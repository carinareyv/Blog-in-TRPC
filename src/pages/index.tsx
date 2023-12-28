import React, { useContext } from "react";
import { CiSearch } from "react-icons/ci";
import { HiChevronDown } from "react-icons/hi";
import MainLayout from "../layouts/MainLayout";
import WriteFormModal from "../components/WriteFormModal";
import { trpc } from "../utils/trpc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import dayjs from "dayjs";
import Image from "next/image";

const HomePage = () => {
  const getPosts = trpc.post.getPosts.useQuery();

  return (
    <MainLayout>
      <section className="grid h-full w-full grid-cols-12 place-items-center">
        {" "}
        {/*This is the main section*/}
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
                    <div
                      key={i}
                      className="rounded-2xl bg-gray-200/50 px-5 py-2"
                    >
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
              getPosts.data.map((post) => (
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
                       <span className="mx-1">{dayjs(post.createdAt).format("DD/MM/YYYY")}</span> 
                      </p>
                      <p className="text-sm">Developer</p>
                    </div>
                  </div>
                  <div className="grid h-36 w-full grid-cols-12 gap-4">
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
                  </div>
                </div>
              ))}
          </div>
        </main>
        {/*End of main section*/}
        {/*This is our sidebar*/}
        <aside className="top-20 col-span-4 flex h-full w-full flex-col space-y-4 p-6">
          <div className="my-6 text-lg font-semibold">
            <h3>People you may know</h3>
            <div className="flex flex-col space-y-4"></div>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-row items-center space-x-5">
                <div className="h-10 w-10 flex-none rounded-full bg-gray-300"></div>
                <div>
                  <div className="text-sm font-bold text-gray-900">
                    John Doe
                  </div>
                  <div className="text-xs">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Est blanditiis nobis accusantium itaque?
                  </div>
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
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="group flex items-center space-x-6">
                  <div className="aspect-square h-full w-2/5 rounded-xl bg-gray-300"></div>
                  <div className="flex w-3/5 flex-col space-y-2">
                    <div className="decoration-indigo text-lg font-semibold group-hover:underline">
                      Lorem ipsum dolor sit amet consectetur.
                    </div>
                    <div>
                      Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                      Sed, fuga?
                    </div>
                    <div className="flex w-full items-center space-x-4">
                      <div className="h-8 w-8 rounded-full bg-gray-300"></div>
                      <div>Carina Rey&#x2022;</div>
                      <div>Oct 15, 2023</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
        {/*End of sidebar*/}
      </section>
      <WriteFormModal />
    </MainLayout>
  );
};

export default HomePage;
