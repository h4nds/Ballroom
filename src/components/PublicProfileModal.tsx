import { useEffect, useId, useState } from "react";
import type { PublicUserProfile } from "../types";
import { followUser, getPublicProfile, unfollowUser } from "../lib/usersApi";
import { useForumSounds } from "../hooks/useForumSounds";
import { useUser } from "../context/UserContext";

type Props = {
  open: boolean;
  username: string;
  onClose: () => void;
};

export function PublicProfileModal({ open, username, onClose }: Props) {
  const { user: sessionUser } = useUser();
  const titleId = useId();
  const { play } = useForumSounds();
  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [followBusy, setFollowBusy] = useState(false);

  useEffect(() => {
    if (!open || !username) return;
    setLoading(true);
    setError(null);
    setProfile(null);
    void getPublicProfile(username).then((res) => {
      setLoading(false);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setProfile(res.user);
    });
  }, [open, username]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const toggleFollow = async () => {
    if (!profile || !sessionUser || profile.isSelf) return;
    setFollowBusy(true);
    const res = profile.isFollowing
      ? await unfollowUser(profile.username)
      : await followUser(profile.username);
    setFollowBusy(false);
    if (!res.ok) {
      play("whoosh");
      setError(res.error);
      return;
    }
    play("success");
    setProfile(res.user);
  };

  return (
    <div
      className="modal-root"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal sheet-pop public-profile-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <h2 id={titleId} className="modal-title">
          @{username}
        </h2>
        {loading ? (
          <p className="members-status">loading…</p>
        ) : error ? (
          <p className="field-error" role="alert">
            {error}
          </p>
        ) : profile ? (
          <>
            <div className={`public-profile-accent accent-${profile.accent}`} aria-hidden />
            <p className="public-profile-name">{profile.displayName}</p>
            <p className="public-profile-meta">
              {profile.discipline} · {profile.followersCount} followers · {profile.followingCount} following
            </p>
            {profile.bio.trim() ? (
              <p className="public-profile-bio">{profile.bio}</p>
            ) : (
              <p className="public-profile-bio public-profile-bio-empty">no bio yet</p>
            )}
            {sessionUser && !profile.isSelf ? (
              <div className="public-profile-actions">
                <button
                  type="button"
                  className={profile.isFollowing ? "btn-ghost" : "btn-primary"}
                  disabled={followBusy}
                  onClick={() => void toggleFollow()}
                >
                  {followBusy ? "…" : profile.isFollowing ? "following" : "follow"}
                </button>
              </div>
            ) : null}
            {sessionUser && profile.isSelf ? (
              <p className="modal-hint">this is you — edit your spot from the header profile menu.</p>
            ) : null}
            {!sessionUser ? (
              <p className="modal-hint">sign in to follow people on the floor.</p>
            ) : null}
          </>
        ) : null}
        <div className="modal-actions">
          <button type="button" className="btn-primary" onClick={onClose}>
            close
          </button>
        </div>
      </div>
    </div>
  );
}
