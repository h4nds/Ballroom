export type Accent = "purple" | "green" | "yellow";

export type AuthOpenMode = "join" | "signin";

export interface UserProfile {
  username: string;
  displayName: string;
  discipline: "visual" | "motion" | "music" | "writing" | "general";
  accent: Accent;
  soundsEnabled: boolean;
}

export interface Board {
  id: string;
  name: string;
  description: string;
  accent: Accent;
  icon: string;
  threads: string;
  posts: string;
  /** Set when there is a real latest thread from the API. */
  latestTitle?: string;
  latestAuthor?: string;
  latestAgo?: string;
}

export interface Category {
  id: string;
  title: string;
  tagline: string;
  boards: Board[];
}

