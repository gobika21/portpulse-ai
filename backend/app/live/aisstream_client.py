"""Live vessel data via the aisstream.io AIS websocket feed.

DP World / Jebel Ali do not expose a public API for berth occupancy or
internal queue data — those stay estimated/manual. What IS available is
live AIS vessel positions, geofenced around a port area, as a proxy for
"vessels currently anchored/waiting nearby."

Caveat (confirmed by testing): aisstream.io is a free, volunteer-receiver
network — coverage depends on people running their own AIS antennas, not
satellite AIS. The Persian Gulf / Jebel Ali currently has little to no
volunteer receiver coverage on this free tier, so the Jebel Ali feed will
usually show 0 vessels. Rotterdam (dense European receiver coverage) is
included as a live "proof of capability" panel — the same pipeline, same
code path, just pointed at a port that actually has free data flowing.

Anchored vessels only broadcast an AIS position update roughly every
2-3 minutes (vs. every few seconds while underway), so a short blocking
request per API call would almost always see nothing. Instead this module
runs a persistent background listener (started at app startup) that keeps
an in-memory cache of the most recently seen vessels per port, and API
requests just read that cache.
"""

import asyncio
import json
import logging
import os
import time

import websockets

logger = logging.getLogger(__name__)

AISSTREAM_URL = "wss://stream.aisstream.io/v0/stream"

# A vessel under this speed (knots) is treated as anchored/waiting rather than transiting.
WAITING_SPEED_KNOTS = 1.0

# Anchored vessels report infrequently; a vessel not heard from in this long is dropped from the cache.
STALE_AFTER_SECONDS = 8 * 60

RECONNECT_DELAY_SECONDS = 5

EN_LIVE_NOTE = "We are tracking real ship movements near this port right now."
AR_LIVE_NOTE = "نتابع حركة السفن الحقيقية قرب هذا الميناء الآن."

PORTS = {
    "rotterdam": {
        "name": {"en": "Rotterdam", "ar": "روتردام"},
        "country": {"en": "Netherlands", "ar": "هولندا"},
        "bbox": [[51.85, 3.95], [52.00, 4.15]],
        "live_coverage": True,
        "note": {"en": EN_LIVE_NOTE, "ar": AR_LIVE_NOTE},
    },
    "singapore": {
        "name": {"en": "Singapore", "ar": "سنغافورة"},
        "country": {"en": "Singapore", "ar": "سنغافورة"},
        "bbox": [[1.20, 103.60], [1.30, 103.90]],
        "live_coverage": True,
        "note": {"en": EN_LIVE_NOTE, "ar": AR_LIVE_NOTE},
    },
    "los_angeles": {
        "name": {"en": "Los Angeles / Long Beach", "ar": "لوس أنجلوس / لونغ بيتش"},
        "country": {"en": "United States", "ar": "الولايات المتحدة"},
        "bbox": [[33.70, -118.30], [33.79, -118.19]],
        "live_coverage": True,
        "note": {"en": EN_LIVE_NOTE, "ar": AR_LIVE_NOTE},
    },
    "antwerp": {
        "name": {"en": "Antwerp", "ar": "أنتويرب"},
        "country": {"en": "Belgium", "ar": "بلجيكا"},
        "bbox": [[51.20, 4.20], [51.35, 4.45]],
        "live_coverage": True,
        "note": {"en": EN_LIVE_NOTE, "ar": AR_LIVE_NOTE},
    },
    "jebel_ali": {
        "name": {"en": "Jebel Ali", "ar": "جبل علي"},
        "country": {"en": "United Arab Emirates", "ar": "الإمارات العربية المتحدة"},
        "bbox": [[24.90, 54.95], [25.05, 55.10]],
        "live_coverage": False,
        "note": {
            "en": "We don't have live ship-tracking data for this port yet, so this will show 0.",
            "ar": "لا تتوفر لدينا بيانات تتبع مباشرة لهذا الميناء بعد، لذا ستظهر القيمة 0.",
        },
    },
}


def _localized(field: dict, lang: str) -> str:
    return field.get(lang, field["en"])


class AISStreamError(Exception):
    pass


def _port_for_coords(lat: float, lon: float) -> str | None:
    for port_id, info in PORTS.items():
        (lat_min, lon_min), (lat_max, lon_max) = info["bbox"]
        if lat_min <= lat <= lat_max and lon_min <= lon <= lon_max:
            return port_id
    return None


class VesselCache:
    def __init__(self):
        self._vessels: dict[str, dict[str, dict]] = {port_id: {} for port_id in PORTS}
        self.connected = False
        self.last_error: str | None = None
        self.started_at = time.monotonic()

    def upsert(self, port_id: str, mmsi: str, sog_knots: float, lat: float, lon: float):
        self._vessels[port_id][mmsi] = {
            "sog_knots": sog_knots,
            "lat": lat,
            "lon": lon,
            "last_seen": time.monotonic(),
        }

    def snapshot(self, port_id: str, include_positions: bool = False, lang: str = "en") -> dict:
        now = time.monotonic()
        fresh = {
            mmsi: v for mmsi, v in self._vessels.get(port_id, {}).items()
            if now - v["last_seen"] <= STALE_AFTER_SECONDS
        }
        self._vessels[port_id] = fresh

        waiting = [v for v in fresh.values() if v["sog_knots"] < WAITING_SPEED_KNOTS]
        port_info = PORTS[port_id]
        (lat_min, lon_min), (lat_max, lon_max) = port_info["bbox"]

        result = {
            "port_id": port_id,
            "port_name": _localized(port_info["name"], lang),
            "country": _localized(port_info["country"], lang),
            "live_coverage": port_info["live_coverage"],
            "vessel_queue_length": len(waiting),
            "vessels_observed": len(fresh),
            "source": "aisstream.io",
            "bounding_box": port_info["bbox"],
            "center": [(lat_min + lat_max) / 2, (lon_min + lon_max) / 2],
            "coverage_note": _localized(port_info["note"], lang),
            "connected": self.connected,
            "warming_up": self.connected and (now - self.started_at) < STALE_AFTER_SECONDS,
            "last_error": self.last_error,
        }

        if include_positions:
            result["ships"] = [
                {
                    "id": mmsi,
                    "lat": v["lat"],
                    "lon": v["lon"],
                    "speed_knots": round(v["sog_knots"], 1),
                    "waiting": v["sog_knots"] < WAITING_SPEED_KNOTS,
                }
                for mmsi, v in fresh.items()
            ]

        return result

    def all_snapshots(self, lang: str = "en") -> list[dict]:
        return [self.snapshot(port_id, lang=lang) for port_id in PORTS]


cache = VesselCache()


async def _listen_forever():
    api_key = os.environ.get("AISSTREAM_API_KEY")
    if not api_key:
        cache.last_error = "AISSTREAM_API_KEY is not set"
        return

    bounding_boxes = [info["bbox"] for info in PORTS.values()]

    while True:
        try:
            async with websockets.connect(AISSTREAM_URL) as ws:
                subscribe = {
                    "APIKey": api_key,
                    "BoundingBoxes": bounding_boxes,
                    "FilterMessageTypes": ["PositionReport"],
                }
                await ws.send(json.dumps(subscribe))
                cache.connected = True
                cache.last_error = None
                logger.info("AIS stream connected, watching %d port bounding boxes", len(bounding_boxes))

                async for raw in ws:
                    msg = json.loads(raw)
                    if msg.get("MessageType") != "PositionReport":
                        continue
                    report = msg["Message"]["PositionReport"]
                    lat, lon = report.get("Latitude"), report.get("Longitude")
                    port_id = _port_for_coords(lat, lon)
                    if port_id is None:
                        continue
                    mmsi = str(report.get("UserID"))
                    cache.upsert(port_id, mmsi, sog_knots=report.get("Sog", 0.0), lat=lat, lon=lon)
        except (websockets.exceptions.WebSocketException, OSError) as exc:
            cache.connected = False
            cache.last_error = str(exc)
            logger.warning("AIS stream disconnected: %s — retrying in %ss", exc, RECONNECT_DELAY_SECONDS)
            await asyncio.sleep(RECONNECT_DELAY_SECONDS)


_collector_task: asyncio.Task | None = None


def start_collector():
    global _collector_task
    if _collector_task is None:
        _collector_task = asyncio.create_task(_listen_forever())


def stop_collector():
    global _collector_task
    if _collector_task is not None:
        _collector_task.cancel()
        _collector_task = None


def get_live_vessel_queue(port_id: str, include_positions: bool = False, lang: str = "en") -> dict:
    if port_id not in PORTS:
        raise AISStreamError(f"Unknown port_id '{port_id}'. Known ports: {list(PORTS)}")
    return cache.snapshot(port_id, include_positions=include_positions, lang=lang)


def get_all_live_vessel_queues(lang: str = "en") -> list[dict]:
    return cache.all_snapshots(lang=lang)


def list_ports(lang: str = "en") -> list[dict]:
    return [
        {
            "port_id": port_id,
            "name": _localized(info["name"], lang),
            "country": _localized(info["country"], lang),
            "live_coverage": info["live_coverage"],
        }
        for port_id, info in PORTS.items()
    ]
