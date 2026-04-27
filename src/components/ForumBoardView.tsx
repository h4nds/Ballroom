import { useEffect, useMemo, useState } from "react";
import { useForumSounds } from "../hooks/useForumSounds";
import { createThread, getBoardThreads } from "../lib/forumApi";
import { useUser } from "../context/UserContext";
import type { ForumBoardRecord, ForumThreadRow } from "../types";

type Props = {
  boardSlug: string;
  onBack: () => void;
  onOpenThread: (threadId: number) => void;
};

function formatWhen(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function ForumBoardView({ boardSlug, onBack, onOpenThread }: Props) {
  const { user } = useUser();
  const { play } = useForumSounds();
  const [board, setBoard] = useState<ForumBoardRecord | null>(null);
  const [threads, setThreads] = useState<ForumThreadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    void getBoardThreads(boardSlug)
      .then((data) => {
        if (!active) return;
        setBoard(data.board);
        setThreads(data.threads);
      })
      .catch((e: unknown) => {
        if (!active) return;
        setError(e instanceof Error ? e.message : "failed to load board");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [boardSlug]);

  const canCreate = useMemo(() => !!user && subject.trim().length > 0 && body.trim().length > 0, [user, subject, body]);

  const submitThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreate || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const thread = await createThread({ boardSlug, subject: subject.trim(), body: body.trim() });
      setSubject("");
      setBody("");
      play("success");
      onOpenThread(thread.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "failed to create thread");
      play("whoosh");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="forum-view sheet-pop">
      <div className="forum-head">
        <button type="button" className="btn-ghost forum-back" onClick={onBack}>
          ← all boards
        </button>
        <h2 className="forum-title">/{boardSlug}/ {board?.name ?? "board"}</h2>
      </div>
      {board?.description ? <p className="forum-subtitle">{board.description}</p> : null}

      {user ? (
        <form className="forum-compose" onSubmit={submitThread}>
          <h3 className="forum-compose-title">start thread</h3>
          <input
            className="forum-input"
            placeholder="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            maxLength={200}
          />
          <textarea
            className="forum-textarea"
            placeholder="post body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={20_000}
          />
          <div className="forum-compose-actions">
            <button className="btn-primary" type="submit" disabled={!canCreate || submitting}>
              create thread
            </button>
          </div>
        </form>
      ) : (
        <p className="forum-note">sign in to create a thread.</p>
      )}

      {loading ? <p className="forum-note">loading threads...</p> : null}
      {error ? <p className="forum-error">{error}</p> : null}

      <div className="thread-table" role="list">
        {threads.map((thread) => (
          <article key={thread.id} className="thread-row" role="listitem">
            <button type="button" className="thread-subject" onClick={() => onOpenThread(thread.id)}>
              {thread.subject}
            </button>
            <p className="thread-preview">{thread.opBodyPreview}</p>
            <p className="thread-meta">
              {thread.authorDisplayName} · No.{thread.id} · {thread.replyCount} repl · {formatWhen(thread.bumpedAt)}
            </p>
          </article>
        ))}
        {!loading && threads.length === 0 ? <p className="forum-note">no threads yet. start the first one.</p> : null}
      </div>
    </section>
  );
}
