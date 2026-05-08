import { useEffect, useState } from "react";
import { useForumSounds } from "../hooks/useForumSounds";
import { createReply, getThread } from "../lib/forumApi";
import { useUser } from "../context/UserContext";
import type { ForumPostRecord, ForumThreadRecord } from "../types";

type Props = {
  threadId: number;
  onBackToBoard: (boardSlug: string) => void;
};

function formatWhen(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function ForumThreadView({ threadId, onBackToBoard }: Props) {
  const { user } = useUser();
  const { play } = useForumSounds();
  const [thread, setThread] = useState<ForumThreadRecord | null>(null);
  const [posts, setPosts] = useState<ForumPostRecord[]>([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    void getThread(threadId)
      .then((data) => {
        if (!active) return;
        setThread(data.thread);
        setPosts(data.posts);
      })
      .catch((e: unknown) => {
        if (!active) return;
        setError(e instanceof Error ? e.message : "failed to load thread");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [threadId]);

  const submitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thread || !reply.trim() || !user || submitting) return;

    setSubmitting(true);
    setError(null);
    try {
      const post = await createReply({ threadId: thread.id, body: reply.trim() });
      setReply("");
      setPosts((prev) => [...prev, post]);
      play("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "failed to submit reply");
      play("whoosh");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="forum-view sheet-pop">
      <div className="forum-head">
        <button
          type="button"
          className="btn-ghost forum-back"
          onClick={() => {
            if (thread) onBackToBoard(thread.boardSlug);
          }}
          disabled={!thread}
        >
          ← /{thread?.boardSlug ?? "board"}/
        </button>
        <h2 className="forum-title">{thread?.subject ?? "thread"}</h2>
      </div>
      {loading ? <p className="forum-note">loading thread...</p> : null}
      {error ? <p className="forum-error">{error}</p> : null}

      {thread ? (
        <article className="post-card post-op">
          <p className="post-head">
            <span className="post-author">{thread.authorDisplayName}</span> {formatWhen(thread.createdAt)} No.{thread.id}
          </p>
          <pre className="post-body">{thread.opBody}</pre>
        </article>
      ) : null}

      {posts.map((post) => (
        <article key={post.id} className="post-card">
          <p className="post-head">
            <span className="post-author">{post.authorDisplayName}</span> {formatWhen(post.createdAt)} No.{post.id}
          </p>
          <pre className="post-body">{post.body}</pre>
        </article>
      ))}

      {thread && user ? (
        <form className="forum-compose" onSubmit={submitReply}>
          <h3 className="forum-compose-title">reply</h3>
          <textarea
            className="forum-textarea"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="write a reply"
            maxLength={20_000}
          />
          <div className="forum-compose-actions">
            <button className="btn-primary" type="submit" disabled={!reply.trim() || submitting}>
              post reply
            </button>
          </div>
        </form>
      ) : null}
    </section>
  );
}
