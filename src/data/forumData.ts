import type { Category } from "../types";

/** Board layout only — counts and activity come from the backend later. */
export const categories: Category[] = [
  {
    id: "stage",
    title: "THE STAGE",
    tagline: "share your work & get seen",
    boards: [
      {
        id: "visual",
        name: "visual work",
        description: "illustration, photography, design",
        accent: "purple",
        icon: "palette",
        threads: "0",
        posts: "0",
      },
      {
        id: "motion",
        name: "motion & film",
        description: "animation, video, motion graphics",
        accent: "purple",
        icon: "clapper",
        threads: "0",
        posts: "0",
      },
      {
        id: "music",
        name: "music & sound",
        description: "production, composition, foley",
        accent: "purple",
        icon: "wave",
        threads: "0",
        posts: "0",
      },
      {
        id: "writing",
        name: "writing & words",
        description: "prose, poetry, scripts",
        accent: "purple",
        icon: "pen",
        threads: "0",
        posts: "0",
      },
    ],
  },
  {
    id: "backroom",
    title: "THE BACK ROOM",
    tagline: "process, tools & craft talk",
    boards: [
      {
        id: "tools",
        name: "tools & process",
        description: "software, workflows, gear",
        accent: "yellow",
        icon: "gear",
        threads: "0",
        posts: "0",
      },
      {
        id: "critique",
        name: "critique & feedback",
        description: "honest eyes only",
        accent: "yellow",
        icon: "eye",
        threads: "0",
        posts: "0",
      },
    ],
  },
  {
    id: "lobby",
    title: "THE LOBBY",
    tagline: "connect, collab & just hang",
    boards: [
      {
        id: "collabs",
        name: "find collabs",
        description: "partners, bandmates, co-authors",
        accent: "green",
        icon: "handshake",
        threads: "0",
        posts: "0",
      },
    ],
  },
];
