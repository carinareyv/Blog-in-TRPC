import React, { useContext } from "react";
import { IoReorderThreeOutline } from "react-icons/io5";
import { BsBell } from "react-icons/bs";
import { SlSettings } from "react-icons/sl";
import { FiEdit } from "react-icons/fi";
import { GlobalContext } from "../../contexts/GlobalContextProvider";
import { signIn, useSession, signOut } from "next-auth/react";
import { HiLogout } from "react-icons/hi";
import Link from "next/link";
import toast from "react-hot-toast";

const Header = () => {
  const { data: sessionData, status } = useSession();
  const { isWriteModalOpen, setIsWriteModalOpen } = useContext(GlobalContext);
  return (
    <header className="flex h-20 w-full flex-row items-center justify-around border-b-[1px] border-gray-300 bg-white">
      <div>
        <IoReorderThreeOutline className="text-2xl text-gray-600" />
      </div>
      <Link href={"/"} className="cursor-pointer select-none text-xl font-thin">
        Another Recipe Community!
      </Link>
      {status === "authenticated" ? (
        <div className="flex items-center space-x-4">
          <div>
            <BsBell className="cursor-pointer text-2xl text-gray-600" />
          </div>
          <div>
            <SlSettings className="cursor-pointer text-2xl text-gray-600" />
          </div>
          <div>
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="flex items-center space-x-3 rounded border  border-gray-200 px-4 py-2 transition hover:border-gray-900 hover:text-gray-900"
            >
              <div>Write</div>
              <div>
                <FiEdit className="text-gray-600" />
              </div>
            </button>
          </div>
          <div>
            <button
              onClick={() => signOut()}
              className="flex items-center space-x-3 rounded border  border-gray-200 px-4 py-2 transition hover:border-gray-900 hover:text-gray-900"
            >
              <div>Log Out</div>
              <div>
                <HiLogout className="text-gray-600" />
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div>
          <button
            onClick={() => signIn()}
            className="flex items-center space-x-3 rounded border  border-gray-200 px-4 py-2 transition hover:border-gray-900 hover:text-gray-900"
          >
            Sign In{" "}
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
