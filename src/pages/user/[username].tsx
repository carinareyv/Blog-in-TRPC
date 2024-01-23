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
import Modal from "../../components/Modal";
import { buttonClass } from "../../shared/tools";
import { messages } from "../messages";

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
        toast.success(messages.avatarSuccess);
      }
    },
  });

  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 1.5 * 1000000) {
        return toast.error(messages.avatarError);
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

  const [isFollowModalOpen, setIsFollowModalOpen] = useState({
    isOpen: false,
    modalType: "followers",
  });

  const followers = trpc.user.getAllFollowers.useQuery(
    {
      userId: userProfile?.data?.id as string,
    },
    { enabled: Boolean(userProfile?.data?.id) }
  );
  const following = trpc.user.getAllFollowing.useQuery(
    {
      userId: userProfile?.data?.id as string,
    },
    { enabled: Boolean(userProfile?.data?.id) }
  );

  const followUser = trpc.user.followUser.useMutation({
    onSuccess: () => {
      //update UI
      userRoute.getAllFollowers.invalidate();
      userRoute.getAllFollowing.invalidate();
      userRoute.getUserProfile.invalidate();
      toast.success(messages.followingSuccess);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const unfollowUser = trpc.user.unfollowUser.useMutation({
    onSuccess: () => {
      //update UI
      userRoute.getAllFollowers.invalidate();
      userRoute.getAllFollowing.invalidate();
      userRoute.getUserProfile.invalidate();
      toast.success(messages.unfollowingSuccess);
    },
  });

  return (
    <MainLayout>
      {followers.isSuccess && following.isSuccess && (
        <Modal
          isOpen={isFollowModalOpen.isOpen}
          onClose={() =>
            setIsFollowModalOpen((prev) => ({ ...prev, isOpen: false }))
          }
        >
          <div className="flex w-full flex-col items-center justify-center space-y-4">
            {isFollowModalOpen.modalType === "followers" && (
              <div className="flex w-full flex-col justify-center">
                <h3 className="my-2 p-2 text-xl">{messages.followers}</h3>

                {followers.data?.followedBy?.map((user) => (
                  <div
                    key={user.id}
                    className="my-1 flex w-full items-center justify-between rounded-xl bg-gray-200 px-4 py-2"
                  >
                    <div> {user.name} </div>
                    {currentUser.data?.user?.id !== user.id && (
                      <div>
                        <button
                          onClick={() =>
                            user.followedBy.length > 0
                              ? unfollowUser.mutate({
                                  userIdToUnfollow: user.id,
                                })
                              : followUser.mutate({
                                  userIdToFollow: user.id,
                                })
                          }
                          className={`${buttonClass} bg-white `}
                        >
                          {user.followedBy.length > 0
                            ? messages.unfollow
                            : messages.follow}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {isFollowModalOpen.modalType === "following" && (
              <div className="flex w-full flex-col justify-center">
                <h3 className="my-2 p-2 text-xl">{messages.following}</h3>
                {following.data?.followings?.map((user) => (
                  <div
                    key={user.id}
                    className="flex w-full items-center justify-between rounded-xl bg-gray-200 px-4 py-2"
                  >
                    <div>{user.name}</div>

                    {currentUser.data?.user?.id !== user.id && (
                      <div>
                        {" "}
                        <button
                          onClick={() =>
                            unfollowUser.mutate({
                              userIdToUnfollow: user.id,
                            })
                          }
                          className={`${buttonClass} bg-white `}
                        >
                          {messages.unfollow}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}
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
                {userProfile.data?._count.posts ?? 0} {messages.posts}
              </div>
              <div className=" flex items-center space-x-4">
                <button
                  onClick={() =>
                    setIsFollowModalOpen({
                      isOpen: true,
                      modalType: "followers",
                    })
                  }
                  className="text-gray-700 hover:text-gray-900"
                >
                  <span className="text-gray-900">
                    {userProfile.data?._count.followedBy}
                  </span>{" "}
                  {messages.followers}
                </button>
                <button
                  onClick={() =>
                    setIsFollowModalOpen({
                      isOpen: true,
                      modalType: "following",
                    })
                  }
                  className="text-gray-700 hover:text-gray-900"
                >
                  <span className="text-gray-900">
                    {userProfile.data?._count.followings}
                  </span>{" "}
                  {messages.following}
                </button>
              </div>
              <div className="flex w-full items-center space-x-4">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success(messages.copied);
                  }}
                  className={`${buttonClass} mt-2 active:scale-95`}
                >
                  <div>{messages.shared}</div>
                  <div>
                    <SlShareAlt />
                  </div>
                </button>
                {userProfile.isSuccess &&
                  userProfile.data?.followedBy &&
                  currentUser.data?.user?.id !== userProfile.data.id && (
                    <button
                      onClick={() => {
                        if (userProfile.data?.id) {
                          userProfile.data.followedBy.length > 0
                            ? unfollowUser.mutate({
                                userIdToUnfollow: userProfile.data?.id,
                              })
                            : followUser.mutate({
                                userIdToFollow: userProfile.data?.id,
                              });
                        }
                      }}
                      className={`${buttonClass} mt-2 bg-white`}
                    >
                      {userProfile.data?.followedBy.length > 0
                        ? messages.unfollow
                        : messages.follow}
                    </button>
                  )}
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
