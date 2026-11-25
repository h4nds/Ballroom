import { showcase } from "../../data/floorContent";

type Props = {
  onOpenArticle: (articleId: string) => void;
};

export function ShowcasePage({ onOpenArticle }: Props) {
  return (
    <section className="page showcase-page" aria-labelledby="showcase-title">
      <header className="page-head">
        <p className="page-kicker">on the wall</p>
        <h1 id="showcase-title" className="page-title">
          showcase
        </h1>
        <p className="page-lead">Work that made it out of the thread and onto the wall.</p>
      </header>
      <ul className="showcase-grid">
        {showcase.map((piece) => (
          <li key={piece.id}>
            <article className="showcase-card">
              <p className="page-kicker">{piece.medium}</p>
              <h2>{piece.title}</h2>
              <p>{piece.note}</p>
              <p className="thread-meta">{piece.maker}</p>
              <button type="button" className="linkish" onClick={() => onOpenArticle(piece.articleId)}>
                read the thread
              </button>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
