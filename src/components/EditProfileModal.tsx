"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import NextImage from "next/image";
import { updateProfileAction } from "@/actions";
import type { User } from "@/lib/fakeApi";
import Image from "./Image";

const MAX_BIO = 160;
const MAX_NAME = 50;

const EditProfileModal = ({
  user,
  onClose,
}: {
  user: User;
  onClose: () => void;
}) => {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [location, setLocation] = useState(user.location ?? "");
  const [link, setLink] = useState(user.link ?? "");
  const [birthday, setBirthday] = useState(user.birthday ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const dialogRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const avatarPreview = avatarFile ? URL.createObjectURL(avatarFile) : user.avatar;
  const coverPreview = coverFile ? URL.createObjectURL(coverFile) : user.cover;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      if (avatarFile) formData.set("avatar", avatarFile);
      if (coverFile) formData.set("cover", coverFile);
      const result = await updateProfileAction(formData);
      if (result.ok) {
        onClose();
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-borderGray bg-black shadow-2xl animate-scaleIn"
      >
        <form
          ref={formRef}
          action={handleSubmit}
          className="flex flex-col gap-4"
        >
          <header className="sticky top-0 z-10 flex items-center justify-between bg-black/80 px-5 py-3 backdrop-blur">
            <div className="flex items-center gap-8">
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-hoverGrayStrong"
                aria-label="Close"
              >
                <Image path="icons/back.svg" alt="Close" w={20} h={20} />
              </button>
              <h1 className="text-lg font-bold">Edit profile</h1>
            </div>
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-white px-5 py-2 text-sm font-bold text-black transition-all hover:brightness-90 active:scale-[0.98] disabled:opacity-60"
            >
              {pending ? "Saving..." : "Save"}
            </button>
          </header>
          <div className="flex flex-col gap-6 px-5 pb-5">
            <div className="relative w-full animate-fadeIn">
              <div className="relative w-full aspect-[3/1] overflow-hidden bg-black/60">
                {coverPreview && (
                  <NextImage
                    src={
                      coverFile
                        ? coverPreview
                        : /^https?:\/\//.test(coverPreview)
                        ? coverPreview
                        : `/${coverPreview}`
                    }
                    alt=""
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/30">
                  <label className="cursor-pointer rounded-full bg-black/70 p-2 transition-colors hover:bg-black/80">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        setCoverFile(e.target.files?.[0] ?? null)
                      }
                    />
                    <Image path="icons/image.svg" alt="Change cover" w={20} h={20} />
                  </label>
                  {coverFile && (
                    <button
                      type="button"
                      onClick={() => setCoverFile(null)}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-black/80"
                      aria-label="Remove cover"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
              <div className="absolute left-4 -translate-y-1/2 animate-scaleIn">
                <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-black bg-gray-300 sm:h-28 sm:w-28">
                  {avatarPreview && (
                    <NextImage
                      src={
                        avatarFile
                          ? avatarPreview
                          : /^https?:\/\//.test(avatarPreview)
                          ? avatarPreview
                          : `/${avatarPreview}`
                      }
                      alt=""
                      fill
                      className="object-cover"
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <label className="cursor-pointer rounded-full bg-black/70 p-2 transition-colors hover:bg-black/80">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          setAvatarFile(e.target.files?.[0] ?? null)
                        }
                      />
                      <Image path="icons/image.svg" alt="Change avatar" w={20} h={20} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10 flex flex-col gap-4">
              {error && (
                <p className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400 animate-fadeIn">
                  {error}
                </p>
              )}
              <label className="flex flex-col gap-1 rounded-md border border-borderGray px-3 py-2 focus-within:border-iconBlue focus-within:ring-1 focus-within:ring-iconBlue/40">
                <span className="text-xs text-textGray">Name</span>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={MAX_NAME + 5}
                  required
                  className="bg-transparent text-textGrayLight outline-none placeholder:text-textGray"
                />
                <span className="self-end text-xs text-textGray">
                  {name.length}/{MAX_NAME}
                </span>
              </label>
              <label className="flex flex-col gap-1 rounded-md border border-borderGray px-3 py-2 focus-within:border-iconBlue focus-within:ring-1 focus-within:ring-iconBlue/40">
                <span className="text-xs text-textGray">Bio</span>
                <textarea
                  name="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  maxLength={MAX_BIO + 10}
                  className="resize-none bg-transparent text-textGrayLight outline-none placeholder:text-textGray"
                />
                <span className="self-end text-xs text-textGray">
                  {bio.length}/{MAX_BIO}
                </span>
              </label>
              <label className="flex flex-col gap-1 rounded-md border border-borderGray px-3 py-2 focus-within:border-iconBlue focus-within:ring-1 focus-within:ring-iconBlue/40">
                <span className="text-xs text-textGray">Location</span>
                <input
                  type="text"
                  name="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  maxLength={50}
                  className="bg-transparent text-textGrayLight outline-none placeholder:text-textGray"
                />
              </label>
              <label className="flex flex-col gap-1 rounded-md border border-borderGray px-3 py-2 focus-within:border-iconBlue focus-within:ring-1 focus-within:ring-iconBlue/40">
                <span className="text-xs text-textGray">Website</span>
                <input
                  type="text"
                  name="link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="example.com"
                  maxLength={100}
                  className="bg-transparent text-textGrayLight outline-none placeholder:text-textGray"
                />
              </label>
              <label className="flex flex-col gap-1 rounded-md border border-borderGray px-3 py-2 focus-within:border-iconBlue focus-within:ring-1 focus-within:ring-iconBlue/40">
                <span className="text-xs text-textGray">Birth date</span>
                <input
                  type="text"
                  name="birthday"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  placeholder="Month DD, YYYY"
                  maxLength={40}
                  className="bg-transparent text-textGrayLight outline-none placeholder:text-textGray"
                />
              </label>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
