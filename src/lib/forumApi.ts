import type { ForumBoardRecord, ForumPostRecord, ForumThreadRecord, ForumThreadRow } from "../types";
import { apiFetch } from "./api";

export async function getForumBoards(): Promise<ForumBoardRecord[]> {
  const res = await apiFetch("/api/boards");
  if (!res.ok) throw new Error("failed to load boards");
  const data = (await res.json()) as { boards: ForumBoardRecord[] };
  return data.boards;
}

export async function getBoardThreads(slug: string): Promise<{ board: ForumBoardRecord; threads: ForumThreadRow[] }> {
  const res = await apiFetch(`/api/boards/${encodeURIComponent(slug)}`);
  if (!res.ok) throw new Error("failed to load board");
  return (await res.json()) as { board: ForumBoardRecord; threads: ForumThreadRow[] };
}

export async function createThread(input: {
  boardSlug: string;
  subject: string;
  body: string;
}): Promise<ForumThreadRecord> {
  const res = await apiFetch(`/api/boards/${encodeURIComponent(input.boardSlug)}/threads`, {
    method: "POST",
    body: JSON.stringify({ subject: input.subject, body: input.body }),
  });
  const data = (await res.json()) as { thread?: ForumThreadRecord; error?: string };
  if (!res.ok || !data.thread) throw new Error(data.error || "failed to create thread");
  return data.thread;
}

export async function getThread(threadId: number): Promise<{ thread: ForumThreadRecord; posts: ForumPostRecord[] }> {
  const res = await apiFetch(`/api/threads/${threadId}`);
  if (!res.ok) throw new Error("failed to load thread");
  return (await res.json()) as { thread: ForumThreadRecord; posts: ForumPostRecord[] };
}

export async function createReply(input: { threadId: number; body: string }): Promise<ForumPostRecord> {
  const res = await apiFetch(`/api/threads/${input.threadId}/posts`, {
    method: "POST",
    body: JSON.stringify({ body: input.body }),
  });
  const data = (await res.json()) as { post?: ForumPostRecord; error?: string };
  if (!res.ok || !data.post) throw new Error(data.error || "failed to create reply");
  return data.post;
}
