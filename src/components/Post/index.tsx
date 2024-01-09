import React, { useState } from "react";
import dayjs from "dayjs";
import Image from "next/image";
import { trpc } from "../../utils/trpc";
import type { RouterOutputs } from "../../utils/trpc";
import Link from "next/link";
import { CiBookmarkCheck, CiBookmarkPlus } from "react-icons/ci";

type PostProps = RouterOutputs["post"]["getPosts"][number];

const Post = ({ ...post }: PostProps) => {
  const [isBookmarked, setIsbookmarked] = useState(
    Boolean(post.bookmarks?.length > 0)
  );
  const bookmarkPost = trpc.post.bookmarkPost.useMutation({
    onSuccess: () => {
      setIsbookmarked((prev) => !prev);
    },
  });
  const removeBookmark = trpc.post.removeBookmark.useMutation({
    onSuccess: () => {
      setIsbookmarked((prev) => !prev);
    },
  });
  return (
    <div
      key={post.id}
      className="group flex flex-col space-y-4 border-b border-gray-300 pb-8 last:border-none"
    >
      <div className="flex w-full items-center space-x-2">
        <div className="relative h-10 w-10 rounded-full bg-gray-400 ">
          {post.author.image && (
            <Image
              src={post.author.image}
              fill
              alt={post.author.name ?? ""}
              className="rounded-full"
            />
          )}
        </div>
        <div>
          <p className="font-semibold">
            {post.author.name} &#x2022;{" "}
            <span className="mx-1">
              {dayjs(post.createdAt).format("DD/MM/YYYY")}
            </span>
          </p>
          <p className="text-sm">Developer</p>
        </div>
      </div>
      <Link
        href={`/${post.slug}`}
        className="grid h-36 w-full grid-cols-12 gap-4"
      >
        <div className="col-span-8 flex flex-col space-y-2">
          <p className="text-grey-800 text-2xl font-bold group-hover:underline">
            {post.title}
          </p>
          <p className="break-words text-sm text-gray-500">
            {post.description}
          </p>
        </div>

        <div className="col-span-4">
          <div className="h-full w-full transform rounded-xl bg-gray-300 transition duration-300 hover:scale-105 hover:shadow-xl"></div>
        </div>
      </Link>
      <div className="">
        {isBookmarked ? (
          <CiBookmarkCheck
            className="cursor-pointer pt-1 text-3xl"
            onClick={() => {
              removeBookmark.mutate({ postId: post.id });
            }}
          />
        ) : (
          <CiBookmarkPlus
            className="cursor-pointer pt-1 text-3xl"
            onClick={() => {
              bookmarkPost.mutate({
                postId: post.id,
              });
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Post;
