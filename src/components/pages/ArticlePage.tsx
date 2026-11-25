import { articlesForBoard, findBoardContext, type Article } from "../../data/floorContent";
import { Crumbs } from "../Crumbs";

type Props = {
  article: Article;
  onHome: () => void;
  onOpenSection: (categoryId: string) => void;
  onOpenBoard: (boardId: string) => void;
  onOpenArticle: (articleId: string) => void;
};

export function ArticlePage({ article, onHome, onOpenSection, onOpenBoard, onOpenArticle }: Props) {
  const context = findBoardContext(article.boardId);
  const related = articlesForBoard(article.boardId).filter((item) => item.id !== article.id);

  return (
    <div className="article-layout">
      <article className="page article-page">
        <Crumbs
          items={[
            { label: "boards", onClick: onHome },
            context
              ? {
                  label: context.category.title.toLowerCase(),
                  onClick: () => onOpenSection(context.category.id),
                }
              : { label: "section" },
            context
              ? { label: context.board.name, onClick: () => onOpenBoard(context.board.id) }
              : { label: article.boardId },
            { label: article.title },
          ]}
        />
        <header className="page-head">
          <p className="page-kicker">{context?.board.name ?? "thread"}</p>
          <h1 className="page-title">{article.title}</h1>
          <p className="thread-meta">
            {article.author} · {article.ago}
          </p>
        </header>
        <div className="article-body">
          {article.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <section className="replies" aria-labelledby="replies-title">
          <h2 id="replies-title">replies</h2>
          {article.replies.length === 0 ? (
            <p className="widget-empty">No replies yet.</p>
          ) : (
            <ol className="reply-list">
              {article.replies.map((reply) => (
                <li key={reply.id}>
                  <article>
                    <h3>{reply.author}</h3>
                    <p className="thread-meta">{reply.ago}</p>
                    <p>{reply.body}</p>
                  </article>
                </li>
              ))}
            </ol>
          )}
        </section>
      </article>
      <aside className="article-aside" aria-label="More on this board">
        <h2>more on this board</h2>
        {related.length === 0 ? (
          <p className="widget-empty">This is the only thread here.</p>
        ) : (
          <ul>
            {related.map((item) => (
              <li key={item.id}>
                <button type="button" className="text-button" onClick={() => onOpenArticle(item.id)}>
                  {item.title}
                </button>
                <span>{item.author}</span>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}
