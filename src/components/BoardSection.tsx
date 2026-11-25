import type { Category } from "../types";
import { BoardRow } from "./BoardRow";

type Props = {
  category: Category;
  canPost?: boolean;
  onOpenSection?: (categoryId: string) => void;
  onOpenBoard?: (boardId: string) => void;
  onOpenArticle?: (articleId: string) => void;
  latestArticleId?: (boardId: string) => string | undefined;
  onStartThread?: (boardId: string) => void;
  showHeading?: boolean;
};

export function BoardSection({
  category,
  canPost = false,
  onOpenSection,
  onOpenBoard,
  onOpenArticle,
  latestArticleId,
  onStartThread,
  showHeading = true,
}: Props) {
  return (
    <section className="board-section" aria-labelledby={showHeading ? `cat-${category.id}` : undefined}>
      {showHeading ? (
        <header className="board-section-head">
          <h2 className="board-section-title" id={`cat-${category.id}`}>
            {onOpenSection ? (
              <button type="button" className="text-button" onClick={() => onOpenSection(category.id)}>
                {category.title}
              </button>
            ) : (
              category.title
            )}
          </h2>
          <p className="board-section-tag">{category.tagline}</p>
        </header>
      ) : null}
      <ul className="board-list">
        {category.boards.map((b) => (
          <li key={b.id}>
            <BoardRow
              board={b}
              canPost={canPost}
              onOpenBoard={onOpenBoard}
              onOpenArticle={onOpenArticle}
              latestArticleId={latestArticleId?.(b.id)}
              onStartThread={onStartThread}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
