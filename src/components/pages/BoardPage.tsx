import type { Board, Category } from "../../types";
import { articlesForBoard } from "../../data/floorContent";
import { Crumbs } from "../Crumbs";

type Props = {
  category: Category;
  board: Board;
  canPost: boolean;
  onHome: () => void;
  onOpenSection: (categoryId: string) => void;
  onOpenArticle: (articleId: string) => void;
  onStartThread: (boardId: string) => void;
};

export function BoardPage({
  category,
  board,
  canPost,
  onHome,
  onOpenSection,
  onOpenArticle,
  onStartThread,
}: Props) {
  const threads = articlesForBoard(board.id);

  return (
    <article className="page board-page">
      <Crumbs
        items={[
          { label: "boards", onClick: onHome },
          { label: category.title.toLowerCase(), onClick: () => onOpenSection(category.id) },
          { label: board.name },
        ]}
      />
      <header className="page-head">
        <p className="page-kicker">board</p>
        <h1 className="page-title">{board.name}</h1>
        <p className="page-lead">{board.description}</p>
        {canPost ? (
          <button type="button" className="btn-join" onClick={() => onStartThread(board.id)}>
            start a thread
          </button>
        ) : (
          <p className="page-note">Sign in to start a thread on this board.</p>
        )}
      </header>
      {threads.length === 0 ? (
        <p className="widget-empty">No threads on this board yet.</p>
      ) : (
        <ol className="thread-list">
          {threads.map((thread) => (
            <li key={thread.id}>
              <article className="thread-row">
                <h2>
                  <button type="button" className="text-button" onClick={() => onOpenArticle(thread.id)}>
                    {thread.title}
                  </button>
                </h2>
                <p>{thread.excerpt}</p>
                <p className="thread-meta">
                  {thread.author} · {thread.ago} · {thread.replies.length}{" "}
                  {thread.replies.length === 1 ? "reply" : "replies"}
                </p>
              </article>
            </li>
          ))}
        </ol>
      )}
    </article>
  );
}
