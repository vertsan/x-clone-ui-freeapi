"use client";

import { useEffect, useState, useTransition } from "react";
import { followAction } from "@/actions";

const FollowButton = ({
  userId,
  initialFollowing = false,
  initialFollowers,
  onChange,
}: {
  userId: string;
  initialFollowing?: boolean;
  initialFollowers: number;
  onChange?: (data: { following: boolean; followers: number }) => void;
}) => {
  const [following, setFollowing] = useState(initialFollowing);
  const [followers, setFollowers] = useState(initialFollowers);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setFollowing(initialFollowing);
    setFollowers(initialFollowers);
  }, [initialFollowing, initialFollowers]);

  const toggle = () => {
    const next = !following;
    setFollowing(next);
    setFollowers((prev) => prev + (next ? 1 : -1));
    onChange?.({ following: next, followers: followers + (next ? 1 : -1) });
    startTransition(async () => {
      const result = await followAction(userId);
      setFollowing(result.following);
      setFollowers(result.followers);
      onChange?.(result);
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      className={`py-1.5 px-5 font-semibold rounded-full transition-all hover:brightness-90 active:scale-95 disabled:opacity-60 ${
        following
          ? "bg-transparent text-white border-[1px] border-borderGray hover:bg-red-500/10 hover:text-red-400 hover:border-red-400"
          : "bg-white text-black"
      }`}
    >
      {following ? "Following" : "Follow"}
    </button>
  );
};

export default FollowButton;
