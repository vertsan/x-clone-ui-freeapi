import Post from "./Post";
import { getPosts } from "@/lib/fakeApi";

const Feed = async ({ username }: { username?: string }) => {
  const posts = await getPosts({ username });

  if (!posts.length) {
    return (
      <div className="p-8 text-center text-textGray animate-fadeIn">
        No posts to show yet.
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