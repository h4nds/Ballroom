import type { Category, ForumBoardRecord } from "../types";

function formatBumpedAgo(iso: string): string {
  const d = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 48) return `${hrs}h ago`;
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

/** Overlay live counts + latest thread from `GET /api/boards` onto static layout categories. */
export function mergeCategoriesWithBoardApi(base: Category[], boards: ForumBoardRecord[]): Category[] {
  const bySlug = new Map(boards.map((b) => [b.slug, b]));

  return base.map((cat) => ({
    ...cat,
    boards: cat.boards.map((board) => {
      const api = bySlug.get(board.id);
      if (!api) return board;

      const threadsStr = String(api.threadCount);
      const postsStr = String(api.postCount);
      const hasLatest =
        api.latestSubject != null &&
        api.latestSubject !== "" &&
        api.latestAuthorDisplayName != null &&
        api.latestBumpedAt != null;

      return {
        ...board,
        name: api.name,
        description: api.description,
        threads: threadsStr,
        posts: postsStr,
        ...(hasLatest
          ? {
              latestTitle: api.latestSubject,
              latestAuthor: api.latestAuthorDisplayName,
              latestAgo: formatBumpedAgo(api.latestBumpedAt!),
            }
          : {}),
      };
    }),
  }));
}
