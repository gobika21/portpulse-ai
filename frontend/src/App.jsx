import { useState } from "react";

const T = {
  bg:"#0D1117", surface:"#161B22", panel:"#1C2230", border:"#2A3444", borderLt:"#3A4556",
  text:"#E6EDF3", muted:"#8B949E", subtle:"#4A5568",
  accent:"#E8621A", accentLt:"#F27C3A", accentDim:"#2A1A0D",
  green:"#3FB950", greenDim:"#0D2516", amber:"#D29922", amberDim:"#261D06",
  red:"#DA3633", redDim:"#230C0C",
};

const TIER_STYLE = {
  Low:      { color:T.green,  bg:T.greenDim, border:T.green },
  Medium:   { color:T.amber,  bg:T.amberDim, border:T.amber },
  High:     { color:T.accentLt, bg:T.accentDim, border:T.accent },
  Critical: { color:T.red,    bg:T.redDim,   border:T.red },
};

const PERSONA_LABEL = {
  carrier: { icon:"🚢", label:"Carrier" },
  trucking_company: { icon:"🚛", label:"Trucking Company" },
  terminal_operator: { icon:"🏗️", label:"Terminal Operator" },
};

const SCENARIOS = [
  { key:"low", label:"Low", snapshot:{ port_name:"Jebel Ali", berth_occupancy_rate:0.35, vessel_queue_length:1, avg_waiting_time_hours:2 } },
  { key:"medium", label:"Medium", snapshot:{ port_name:"Jebel Ali", berth_occupancy_rate:0.6, vessel_queue_length:5, avg_waiting_time_hours:8 } },
  { key:"high", label:"High", snapshot:{ port_name:"Jebel Ali", berth_occupancy_rate:0.8, vessel_queue_length:12, avg_waiting_time_hours:18 } },
  { key:"critical", label:"Critical", snapshot:{ port_name:"Jebel Ali", berth_occupancy_rate:0.95, vessel_queue_length:22, avg_waiting_time_hours:30 } },
];

const API_URL = import.meta.env.VITE_PORTPULSE_API_URL || "http://localhost:8000";

function Metric({ label, value }) {
  return (
    <div style={{ background:T.panel, border:`1px solid ${T.border}`, borderRadius:10, padding:"12px 14px", flex:1 }}>
      <div style={{ fontSize:10, color:T.muted, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</div>
      <div style={{ fontSize:20, fontWeight:600, color:T.text, marginTop:4 }}>{value}</div>
    </div>
  );
}

export default function App() {
  const [scenarioKey, setScenarioKey] = useState("high");
  const [snapshot, setSnapshot] = useState(SCENARIOS.find(s=>s.key==="high").snapshot);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function pickScenario(key) {
    setScenarioKey(key);
    setSnapshot(SCENARIOS.find(s=>s.key===key).snapshot);
    setResult(null);
    setError(null);
  }

  function updateField(field, value) {
    setSnapshot(prev => ({ ...prev, [field]: value }));
  }

  async function runAdvisory() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`${API_URL}/advisory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(snapshot),
      });
      if (!res.ok) {
        const body = await res.json().catch(()=>({}));
        throw new Error(body.detail || `Request failed (${res.status})`);
      }
      setResult(await res.json());
    } catch (e) {
      setError(e.message || "Failed to reach the PortPulse backend");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight:"100vh", background:T.bg, color:T.text, fontFamily:"'Inter',system-ui,sans-serif", fontSize:14 }}>
      <header style={{ height:50, display:"flex", alignItems:"center", padding:"0 16px", background:T.surface, borderBottom:`1px solid ${T.border}`, gap:8 }}>
        <span style={{ fontSize:20 }}>⚡</span>
        <span style={{ fontSize:15, fontWeight:600, letterSpacing:"-0.01em" }}>PortPulse AI</span>
        <span style={{ fontSize:10, fontWeight:500, color:T.accent, background:T.accentDim, border:`1px solid ${T.accent}`, borderRadius:4, padding:"1px 6px" }}>Congestion Advisory</span>
      </header>

      <div style={{ padding:24, display:"flex", flexDirection:"column", gap:20, maxWidth:960, margin:"0 auto" }}>

        <div style={{ fontSize:12, color:T.muted }}>
          Monitoring → Classification → Decision-support → Advisory-drafting — a 4-agent pipeline over live port metrics.
        </div>

        {/* Scenario picker */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {SCENARIOS.map(s => (
            <button key={s.key} onClick={()=>pickScenario(s.key)} style={{
              padding:"6px 14px", borderRadius:99, fontSize:12, cursor:"pointer",
              border:`1px solid ${scenarioKey===s.key ? TIER_STYLE[s.label].border : T.border}`,
              background: scenarioKey===s.key ? TIER_STYLE[s.label].bg : "transparent",
              color: scenarioKey===s.key ? TIER_STYLE[s.label].color : T.muted,
            }}>{s.label}</button>
          ))}
        </div>

        {/* Editable snapshot */}
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ background:T.panel, border:`1px solid ${T.border}`, borderRadius:10, padding:"12px 14px", flex:1, minWidth:160 }}>
            <div style={{ fontSize:10, color:T.muted, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>Berth Occupancy Rate</div>
            <input type="number" step="0.01" min="0" max="1" value={snapshot.berth_occupancy_rate}
              onChange={e=>updateField("berth_occupancy_rate", parseFloat(e.target.value))}
              style={{ width:"100%", background:T.surface, border:`1px solid ${T.borderLt}`, borderRadius:6, padding:"6px 8px", color:T.text, fontSize:14 }}/>
          </div>
          <div style={{ background:T.panel, border:`1px solid ${T.border}`, borderRadius:10, padding:"12px 14px", flex:1, minWidth:160 }}>
            <div style={{ fontSize:10, color:T.muted, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>Vessel Queue Length</div>
            <input type="number" min="0" value={snapshot.vessel_queue_length}
              onChange={e=>updateField("vessel_queue_length", parseInt(e.target.value || "0", 10))}
              style={{ width:"100%", background:T.surface, border:`1px solid ${T.borderLt}`, borderRadius:6, padding:"6px 8px", color:T.text, fontSize:14 }}/>
          </div>
          <div style={{ background:T.panel, border:`1px solid ${T.border}`, borderRadius:10, padding:"12px 14px", flex:1, minWidth:160 }}>
            <div style={{ fontSize:10, color:T.muted, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>Avg Waiting Time (hrs)</div>
            <input type="number" step="0.1" min="0" value={snapshot.avg_waiting_time_hours}
              onChange={e=>updateField("avg_waiting_time_hours", parseFloat(e.target.value))}
              style={{ width:"100%", background:T.surface, border:`1px solid ${T.borderLt}`, borderRadius:6, padding:"6px 8px", color:T.text, fontSize:14 }}/>
          </div>
        </div>

        <button onClick={runAdvisory} disabled={loading} style={{
          alignSelf:"flex-start", padding:"9px 20px", borderRadius:8, border:"none", cursor:loading?"not-allowed":"pointer",
          background: loading ? T.border : T.accent, color:"white", fontSize:13, fontWeight:600,
        }}>{loading ? "Running agents…" : "Run Advisory Pipeline"}</button>

        {error && (
          <div style={{ background:T.redDim, border:`1px solid ${T.red}`, borderRadius:8, padding:"10px 14px", fontSize:12, color:T.red }}>
            ⚠️ {error} — is the backend running at <code>{API_URL}</code>? (<code>cd backend && uvicorn app.main:app --reload</code>)
          </div>
        )}

        {result && (
          <>
            <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
              <div style={{
                padding:"6px 16px", borderRadius:99, fontSize:13, fontWeight:700,
                background:TIER_STYLE[result.tier].bg, color:TIER_STYLE[result.tier].color,
                border:`1px solid ${TIER_STYLE[result.tier].border}`,
              }}>{result.tier} Congestion</div>
              <div style={{ fontSize:12, color:T.muted }}>{result.tier_reasoning}</div>
            </div>

            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <Metric label="Berth Occupancy" value={`${Math.round(snapshot.berth_occupancy_rate*100)}%`}/>
              <Metric label="Vessel Queue" value={snapshot.vessel_queue_length}/>
              <Metric label="Avg Wait" value={`${snapshot.avg_waiting_time_hours}h`}/>
            </div>

            <div>
              <div style={{ fontSize:12, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em", color:T.muted, marginBottom:10 }}>Advisories</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {result.recommendations.map((rec, i) => {
                  const persona = PERSONA_LABEL[rec.persona] || { icon:"📋", label:rec.persona };
                  return (
                    <div key={i} style={{ background:T.panel, border:`1px solid ${T.border}`, borderRadius:10, padding:"14px 16px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                        <span style={{ fontSize:16 }}>{persona.icon}</span>
                        <span style={{ fontSize:13, fontWeight:600 }}>{persona.label}</span>
                      </div>
                      <div style={{ fontSize:13, color:T.text, lineHeight:1.6, marginBottom:8 }}>
                        {result.advisories[rec.persona] || rec.action}
                      </div>
                      <div style={{ fontSize:11, color:T.subtle, fontStyle:"italic" }}>Reasoning: {rec.reasoning}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
