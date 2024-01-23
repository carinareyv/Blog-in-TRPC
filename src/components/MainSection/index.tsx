import React from "react";

import { CiSearch } from "react-icons/ci";
import { trpc } from "../../utils/trpc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Post from "../Post";
import InfiniteScroll from "react-infinite-scroll-component";
import { BiLoaderCircle } from "react-icons/bi";
import { basicClass } from "../../shared/tools";
import { messages } from "./messages";

const MainSection = () => {
  const getPosts = trpc.post.getPosts.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const getTags = trpc.tag.getTags.useQuery();

  return (
    <main className="col-span-8 h-full w-full border-r border-gray-300 ">
      <div className="flex w-full flex-col space-y-4 px-24 py-10 ">
        <div className="flex w-full items-center space-x-4">
          <label
            htmlFor="search"
            className="relative w-full rounded-lg border border-gray-800"
          >
            <div className="absolute left-3 flex h-full items-center">
              <CiSearch />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="w-full rounded-lg px-4 py-1 pl-7 text-sm outline-none placeholder:text-xs placeholder:text-gray-300"
              placeholder={messages.search}
            />
          </label>
          <div className="flex w-full items-center justify-end space-x-4">
            <div className="flex items-center space-x-2">
              {getTags.isSuccess &&
                getTags.data.map((tag) => (
                  <div
                    key={tag.id}
                    className="rounded-2xl bg-gray-200/50 px-5 py-2"
                  >
                    {tag.name}
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-between border-b border-gray-300 pb-8"></div>
      </div>
      <div className="flex w-full flex-col justify-center space-y-8 px-24">
        {getPosts.isLoading && (
          <div className={`${basicClass} w-full space-x-4`}>
            <div>
              <AiOutlineLoading3Quarters className="animate-spin" />
            </div>
            <div>{messages.loading}</div>
          </div>
        )}

        <InfiniteScroll
          dataLength={
            getPosts.data?.pages.flatMap((page) => page.posts).length ?? 0
          } //This is important field to render the next data
          next={getPosts.fetchNextPage}
          hasMore={Boolean(getPosts.hasNextPage)}
          loader={
            <div className={`${basicClass} w-full`}>
              <BiLoaderCircle className="animate-spin" />
            </div>
          }
          endMessage={
            <p className="pt-3 text-center">
              <b>{messages.seen}</b>
            </p>
          }
        >
          {getPosts.isSuccess &&
            getPosts.data.pages
              .flatMap((page) => page.posts)
              .map((post) => <Post {...post} key={post.id} />)}
        </InfiniteScroll>
      </div>
    </main>
  );
};

export default MainSection;
