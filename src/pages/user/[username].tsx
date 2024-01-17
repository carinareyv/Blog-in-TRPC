import React, { useState } from "react";
import Image from "next/image";
import MainLayout from "../../layouts/MainLayout";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { SlShareAlt } from "react-icons/sl";
import { BiEdit } from "react-icons/bi";
import toast from "react-hot-toast";
import Post from "../../components/Post";
import { useSession } from "next-auth/react";

import { createClient } from "@supabase/supabase-js";
import { env } from "../../env/client.mjs";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL,
  env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY
);

const UserProfilePage = () => {
  const router = useRouter();

  const currentUser = useSession();

  const userProfile = trpc.user.getUserProfile.useQuery(
    {
      username: router.query.username as string,
    },
    {
      enabled: !!router.query.username,
    }
  );

  const userPosts = trpc.user.getUserPosts.useQuery(
    {
      username: router.query.username as string,
    },
    {
      enabled: !!router.query.username,
    }
  );

  const [objectImage, setObjectImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const userRoute = trpc.useContext().user;

  const uploadAvatar = trpc.user.uploadAvatar.useMutation({
    onSuccess: () => {
      if (userProfile.data?.username) {
        userRoute.getUserProfile.invalidate({
          username: userProfile.data?.username as string,
        });
        toast.success("Your avatar was successfully changed");
      }
    },
  });

  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 1.5 * 1000000) {
        return toast.error("Image should not exceed 1MB");
      }
      setFile(file);
      setObjectImage(URL.createObjectURL(file));

      const fileReader = new FileReader();
      // fileReader.readAsDataURL(file);
      fileReader.onloadend = () => {
        if (fileReader.result) {
          uploadAvatar.mutate({
            imageAsDataUrl: fileReader.result as string,
            mimetype: file.type,
          });
        }
      };
      fileReader.readAsDataURL(file);
    }
  };

  return (
    <MainLayout>
      <div className="flex h-full w-full items-center justify-center">
        <div className="my-10 flex h-full w-full flex-col items-center justify-center lg:max-w-screen-md xl:max-w-screen-lg">
          <div className="flex w-full flex-col rounded-3xl bg-white shadow-md">
            <div className="relative h-44 w-full rounded-t-3xl bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-orange-900 via-amber-100 to-orange-900">
              <div className="absolute -bottom-10 left-12">
                <div className="group relative h-28 w-28 rounded-full border-2 border-white bg-gray-100">
                  {currentUser.data?.user?.id === userProfile.data?.id && (
                    <label
                      htmlFor="avatarFile"
                      className="absolute z-10 flex h-full w-full cursor-pointer items-center justify-center rounded-full transition group-hover:bg-black/40"
                    >
                      <BiEdit className="hidden text-3xl text-white group-hover:block" />
                      <input
                        type="file"
                        name="avatarFile"
                        id="avatarFile"
                        className="sr-only"
                        accept="image/*"
                        onChange={onChangeImage}
                        multiple={false}
                      />
                    </label>
                  )}
                  {!objectImage && userProfile.data?.image && (
                    <img
                      src={userProfile.data?.image}
                      alt={userProfile.data?.name ?? ""}
                      className="rounded-full"
                    />
                  )}
                  {objectImage && (
                    <Image
                      src={objectImage}
                      alt={userProfile.data?.name ?? ""}
                      fill
                      className="rounded-full"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="ml-12 mt-10 flex flex-col space-y-0.5 rounded-b-3xl py-5">
              <div className="text-2xl font-semibold text-gray-800">
                {userProfile.data?.name}
              </div>
              <div className="text-gray-600">@{userProfile.data?.username}</div>
              <div className="text-gray-600">
                {userProfile.data?._count.posts ?? 0} Posts
              </div>
              <div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("URL copied to clipboard!");
                  }}
                  className="mt-2 flex transform items-center space-x-3  rounded border border-gray-200 px-4 py-2 transition hover:border-gray-900 hover:text-gray-900 active:scale-95"
                >
                  <div>Share</div>
                  <div>
                    <SlShareAlt />
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div className="my-10 w-full">
            {userPosts.isSuccess &&
              userPosts.data?.posts?.map((post) => (
                <Post {...post} key={post.id} />
              ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserProfilePage;