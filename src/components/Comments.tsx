import Image from "./Image";
import Post from "./Post";
import { getComments } from "@/lib/fakeApi";

const Comments = async ({ postId }: { postId: string }) => {
  const comments = await getComments(postId);

  return (
    <div className="">
      <form className="flex items-center justify-between gap-4 p-4 ">
        <div className="relative w-10 h-10 rounded-full overflow-hidden">
          <Image
            path="general/avatar.png"
            alt="Vert San"
            w={100}
            h={100}
            tr={true}
          />
        </div>
        <input
          type="text"
          className="flex-1 bg-transparent outline-none p-2 text-xl"
          placeholder="Post your reply"
        />
        <button className="py-2 px-4 font-bold bg-white text-black rounded-full">
          Reply
        </button>
      </form>
      {comments.length === 0 ? (
        <div className="p-8 text-center text-textGray">
          No replies yet. Be the first to reply!
        </div>
      ) : (
        comments.map((comment) => (
          <Post key={comment.id} type="comment" post={comment} />
        ))
      )}
    </div>
  );
};

export default Comments;