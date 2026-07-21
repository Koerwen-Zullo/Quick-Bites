// In dev, use same-origin requests via the Vite /api proxy so HTTP-only cookies work.
const API_BASE_URL = import.meta.env.DEV
    ? ""
    : (import.meta.env.VITE_API_BASE_URL ?? "");

const buildUrl = (input: string) =>
    input.startsWith("http") ? input : `${API_BASE_URL}${input}`;

const buildInit = (init: RequestInit = {}): RequestInit => ({
    ...init,
    credentials: "include",
    headers: {
        "Content-Type": "application/json",
        ...init.headers,
    },
});

let refreshPromise: Promise<boolean> | null = null;

async function tryRefreshSession(): Promise<boolean> {
    if (!refreshPromise) {
        refreshPromise = fetch(buildUrl("/api/auth/refresh-token"), buildInit())
            .then((response) => response.ok)
            .finally(() => {
                refreshPromise = null;
            });
    }
    return refreshPromise;
}

function shouldAttemptRefresh(input: string, init: RequestInit): boolean {
    if (init.method?.toUpperCase() === "POST" && input.includes("/auth/login")) {
        return false;
    }
    if (input.includes("/auth/refresh-token")) {
        return false;
    }
    return true;
}

export async function authFetch(
    input: string,
    init: RequestInit = {},
): Promise<Response> {
    const url = buildUrl(input);
    let response = await fetch(url, buildInit(init));

    if (
        response.status === 401 &&
        shouldAttemptRefresh(input, init)
    ) {
        const refreshed = await tryRefreshSession();
        if (refreshed) {
            response = await fetch(url, buildInit(init));
        }
    }

    return response;
}

// Refresh access token before it expires (14 min for a 15 min token).
export async function refreshSession(): Promise<boolean> {
    return tryRefreshSession();
}
