"use client";

import Link from "next/link";
import Image from "./Image";
import { usePathname } from "next/navigation";
import type { User } from "@/lib/fakeApi";

const menuList = [
  { id: 1, name: "Homepage", link: "/", icon: "icons/home.svg" },
  { id: 2, name: "Explore", link: "/explore", icon: "icons/explore.svg" },
  { id: 3, name: "Notification", link: "/notifications", icon: "icons/notification.svg" },
  { id: 4, name: "Messages", link: "/messages", icon: "icons/message.svg" },
  { id: 5, name: "Bookmarks", link: "/bookmarks", icon: "icons/bookmark.svg" },
  { id: 6, name: "Jobs", link: "/jobs", icon: "icons/job.svg" },
  { id: 7, name: "Communities", link: "/communities", icon: "icons/community.svg" },
  { id: 8, name: "Premium", link: "/premium", icon: "general/x_logo.png" },
  { id: 9, name: "Profile", link: "", icon: "icons/profile.svg" },
  { id: 10, name: "More", link: "/more", icon: "icons/more.svg" },
];

const LeftBar = ({ user }: { user?: User | null }) => {
  const pathname = usePathname();
  const profileLink = user ? `/${user.username}` : "/";

  return (
    <div className="sticky top-0 flex h-dvh flex-col pt-2 pb-4 animate-slideInLeft">
      {/* LOGO MENU BUTTON */}
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto no-scrollbar text-lg items-center xxl:items-start">
        {/* LOGO */}
        <Link
          href="/"
          className="p-3 rounded-full hover:bg-hoverGrayStrong transition-all hover:scale-105 animate-slideUp"
        >
          <Image path="general/x_logo.png" alt="logo" w={26} h={26} />
        </Link>
        {/* MENU LIST */}
        <div className="flex flex-col gap-1">
          {menuList.map((item, i) => {
            const href = item.id === 9 ? profileLink : item.link;
            const active = pathname === href;
            return (
              <Link
                href={href}
                title={item.name}
                style={{ animationDelay: `${80 + i * 35}ms` }}
                className={`group flex items-center gap-4 rounded-full p-3 [@media(max-height:800px)]:py-2 transition-colors hover:bg-hoverGrayStrong animate-slideUp ${
                  active ? "font-bold text-textGrayLight" : "text-textGray"
                }`}
                key={item.id}
              >
                <Image
                  path={item.icon}
                  alt={item.name}
                  w={26}
                  h={26}
                  className="transition-transform duration-200 group-hover:scale-105"
                />
                <span className="hidden xxl:inline">{item.name}</span>
              </Link>
            );
          })}
        </div>
        {/* BUTTON */}
        <Link
          href="/compose/post"
          className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center xxl:hidden transition-all hover:brightness-90 active:scale-95 animate-slideUp [animation-delay:440ms]"
        >
          <Image path="icons/post.svg" alt="new post" w={24} h={24} />
        </Link>
        <Link
          href="/compose/post"
          className="hidden xxl:block bg-white text-black rounded-full font-bold text-[17px] py-3 px-20 transition-all hover:brightness-90 active:scale-95 animate-slideUp [animation-delay:440ms]"
        >
          Post
        </Link>
      </div>
      {/* USER */}
      <Link
        href={profileLink}
        className="shrink-0 flex items-center justify-between gap-2 rounded-full p-3 transition-all hover:bg-hoverGrayStrong animate-slideUp [animation-delay:500ms]"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="w-10 h-10 shrink-0 relative rounded-full overflow-hidden">
            <Image
              path={user?.avatar ?? "general/avatar.png"}
              alt={user?.name ?? "Vert San"}
              w={100}
              h={100}
              tr={true}
            />
          </div>
          <div className="hidden xxl:flex flex-col min-w-0">
            <span className="font-bold leading-tight truncate">
              {user?.name ?? "Vert San"}
            </span>
            <span className="text-sm text-textGray truncate">
              {user ? `@${user.username}` : "@vertSan"}
            </span>
          </div>
        </div>
        <Image
          path="icons/infoMore.svg"
          alt="more"
          w={18}
          h={18}
          className="hidden xxl:block shrink-0"
        />
      </Link>
    </div>
  );
};

export default LeftBar;