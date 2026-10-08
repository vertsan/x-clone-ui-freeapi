import Feed from "@/components/Feed";
import FollowButton from "@/components/FollowButton";
import Image from "@/components/Image";
import Link from "next/link";
import ProfileTabs from "@/components/ProfileTabs";
import VerifiedBadge from "@/components/VerifiedBadge";
import EditProfileModal from "@/components/EditProfileModal";
import {
  getCurrentUser,
  getPostCount,
  getUser,
  isFollowingUser,
  type ProfileTab,
} from "@/lib/fakeApi";

const validTabs: ProfileTab[] = ["posts", "replies", "media", "likes"];

const UserPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { username } = await params;
  const sp = await searchParams;
  const rawTab = Array.isArray(sp.tab) ? sp.tab[0] : sp.tab;
  const tab: ProfileTab = validTabs.includes(rawTab as ProfileTab)
    ? (rawTab as ProfileTab)
    : "posts";

  const [user, currentUser, postCount] = await Promise.all([
    getUser(username),
    getCurrentUser(),
    getPostCount(username),
  ]);

  if (!user) {
    return (
      <div className="p-8 text-center text-textGray animate-fadeIn">
        @{username} doesn&apos;t exist.
      </div>
    );
  }

  const isOwnProfile = currentUser?.username === user.username;
  const following = isOwnProfile ? false : await isFollowingUser(user.id);

  const showWebsite = user.link;
  const showBirthday = user.birthday;
  const showLocation = user.location;

  return (
    <div className="">
      {/* PROFILE TITLE */}
      <div className="flex items-center gap-8 sticky top-0 backdrop-blur-md px-5 py-3 z-10 bg-[#00000084] animate-fadeIn border-b border-borderGray">
        <Link href="/" className="rounded-full p-1.5 transition-colors hover:bg-hoverGrayStrong">
          <Image path="icons/back.svg" alt="back" w={20} h={20} />
        </Link>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg truncate">{user.name}</h1>
            {user.verified && <VerifiedBadge className="shrink-0" />}
          </div>
          <span className="text-textGray text-xs truncate">
            {postCount} {postCount === 1 ? "post" : "posts"}
          </span>
        </div>
      </div>
      {/* INFO */}
      <div className="">
        {/* COVER & AVATAR CONTAINER */}
        <div className="relative w-full animate-fadeIn">
          {/* COVER */}
          <div className="w-full aspect-[3/1] relative overflow-hidden bg-gray-900">
            <Image path={user.cover} alt="" w={600} h={200} tr={true} />
          </div>
          {/* AVATAR */}
          <div className="w-1/5 min-w-[56px] sm:min-w-[80px] md:min-w-[96px] lg:min-w-[120px] aspect-square rounded-full overflow-hidden border-4 border-black bg-gray-300 absolute left-4 -translate-y-1/2 animate-scaleIn">
            <Image path={user.avatar} alt="" w={120} h={120} tr={true} />
          </div>
        </div>
        <div className="flex w-full items-center justify-end gap-2 px-4 pb-3 mt-1 animate-slideUp [animation-delay:80ms]">
          <div className="w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-borderGray cursor-pointer transition-colors hover:bg-hoverGrayStrong">
            <Image path="icons/more.svg" alt="more" w={20} h={20} />
          </div>
          <div className="w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-borderGray cursor-pointer transition-colors hover:bg-hoverGrayStrong">
            <Image path="icons/explore.svg" alt="more" w={20} h={20} />
          </div>
          <div className="w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-borderGray cursor-pointer transition-colors hover:bg-hoverGrayStrong">
            <Image path="icons/message.svg" alt="more" w={20} h={20} />
          </div>
          {isOwnProfile ? (
            <button
              type="button"
              className="py-1.5 px-5 bg-transparent text-white font-semibold rounded-full border-[1px] border-borderGray transition-all hover:bg-hoverGrayStrong active:scale-95"
            >
              Edit profile
            </button>
          ) : (
            <FollowButton
              userId={user.id}
              initialFollowing={following}
              initialFollowers={user.followers}
            />
          )}
        </div>
        {/* USER DETAILS */}
        <div className="px-4 pb-4 mt-1 flex flex-col gap-3 animate-slideUp [animation-delay:140ms]">
          {/* USERNAME & HANDLE */}
          <div className="">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold leading-tight">{user.name}</h1>
              {user.verified && <VerifiedBadge />}
            </div>
            <span className="text-textGray text-sm">@{user.username}</span>
          </div>
          {user.bio && (
            <p className="whitespace-pre-wrap break-words leading-normal">
              {user.bio}
            </p>
          )}
          {/* JOB & LOCATION & DATE */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-textGray text-[15px]">
            {showLocation && (
              <div className="flex items-center gap-1.5">
                <Image
                  path="icons/userLocation.svg"
                  alt="location"
                  w={20}
                  h={20}
                />
                <span>{user.location}</span>
              </div>
            )}
            {showWebsite && (
              <a
                href={user.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-iconBlue transition-colors hover:underline"
              >
                <Image path="icons/explore.svg" alt="website" w={20} h={20} />
                <span className="truncate max-w-[200px] sm:max-w-[260px]">
                  {user.link?.replace(/^https?:\/\//, "")}
                </span>
              </a>
            )}
            {showBirthday && (
              <div className="flex items-center gap-1.5">
                <Image path="icons/date.svg" alt="birthday" w={20} h={20} />
                <span>Born {user.birthday}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Image path="icons/date.svg" alt="date" w={20} h={20} />
              <span>Joined {user.joinedAt}</span>
            </div>
          </div>
          {/* FOLLOWINGS & FOLLOWERS */}
          <div className="flex gap-5 text-[15px]">
            <Link
              href={`/${user.username}/?tab=following`}
              className="flex items-center gap-1 transition-colors hover:underline"
            >
              <span className="font-bold text-textGrayLight">
                {user.following}
              </span>
              <span className="text-textGray text-[15px]">Following</span>
            </Link>
            <Link
              href={`/${user.username}/?tab=followers`}
              className="flex items-center gap-1 transition-colors hover:underline"
            >
              <span className="font-bold text-textGrayLight">
                {user.followers}
              </span>
              <span className="text-textGray text-[15px]">Followers</span>
            </Link>
          </div>
        </div>
      </div>
      <ProfileTabs username={user.username} active={tab} />
      {/* FEED */}
      <Feed username={user.username} tab={tab} />
      {isOwnProfile && <EditProfileModal user={user} onClose={() => {}} />}
    </div>
  );
};

export default UserPage;
