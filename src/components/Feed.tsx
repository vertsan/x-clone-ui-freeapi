import Post from "./Post";
import { getPosts, type ProfileTab } from "@/lib/fakeApi";

const emptyMessages = (username?: string, tab?: ProfileTab) => {
  switch (tab) {
    case "replies":
      return `@${username} hasn't replied yet.`;
    case "media":
      return `@${username} hasn't posted any media yet.`;
    case "likes":
      return `@${username} hasn't liked anything yet.`;
    default:
      return "No posts to show yet.";
  }
};

const Feed = async ({
  username,
  tab,
}: {
  username?: string;
  tab?: ProfileTab;
}) => {
  const posts = await getPosts({ username, tab });

  if (!posts.length) {
    return (
      <div className="p-8 text-center text-textGray animate-fadeIn">
        {emptyMessages(username, tab)}
      </div>
    );
  }

  return (
    <div className="">
      {posts.map((post, i) => (
        <div
          key={post.id}
          className="animate-fadeIn"
          style={{ animationDelay: `${Math.min(i, 10) * 50}ms` }}
        >
          <Post post={post} />
        </div>
      ))}
    </div>
  );
};

export default Feed;
