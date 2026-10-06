import Feed from "@/components/Feed";
import Share from "@/components/Share";
import HomeTabs from "@/components/HomeTabs";

const Homepage = () => {
  return (
    <div className="">
      <HomeTabs />
      <Share />
      <Feed />
    </div>
  );
};

export default Homepage;