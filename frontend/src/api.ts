const API_BASE = "";

export async function fetchExpansions() {
  const res = await fetch(`${API_BASE}/api/expansions`);
  if (!res.ok) throw new Error("Failed to fetch expansions");
  return res.json();
}

export async function fetchRandomCards(expansions: string[], count = 10) {
  const params = new URLSearchParams({
    expansions: expansions.join(","),
    count: String(count),
  });
  const res = await fetch(`${API_BASE}/api/cards/random?${params}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to fetch cards");
  }
  return res.json();
}
