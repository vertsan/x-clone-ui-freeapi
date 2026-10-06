// Thin client for the FreeAPI.app public API (https://api.freeapi.app).
// Every response uses the same envelope: { statusCode, data, message, success }.
// All requests are cached by the Next.js Data Cache for 5 minutes.

const BASE_URL =
  process.env.FREEAPI_BASE_URL ?? "https://api.freeapi.app/api/v1";

type Envelope<T> = {
  statusCode: number;
  data: T | null;
  message: string;
  success: boolean;
};

export type Paginated<T> = {
  data: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
};

export async function fetchFreeApi<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      console.error(`FreeAPI ${path} -> HTTP ${res.status}`);
      return null;
    }
    const body = (await res.json()) as Envelope<T>;
    if (!body.success || body.data == null) {
      console.error(`FreeAPI ${path} -> ${body.message}`);
      return null;
    }
    return body.data;
  } catch (error) {
    console.error(`FreeAPI ${path} failed:`, error);
    return null;
  }
}

export async function fetchFreeApiPage<T>(path: string): Promise<T[]> {
  const data = await fetchFreeApi<Paginated<T>>(path);
  return data?.data ?? [];
}

// --- raw endpoint shapes --------------------------------------------------

export type RandomUserRaw = {
  gender?: string;
  name: { title?: string; first: string; last: string };
  location: { city: string; state?: string; country: string };
  email: string;
  login: { uuid: string; username: string };
  dob?: { date: string; age: number };
  registered?: { date: string; age: number };
  picture: { large: string; medium: string; thumbnail: string };
  nat?: string;
};

export type QuoteRaw = {
  id: number;
  content: string;
  author: string;
  authorSlug: string;
  tags: string[];
};

export type JokeRaw = {
  id: number;
  content: string;
  categories: string[];
};

export type MealRaw = {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strMealThumb: string;
  strTags?: string | null;
};

export type DogRaw = {
  id: number;
  name: string;
  bred_for?: string;
  breed_group?: string;
  origin?: string;
  temperament?: string;
  image?: { id: string; url: string; width?: number; height?: number };
};

export type BookRaw = {
  id: number | string;
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: { thumbnail?: string; smallThumbnail?: string };
  };
};

export type ProductRaw = {
  id: number;
  title: string;
  price: number;
  discountPercentage?: number;
  rating: number;
  stock?: number;
  brand?: string;
  category: string;
  thumbnail: string;
  images: string[];
};
