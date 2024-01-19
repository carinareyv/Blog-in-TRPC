import React from "react";
import { trpc } from "../../utils/trpc";
import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

const SideSection = () => {
  const readingList = trpc.post.getReadingList.useQuery();

  const suggestions = trpc.user.getUsersSuggestions.useQuery();

  return (
    <aside className="top-20 col-span-4 flex h-full w-full flex-col space-y-4 p-6">
      <div className="my-6 text-lg font-semibold">
        <h3>People you may find interesting</h3>

        <div className="flex flex-col space-y-4"></div>
        {suggestions.isSuccess &&
          suggestions.data.map((user) => (
            <div key={user.id} className="flex flex-row items-center space-x-5">
              <div className="relative h-10 w-10 flex-none rounded-full bg-gray-300">
                {user.image && (
                  <Image
                    src={user.image}
                    fill
                    alt={user.image ?? ""}
                    className="rounded-full"
                  />
                )}
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">
                  {user.name}
                </div>
                <div className="text-xs">{user.username}</div>
              </div>
              <div>
                <button className="border-gray-300/400 flex items-center space-x-3 rounded  border px-4 py-2 transition hover:border-gray-900 hover:text-gray-900">
                  Follow
                </button>
              </div>
            </div>
          ))}
      </div>
      <div>
        <h3 className="my-6 text-lg font-semibold">Your reading list</h3>
        <div className="flex flex-col space-y-8">
          {readingList.data &&
            readingList.data.map((bookmark) => (
              <Link
                href={`/${bookmark.post.slug}`}
                key={bookmark.id}
                className="group flex items-center space-x-6"
              >
                <div className="aspect-square h-full w-2/5 rounded-xl bg-gray-300"></div>
                <div className="flex w-3/5 flex-col space-y-2">
                  <div className="decoration-indigo text-lg font-semibold group-hover:underline">
                    {bookmark.post.title}
                  </div>
                  <div className="truncate">{bookmark.post.description}</div>
                  <div className="flex w-full items-center space-x-4">
                    <div className="h-8 w-8 rounded-full bg-gray-300"></div>
                    <div>{bookmark.post.author.name}</div>
                    <div>
                      {dayjs(bookmark.post.createdAt).format("DD/MM/YYYY")}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </aside>
  );
};

export default SideSection;
