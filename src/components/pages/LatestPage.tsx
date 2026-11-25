import { articles } from "../../data/floorContent";
import { findBoardContext } from "../../data/floorContent";

type Props = {
  onOpenArticle: (articleId: string) => void;
};

export function LatestPage({ onOpenArticle }: Props) {
  return (
    <section className="page feed-page" aria-labelledby="latest-title">
      <header className="page-head">
        <p className="page-kicker">the floor</p>
        <h1 id="latest-title" className="page-title">
          latest posts
        </h1>
        <p className="page-lead">Newest threads across every board, in the order they landed.</p>
      </header>
      <ol className="feed-list">
        {articles.map((article) => {
          const context = findBoardContext(article.boardId);
          return (
            <li key={article.id}>
              <article className="feed-card">
                <p className="page-kicker">{context?.board.name ?? article.boardId}</p>
                <h2>
                  <button type="button" className="text-button" onClick={() => onOpenArticle(article.id)}>
                    {article.title}
                  </button>
                </h2>
                <p>{article.excerpt}</p>
                <p className="thread-meta">
                  {article.author} · {article.ago}
                </p>
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
