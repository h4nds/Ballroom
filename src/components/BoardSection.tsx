import type { Category } from "../types";
import { BoardRow } from "./BoardRow";

type Props = {
  category: Category;
};

export function BoardSection({ category }: Props) {
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
          <BoardRow key={b.id} board={b} />
        ))}
      </div>
    </section>
  );
}
