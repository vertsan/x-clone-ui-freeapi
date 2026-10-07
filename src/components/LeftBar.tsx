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
    <div className="h-screen sticky top-0 flex flex-col justify-between pt-2 pb-8">
      {/* LOGO MENU BUTTON */}
      <div className="flex flex-col gap-4 text-lg items-center xxl:items-start">
        {/* LOGO */}
        <Link
          href="/"
          className="p-3 rounded-full hover:bg-hoverGrayStrong transition-colors"
        >
          <Image path="general/x_logo.png" alt="logo" w={26} h={26} />
        </Link>
        {/* MENU LIST */}
        <div className="flex flex-col gap-1">
          {menuList.map((item) => {
            const href = item.id === 9 ? profileLink : item.link;
            const active = pathname === href;
            return (
              <Link
                href={href}
                title={item.name}
                className={`group flex items-center gap-4 rounded-full p-3 transition-colors hover:bg-hoverGrayStrong ${
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
          className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center xxl:hidden transition-all hover:brightness-90 active:scale-95"
        >
          <Image path="icons/post.svg" alt="new post" w={24} h={24} />
        </Link>
        <Link
          href="/compose/post"
          className="hidden xxl:block bg-white text-black rounded-full font-bold text-[17px] py-3 px-20 transition-all hover:brightness-90 active:scale-95"
        >
          Post
        </Link>
      </div>
      {/* USER */}
      <Link
        href={profileLink}
        className="flex items-center justify-between rounded-full p-2 transition-colors hover:bg-hoverGrayStrong cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 relative rounded-full overflow-hidden">
            <Image
              path={user?.avatar ?? "general/avatar.png"}
              alt={user?.name ?? "Vert San"}
              w={100}
              h={100}
              tr={true}
            />
          </div>
          <div className="hidden xxl:flex flex-col">
            <span className="font-bold leading-tight">
              {user?.name ?? "Vert San"}
            </span>
            <span className="text-sm text-textGray">
              {user ? `@${user.username}` : "@vertSan"}
            </span>
          </div>
        </div>
        <div className="hidden xxl:block cursor-pointer font-bold text-textGray">
          ...
        </div>
      </Link>
    </div>
  );
};

export default LeftBar;