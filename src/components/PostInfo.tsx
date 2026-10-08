import Image from "./Image";

const PostInfo = () => {
  return (
    <div className="group cursor-pointer rounded-full p-2 -m-1 transition-all hover:bg-iconBlue/10 hover:scale-110">
      <Image path="icons/infoMore.svg" alt="" w={16} h={16} />
    </div>
  );
};

export default PostInfo;