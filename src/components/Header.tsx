import type { AuthOpenMode } from "../types";
import { useForumSounds } from "../hooks/useForumSounds";
import { useUser } from "../context/UserContext";

type Props = {
  onOpenAuth: (mode: AuthOpenMode) => void;
  onOpenProfile: () => void;
};

export function Header({ onOpenAuth, onOpenProfile }: Props) {
  const { user, updateProfile } = useUser();
  const { play } = useForumSounds(user?.soundsEnabled ?? true);

  return (
    <header className="site-header">
      <a
        href="/"
        className="logo"
        onPointerDown={() => play("tap")}
        onKeyDown={(e) => e.key === "Enter" && play("tap")}
      >
        ballroom
      </a>
      <nav className="header-actions" aria-label="Account">
        <button type="button" className="linkish" onClick={() => play("whoosh")}>
          search
        </button>
        <button type="button" className="linkish" onClick={() => play("whoosh")}>
          members
        </button>
        {user ? (
          <button
            type="button"
            className="profile-trigger"
            onClick={() => {
              play("tap");
              onOpenProfile();
            }}
            aria-label={`Open profile and settings for ${user.displayName || user.username}`}
          >
            <span className="avatar-tiny" aria-hidden>
              {(user.displayName || user.username).slice(0, 2).toUpperCase()}
            </span>
            <span className="profile-text">
              <span className="profile-eyebrow">profile</span>
              <span className="profile-name">{user.displayName || user.username}</span>
            </span>
          </button>
        ) : (
          <>
            <button
              type="button"
              className="linkish"
              onClick={() => {
                play("tap");
                onOpenAuth("signin");
              }}
            >
              sign in
            </button>
            <button
              type="button"
              className="btn-join"
              onClick={() => {
                play("join");
                onOpenAuth("join");
              }}
            >
              join the floor
            </button>
          </>
        )}
        {user ? (
          <label className="sound-toggle" title="UI sounds">
            <input
              type="checkbox"
              checked={user.soundsEnabled}
              onChange={(e) => {
                void updateProfile({ soundsEnabled: e.target.checked });
              }}
            />
            <span>sounds</span>
          </label>
        ) : null}
      </nav>
    </header>
  );
}
