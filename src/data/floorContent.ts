import { categories } from "./forumData";

export interface Reply {
  id: string;
  author: string;
  ago: string;
  body: string;
}

export interface Article {
  id: string;
  boardId: string;
  title: string;
  excerpt: string;
  paragraphs: string[];
  author: string;
  ago: string;
  replies: Reply[];
}

export interface ShowcasePiece {
  id: string;
  title: string;
  maker: string;
  medium: string;
  note: string;
  articleId: string;
}

export interface CollabCall {
  id: string;
  title: string;
  need: string;
  detail: string;
  postedBy: string;
  when: string;
}

export interface FloorEvent {
  id: string;
  title: string;
  when: string;
  where: string;
  detail: string;
}

export const articles: Article[] = [
  {
    id: "night-study",
    boardId: "visual",
    title: "night study, three exposures",
    excerpt: "Same stairwell, three shutter speeds, and the one frame that kept the railing.",
    author: "mara quill",
    ago: "2h ago",
    paragraphs: [
      "I shot the west stairwell after the building cleared out. Same tripod, same frame, three exposures: a half second, two seconds, and eight.",
      "The short one is honest and a little dull. The long one turns the exit sign into a smear. The middle frame keeps the railing and still lets the light pool on the landing.",
      "Posting all three so the crop conversation has something to argue with. I am keeping the middle one unless someone shows me I am wrong.",
    ],
    replies: [
      {
        id: "ns-1",
        author: "jules nash",
        ago: "1h ago",
        body: "Middle frame. The smear in the long exposure eats the only line that tells you it is a stair.",
      },
      {
        id: "ns-2",
        author: "len voss",
        ago: "40m ago",
        body: "Agree, and I would lift the shadow on the bottom step. Right now the landing floats.",
      },
    ],
  },
  {
    id: "poster-system",
    boardId: "visual",
    title: "poster system for a room that does not exist",
    excerpt: "A four-poster set built around one rule: the type never sits in the middle.",
    author: "jules nash",
    ago: "1d ago",
    paragraphs: [
      "This set is for a venue I invented so I could stop designing for clients who say “make the logo bigger.” Four posters, one grid, type locked to the left edge.",
      "The color is almost nothing on purpose. If the poster still reads from the back of a room in greys, it will survive a bad printer.",
    ],
    replies: [
      {
        id: "ps-1",
        author: "nia cole",
        ago: "20h ago",
        body: "The third poster is the one I would steal. The others explain the system. That one just uses it.",
      },
    ],
  },
  {
    id: "twelve-second-loop",
    boardId: "motion",
    title: "a 12-second loop that would not sit still",
    excerpt: "The cut is fine. The hold at the end is what keeps missing the downbeat.",
    author: "rio ames",
    ago: "5h ago",
    paragraphs: [
      "Short loop for a title card. Twelve seconds, four cuts, and a hold that is supposed to land on the kick.",
      "It does not. I have slipped the last frame by two, then by five, and it still feels early. Posting the timing sheet with the loop so someone who actually counts can see it.",
    ],
    replies: [
      {
        id: "tl-1",
        author: "nia cole",
        ago: "3h ago",
        body: "Your hold is early because the kick is late in the bar, not on one. Sit the cut on the snare and it locks.",
      },
    ],
  },
  {
    id: "stairwell-tape",
    boardId: "music",
    title: "field recording from the stairwell",
    excerpt: "Four minutes of shoes, a door, and a radiator that will not shut up.",
    author: "nia cole",
    ago: "6h ago",
    paragraphs: [
      "Recorded on the same landing Mara keeps photographing. Phone in a coat pocket, no wind, just the room.",
      "The radiator is the part I want. Everything else is footsteps getting out of the way. I am cutting a bed from the last ninety seconds if nobody objects to the hum.",
    ],
    replies: [
      {
        id: "st-1",
        author: "rio ames",
        ago: "4h ago",
        body: "Leave the hum. It is the only thing that says the building is on.",
      },
    ],
  },
  {
    id: "usher",
    boardId: "writing",
    title: "the usher who never clocks out",
    excerpt: "Opening page of a short about a person who seats ghosts and calls it a job.",
    author: "len voss",
    ago: "8h ago",
    paragraphs: [
      "She tears the ticket, points with two fingers, and does not look at the seat she is sending them to. Most nights that is the whole job.",
      "On Thursdays the tickets have names she recognizes from programs that are already over. She seats them anyway. The house is never as empty as the manager says it is.",
      "This is the first page. I want to know if the voice is too pleased with itself before I write the second.",
    ],
    replies: [
      {
        id: "us-1",
        author: "mara quill",
        ago: "7h ago",
        body: "The second paragraph is the story. The first one can be half as long.",
      },
    ],
  },
  {
    id: "brush-set",
    boardId: "tools",
    title: "the brush set I stopped apologizing for",
    excerpt: "Six brushes, one eraser, and the shortcut I actually remember.",
    author: "mara quill",
    ago: "3d ago",
    paragraphs: [
      "People keep asking for my full setup. It is six brushes, a hard eraser, and one action that exports a flattened jpg. That is the list.",
      "The useful part is the naming. Each brush says what it does in the thumbnail, not what it is made of. I stopped losing twenty minutes looking for “the soft one.”",
    ],
    replies: [],
  },
  {
    id: "crop-lying",
    boardId: "critique",
    title: "tell me if the crop is lying",
    excerpt: "Full frame next to the crop I want to post. One of them is cheating.",
    author: "jules nash",
    ago: "9h ago",
    paragraphs: [
      "Full frame includes a trash can and a sliver of a parked car. The crop is a clean doorway and a figure. I like the crop. I do not trust it.",
      "If the picture only works after I remove the street, say so. I would rather post the ugly true one.",
    ],
    replies: [
      {
        id: "cl-1",
        author: "len voss",
        ago: "8h ago",
        body: "The crop is fine. The trash can was never the subject. You are not lying. You are editing.",
      },
    ],
  },
  {
    id: "sound-for-short",
    boardId: "collabs",
    title: "need a sound person for a short",
    excerpt: "Picture is locked. I need someone who can make a stairwell feel occupied.",
    author: "rio ames",
    ago: "1d ago",
    paragraphs: [
      "Twelve-second piece, picture locked, no dialogue. I need footsteps, a door, and a room tone that does not sound like a library.",
      "Nia’s stairwell tape is close to the world I want. If you want the cut, it is in the motion board. Credit up front, no rush past next Friday.",
    ],
    replies: [
      {
        id: "sf-1",
        author: "nia cole",
        ago: "22h ago",
        body: "I can cut the bed this week. Send the locked picture and I will match the door to your last frame.",
      },
    ],
  },
];

export const showcase: ShowcasePiece[] = [
  {
    id: "show-night",
    title: "night study",
    maker: "mara quill",
    medium: "photograph",
    note: "The middle exposure. Railing kept, exit sign still a sign.",
    articleId: "night-study",
  },
  {
    id: "show-posters",
    title: "room that does not exist",
    maker: "jules nash",
    medium: "poster set",
    note: "Four sheets, type on the left, almost no color.",
    articleId: "poster-system",
  },
  {
    id: "show-loop",
    title: "title loop",
    maker: "rio ames",
    medium: "motion",
    note: "Twelve seconds. The hold finally sits on the snare.",
    articleId: "twelve-second-loop",
  },
  {
    id: "show-usher",
    title: "the usher",
    maker: "len voss",
    medium: "prose",
    note: "First page, after the opening got cut in half.",
    articleId: "usher",
  },
];

export const collabCalls: CollabCall[] = [
  {
    id: "call-sound",
    title: "sound for a locked short",
    need: "sound design",
    detail: "No dialogue. Footsteps, a door, and room tone that feels lived in. Picture is already cut.",
    postedBy: "rio ames",
    when: "needed by Friday",
  },
  {
    id: "call-type",
    title: "a second pair of eyes on a poster grid",
    need: "type and layout",
    detail: "Four posters share one grid. I need someone to tell me which one is only explaining the system.",
    postedBy: "jules nash",
    when: "open",
  },
  {
    id: "call-read",
    title: "reader for a short in progress",
    need: "writing",
    detail: "One finished page and a second that does not exist yet. Looking for notes on voice, not plot.",
    postedBy: "len voss",
    when: "this week",
  },
];

export const events: FloorEvent[] = [
  {
    id: "evt-critique",
    title: "open critique",
    when: "Thursday · 7:00 pm",
    where: "the back room",
    detail: "Bring one image or one page. Everyone else gets two minutes. No speeches about your process unless someone asks.",
  },
  {
    id: "evt-listening",
    title: "listening hour",
    when: "Saturday · 4:00 pm",
    where: "music & sound",
    detail: "Nia plays the stairwell tapes and two other beds. Talk after, not during.",
  },
  {
    id: "evt-collab",
    title: "collab matching",
    when: "Sunday · 2:00 pm",
    where: "the lobby",
    detail: "Five-minute pitches. If you need a partner, say the role out loud and stop. The list goes up the same day.",
  },
];

export function articlesForBoard(boardId: string): Article[] {
  return articles.filter((article) => article.boardId === boardId);
}

export function findArticle(id: string): Article | undefined {
  return articles.find((article) => article.id === id);
}

export function findBoardContext(boardId: string) {
  for (const category of categories) {
    const board = category.boards.find((item) => item.id === boardId);
    if (board) return { category, board };
  }
  return null;
}

export function postCount(article: Article): number {
  return 1 + article.replies.length;
}
