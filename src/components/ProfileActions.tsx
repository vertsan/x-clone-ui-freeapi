"use client";

import { useState } from "react";
import EditProfileModal from "./EditProfileModal";
import type { User } from "@/lib/fakeApi";

const ProfileActions = ({ user }: { user: User }) => {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setEditOpen(true)}
        className="py-1.5 px-5 bg-transparent text-white font-semibold rounded-full border-[1px] border-borderGray transition-all hover:bg-hoverGrayStrong active:scale-95"
      >
        Edit profile
      </button>
      {editOpen && <EditProfileModal user={user} onClose={() => setEditOpen(false)} />}
    </>
  );
};

export default ProfileActions;
