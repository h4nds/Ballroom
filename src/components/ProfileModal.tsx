import { useEffect, useId, useState } from "react";
import type { Accent, UserProfile } from "../types";
import { useForumSounds } from "../hooks/useForumSounds";
import { useUser } from "../context/UserContext";

type Props = {
  open: boolean;
  onClose: () => void;
};

const accents: { id: Accent; label: string }[] = [
  { id: "purple", label: "violet" },
  { id: "green", label: "mint" },
  { id: "yellow", label: "gold" },
];

const disciplines: UserProfile["discipline"][] = [
  "visual",
  "motion",
  "music",
  "writing",
  "general",
];

export function ProfileModal({ open, onClose }: Props) {
  const { user, updateProfile, logout, authPending } = useUser();
  const { play } = useForumSounds(user?.soundsEnabled ?? true);
  const titleId = useId();
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [discipline, setDiscipline] = useState(user?.discipline ?? "general");
  const [accent, setAccent] = useState(user?.accent ?? "purple");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && open) {
      setDisplayName(user.displayName);
      setDiscipline(user.discipline);
      setAccent(user.accent);
      setError(null);
    }
  }, [user, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !user) return null;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateProfile({
      displayName: displayName.trim() || user.username,
      discipline,
      accent,
    });
    if (!result.ok) {
      play("whoosh");
      setError(result.error);
      return;
    }

    play("success");
    onClose();
  };

  return (
    <div className="modal-root" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal sheet-pop" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <h2 id={titleId} className="modal-title">
          your spot
        </h2>
        <p className="modal-hint">
          @{user.username} — keep it minimal: how you show up, your lane, and an accent for your dot.
        </p>
        <form onSubmit={save} className="modal-form">
          <label className="field">
            <span>display name</span>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={48}
            />
          </label>
          <fieldset className="field-row">
            <legend>discipline</legend>
            <div className="chip-row">
              {disciplines.map((d) => (
                <label key={d} className={`chip ${discipline === d ? "is-on" : ""}`}>
                  <input
                    type="radio"
                    name="disc"
                    value={d}
                    checked={discipline === d}
                    onChange={() => {
                      setDiscipline(d);
                      play("tap");
                    }}
                  />
                  {d}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className="field-row">
            <legend>accent</legend>
            <div className="accent-picks">
              {accents.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className={`accent-swatch accent-${a.id} ${accent === a.id ? "is-on" : ""}`}
                  aria-pressed={accent === a.id}
                  onClick={() => {
                    setAccent(a.id);
                    play("tap");
                  }}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </fieldset>

          <details className="security-panel">
            <summary className="security-summary">Account &amp; security</summary>
            <div className="security-body">
              <p>
                Your account now uses a server-side session and stored credentials. Keep your password
                unique, and sign out on shared devices.
              </p>
              <p>
                <strong>Next security step:</strong> add password reset, optional 2FA, and OAuth providers
                so recovery and multi-device sign-in are smoother.
              </p>
            </div>
          </details>
          {error ? <p className="modal-hint" role="alert">{error}</p> : null}

          <div className="modal-actions split">
            <button
              type="button"
              className="btn-ghost danger"
              onClick={async () => {
                play("whoosh");
                await logout();
                onClose();
              }}
              disabled={authPending}
            >
              sign out
            </button>
            <div className="modal-actions">
              <button type="button" className="btn-ghost" onClick={onClose}>
                cancel
              </button>
              <button type="submit" className="btn-primary" disabled={authPending}>
                save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
