import { useEffect, useId, useState } from "react";
import type { UserCard } from "../types";
import { listUsers } from "../lib/usersApi";
import { useForumSounds } from "../hooks/useForumSounds";

type Props = {
  open: boolean;
  onClose: () => void;
  onSelectMember: (username: string) => void;
};

export function MembersModal({ open, onClose, onSelectMember }: Props) {
  const titleId = useId();
  const { play } = useForumSounds();
  const [users, setUsers] = useState<UserCard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    void listUsers().then((res) => {
      setLoading(false);
      if (!res.ok) {
        setError(res.error);
        setUsers([]);
        return;
      }
      setUsers(res.users);
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-root"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal sheet-pop members-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <h2 id={titleId} className="modal-title">
          members
        </h2>
        <p className="modal-hint">everyone on the floor right now — tap a name to open their profile.</p>
        {loading ? (
          <p className="members-status">loading…</p>
        ) : error ? (
          <p className="field-error" role="alert">
            {error}
          </p>
        ) : users.length === 0 ? (
          <p className="members-status">no accounts yet — be the first to join.</p>
        ) : (
          <ul className="members-list">
            {users.map((u) => (
              <li key={u.username}>
                <button
                  type="button"
                  className="members-row"
                  onClick={() => {
                    play("tap");
                    onSelectMember(u.username);
                  }}
                >
                  <span className={`members-dot accent-${u.accent}`} aria-hidden />
                  <span className="members-row-main">
                    <span className="members-name">{u.displayName}</span>
                    <span className="members-handle">@{u.username}</span>
                  </span>
                  <span className="members-disc">{u.discipline}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="modal-actions">
          <button type="button" className="btn-primary" onClick={onClose}>
            close
          </button>
        </div>
      </div>
    </div>
  );
}
