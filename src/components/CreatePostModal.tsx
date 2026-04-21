import { useEffect, useId, useState } from "react";
import { useForumSounds } from "../hooks/useForumSounds";
import { listBoardsForPicker } from "../data/forumData";
import { createPost } from "../lib/postsApi";

type Props = {
  open: boolean;
  defaultBoardId: string;
  onClose: () => void;
};

const pickerOptions = listBoardsForPicker();

export function CreatePostModal({ open, defaultBoardId, onClose }: Props) {
  const { play } = useForumSounds();
  const titleId = useId();
  const [boardId, setBoardId] = useState(defaultBoardId);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!open) return;
    setBoardId(defaultBoardId);
    setTitle("");
    setBody("");
    setError(null);
    setPending(false);
  }, [open, defaultBoardId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    const b = body.trim();
    if (!t || !b) {
      setError("title and body are required");
      return;
    }

    setPending(true);
    setError(null);
    const result = await createPost({ boardId, title: t, body: b });
    setPending(false);
    if (!result.ok) {
      play("whoosh");
      setError(result.error);
      return;
    }
    play("success");
    onClose();
  };

  return (
    <div
      className="modal-root"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && !pending && onClose()}
    >
      <div
        className="modal sheet-pop create-post-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <h2 id={titleId} className="modal-title">
          start a thread
        </h2>
        <p className="modal-hint">published to the board you pick — sign-in required on the server.</p>
        <form onSubmit={submit} className="modal-form">
          <label className="field">
            <span>board</span>
            <select
              className="field-select"
              value={boardId}
              onChange={(e) => setBoardId(e.target.value)}
              disabled={pending}
            >
              {pickerOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="what’s this about?"
              maxLength={200}
              autoComplete="off"
              disabled={pending}
            />
          </label>
          <label className="field">
            <span>body</span>
            <textarea
              className="field-textarea"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="say your piece…"
              rows={7}
              maxLength={20000}
              disabled={pending}
            />
          </label>
          {error ? (
            <p className="field-error" role="alert">
              {error}
            </p>
          ) : null}
          <div className="modal-actions">
            <button type="button" className="btn-ghost" disabled={pending} onClick={() => onClose()}>
              cancel
            </button>
            <button type="submit" className="btn-primary" disabled={pending}>
              {pending ? "posting…" : "post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
