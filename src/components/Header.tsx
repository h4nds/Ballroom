import type { Ref } from "react";
import type { AuthOpenMode } from "../types";
import { useForumSounds } from "../hooks/useForumSounds";
import { useUser } from "../context/UserContext";
import { useSounds } from "../context/SoundsContext";
import { HeaderSearch, type HeaderSearchHandle } from "./HeaderSearch";

type Props = {
  onOpenAuth: (mode: AuthOpenMode) => void;
  onOpenProfile: () => void;
  onOpenMembers: () => void;
  boardSearchQuery: string;
  onBoardSearchChange: (value: string) => void;
  searchRef: Ref<HeaderSearchHandle | null>;
};

export function Header({
  onOpenAuth,
  onOpenProfile,
  onOpenMembers,
  boardSearchQuery,
  onBoardSearchChange,
  searchRef,
}: Props) {
  const { user } = useUser();
  const { soundsEnabled, setSoundsEnabled } = useSounds();
  const { play } = useForumSounds();

  return (
    <header className="site-header">
      <a
        href="/"
        className="logo"
        onPointerDown={() => play("tap")}
        onKeyDown={(e) => e.key === "Enter" && play("tap")}
        aria-label="Ballroom — home"
      >
        <img
          className="logo-img"
          src="/logo-ballroom.png"
          alt=""
          width={360}
          height={90}
          decoding="async"
        />
      </a>
      <nav className="header-actions" aria-label="Account">
        <HeaderSearch ref={searchRef} query={boardSearchQuery} onQueryChange={onBoardSearchChange} />
        <button
          type="button"
          className="linkish"
          onClick={() => {
            play("whoosh");
            onOpenMembers();
          }}
        >
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
        <label className="sound-toggle" title="UI sounds">
          <input
            type="checkbox"
            checked={soundsEnabled}
            onChange={(e) => {
              play("tap");
              setSoundsEnabled(e.target.checked);
            }}
          />
          <span>sounds</span>
        </label>
      </nav>
    </header>
  );
}
