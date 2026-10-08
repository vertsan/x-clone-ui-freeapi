import Image from "./Image";
import PostInfo from "./PostInfo";
import PostInteractions from "./PostInteractions";
import Video from "./Video";
import VerifiedBadge from "./VerifiedBadge";
import Link from "next/link";
import { formatDateTime, getPost, timeAgo, type PostData } from "@/lib/fakeApi";

const Post = async ({
  type,
  post: initialPost,
  postId,
}: {
  type?: "status" | "comment";
  post?: PostData;
  postId?: string;
}) => {
  const post = initialPost ?? (postId ? await getPost(postId) : null);

  if (!post) {
    return (
      <div className="p-6 text-center text-textGray border-y-[1px] border-borderGray">
        This post is unavailable.
      </div>
    );
  }

  const { user } = post;

  return (
    <article className="group/post p-4 border-y-[1px] border-borderGray transition-colors hover:bg-[#080808] animate-fadeIn">
      {/* POST TYPE */}
      {post.repostedBy && (
        <div className="flex items-center gap-2 text-sm text-textGray mb-2 font-semibold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
          >
            <path
              fill="#71767b"
              d="M4.75 3.79l4.603 4.3-1.706 1.82L6 8.38v7.37c0 .97.784 1.75 1.75 1.75H13V20H7.75c-2.347 0-4.25-1.9-4.25-4.25V8.38L1.853 9.91.147 8.09l4.603-4.3zm11.5 2.71H11V4h5.25c2.347 0 4.25 1.9 4.25 4.25v7.37l1.647-1.53 1.706 1.82-4.603 4.3-4.603-4.3 1.706-1.82L18 15.62V8.25c0-.97-.784-1.75-1.75-1.75z"
            />
          </svg>
          <span>{post.repostedBy} reposted</span>
        </div>
      )}
      {/* POST CONTENT */}
      <div className={`flex gap-3 ${type === "status" && "flex-col"}`}>
        {/* AVATAR */}
        <div
          className={`${
            type === "status" && "hidden"
          } relative w-10 h-10 shrink-0 rounded-full overflow-hidden transition-opacity group-hover/post:opacity-90`}
        >
          <Image path={user.avatar} alt={user.name} w={100} h={100} tr={true} />
        </div>
        {/* CONTENT */}
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          {/* TOP */}
          <div className="w-full flex justify-between items-start">
            <Link href={`/${user.username}`} className="flex gap-3 min-w-0">
              <div
                className={`${
                  type !== "status" && "hidden"
                } relative w-10 h-10 shrink-0 rounded-full overflow-hidden`}
              >
                <Image
                  path={user.avatar}
                  alt={user.name}
                  w={100}
                  h={100}
                  tr={true}
                />
              </div>
              <div
                className={`flex items-center gap-x-1 flex-wrap ${
                  type === "status" && "flex-col gap-0 !items-start"
                }`}
              >
                <div className="flex items-center gap-1">
                  <h1 className="text-[15px] font-bold hover:underline">
                    {user.name}
                  </h1>
                  {user.verified && <VerifiedBadge className="shrink-0" />}
                </div>
                <span
                  className={`text-textGray ${
                    type === "status" ? "text-sm" : "text-[15px]"
                  }`}
                >
                  @{user.username}
                </span>
                {type !== "status" && (
                  <span className="text-textGray text-[15px]">
                    · {timeAgo(post.createdAt)}
                  </span>
                )}
              </div>
            </Link>
            <PostInfo />
          </div>
          {/* TEXT & MEDIA */}
          <Link href={`/${user.username}/status/${post.id}`}>
            <p
              className={`${
                type === "status"
                  ? "text-lg leading-relaxed"
                  : "text-[15px] leading-normal"
              } break-words`}
            >
              {post.text}
            </p>
          </Link>
          {post.media && (
            <div className="mt-2 overflow-hidden rounded-2xl border border-borderGray transition-opacity hover:opacity-95">
              {post.media.type === "image" ? (
                <Image
                  path={post.media.path}
                  alt=""
                  w={post.media.width}
                  h={post.media.height}
                  className={post.media.sensitive ? "blur-lg" : ""}
                />
              ) : (
                <Video
                  path={post.media.path}
                  className={post.media.sensitive ? "blur-lg" : ""}
                />
              )}
            </div>
          )}
          {type === "status" && (
            <span className="text-textGray text-[15px] mt-1">
              {formatDateTime(post.createdAt)}
            </span>
          )}
          <PostInteractions
            comments={post.comments}
            reposts={post.reposts}
            likes={post.likes}
          />
        </div>
      </div>
    </article>
  );
};

export default Post;