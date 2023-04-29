import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { api } from "~/utils/api";

dayjs.extend(relativeTime);

const ProfileFeed = (props: { userId: string }) => {
  const { data, error, isLoading } = api.posts.getPostsByUserId.useQuery({
    userId: props.userId,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4">
        <PostLoadingSkeleton />
        <PostLoadingSkeleton />
        <PostLoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return <div>Something went wrong</div>;
  }

  if (!data || !data.length) {
    return <div className="p-4">The user has not posted anything yet!</div>;
  }

  return (
    <div className="flex flex-col space-y-4">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (!data) {
    return (
      <>
        <PageLayout>
          <div className="pattern-cross relative h-36 pattern-white pattern-bg-slate-900 pattern-opacity-100 pattern-size-8">
            <Image
              src={"/Not_Found.png"}
              alt="Not_Found's profile pic"
              width={128}
              height={128}
              className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-4 border-black bg-black "
            />
          </div>
          <div className="h-[64px]"></div>
          <div className="p-4 text-2xl font-bold">@Not_Found</div>
          <div className="w-full border-b border-slate-400" />
          <ProfileFeed userId={"Not_Found"} />
        </PageLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <PageLayout>
        <div className="pattern-cross relative h-36 pattern-white pattern-bg-slate-900 pattern-opacity-100 pattern-size-8">
          <Image
            src={data.profileImageUrl}
            alt={`${data.username ?? "unknown"}'s profile pic`}
            width={128}
            height={128}
            className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-4 border-black bg-black "
          />
        </div>
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold">{`@${
          data.username ?? "unknown"
        }`}</div>
        <div className="w-full border-b border-slate-400" />
        <ProfileFeed userId={data.id} />
      </PageLayout>
    </>
  );
};

import { PageLayout } from "~/components/layout";
import { PostLoadingSkeleton } from "~/components/PostLoadingSkeleton";
import { PostView } from "~/components/PostView";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const slug = context.params?.slug;
  if (typeof slug !== "string") {
    throw new Error("Invalid slug");
  }
  const username = slug.replace("@", "");
  await ssg.profile.getUserByUsername.prefetch({
    username,
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default ProfilePage;
