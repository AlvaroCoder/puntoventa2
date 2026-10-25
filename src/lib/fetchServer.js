import { getSession } from "@/lib/authentication";

const BASE_URL_SPRING = process.env.BASE_URL_SPRING ?? "http://localhost:8085";

export async function fetchServer(
  endpoint,
  { method = "GET", body = null, params = {} } = {},
) {
  const session = await getSession();
  const token = session?.access_token;

  const base = endpoint.startsWith("http")
    ? endpoint
    : `${BASE_URL_SPRING}${endpoint}`;
  const url = Object.keys(params).length
    ? `${base}?${new URLSearchParams(params).toString()}`
    : base;

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body !== null ? { body: JSON.stringify(body) } : {}),
    cache: "no-store", // ← importante en Next.js para no cachear datos del usuario
  });

  let json = null;
  try {
    json = await response.json();
  } catch {
    json = null;
  }

  return {
    ok: response.ok,
    status: response.status,
    data: json?.data ?? json,
    message: json?.message ?? "",
    error: !response.ok,
  };
}
