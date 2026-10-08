"use server";

import { revalidatePath } from "next/cache";
import { imagekit } from "./utils";
import {
  createPost,
  toggleFollow,
  updateCurrentUser,
  type PostMedia,
} from "@/lib/fakeApi";

export const shareAction = async (
  formData: FormData,
  settings: { type: "original" | "wide" | "square"; sensitive: boolean }
) => {
  const text = (formData.get("desc") as string) ?? "";
  const file = formData.get("file") as File | null;

  let media: PostMedia | undefined;

  if (file && file.size > 0 && !imagekit) {
    console.warn(
      "ImageKit is not configured (missing keys in .env) — posting without media."
    );
  }

  if (file && file.size > 0 && imagekit) {
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const transformation = `w-600, ${
        settings.type === "square"
          ? "ar-1-1"
          : settings.type === "wide"
          ? "ar-16-9"
          : ""
      }`;

      const result = await imagekit.upload({
        file: buffer,
        fileName: file.name,
        folder: "/posts",
        ...(file.type.includes("image") && {
          transformation: { pre: transformation },
        }),
        customMetadata: { sensitive: settings.sensitive },
      });

      media = {
        type: file.type.includes("video") ? "video" : "image",
        path: result.filePath,
        width: result.width ?? 600,
        height: result.height ?? 600,
        sensitive: settings.sensitive,
      };
    } catch (error) {
      console.error("Media upload failed:", error);
    }
  }

  await createPost({ text, media });
  revalidatePath("/");
};

export const followAction = async (
  userId: string
): Promise<{ following: boolean; followers: number }> => {
  const result = await toggleFollow(userId);
  revalidatePath("/", "layout");
  return result;
};

export type ProfileActionResult = { ok: true } | { ok: false; error: string };

const uploadProfileImage = async (
  file: File | null
): Promise<string | null> => {
  if (!file || file.size === 0 || !imagekit) return null;
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await imagekit.upload({
      file: buffer,
      fileName: file.name,
      folder: "/profiles",
    });
    return result.filePath;
  } catch (error) {
    console.error("Profile image upload failed:", error);
    return null;
  }
};

const normalizeLink = (value: string): string | null => {
  if (!value) return null;
  const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(candidate);
    return url.hostname.includes(".") ? url.href : null;
  } catch {
    return null;
  }
};

export const updateProfileAction = async (
  formData: FormData
): Promise<ProfileActionResult> => {
  const name = String(formData.get("name") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const linkInput = String(formData.get("link") ?? "").trim();
  const birthday = String(formData.get("birthday") ?? "").trim();

  if (!name) return { ok: false, error: "Name can't be empty." };
  if (name.length > 50) return { ok: false, error: "Name is too long." };
  if (bio.length > 160)
    return { ok: false, error: "Bio must be 160 characters or fewer." };
  if (location.length > 50)
    return { ok: false, error: "Location is too long." };
  if (birthday.length > 40)
    return { ok: false, error: "Birthday is too long." };

  let link: string | undefined;
  if (linkInput) {
    const normalized = normalizeLink(linkInput);
    if (!normalized || normalized.length > 100)
      return { ok: false, error: "That link doesn't look valid." };
    link = normalized;
  }

  const avatar = await uploadProfileImage(
    formData.get("avatar") as File | null
  );
  const cover = await uploadProfileImage(formData.get("cover") as File | null);

  if (!imagekit && ((formData.get("avatar") as File | null)?.size ?? 0) > 0) {
    console.warn(
      "ImageKit is not configured (missing keys in .env) — keeping current avatar."
    );
  }

  await updateCurrentUser({
    name,
    bio,
    location,
    link: link ?? "",
    birthday,
    ...(avatar && { avatar }),
    ...(cover && { cover }),
  });

  revalidatePath("/", "layout");
  return { ok: true };
};