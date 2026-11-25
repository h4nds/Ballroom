import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AuthOpenMode } from "./types";
import { UserProvider, useUser } from "./context/UserContext";
import { SoundsProvider } from "./context/SoundsContext";
import { ThemeProvider } from "./context/ThemeContext";
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
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { ArticlePage } from "./components/pages/ArticlePage";
import { BoardPage } from "./components/pages/BoardPage";
import { CollabsPage } from "./components/pages/CollabsPage";
import { EventsPage } from "./components/pages/EventsPage";
import { LatestPage } from "./components/pages/LatestPage";
import { SectionPage } from "./components/pages/SectionPage";
import { ShowcasePage } from "./components/pages/ShowcasePage";
import {
  articlesForBoard,
  findArticle,
  findBoardContext,
  postCount,
} from "./data/floorContent";
import type { Board, Category } from "./types";
import "./index.css";

type Tab = "boards" | "latest" | "showcase" | "collabs" | "events";

type FloorView =
  | { kind: "home" }
  | { kind: "section"; categoryId: string }
  | { kind: "board"; boardId: string }
  | { kind: "article"; articleId: string }
  | { kind: "latest" }
  | { kind: "showcase" }
  | { kind: "collabs" }
  | { kind: "events" };

function withActivity(board: Board): Board {
  const threads = articlesForBoard(board.id);
  const latest = threads[0];
  const posts = threads.reduce((total, thread) => total + postCount(thread), 0);
  return {
    ...board,
    threads: String(threads.length),
    posts: String(posts),
    latestTitle: latest?.title,
    latestAuthor: latest?.author,
    latestAgo: latest?.ago,
  };
}

function presentCategory(category: Category): Category {
  return { ...category, boards: category.boards.map(withActivity) };
}

function ForumHome() {
  const { user, clearNewDay } = useUser();
  const { play } = useForumSounds();
  const searchRef = useRef<HeaderSearchHandle | null>(null);
  const [authMode, setAuthMode] = useState<AuthOpenMode | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("boards");
  const [view, setView] = useState<FloorView>({ kind: "home" });
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

  const openTab = useCallback((tab: Tab) => {
    setActiveTab(tab);
    setBoardSearchQuery("");
    if (tab === "boards") setView({ kind: "home" });
    else setView({ kind: tab });
  }, []);

  const goHome = useCallback(() => {
    setActiveTab("boards");
    setView({ kind: "home" });
  }, []);

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
          openTab(tab);
          play("tap");
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [authMode, profileOpen, hintsOpen, membersOpen, publicProfileUsername, createPostOpen, play, openTab]);

  useEffect(() => {
    if (boardSearchQuery.trim()) {
      setActiveTab("boards");
      setView({ kind: "home" });
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
        onHome={goHome}
        onOpenAuth={setAuthMode}
        onOpenProfile={() => setProfileOpen(true)}
        onOpenMembers={() => setMembersOpen(true)}
        boardSearchQuery={boardSearchQuery}
        onBoardSearchChange={setBoardSearchQuery}
        searchRef={searchRef}
      />
      <SubNav active={activeTab} onChange={openTab} />

      <main className="floor" id="floor">
        {view.kind === "home" && (
          <>
            <Hero />
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
              <div className="floor-columns">
                {filteredCategories.map((cat) => (
                  <BoardSection
                    key={cat.id}
                    category={presentCategory(cat)}
                    canPost={!!user}
                    onOpenSection={(categoryId) => setView({ kind: "section", categoryId })}
                    onOpenBoard={(boardId) => setView({ kind: "board", boardId })}
                    onOpenArticle={(articleId) => setView({ kind: "article", articleId })}
                    latestArticleId={(boardId) => articlesForBoard(boardId)[0]?.id}
                    onStartThread={openCreatePost}
                  />
                ))}
                <Sidebar onOpenArticle={(articleId) => setView({ kind: "article", articleId })} />
              </div>
            )}
            {filteredCategories.length > 0 && (
              <div className="scroll-hint" aria-hidden>
                <span className="scroll-arrow">↓</span>
              </div>
            )}
          </>
        )}

        {view.kind === "section" &&
          (() => {
            const category = categories.find((cat) => cat.id === view.categoryId);
            if (!category) return null;
            return (
              <SectionPage
                category={presentCategory(category)}
                canPost={!!user}
                onHome={goHome}
                onOpenBoard={(boardId) => setView({ kind: "board", boardId })}
                onOpenArticle={(articleId) => setView({ kind: "article", articleId })}
                onStartThread={openCreatePost}
              />
            );
          })()}

        {view.kind === "board" &&
          (() => {
            const context = findBoardContext(view.boardId);
            if (!context) return null;
            return (
              <BoardPage
                category={context.category}
                board={withActivity(context.board)}
                canPost={!!user}
                onHome={goHome}
                onOpenSection={(categoryId) => setView({ kind: "section", categoryId })}
                onOpenArticle={(articleId) => setView({ kind: "article", articleId })}
                onStartThread={openCreatePost}
              />
            );
          })()}

        {view.kind === "article" &&
          (() => {
            const article = findArticle(view.articleId);
            if (!article) return null;
            return (
              <ArticlePage
                article={article}
                onHome={goHome}
                onOpenSection={(categoryId) => setView({ kind: "section", categoryId })}
                onOpenBoard={(boardId) => setView({ kind: "board", boardId })}
                onOpenArticle={(articleId) => setView({ kind: "article", articleId })}
              />
            );
          })()}

        {view.kind === "latest" && (
          <LatestPage onOpenArticle={(articleId) => setView({ kind: "article", articleId })} />
        )}
        {view.kind === "showcase" && (
          <ShowcasePage onOpenArticle={(articleId) => setView({ kind: "article", articleId })} />
        )}
        {view.kind === "collabs" && <CollabsPage />}
        {view.kind === "events" && <EventsPage />}
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
        <ThemeSwitcher />
        <p>
          2026 Ballroom Enwretched. All Rights reserved · built for creatives ·{" "}
          shift + <kbd className="footer-kbd">?</kbd> keyboard hints ·{" "}
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <SoundsProvider>
          <ForumHome />
        </SoundsProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
