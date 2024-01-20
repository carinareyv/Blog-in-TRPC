import React from "react";

import { CiSearch } from "react-icons/ci";
import { HiChevronDown } from "react-icons/hi";
import { trpc } from "../../utils/trpc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Post from "../Post";

const MainSection = () => {
  const getPosts = trpc.post.getPosts.useQuery();
  console.log(
    "POSTS",
    getPosts?.data?.map((post) => {
      post.createdAt;
    })
  );

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
              placeholder="Search..."
            />
          </label>
          <div className="flex w-full items-center justify-end space-x-4">
            <div className="flex items-center space-x-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-gray-200/50 px-5 py-2">
                  tag {i}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-between border-b border-gray-300 pb-8">
          <div>Articles</div>
          <div>
            <button className="flex items-center space-x-2 rounded-3xl border border-gray-800 px-4 py-1.5 font-semibold">
              <div>Following</div>
              <div>
                <HiChevronDown className="text-xl" />
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col justify-center space-y-8 px-24">
        {getPosts.isLoading && (
          <div className="flex h-full w-full items-center justify-center space-x-4">
            <div>
              <AiOutlineLoading3Quarters className="animate-spin" />
            </div>
            <div>Loading...</div>
          </div>
        )}

        {getPosts.isSuccess &&
          getPosts.data.map((post) => <Post {...post} key={post.id} />)}
      </div>
    </main>
  );
};

export default MainSection;
