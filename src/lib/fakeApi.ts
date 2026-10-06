// Data layer for the X clone UI, backed by the live FreeAPI.app API
// (https://api.freeapi.app). Public endpoints (randomusers, quotes, jokes,
// meals, dogs, books, products) are mapped into the UI's User/PostData types
// and assembled into a deterministic feed so ids stay stable between the feed
// list and a post's detail page. Posts created in the composer live in a
// small in-memory store (FreeAPI's social-media write endpoint is broken
// server-side), so they survive until the server restarts.

import {
  fetchFreeApiPage,
  type BookRaw,
  type DogRaw,
  type JokeRaw,
  type MealRaw,
  type ProductRaw,
  type QuoteRaw,
  type RandomUserRaw,
} from "./freeapi";

export type User = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  cover: string;
  bio: string;
  location: string;
  joinedAt: string;
  followers: number;
  following: number;
  verified?: boolean;
};

export type MediaType = "image" | "video";

export type PostMedia = {
  type: MediaType;
  path: string;
  width: number;
  height: number;
  sensitive?: boolean;
};

export type PostData = {
  id: string;
  user: User;
  text: string;
  createdAt: string;
  media?: PostMedia;
  repostedBy?: string;
  comments: number;
  reposts: number;
  likes: number;
};

export type Trend = {
  id: string;
  category: string;
  title: string;
  posts: string;
};

// --- helpers --------------------------------------------------------------

const minutesAgo = (mins: number) =>
  new Date(Date.now() - mins * 60_000).toISOString();

export const timeAgo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.max(1, Math.floor(diff / 60_000));
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (iso: string): string =>
  new Date(iso).toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const hash = (value: string): number => {
  let result = 5381;
  for (let i = 0; i < value.length; i++) {
    result = ((result << 5) + result + value.charCodeAt(i)) | 0;
  }
  return Math.abs(result);
};

const seededInt = (seed: string, min: number, max: number): number =>
  min + (hash(seed) % (max - min + 1));

const pick = <T>(items: T[], index: number): T | null =>
  items.length ? items[index % items.length] : null;

const formatMonthYear = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

// --- users ----------------------------------------------------------------

const mapUser = (raw: RandomUserRaw, index: number): User => {
  const seed = raw.login?.uuid ?? String(index);
  return {
    id: seed,
    name: `${raw.name.first} ${raw.name.last}`,
    username: raw.login.username,
    avatar: raw.picture.large,
    cover: "general/cover.jpg",
    bio: `Hey, I'm ${raw.name.first}! Sharing life and ideas from ${
      raw.location.city
    }, ${raw.location.country}.`,
    location: `${raw.location.city}, ${raw.location.country}`,
    joinedAt: formatMonthYear(raw.registered?.date ?? raw.dob?.date ?? Date.now().toString()),
    followers: seededInt(seed + "followers", 120, 98_000),
    following: seededInt(seed + "following", 12, 1_400),
    verified: hash(seed + "verified") % 4 === 0,
  };
};

// Used when the API is unreachable so composing a post still works.
const fallbackUser: User = {
  id: "local",
  name: "Vert San",
  username: "vertSan",
  avatar: "general/avatar.png",
  cover: "general/cover.jpg",
  bio: "",
  location: "",
  joinedAt: "",
  followers: 0,
  following: 0,
};

// --- feed data (loaded once, cached for the server process) ---------------

type FeedData = {
  users: User[];
  quotes: QuoteRaw[];
  jokes: JokeRaw[];
  meals: MealRaw[];
  dogs: DogRaw[];
  books: BookRaw[];
  products: ProductRaw[];
};

const PAGE = "?page=1&limit=50";

let feedDataPromise: Promise<FeedData> | null = null;

const loadFeedData = (): Promise<FeedData> => {
  feedDataPromise ??= Promise.all([
    fetchFreeApiPage<RandomUserRaw>(`/public/randomusers${PAGE}`),
    fetchFreeApiPage<QuoteRaw>(`/public/quotes${PAGE}`),
    fetchFreeApiPage<JokeRaw>(`/public/randomjokes${PAGE}`),
    fetchFreeApiPage<MealRaw>(`/public/meals${PAGE}`),
    fetchFreeApiPage<DogRaw>(`/public/dogs${PAGE}`),
    fetchFreeApiPage<BookRaw>(`/public/books${PAGE}`),
    fetchFreeApiPage<ProductRaw>(`/public/randomproducts${PAGE}`),
  ]).then(([users, quotes, jokes, meals, dogs, books, products]) => ({
    users: users.map(mapUser),
    quotes,
    jokes,
    meals,
    dogs,
    books,
    products,
  }));
  return feedDataPromise;
};

// --- deterministic feed ---------------------------------------------------
// The feed is a universe of 300 generated posts. Item `i` draws from source
// `i % 6` (quotes, jokes, meals, dogs, books, products) and is authored by
// `users[i % users.length]`, so every user owns a stable slice of posts.
// Post ids encode both parts ("q-3", "m-12", ...) which lets getPost()
// regenerate the exact same post without any storage.

const SOURCES = ["q", "j", "m", "d", "b", "p"] as const;
const FEED_SIZE = 300;
const HOME_FEED_SIZE = 30;

type SourcePrefix = (typeof SOURCES)[number];

const REPLIES = [
  "This is exactly what I needed to hear today.",
  "Strongly agree with this take.",
  "Been saying this for years, glad someone posted it.",
  "Saving this one for later.",
  "Underrated post right here.",
  "How is this not getting more attention?",
  "Shared this with my whole team.",
  "Finally someone gets it.",
  "This changed my perspective on the matter.",
  "Came here to say the same thing.",
  "More of this, please.",
  "Woke up and chose truth today.",
];

const buildPost = (index: number, data: FeedData): PostData | null => {
  const source = SOURCES[index % SOURCES.length];
  const sourceIndex = Math.floor(index / SOURCES.length);
  const user = pick(data.users, index);
  if (!user) return null;

  const id = `${source}-${sourceIndex}`;
  let text: string | null = null;
  let media: PostMedia | undefined;

  switch (source as SourcePrefix) {
    case "q": {
      const quote = pick(data.quotes, sourceIndex);
      if (!quote) return null;
      text = `${quote.content}\n\n— ${quote.author}`;
      break;
    }
    case "j": {
      const joke = pick(data.jokes, sourceIndex);
      if (!joke) return null;
      text = joke.content;
      break;
    }
    case "m": {
      const meal = pick(data.meals, sourceIndex);
      if (!meal) return null;
      text = `Cooked up ${meal.strMeal} — ${meal.strCategory} • ${meal.strArea} today.`;
      media = {
        type: "image",
        path: meal.strMealThumb,
        width: 600,
        height: 600,
      };
      break;
    }
    case "d": {
      const dog = pick(data.dogs, sourceIndex);
      if (!dog) return null;
      text = `Meet ${dog.name} — ${
        dog.bred_for ?? dog.breed_group ?? "professional good pup"
      } • ${dog.origin ?? "from around the world"}.`;
      if (dog.image?.url) {
        media = {
          type: "image",
          path: dog.image.url,
          width: dog.image.width ?? 600,
          height: dog.image.height ?? 600,
        };
      }
      break;
    }
    case "b": {
      const book = pick(data.books, sourceIndex);
      if (!book) return null;
      const authors = book.volumeInfo.authors?.join(", ") ?? "an unknown author";
      text = `Reading "${book.volumeInfo.title}" by ${authors}.`;
      const cover = book.volumeInfo.imageLinks?.thumbnail;
      if (cover) {
        media = {
          type: "image",
          path: cover.replace(/^http:\/\//, "https://"),
          width: 400,
          height: 600,
        };
      }
      break;
    }
    case "p": {
      const product = pick(data.products, sourceIndex);
      if (!product) return null;
      text = `${product.title} — $${product.price} · ${product.rating}★${
        product.brand ? ` (${product.brand})` : ""
      } in ${product.category}.`;
      break;
    }
  }

  if (text == null) return null;

  const repostedBy =
    hash(id + "repost") % 7 === 0 && data.users.length > 4
      ? pick(data.users, index + 3)!.name
      : undefined;

  return {
    id,
    user,
    text,
    createdAt: minutesAgo(seededInt(id + "time", 3, 8_000)),
    media,
    repostedBy,
    comments: seededInt(id + "comments", 0, 480),
    reposts: seededInt(id + "reposts", 0, 1_500),
    likes: seededInt(id + "likes", 5, 9_500),
  };
};

// --- posts created in the composer (in-memory) ----------------------------

let localPostId = 100;
const localPosts: PostData[] = [];

// --- api ------------------------------------------------------------------

export const getUsers = async (): Promise<User[]> => {
  const data = await loadFeedData();
  return data.users.map((user) => ({ ...user }));
};

export const getUser = async (username: string): Promise<User | null> => {
  const data = await loadFeedData();
  const user = data.users.find((item) => item.username === username) ?? null;
  return user ? { ...user } : null;
};

export const getCurrentUser = async (): Promise<User> => {
  const data = await loadFeedData();
  return { ...(data.users[0] ?? fallbackUser) };
};

export const getPosts = async (options?: {
  username?: string;
}): Promise<PostData[]> => {
  const data = await loadFeedData();
  const posts: PostData[] = [];

  if (options?.username) {
    const userIndex = data.users.findIndex(
      (item) => item.username === options.username
    );
    if (userIndex >= 0) {
      for (let i = 0; i < FEED_SIZE; i++) {
        if (i % data.users.length !== userIndex) continue;
        const post = buildPost(i, data);
        if (post) posts.push(post);
      }
    }
  } else {
    for (let i = 0; i < HOME_FEED_SIZE; i++) {
      const post = buildPost(i, data);
      if (post) posts.push(post);
    }
  }

  const local = localPosts.filter(
    (post) => !options?.username || post.user.username === options.username
  );

  return [
    ...local.map((post) => ({ ...post })),
    ...posts.map((post) => ({ ...post })),
  ];
};

export const getPost = async (id: string): Promise<PostData | null> => {
  const local = localPosts.find((item) => item.id === id);
  if (local) return { ...local };

  const parsed = /^([qjmpbd])-(\d+)$/.exec(id);
  if (!parsed) return null;

  const source = parsed[1] as SourcePrefix;
  const sourceIndex = SOURCES.indexOf(source);
  if (sourceIndex < 0) return null;

  const data = await loadFeedData();
  const post = buildPost(Number(parsed[2]) * SOURCES.length + sourceIndex, data);
  return post ? { ...post } : null;
};

export const getComments = async (postId: string): Promise<PostData[]> => {
  const data = await loadFeedData();
  if (!data.users.length) return [];

  const count = seededInt(postId + "count", 0, 3);
  const base = hash(postId);
  const comments: PostData[] = [];

  for (let k = 0; k < count; k++) {
    const user = data.users[(base + k * 7 + 1) % data.users.length];
    const seed = `${postId}-${k}`;
    comments.push({
      id: `c-${postId}-${k}`,
      user,
      text: REPLIES[seededInt(seed + "text", 0, REPLIES.length - 1)],
      createdAt: minutesAgo(seededInt(seed + "time", 5, 3_000)),
      comments: 0,
      reposts: 0,
      likes: seededInt(seed + "likes", 0, 240),
    });
  }

  return comments;
};

export const getTrends = async (): Promise<Trend[]> => trends;

export const getRecommendations = async (): Promise<User[]> => {
  const data = await loadFeedData();
  return data.users.slice(1, 4).map((user) => ({ ...user }));
};

export const createPost = async (input: {
  text: string;
  user?: User;
  media?: PostMedia;
}): Promise<PostData> => {
  const data = await loadFeedData();
  const post: PostData = {
    id: String(++localPostId),
    user: input.user ?? data.users[0] ?? fallbackUser,
    text: input.text || " ",
    createdAt: new Date().toISOString(),
    media: input.media,
    comments: 0,
    reposts: 0,
    likes: 0,
  };
  localPosts.unshift(post);
  return { ...post };
};

// --- static data ----------------------------------------------------------

export const trends: Trend[] = [
  {
    id: "t1",
    category: "Technology • Trending",
    title: "OpenAI",
    posts: "20K posts",
  },
  {
    id: "t2",
    category: "Technology • Trending",
    title: "Next.js",
    posts: "18.4K posts",
  },
  {
    id: "t3",
    category: "Programming • Trending",
    title: "React 19",
    posts: "12.1K posts",
  },
  {
    id: "t4",
    category: "Design • Trending",
    title: "Tailwind CSS",
    posts: "9,842 posts",
  },
];
