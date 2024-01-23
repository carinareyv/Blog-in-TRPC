import React from "react";
import { trpc } from "../../utils/trpc";
import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { buttonClass } from "../../shared/tools";
import { messages } from "./messages";

const SideSection = () => {
  const readingList = trpc.post.getReadingList.useQuery();

  const suggestions = trpc.user.getUsersSuggestions.useQuery();

  const followUser = trpc.user.followUser.useMutation({
    onSuccess: () => {
      toast.success(messages.following);
    },
  });

  return (
    <aside className="top-20 col-span-4 flex h-full w-full flex-col space-y-4 p-6">
      <div className="my-6 text-lg font-semibold">
        <h3>{messages.profiles}</h3>

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
                <button
                  onClick={() =>
                    followUser.mutate({
                      userIdToFollow: user.id,
                    })
                  }
                  className={buttonClass}
                >
                  {messages.follow}
                </button>
              </div>
            </div>
          ))}
      </div>
      <div>
        <h3 className="my-6 text-lg font-semibold">{messages.list}</h3>
        <div className="flex flex-col space-y-8">
          {readingList.data &&
            readingList.data.map((bookmark) => (
              <Link
                href={`/${bookmark.post.slug}`}
                key={bookmark.id}
                className="group flex items-center space-x-6"
              >
                <div className="flex w-full flex-col space-y-2">
                  <div className="text-lg font-normal group-hover:underline">
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
