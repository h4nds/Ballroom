import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AuthOpenMode } from "./types";
import { UserProvider, useUser } from "./context/UserContext";
import { SoundsProvider } from "./context/SoundsContext";
import { categories } from "./data/forumData";
import { filterCategories } from "./lib/filterCategories";
import { isTypingInTextField, tabFromShiftDigitCode } from "./lib/keyboardNav";
import { useForumSounds } from "./hooks/useForumSounds";
import type { HeaderSearchHandle } from "./components/HeaderSearch";
import { Header } from "./components/Header";
import { SubNav } from "./components/SubNav";
import { Hero } from "./components/Hero";
import { BoardSection } from "./components/BoardSection";
import { Sidebar } from "./components/Sidebar";
import { AuthModal } from "./components/AuthModal";
import { ProfileModal } from "./components/ProfileModal";
import { WelcomeToast } from "./components/WelcomeToast";
import { HintsModal } from "./components/HintsModal";
import { CreatePostModal } from "./components/CreatePostModal";
import { MembersModal } from "./components/MembersModal";
import { PublicProfileModal } from "./components/PublicProfileModal";
import "./index.css";

type Tab = "boards" | "latest" | "showcase" | "collabs" | "events";

function ForumHome() {
  const { user, clearNewDay } = useUser();
  const { play } = useForumSounds();
  const searchRef = useRef<HeaderSearchHandle | null>(null);
  const [authMode, setAuthMode] = useState<AuthOpenMode | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("boards");
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [hintsOpen, setHintsOpen] = useState(false);
  const [boardSearchQuery, setBoardSearchQuery] = useState("");
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [createPostBoardId, setCreatePostBoardId] = useState("visual");
  const [membersOpen, setMembersOpen] = useState(false);
  const [publicProfileUsername, setPublicProfileUsername] = useState<string | null>(null);
  const prevUser = useRef<string | null>(null);

  const openCreatePost = useCallback((boardId: string) => {
    setCreatePostBoardId(boardId);
    setCreatePostOpen(true);
  }, []);

  const filteredCategories = useMemo(
    () => filterCategories(categories, boardSearchQuery),
    [boardSearchQuery],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;

      const typing = isTypingInTextField(e.target);

      if (e.key === "?" && !typing) {
        e.preventDefault();
        setHintsOpen((o) => !o);
        return;
      }

      if (typing) return;

      const modalBlocking =
        authMode !== null ||
        profileOpen ||
        hintsOpen ||
        membersOpen ||
        publicProfileUsername !== null ||
        createPostOpen;

      if (e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (e.code === "KeyH") {
          if (!modalBlocking) {
            e.preventDefault();
            setHintsOpen(true);
            play("tap");
          }
          return;
        }

        if (modalBlocking) return;

        if (e.code === "KeyF") {
          e.preventDefault();
          searchRef.current?.focusSearch();
          play("whoosh");
          return;
        }

        const tab = tabFromShiftDigitCode(e.code);
        if (tab) {
          e.preventDefault();
          setActiveTab(tab);
          play("tap");
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [authMode, profileOpen, hintsOpen, membersOpen, publicProfileUsername, createPostOpen, play]);

  useEffect(() => {
    if (boardSearchQuery.trim()) {
      setActiveTab("boards");
    }
  }, [boardSearchQuery]);

  useEffect(() => {
    if (!user) {
      prevUser.current = null;
      return;
    }
    if (user.username === prevUser.current) return;
    prevUser.current = user.username;
    const sk = `ballroom_floor_${user.username}`;
    if (sessionStorage.getItem(sk)) return;
    setWelcomeOpen(true);
  }, [user]);

  const dismissWelcome = useCallback(() => {
    clearNewDay();
    if (user) sessionStorage.setItem(`ballroom_floor_${user.username}`, "1");
    setWelcomeOpen(false);
  }, [clearNewDay, user]);

  return (
    <div className="app-shell">
      <div className="bg-noise" aria-hidden />
      <Header
        onOpenAuth={setAuthMode}
        onOpenProfile={() => setProfileOpen(true)}
        onOpenMembers={() => setMembersOpen(true)}
        boardSearchQuery={boardSearchQuery}
        onBoardSearchChange={setBoardSearchQuery}
        searchRef={searchRef}
      />
      <SubNav active={activeTab} onChange={setActiveTab} />

      <main className="main-grid">
        <div className="main-col">
          <Hero />
          {activeTab === "boards" && (
            <>
              {filteredCategories.length === 0 ? (
                <p className="board-search-empty" role="status">
                  No boards match “{boardSearchQuery.trim()}”. Try another word or{" "}
                  <button
                    type="button"
                    className="linkish board-search-clear"
                    onClick={() => setBoardSearchQuery("")}
                  >
                    clear search
                  </button>
                  .
                </p>
              ) : (
                filteredCategories.map((cat) => (
                  <BoardSection
                    key={cat.id}
                    category={cat}
                    canPost={!!user}
                    onStartThread={openCreatePost}
                  />
                ))
              )}
              {filteredCategories.length > 0 && (
                <div className="scroll-hint" aria-hidden>
                  <span className="scroll-arrow">↓</span>
                </div>
              )}
            </>
          )}
          {activeTab !== "boards" && (
            <section className="placeholder-panel sheet-pop">
              <h2 className="placeholder-title">{activeTab.replace("-", " ")}</h2>
              <p className="placeholder-copy">
                Hammer & nail!!!!
              </p>
            </section>
          )}
        </div>
        <Sidebar />
      </main>

      <AuthModal
        open={authMode !== null}
        mode={authMode}
        onModeChange={setAuthMode}
        onClose={() => setAuthMode(null)}
      />
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
      <WelcomeToast show={welcomeOpen} onDismiss={dismissWelcome} />
      <HintsModal open={hintsOpen} onClose={() => setHintsOpen(false)} />
      <CreatePostModal
        open={createPostOpen}
        defaultBoardId={createPostBoardId}
        onClose={() => setCreatePostOpen(false)}
      />
      <MembersModal
        open={membersOpen}
        onClose={() => setMembersOpen(false)}
        onSelectMember={(u) => {
          setMembersOpen(false);
          setPublicProfileUsername(u);
        }}
      />
      <PublicProfileModal
        open={publicProfileUsername !== null}
        username={publicProfileUsername ?? ""}
        onClose={() => setPublicProfileUsername(null)}
      />

      <footer className="site-footer">
        <p>
          2026 Ballroom Enwretched. All Rights reserved · built for creatives ·{" "}
          <kbd className="footer-kbd">?</kbd> keyboard hints ·{" "}
          <kbd className="footer-kbd">Shift</kbd>+<kbd className="footer-kbd">1–5</kbd> sections ·{" "}
          <kbd className="footer-kbd">Shift</kbd>+<kbd className="footer-kbd">F</kbd> search ·{" "}
          <kbd className="footer-kbd">Shift</kbd>+<kbd className="footer-kbd">H</kbd> hints
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <SoundsProvider>
        <ForumHome />
      </SoundsProvider>
    </UserProvider>
  );
}
