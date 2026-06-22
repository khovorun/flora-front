export const API_ROOT = import.meta.env.VITE_API_URL ?? "";

export function keepAlive() {
  fetch(`${API_ROOT}api/bouquets?_limit=1`).catch(() => {});
}

export async function fetchBouquetsPage(page, limit) {
  const res = await fetch(`${API_ROOT}api/bouquets?_page=${page}&_limit=${limit}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchBouquetById(id) {
  const res = await fetch(`${API_ROOT}api/bouquets/${id}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchFavorites() {
  const res = await fetch(`${API_ROOT}api/bouquets?favorite=true&_limit=10`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchReviews() {
  const res = await fetch(`${API_ROOT}api/reviews`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function postOrder(payload) {
  const res = await fetch(`${API_ROOT}api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
