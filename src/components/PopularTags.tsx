import Link from "next/link";
import Image from "./Image";
import { getTrends } from "@/lib/fakeApi";

const PopularTags = async () => {
  const trends = await getTrends();

  return (
    <div className="p-4 rounded-2xl border-[1px] border-borderGray flex flex-col gap-4 animate-slideInRight [animation-delay:70ms]">
      <h1 className="text-xl font-bold text-textGrayLight">
        {"What's"} Happening
      </h1>
      {/* TREND EVENT */}
      <div className="flex gap-4">
        <div className="relative w-20 h-20 rounded-xl overflow-hidden">
          <Image
            path="general/cover.jpg"
            alt="event"
            w={120}
            h={120}
            tr={true}
          />
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-textGrayLight">
            Nadal v Federer Grand Slam
          </h2>
          <span className="text-sm text-textGray">Last Night</span>
        </div>
      </div>
      {/* TOPICS */}
      {trends.map((trend) => (
        <div key={trend.id} className="">
          <div className="flex items-center justify-between">
            <span className="text-textGray text-sm">{trend.category}</span>
            <Image path="icons/infoMore.svg" alt="info" w={16} h={16} />
          </div>
          <h2 className="text-textGrayLight font-bold">{trend.title}</h2>
          <span className="text-textGray text-sm">{trend.posts}</span>
        </div>
      ))}
      <Link href="/" className="text-iconBlue">
        Show More
      </Link>
    </div>
  );
};

export default PopularTags;