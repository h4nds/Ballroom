import type { Category } from "../../types";
import { BoardSection } from "../BoardSection";
import { Crumbs } from "../Crumbs";

type Props = {
  category: Category;
  canPost: boolean;
  onHome: () => void;
  onOpenBoard: (boardId: string) => void;
  onOpenArticle: (articleId: string) => void;
  onStartThread: (boardId: string) => void;
};

export function SectionPage({
  category,
  canPost,
  onHome,
  onOpenBoard,
  onOpenArticle,
  onStartThread,
}: Props) {
  return (
    <article className="page section-page">
      <Crumbs
        items={[
          { label: "boards", onClick: onHome },
          { label: category.title.toLowerCase() },
        ]}
      />
      <header className="page-head">
        <p className="page-kicker">section</p>
        <h1 className="page-title">{category.title.toLowerCase()}</h1>
        <p className="page-lead">{category.tagline}</p>
      </header>
      <BoardSection
        category={category}
        canPost={canPost}
        onOpenBoard={onOpenBoard}
        onOpenArticle={onOpenArticle}
        onStartThread={onStartThread}
        showHeading={false}
      />
    </article>
  );
}
