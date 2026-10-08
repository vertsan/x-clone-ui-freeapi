import Link from "next/link";
import { PROFILE_TABS, type ProfileTab } from "@/lib/fakeApi";

const labels: Record<ProfileTab, string> = {
  posts: "Posts",
  replies: "Replies",
  media: "Media",
  likes: "Likes",
};

const ProfileTabs = ({
  username,
  active,
}: {
  username: string;
  active: ProfileTab;
}) => (
  <div className="flex overflow-x-auto no-scrollbar border-b border-borderGray animate-fadeIn [animation-delay:200ms]">
    {PROFILE_TABS.map((tab) => {
      const isActive = tab === active;
      return (
        <Link
          key={tab}
          href={tab === "posts" ? `/${username}` : `/${username}?tab=${tab}`}
          aria-current={isActive ? "page" : undefined}
          className={`relative flex flex-1 shrink-0 items-center justify-center border-b-4 px-3 py-4 text-[15px] transition-colors hover:bg-hoverGrayStrong ${
            isActive
              ? "border-iconBlue font-bold text-textGrayLight"
              : "border-transparent font-medium text-textGray hover:text-textGrayLight"
          }`}
        >
          {labels[tab]}
        </Link>
      );
    })}
  </div>
);

export default ProfileTabs;
