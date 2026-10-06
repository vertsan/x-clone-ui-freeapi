"use server";

import { revalidatePath } from "next/cache";
import { imagekit } from "./utils";
import { createPost, type PostMedia } from "@/lib/fakeApi";

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