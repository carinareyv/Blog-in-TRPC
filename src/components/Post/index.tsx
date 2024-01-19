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
      className="flex flex-col space-y-4 border-b border-gray-300 pb-8 last:border-none"
    >
      <Link
        href={`/user/${post.author.username}`}
        className="group flex w-full cursor-pointer items-center space-x-2 decoration-indigo-600 "
      >
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
            <span className="group-hover:underline"> {post.author.name}</span>
            &#x2022;{" "}
            <span className="mx-1">
              {dayjs(post.createdAt).format("DD/MM/YYYY")}
            </span>
          </p>
          <p className="text-sm">Developer</p>
        </div>
      </Link>
      <Link
        href={`/${post.slug}`}
        className="group grid h-44 w-full  grid-cols-12 gap-4 overflow-hidden"
      >
        <div className="col-span-8 flex h-full flex-col space-y-4">
          <p className="text-grey-800 text-2xl font-bold group-hover:underline">
            {post.title}
          </p>
          <p className="h-full truncate break-words text-sm  text-gray-500">
            {post.description}
          </p>
        </div>

        <div className="col-span-4">
          <div className="h-full w-full transform rounded-xl bg-gray-300 transition duration-300 hover:scale-105 hover:shadow-xl">
            {post.featuredImage && <Image src={post.featuredImage} alt={post.title} fill className="rounded-xl"/>}
          </div>
        </div>
      </Link>
      <div className="flex w-full items-center justify-between space-x-4">
        <div className="flex flex-row flex-wrap space-x-2">
          {post.tags.map((tag) => (
            <div
              key={tag.id}
              onClick={() => {
                //TODO Carina: Redirect the user to all posts with that tag
              }}
              className="rounded-2xl bg-gray-200/50 px-5 py-3"
            >
              {tag.name}{" "}
            </div>
          ))}
        </div>
        <div>
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
    </div>
  );
};

export default Post;
