import React from "react";
import Image from "next/image";
import MainLayout from "../../layouts/MainLayout";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import {BiEdit} from "react-icons/bi"

const UserProfilePage = () => {
  const router = useRouter();

  const userProfile = trpc.user.getUserProfile.useQuery(
    {
      username: router.query.username as string,
    },
    {
      enabled: !!router.query.username,
    }
  );

  return (
    <MainLayout>
      <div className="flex h-full w-full items-center justify-center">
        <div className="my-10 flex h-full w-full flex-col items-center justify-center lg:max-w-screen-md xl:max-w-screen-lg">
          <div className="relative h-44 w-full rounded-xl bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-orange-900 via-amber-100 to-orange-900">
            <div className="absolute -bottom-10 left-12">
            <div className="group relative h-28 w-28 rounded-full bg-gray-100 border-2 border-white cursor-pointer">
              <label htmlFor="avatarFile" className="cursor-pointer absolute flex items-center justify-center z-10 w-full h-full group-hover:bg-black/40 rounded-full transition">
                <BiEdit className="text-3xl text-white hidden group-hover:block"/>
                <input type="file" name="avatarFile" id="avatarFile" className="sr-only" accept="image/*"/>
              </label>
              {userProfile.data?.image && <Image src={userProfile.data?.image} alt={userProfile.data?.name ?? ''} fill className="rounded-full" />}
            </div>
            </div>
          </div>
          <div>This is for posts</div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserProfilePage;
