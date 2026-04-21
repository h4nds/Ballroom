import type { Category } from "../types";
import { BoardRow } from "./BoardRow";

type Props = {
  category: Category;
  canPost?: boolean;
  onStartThread?: (boardId: string) => void;
};

export function BoardSection({ category, canPost = false, onStartThread }: Props) {
  return (
    <section className="board-section" aria-labelledby={`cat-${category.id}`}>
      <header className="board-section-head">
        <h2 className="board-section-title" id={`cat-${category.id}`}>
          {category.title}
        </h2>
        <p className="board-section-tag">{category.tagline}</p>
      </header>
      <div className="board-list">
        {category.boards.map((b) => (
          <BoardRow
            key={b.id}
            board={b}
            canPost={canPost}
            onStartThread={onStartThread}
          />
        ))}
      </div>
    </section>
  );
}
