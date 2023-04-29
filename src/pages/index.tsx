import { type NextPage } from "next";
import { SignInButton, useUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { toast } from "react-hot-toast";

dayjs.extend(relativeTime);

import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import Image from "next/image";
import { PostLoadingSkeleton } from "~/components/PostLoadingSkeleton";
import { UserLoadingSkeleton } from "~/components/UserLoadingSkeleton";
import { useRef, useState } from "react";
import Link from "next/link";
import { PageLayout } from "~/components/layout";

const CreatePostWizard = () => {
  const [input, setInput] = useState<string>("");
  const { user } = useUser();
  const formRef = useRef<HTMLFormElement>(null);

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: () => {
      toast.custom(
        () => (
          <div className="rounded-lg border border-slate-400 bg-red-600 p-4 font-bold text-white shadow-lg">
            Can&apos;t create post please try again later.
          </div>
        ),
        {
          duration: 3000,
          position: "bottom-center",
        }
      );
    },
  });

  const onEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.shiftKey == false) {
      if (formRef?.current) {
        formRef?.current?.dispatchEvent(
          new Event("submit", { cancelable: true, bubbles: true })
        );
      }
    }
  };

  if (!user) return null;
  return (
    <form
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        mutate({ content: input });
      }}
      className="flex w-full gap-3"
    >
      <Image
        width={56}
        height={56}
        className="h-14 w-14 rounded-full"
        src={user.profileImageUrl}
        alt={`${user.username || ""} profile image`}
      />
      <textarea
        onKeyDown={onEnterPress}
        minLength={1}
        maxLength={255}
        disabled={isPosting}
        placeholder="What's on your mind?"
        className="h-min grow resize-none self-end rounded-md border border-slate-200 bg-transparent px-2 py-1 outline-slate-700 focus:h-32 focus:border-transparent focus:ring-2 focus:ring-slate-500"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      {isPosting ? (
        <div role="status" className="flex w-20 items-end justify-center py-3">
          <svg
            aria-hidden="true"
            className="mr-2 h-8 w-8 animate-spin fill-slate-600 text-slate-200 dark:text-slate-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <button
          disabled={isPosting}
          className="w-20 self-end rounded-md bg-slate-600 px-2 py-3 text-slate-100 hover:bg-slate-700 hover:text-slate-300"
        >
          Post
        </button>
      )}
    </form>
  );
};

type postWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: postWithUser) => {
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

const Home: NextPage = () => {
  const user = useUser();

  const { data, isLoading: postLoading } = api.posts.getAll.useQuery();

  return (
    <PageLayout>
      <div className="flex border-b border-slate-500 p-4">
        <div className="flex justify-center"></div>
        {!user.isSignedIn && (
          <SignInButton mode="modal">
            <button className="w-20 self-end rounded-md bg-slate-600 px-2 py-3 text-slate-100 hover:bg-slate-700 hover:text-slate-300">
              Sign In
            </button>
          </SignInButton>
        )}
        {!user.isLoaded && <UserLoadingSkeleton />}
        {user.isSignedIn && <CreatePostWizard />}
      </div>
      <div className="flex flex-col">
        {postLoading && <PostLoadingSkeleton />}
        {data?.map((fullPostData) => (
          <PostView {...fullPostData} key={fullPostData.post.id} />
        ))}
      </div>
    </PageLayout>
  );
};

export default Home;
