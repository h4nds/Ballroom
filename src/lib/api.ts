const CSRF_HEADER = "X-CSRF-Token";

export type ApiBootstrap = {
  ok: boolean;
  csrf_token: string;
};

let csrfToken: string | null = null;
let bootstrapPromise: Promise<ApiBootstrap> | null = null;

export function getCsrfToken(): string | null {
  return csrfToken;
}

function needsCsrf(method: string): boolean {
  const m = method.toUpperCase();
  return !["GET", "HEAD", "OPTIONS", "TRACE"].includes(m);
}

/**
 * Same-origin fetch to `/api/*` (Vite dev proxy or Nginx in production).
 * Sends the session cookie and attaches the Rails CSRF token for mutating requests.
 */
export async function apiFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  const method = (init.method ?? "GET").toUpperCase();
  if (needsCsrf(method) && csrfToken) {
    headers.set(CSRF_HEADER, csrfToken);
  }
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }
  if (init.body != null && typeof init.body === "string" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(input, {
    ...init,
    method,
    headers,
    credentials: "include",
  });
}

/** Load CSRF token + warm the Rails session cookie. Safe to call once on startup. */
export async function initApiClient(): Promise<ApiBootstrap> {
  if (bootstrapPromise) return bootstrapPromise;

  bootstrapPromise = (async () => {
    const res = await apiFetch("/api/bootstrap", { method: "GET" });
    if (!res.ok) {
      throw new Error(`API bootstrap failed (${res.status})`);
    }
    const data = (await res.json()) as ApiBootstrap;
    if (!data.csrf_token) {
      throw new Error("API bootstrap response missing csrf_token");
    }
    csrfToken = data.csrf_token;
    return data;
  })().catch((err: unknown) => {
    bootstrapPromise = null;
    throw err;
  });

  return bootstrapPromise;
}

/** Call after server-side session changes (e.g. sign-in) to refresh the CSRF token. */
export async function refreshApiSession(): Promise<ApiBootstrap> {
  bootstrapPromise = null;
  csrfToken = null;
  return initApiClient();
}
