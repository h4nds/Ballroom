import { apiFetch } from "./api";
import type { PostRecord } from "../types";

export async function createPost(payload: {
  boardId: string;
  title: string;
  body: string;
}): Promise<{ ok: true; post: PostRecord } | { ok: false; error: string }> {
  try {
    const res = await apiFetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({
        board_id: payload.boardId,
        title: payload.title,
        body: payload.body,
      }),
    });
    const data = (await res.json()) as { post?: PostRecord; error?: string };
    if (!res.ok || !data.post) {
      return { ok: false, error: data.error || "could not publish post" };
    }
    return { ok: true, post: data.post };
  } catch {
    return { ok: false, error: "network error — check API server and try again" };
  }
}
