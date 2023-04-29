import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { GetStaticProps, InferGetStaticPropsType, type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { api } from "~/utils/api";

dayjs.extend(relativeTime);

type pageProps = InferGetStaticPropsType<typeof getStaticProps>;

const ProfilePage: NextPage<pageProps> = ({ username }) => {
  const { data, error } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data) {
    return <div>Something went wrong</div>;
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
        {/* <ProfileFeed userId={data.id} /> */}
      </PageLayout>
    </>
  );
};

import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import SuperJSON from "superjson";
import { PageLayout } from "~/components/layout";

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: SuperJSON,
  });

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
