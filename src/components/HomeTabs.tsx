"use client";

import { useState } from "react";

const tabs = ["For you", "Following", "React.js", "Javascript", "CSS"];

const HomeTabs = () => {
  const [active, setActive] = useState("For you");

  return (
    <div className="flex border-b border-borderGray">
      {tabs.map((tab, i) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`relative flex flex-1 items-center justify-center border-b-4 px-3 py-4 text-[15px] transition-colors hover:bg-hoverGrayStrong ${
            i > 1 ? "hidden md:flex" : ""
          } ${
            active === tab
              ? "border-iconBlue font-bold text-textGrayLight"
              : "border-transparent font-medium text-textGray hover:text-textGrayLight"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default HomeTabs;