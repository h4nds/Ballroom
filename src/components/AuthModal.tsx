import { useEffect, useId, useState } from "react";
import type { AuthOpenMode } from "../types";
import { useForumSounds } from "../hooks/useForumSounds";
import { useUser, STORAGE_LAST_USERNAME } from "../context/UserContext";

type Props = {
  open: boolean;
  mode: AuthOpenMode | null;
  onModeChange: (mode: AuthOpenMode) => void;
  onClose: () => void;
};

export function AuthModal({ open, mode, onModeChange, onClose }: Props) {
  const { login, user } = useUser();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const titleId = useId();
  const { play } = useForumSounds(user?.soundsEnabled ?? true);

  useEffect(() => {
    if (!open || !mode) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, mode, onClose]);

  useEffect(() => {
    if (!open || !mode) return;
    if (mode === "signin") {
      try {
        const last = localStorage.getItem(STORAGE_LAST_USERNAME);
        setUsername(last ?? "");
      } catch {
        setUsername("");
      }
    } else {
      setUsername("");
    }
    setDisplayName("");
  }, [open, mode]);

  if (!open || !mode) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const u = username.trim();
    if (!u) return;
    play("success");
    login(u, displayName.trim() || undefined);
    setUsername("");
    setDisplayName("");
    onClose();
  };

  const copy =
    mode === "join"
      ? {
          title: "Join the floor",
          hint: "Pick a username. Your profile stays in this browser until you sign out. Proper passwords and sync come when we wire up accounts on the server.",
          cta: "claim your spot",
        }
      : {
          title: "Sign in on this device",
          hint: "Use the same username you used before in this browser. A different username starts a new profile for this device (your previous handle’s data is still saved under that name).",
          cta: "continue",
        };

  return (
    <div className="modal-root" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className="modal sheet-pop"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="auth-mode-switch" role="tablist" aria-label="New or returning">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "join"}
            className={`auth-mode-tab ${mode === "join" ? "is-active" : ""}`}
            onClick={() => {
              play("tap");
              onModeChange("join");
            }}
          >
            new here
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signin"}
            className={`auth-mode-tab ${mode === "signin" ? "is-active" : ""}`}
            onClick={() => {
              play("tap");
              onModeChange("signin");
            }}
          >
            returning
          </button>
        </div>
        <h2 id={titleId} className="modal-title">
          {copy.title}
        </h2>
        <p className="modal-hint">{copy.hint}</p>
        <form onSubmit={submit} className="modal-form">
          <label className="field">
            <span>username</span>
            <input
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={mode === "signin" ? "same handle as before" : "e.g. solfège"}
              autoComplete="username"
              maxLength={32}
            />
          </label>
          <label className="field">
            <span>display name (optional)</span>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="how you want to appear"
              maxLength={48}
            />
          </label>
          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>
              cancel
            </button>
            <button type="submit" className="btn-primary" disabled={!username.trim()}>
              {copy.cta}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
