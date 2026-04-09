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
  const { user, updateProfile, logout } = useUser();
  const { play } = useForumSounds(user?.soundsEnabled ?? true);
  const titleId = useId();
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [discipline, setDiscipline] = useState(user?.discipline ?? "general");
  const [accent, setAccent] = useState(user?.accent ?? "purple");

  useEffect(() => {
    if (user && open) {
      setDisplayName(user.displayName);
      setDiscipline(user.discipline);
      setAccent(user.accent);
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

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    play("success");
    updateProfile({
      displayName: displayName.trim() || user.username,
      discipline,
      accent,
    });
    onClose();
  };

  const exportProfile = () => {
    const blob = new Blob([JSON.stringify(user, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ballroom-profile-${user.username}.json`;
    a.click();
    URL.revokeObjectURL(url);
    play("success");
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
                Right now there is <strong>no password</strong> and nothing is sent to a ballroom server.
                Your profile lives in <strong>this browser’s storage</strong> only. Anyone who uses this
                device or clears site data can affect it — that’s fine for a prototype, not for sensitive
                data.
              </p>
              <p>
                <strong>Next step for real security:</strong> accounts backed by a server — hashed
                passwords (or magic links), optional two-factor, and OAuth (Google, Apple, etc.) so you
                can sign in from any device.
              </p>
              <button type="button" className="btn-ghost security-export" onClick={exportProfile}>
                Download my profile (JSON)
              </button>
            </div>
          </details>

          <div className="modal-actions split">
            <button
              type="button"
              className="btn-ghost danger"
              onClick={() => {
                play("whoosh");
                logout();
                onClose();
              }}
            >
              sign out
            </button>
            <div className="modal-actions">
              <button type="button" className="btn-ghost" onClick={onClose}>
                cancel
              </button>
              <button type="submit" className="btn-primary">
                save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
