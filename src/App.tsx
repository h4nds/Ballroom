import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AuthOpenMode } from "./types";
import { UserProvider, useUser } from "./context/UserContext";
import { SoundsProvider } from "./context/SoundsContext";
import { categories } from "./data/forumData";
import { filterCategories } from "./lib/filterCategories";
import { Header } from "./components/Header";
import { SubNav } from "./components/SubNav";
import { Hero } from "./components/Hero";
import { BoardSection } from "./components/BoardSection";
import { Sidebar } from "./components/Sidebar";
import { AuthModal } from "./components/AuthModal";
import { ProfileModal } from "./components/ProfileModal";
import { WelcomeToast } from "./components/WelcomeToast";
import { HintsModal } from "./components/HintsModal";
import "./index.css";

type Tab = "boards" | "latest" | "showcase" | "collabs" | "events";

function ForumHome() {
  const { user, clearNewDay } = useUser();
  const [authMode, setAuthMode] = useState<AuthOpenMode | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("boards");
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [hintsOpen, setHintsOpen] = useState(false);
  const [boardSearchQuery, setBoardSearchQuery] = useState("");
  const prevUser = useRef<string | null>(null);

  const filteredCategories = useMemo(
    () => filterCategories(categories, boardSearchQuery),
    [boardSearchQuery],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "?" || e.repeat) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      e.preventDefault();
      setHintsOpen((o) => !o);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
        boardSearchQuery={boardSearchQuery}
        onBoardSearchChange={setBoardSearchQuery}
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
                filteredCategories.map((cat) => <BoardSection key={cat.id} category={cat} />)
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

      <footer className="site-footer">
        <p>
          2026 Ballroom Enwretched. All Rights reserved · built for creatives · Shift + <kbd className="footer-kbd">?</kbd> for keyboard hints
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
