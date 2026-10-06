import Post from "./Post";
import { getPosts } from "@/lib/fakeApi";

const Feed = async ({ username }: { username?: string }) => {
  const posts = await getPosts({ username });

  if (!posts.length) {
    return (
      <div className="p-8 text-center text-textGray">
        No posts to show yet.
      </div>
    );
  }

  return (
    <div className="">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Feed;