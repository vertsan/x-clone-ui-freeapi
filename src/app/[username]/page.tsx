import Feed from "@/components/Feed";
import Image from "@/components/Image";
import Link from "next/link";
import { getUser } from "@/lib/fakeApi";

const UserPage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;
  const user = await getUser(username);

  if (!user) {
    return (
      <div className="p-8 text-center text-textGray animate-fadeIn">
        @{username} doesn&apos;t exist.
      </div>
    );
  }

  return (
    <div className="">
      {/* PROFILE TITLE */}
      <div className="flex items-center gap-8 sticky top-0 backdrop-blur-md p-4 z-10 bg-[#00000084] animate-fadeIn">
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
          <div className="w-1/5 aspect-square rounded-full overflow-hidden border-4 border-black bg-gray-300 absolute left-4 -translate-y-1/2 animate-scaleIn">
            <Image path={user.avatar} alt="" w={100} h={100} tr={true} />
          </div>
        </div>
        <div className="flex w-full items-center justify-end gap-2 p-2 animate-slideUp [animation-delay:80ms]">
          <div className="w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-gray-500 cursor-pointer">
            <Image path="icons/more.svg" alt="more" w={20} h={20} />
          </div>
          <div className="w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-gray-500 cursor-pointer">
            <Image path="icons/explore.svg" alt="more" w={20} h={20} />
          </div>
          <div className="w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-gray-500 cursor-pointer">
            <Image path="icons/message.svg" alt="more" w={20} h={20} />
          </div>
          <button className="py-2 px-4 bg-white text-black font-bold rounded-full">
            Follow
          </button>
        </div>
        {/* USER DETAILS */}
        <div className="p-4 flex flex-col gap-2 animate-slideUp [animation-delay:140ms]">
          {/* USERNAME & HANDLE */}
          <div className="">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <span className="text-textGray text-sm">@{user.username}</span>
          </div>
          <p>{user.bio}</p>
          {/* JOB & LOCATION & DATE */}
          <div className="flex gap-4 text-textGray text-[15px]">
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
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold">{user.following}</span>
              <span className="text-textGray text-[15px]">Following</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">{user.followers}</span>
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