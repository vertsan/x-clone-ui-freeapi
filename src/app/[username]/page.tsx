import Feed from "@/components/Feed";
import FollowButton from "@/components/FollowButton";
import Image from "@/components/Image";
import Link from "next/link";
import { getCurrentUser, getUser, isFollowingUser } from "@/lib/fakeApi";

const UserPage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;
  const user = await getUser(username);
  const currentUser = await getCurrentUser();
  const isOwnProfile = currentUser.username === username;

  if (!user) {
    return (
      <div className="p-8 text-center text-textGray animate-fadeIn">
        @{username} doesn&apos;t exist.
      </div>
    );
  }

  return (
    <div className="pb-6">
      {/* PROFILE TITLE */}
      <div className="flex items-center gap-8 sticky top-0 backdrop-blur-md px-5 py-3 z-10 bg-[#00000084] animate-fadeIn border-b border-borderGray">

        <Link href="/">
          <Image path="icons/back.svg" alt="back" w={24} h={24} />
        </Link>
        <h1 className="font-bold text-lg">{user.name}</h1>
      </div>
      {/* INFO */}
      <div className="">
        {/* COVER & AVATAR CONTAINER */}
        <div className="relative w-full animate-fadeIn">
          {/* COVER */}
          <div className="w-full aspect-[3/1] relative">
            <Image path={user.cover} alt="" w={600} h={200} tr={true} />
          </div>
          {/* AVATAR */}
          <div className="w-1/5 min-w-[56px] sm:min-w-[80px] md:min-w-[96px] lg:min-w-[120px] aspect-square rounded-full overflow-hidden border-4 border-black bg-gray-300 absolute left-4 -translate-y-1/2 z-10 animate-scaleIn">
            <Image path={user.avatar} alt="" w={100} h={100} tr={true} />
          </div>
        </div>
        {/* ACTION BUTTONS ROW — shares vertical space with the hanging avatar */}
        <div className="flex items-start justify-end gap-2 px-4 pt-3 animate-slideUp [animation-delay:80ms]">
          {isOwnProfile ? (
            <button className="py-1.5 px-5 font-semibold rounded-full border border-gray-500 text-white hover:bg-hoverGrayStrong transition-colors">
              Edit profile
            </button>
          ) : (
            <>
              <div className="w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-gray-500 cursor-pointer">
                <Image path="icons/more.svg" alt="more" w={20} h={20} />
              </div>
              <div className="w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-gray-500 cursor-pointer">
                <Image path="icons/explore.svg" alt="search" w={20} h={20} />
              </div>
              <div className="w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-gray-500 cursor-pointer">
                <Image path="icons/message.svg" alt="message" w={20} h={20} />
              </div>
              <FollowButton
                userId={user.id}
                initialFollowing={await isFollowingUser(user.id)}
                initialFollowers={user.followers}
              />
            </>
          )}
        </div>
        {/* Spacer to clear the avatar's overflow — avatar is w-1/5 and hangs 50%, so ~10% of container width minus buttons row height */}
        <div className="h-6 sm:h-8 md:h-10" />
        {/* USER DETAILS */}
        <div className="px-4 pb-4 flex flex-col gap-3 animate-slideUp [animation-delay:140ms]">
          {/* USERNAME & HANDLE */}
          <div className="">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <span className="text-textGray text-sm">@{user.username}</span>
          </div>
          <p className="whitespace-pre-wrap break-words leading-normal">{user.bio}</p>
          {/* JOB & LOCATION & DATE */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-textGray text-[15px]">
            <div className="flex items-center gap-2">
              <Image
                path="icons/userLocation.svg"
                alt="location"
                w={20}
                h={20}
              />
              <span>{user.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Image path="icons/date.svg" alt="date" w={20} h={20} />
              <span>Joined {user.joinedAt}</span>
            </div>
          </div>
          {/* FOLLOWINGS & FOLLOWERS */}
          <div className="flex gap-5 text-[15px]">
            <div className="flex items-center gap-1">
              <span className="font-bold text-textGrayLight">{user.following}</span>
              <span className="text-textGray text-[15px]">Following</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-textGrayLight">{user.followers}</span>
              <span className="text-textGray text-[15px]">Followers</span>
            </div>
          </div>
        </div>
      </div>
      {/* FEED */}
      <Feed username={user.username} />
    </div>
  );
};

export default UserPage;