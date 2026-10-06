"use client";

import { useState } from "react";
import Image from "./Image";
import NextImage from "next/image";
import { shareAction } from "@/actions";
import ImageEditor from "./ImageEditor";

const MAX_LENGTH = 280;

const Share = () => {
  const [media, setMedia] = useState<File | null>(null);
  const [desc, setDesc] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [settings, setSettings] = useState<{
    type: "original" | "wide" | "square";
    sensitive: boolean;
  }>({
    type: "original",
    sensitive: false,
  });

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMedia(e.target.files[0]);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    await shareAction(formData, settings);
    setDesc("");
    setMedia(null);
  };

  const previewURL = media ? URL.createObjectURL(media) : null;
  const remaining = MAX_LENGTH - desc.length;
  const canPost = (desc.trim().length > 0 || !!media) && remaining >= 0;

  return (
    <form className="flex gap-3 border-b border-borderGray p-4" action={handleSubmit}>
      {/* AVATAR */}
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
        <Image path="general/avatar.png" alt="" w={100} h={100} tr={true} />
      </div>
      {/* OTHERS */}
      <div className="flex flex-1 flex-col gap-3">
        <input
          type="text"
          name="desc"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="What is happening?!"
          maxLength={MAX_LENGTH + 20}
          className="w-full bg-transparent py-2 text-xl outline-none placeholder:text-textGray"
        />
        {focused && (
          <div className="flex items-center gap-2 text-sm font-bold text-iconBlue">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"
              />
            </svg>
            Everyone can reply
          </div>
        )}
        {/* PREVIEW IMAGE */}
        {media?.type.includes("image") && previewURL && (
          <div className="relative overflow-hidden rounded-2xl border border-borderGray">
            <NextImage
              src={previewURL}
              alt=""
              width={600}
              height={600}
              className={`w-full ${
                settings.type === "original"
                  ? "h-auto"
                  : settings.type === "wide"
                    ? "aspect-video object-cover"
                    : "aspect-square object-cover"
              }`}
            />
            <button
              type="button"
              onClick={() => setIsEditorOpen(true)}
              className="absolute left-3 top-3 rounded-full bg-black/75 px-3 py-1 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-black"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setMedia(null)}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/75 text-white backdrop-blur transition-colors hover:bg-black"
              aria-label="Remove media"
            >
              ✕
            </button>
          </div>
        )}
        {/* PREVIEW VIDEO */}
        {media?.type.includes("video") && previewURL && (
          <div className="relative overflow-hidden rounded-2xl border border-borderGray">
            <video src={previewURL} className="w-full" controls />
            <button
              type="button"
              onClick={() => setMedia(null)}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/75 text-white backdrop-blur transition-colors hover:bg-black"
              aria-label="Remove media"
            >
              ✕
            </button>
          </div>
        )}
        {/* ACTIONS */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-borderGray pt-3">
          <div className="flex flex-wrap items-center gap-1 text-iconBlue">
            <label className="cursor-pointer rounded-full p-2 transition-colors hover:bg-iconBlue/10">
              <input
                type="file"
                name="file"
                accept="image/*,video/*"
                onChange={handleMediaChange}
                className="hidden"
              />
              <Image path="icons/image.svg" alt="media" w={20} h={20} />
            </label>
            {["gif.svg", "poll.svg", "emoji.svg", "schedule.svg", "location.svg"].map(
              (icon) => (
                <button
                  type="button"
                  key={icon}
                  className="rounded-full p-2 transition-colors hover:bg-iconBlue/10"
                >
                  <Image path={`icons/${icon}`} alt="" w={20} h={20} />
                </button>
              )
            )}
          </div>
          <div className="flex items-center gap-3">
            {desc.length > 0 && (
              <span
                className={`text-sm ${
                  remaining < 0
                    ? "text-red-500"
                    : remaining <= 20
                      ? "text-iconYellow"
                      : "text-textGray"
                }`}
              >
                {remaining}
              </span>
            )}
            <button
              type="submit"
              disabled={!canPost}
              className="rounded-full bg-iconBlue px-5 py-2 font-bold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-iconBlue/50"
            >
              Post
            </button>
          </div>
        </div>
      </div>
      {isEditorOpen && media && (
        <ImageEditor
          previewURL={previewURL as string}
          settings={settings}
          setSettings={setSettings}
          onClose={() => setIsEditorOpen(false)}
        />
      )}
    </form>
  );
};

export default Share;