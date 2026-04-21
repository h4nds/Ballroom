import type { Category } from "../types";

/** Client-side filter by board name, description, id — until there's a live search API. */
export function filterCategories(categories: Category[], raw: string): Category[] {
  const q = raw.trim().toLowerCase();
  if (!q) return categories;

  return categories
    .map((cat) => ({
      ...cat,
      boards: cat.boards.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.id.toLowerCase().includes(q),
      ),
    }))
    .filter((cat) => cat.boards.length > 0);
}
