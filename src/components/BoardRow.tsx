import type { Board } from "../types";
import { BoardIcon } from "./BoardIcon";
import { useForumSounds } from "../hooks/useForumSounds";

const accentClass: Record<Board["accent"], string> = {
  purple: "accent-purple",
  green: "accent-green",
  yellow: "accent-yellow",
};

type Props = {
  board: Board;
};

export function BoardRow({ board }: Props) {
  const { play } = useForumSounds();

  return (
    <article
      className={`board-row ${accentClass[board.accent]}`}
      onPointerEnter={() => play("hover")}
    >
      <div className="board-icon-wrap" aria-hidden>
        <BoardIcon name={board.icon} />
      </div>
      <div className="board-main">
        <h3 className="board-title">{board.name}</h3>
        <p className="board-desc">{board.description}</p>
      </div>
      <div className="board-metrics">
        <div>
          <span className="metric-label">threads</span>
          <span className="metric-val">{board.threads}</span>
        </div>
        <div>
          <span className="metric-label">posts</span>
          <span className="metric-val">{board.posts}</span>
        </div>
      </div>
      <div className="board-latest">
        {board.latestTitle && board.latestAuthor && board.latestAgo ? (
          <>
            <span className="latest-title">{board.latestTitle}</span>
            <span className="latest-meta">
              by {board.latestAuthor} · {board.latestAgo}
            </span>
          </>
        ) : (
          <>
            <span className="latest-title latest-empty">No threads yet</span>
            <span className="latest-meta">start the first one</span>
          </>
        )}
      </div>
    </article>
  );
}
