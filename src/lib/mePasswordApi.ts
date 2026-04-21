import { apiFetch } from "./api";

export async function updatePassword(payload: {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await apiFetch("/api/me/password", {
      method: "PATCH",
      body: JSON.stringify({
        current_password: payload.currentPassword,
        password: payload.password,
        password_confirmation: payload.passwordConfirmation,
      }),
    });
    const data = (await res.json()) as { ok?: boolean; error?: string };
    if (!res.ok) {
      return { ok: false, error: data.error || "password was not updated" };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "network error" };
  }
}
