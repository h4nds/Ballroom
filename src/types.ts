export type Accent = "purple" | "green" | "yellow";

export type AuthOpenMode = "join" | "signin";

export interface UserProfile {
  username: string;
  displayName: string;
  discipline: "visual" | "motion" | "music" | "writing" | "general";
  accent: Accent;
  soundsEnabled: boolean;
  /** Short public bio; empty string if unset. */
  bio: string;
}

/** Another member’s profile from `GET /api/users/:username`. */
export interface PublicUserProfile {
  username: string;
  displayName: string;
  discipline: UserProfile["discipline"];
  accent: Accent;
  bio: string;
  followersCount: number;
  followingCount: number;
  isSelf: boolean;
  isFollowing: boolean;
}

/** Compact row from `GET /api/users`. */
export interface UserCard {
  username: string;
  displayName: string;
  discipline: UserProfile["discipline"];
  accent: Accent;
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

export interface ForumBoardRecord {
  id: number;
  slug: string;
  name: string;
  description: string;
  threadCount: number;
  /** Threads plus replies (each OP counts as activity). */
  postCount: number;
  latestSubject?: string;
  latestAuthorDisplayName?: string;
  latestBumpedAt?: string;
}

export interface ForumThreadRow {
  id: number;
  boardSlug: string;
  subject: string;
  opBodyPreview: string;
  authorDisplayName: string;
  authorUsername: string;
  replyCount: number;
  createdAt: string;
  bumpedAt: string;
}

export interface ForumThreadRecord {
  id: number;
  boardSlug: string;
  subject: string;
  opBody: string;
  authorDisplayName: string;
  authorUsername: string;
  createdAt: string;
  bumpedAt: string;
}

export interface ForumPostRecord {
  id: number;
  threadId: number;
  body: string;
  authorDisplayName: string;
  authorUsername: string;
  createdAt: string;
}

