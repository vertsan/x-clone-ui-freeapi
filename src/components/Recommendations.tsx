import Link from "next/link";
import Image from "./Image";
import { getRecommendations } from "@/lib/fakeApi";

const Recommendations = async () => {
  const users = await getRecommendations();

  return (
    <div className="p-4 rounded-2xl border-[1px] border-borderGray flex flex-col gap-4 animate-slideInRight [animation-delay:140ms]">
      {users.map((user) => (
        <div key={user.id} className="flex items-center justify-between">
          {/* IMAGE AND USER INFO */}
          <div className="flex items-center gap-2">
            <div className="relative rounded-full overflow-hidden w-10 h-10">
              <Image
                path={user.avatar}
                alt={user.name}
                w={100}
                h={100}
                tr={true}
              />
            </div>
            <div className="">
              <h1 className="text-md font-bold">{user.name}</h1>
              <span className="text-textGray text-sm">@{user.username}</span>
            </div>
          </div>
          {/* BUTTON */}
          <button className="py-1 px-4 font-semibold bg-white text-black rounded-full transition-all hover:brightness-90 active:scale-95">
            Follow
          </button>
        </div>
      ))}
      <Link href="/" className="text-iconBlue">
        Show More
      </Link>
    </div>
  );
};

export default Recommendations;