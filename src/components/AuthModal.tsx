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
  const { login, user, authPending } = useUser();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
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
    setPassword("");
    setPasswordConfirm("");
    setError(null);
  }, [open, mode]);

  if (!open || !mode) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const u = username.trim();
    if (!u || !password) return;
    if (mode === "join" && password !== passwordConfirm) {
      setError("passwords do not match");
      return;
    }

    const result = await login({
      mode,
      username: u,
      password,
      displayName: displayName.trim() || undefined,
    });
    if (!result.ok) {
      play("whoosh");
      setError(result.error);
      return;
    }

    play("success");
    onClose();
  };

  const copy =
    mode === "join"
      ? {
          title: "Join the floor",
          hint: "Create a real account with a password. You can sign in on any device once the backend is running.",
          cta: "claim your spot",
        }
      : {
          title: "Sign in",
          hint: "Use your account username and password.",
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
              disabled={mode === "signin"}
            />
          </label>
          <label className="field">
            <span>password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "join" ? "new-password" : "current-password"}
              minLength={8}
              maxLength={72}
            />
          </label>
          {mode === "join" ? (
            <label className="field">
              <span>confirm password</span>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                maxLength={72}
              />
            </label>
          ) : null}
          {error ? <p className="modal-hint" role="alert">{error}</p> : null}
          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>
              cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={!username.trim() || !password || authPending}
            >
              {copy.cta}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
