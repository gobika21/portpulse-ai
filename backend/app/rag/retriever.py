"""Lightweight retriever over the precedent corpus.

No vector DB or embeddings API — just term-overlap cosine similarity plus a
same-tier boost. Small enough for the seed corpus in corpus.py; the interface
(`retrieve`) is what a real embeddings-backed retriever would need to match if
this is swapped out later.
"""

import math
import re
from collections import Counter

from app.rag.corpus import PRECEDENTS, Precedent

_WORD_RE = re.compile(r"[a-z]+")

# Kept small relative to typical term-overlap scores (roughly 0.05-0.2 once the
# query includes real domain keywords) so a same-tier precedent is preferred on
# a tie, without letting the boost alone decide the ranking regardless of content.
TIER_MATCH_BOOST = 0.08


def _tokenize(text: str) -> Counter:
    return Counter(_WORD_RE.findall(text.lower()))


def _cosine(a: Counter, b: Counter) -> float:
    shared = set(a) & set(b)
    dot = sum(a[t] * b[t] for t in shared)
    norm_a = math.sqrt(sum(v * v for v in a.values()))
    norm_b = math.sqrt(sum(v * v for v in b.values()))
    if not norm_a or not norm_b:
        return 0.0
    return dot / (norm_a * norm_b)


def retrieve(query: str, tier: str, k: int = 2) -> list[Precedent]:
    """Return the top-k precedents most similar to `query`, boosted for tier match."""
    query_vec = _tokenize(query)

    scored = []
    for precedent in PRECEDENTS:
        doc_text = f"{precedent['summary']} {' '.join(precedent['tags'])}"
        score = _cosine(query_vec, _tokenize(doc_text))
        if precedent["tier"] == tier:
            score += TIER_MATCH_BOOST
        scored.append((score, precedent))

    scored.sort(key=lambda pair: pair[0], reverse=True)
    return [precedent for score, precedent in scored[:k] if score > 0]
