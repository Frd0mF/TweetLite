import { type PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren<object>) => {
  return (
    <main className="flex min-h-screen justify-center">
      <div className="w-full rounded-sm border-x border-x-slate-500  md:max-w-2xl">
        {props.children}
      </div>
    </main>
  );
};
