import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import type { RouterOutputs } from "~/utils/api";
import Image from "next/image";
import Link from "next/link";

type postWithUser = RouterOutputs["posts"]["getAll"][number];

export const PostView = (props: postWithUser) => {
  const { post, author } = props;
  if (!post || !author || !author.username) return null;
  return (
    <Link href={`/post/${post.id}`}>
      <div className="flex items-start gap-3 border-b border-slate-500 p-4 hover:bg-slate-800 hover:transition-colors">
        <Image
          width={56}
          height={56}
          className="h-14 w-14 rounded-full"
          src={author.profileImageUrl}
          alt={`${author.username || ""} profile image`}
        />
        <div className="flex flex-col">
          <div className="flex gap-1 font-semibold text-slate-300">
            <Link href={`/@${author.username}`}>
              <span className="hover:underline">{`@${
                author.username || ""
              }`}</span>
            </Link>
            <span>·</span>
            <span className="font-light">
              {dayjs(post.createdAt).fromNow()}
            </span>
          </div>
          <span className="break-all text-2xl">{post.content}</span>
        </div>
      </div>
    </Link>
  );
};
