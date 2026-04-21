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
  const { user, updateProfile, updatePassword, logout, authPending } = useUser();
  const { play } = useForumSounds();
  const titleId = useId();
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [discipline, setDiscipline] = useState(user?.discipline ?? "general");
  const [accent, setAccent] = useState(user?.accent ?? "purple");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [error, setError] = useState<string | null>(null);

  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwOk, setPwOk] = useState<string | null>(null);

  useEffect(() => {
    if (user && open) {
      setDisplayName(user.displayName);
      setDiscipline(user.discipline);
      setAccent(user.accent);
      setBio(user.bio ?? "");
      setError(null);
      setPwCurrent("");
      setPwNew("");
      setPwConfirm("");
      setPwError(null);
      setPwOk(null);
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
      bio: bio.trim(),
    });
    if (!result.ok) {
      play("whoosh");
      setError(result.error);
      return;
    }

    play("success");
    onClose();
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    setPwOk(null);
    if (pwNew !== pwConfirm) {
      setPwError("new passwords do not match");
      return;
    }
    if (pwNew.length < 8) {
      setPwError("new password must be at least 8 characters");
      return;
    }
    const result = await updatePassword({
      currentPassword: pwCurrent,
      password: pwNew,
      passwordConfirmation: pwConfirm,
    });
    if (!result.ok) {
      play("whoosh");
      setPwError(result.error);
      return;
    }
    play("success");
    setPwOk("password updated");
    setPwCurrent("");
    setPwNew("");
    setPwConfirm("");
  };

  return (
    <div className="modal-root" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal sheet-pop profile-modal-wide" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <h2 id={titleId} className="modal-title">
          your spot
        </h2>
        <p className="modal-hint">
          @{user.username} — how you show up, your lane, accent, and a short bio others see on your public profile.
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
          <label className="field">
            <span>bio</span>
            <textarea
              className="field-textarea"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="a line or two about what you make…"
              rows={4}
              maxLength={500}
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

          {error ? (
            <p className="field-error" role="alert">
              {error}
            </p>
          ) : null}

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
                save profile
              </button>
            </div>
          </div>
        </form>

        <details className="security-panel profile-security">
          <summary className="security-summary">Password &amp; account</summary>
          <div className="security-body">
            <form onSubmit={savePassword} className="modal-form password-inline-form">
              <label className="field">
                <span>current password</span>
                <input
                  type="password"
                  value={pwCurrent}
                  onChange={(e) => setPwCurrent(e.target.value)}
                  autoComplete="current-password"
                />
              </label>
              <label className="field">
                <span>new password</span>
                <input
                  type="password"
                  value={pwNew}
                  onChange={(e) => setPwNew(e.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={72}
                />
              </label>
              <label className="field">
                <span>confirm new password</span>
                <input
                  type="password"
                  value={pwConfirm}
                  onChange={(e) => setPwConfirm(e.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={72}
                />
              </label>
              {pwError ? (
                <p className="field-error" role="alert">
                  {pwError}
                </p>
              ) : null}
              {pwOk ? (
                <p className="modal-hint" role="status">
                  {pwOk}
                </p>
              ) : null}
              <button type="submit" className="btn-primary" disabled={authPending}>
                update password
              </button>
            </form>
            <p className="security-footnote">
              Sessions use a secure cookie on this site. Sign out on shared devices.
            </p>
          </div>
        </details>
      </div>
    </div>
  );
}
