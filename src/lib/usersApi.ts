import { apiFetch } from "./api";
import type { PublicUserProfile, UserCard } from "../types";

export async function listUsers(): Promise<
  { ok: true; users: UserCard[] } | { ok: false; error: string }
> {
  try {
    const res = await apiFetch("/api/users");
    const data = (await res.json()) as { users?: UserCard[]; error?: string };
    if (!res.ok || !data.users) {
      return { ok: false, error: data.error || "could not load members" };
    }
    return { ok: true, users: data.users };
  } catch {
    return { ok: false, error: "network error" };
  }
}

export async function getPublicProfile(
  username: string,
): Promise<{ ok: true; user: PublicUserProfile } | { ok: false; error: string }> {
  try {
    const res = await apiFetch(`/api/users/${encodeURIComponent(username)}`);
    const data = (await res.json()) as { user?: PublicUserProfile; error?: string };
    if (!res.ok || !data.user) {
      return { ok: false, error: data.error || "profile not found" };
    }
    return { ok: true, user: data.user };
  } catch {
    return { ok: false, error: "network error" };
  }
}

export async function followUser(
  username: string,
): Promise<{ ok: true; user: PublicUserProfile } | { ok: false; error: string }> {
  try {
    const res = await apiFetch(`/api/users/${encodeURIComponent(username)}/follow`, {
      method: "POST",
    });
    const data = (await res.json()) as { user?: PublicUserProfile; error?: string };
    if (!res.ok || !data.user) {
      return { ok: false, error: data.error || "could not follow" };
    }
    return { ok: true, user: data.user };
  } catch {
    return { ok: false, error: "network error" };
  }
}

export async function unfollowUser(
  username: string,
): Promise<{ ok: true; user: PublicUserProfile } | { ok: false; error: string }> {
  try {
    const res = await apiFetch(`/api/users/${encodeURIComponent(username)}/follow`, {
      method: "DELETE",
    });
    const data = (await res.json()) as { user?: PublicUserProfile; error?: string };
    if (!res.ok || !data.user) {
      return { ok: false, error: data.error || "could not unfollow" };
    }
    return { ok: true, user: data.user };
  } catch {
    return { ok: false, error: "network error" };
  }
}
