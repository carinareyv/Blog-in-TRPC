import React, { useContext } from "react";
import { CiSearch } from "react-icons/ci";
import { HiChevronDown } from "react-icons/hi";
import MainLayout from "../layouts/MainLayout";
import WriteFormModal from "../components/WriteFormModal";

const HomePage = () => {


  return (
    <MainLayout>
     
      <section className="grid h-full w-full grid-cols-12 place-items-center">
        {" "}
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
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex group flex-col space-y-4 pb-8 border-b border-gray-300 last:border-none">
                <div className="flex w-full items-center space-x-2">
                  <div className= "w-10 h-10 bg-gray-400 rounded-full "></div>
                  <div><p className="font-semibold">Carina Rey &#x2022; 15 Oct 2023</p>
                  <p className="text-sm">Developer</p></div>
                  
                </div>
                <div className="grid h-36 w-full grid-cols-12 gap-4">
                  <div className="col-span-8 flex flex-col space-y-2"><p className="text-2xl font-bold text-grey-800 group-hover:underline">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi, rerum?</p>
                  <p className="text-sm text-gray-500 break-words">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione, dolor fugit! Libero ex saepe repudiandae alias. Quibusdam quis, repellendus expedita rerum debitis vero rem, amet a ducimus ut odio recusandae.
                  Ipsam.</p></div>
                  <div className="col-span-4">
                    <div className="h-full w-full rounded-xl bg-gray-300 transition duration-300 hover:scale-105 transform hover:shadow-xl"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
        <aside className="top-20 col-span-4 h-full w-full p-6 flex flex-col space-y-4">
          <div className="my-6 font-semibold text-lg"><h3>People you may know</h3>
          <div className="flex flex-col space-y-4"></div>
          {Array.from({length:4}).map((_,i)=>(
            <div key={i} className='flex flex-row space-x-5 items-center'>
              <div className="bg-gray-300 w-10 h-10 flex-none rounded-full"></div>
              <div>
                <div className="text-gray-900 font-bold text-sm">John Doe</div>
                <div className="text-xs">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Est blanditiis nobis accusantium itaque?</div>
              </div>
              <div>
                <button className="flex items-center space-x-3 rounded border  border-gray-300/400 px-4 py-2 transition hover:border-gray-900 hover:text-gray-900">Follow</button>
              </div>
            </div>
          ) )}
          </div>
          <div><h3 className="my-6 font-semibold text-lg">Your reading list</h3>
          <div className="flex flex-col space-y-8">
            {Array.from({length:4}).map((_,i) => (
              <div key={i} className="flex space-x-6 items-center group">
                <div className="w-2/5 h-full aspect-square bg-gray-300 rounded-xl"></div>
                <div className="w-3/5 flex flex-col space-y-2">
                  <div className="text-lg font-semibold group-hover:underline decoration-indigo">Lorem ipsum dolor sit amet consectetur.</div>
                  <div>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sed, fuga?</div>
                  <div className="flex space-x-4 items-center w-full"> 
                 <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                 <div>Carina Rey&#x2022;</div>
                 <div>Oct 15, 2023</div>
                 </div>
                 </div>
              </div>
            ))}
            </div></div>
        </aside>
      </section>
<WriteFormModal/>
     
    </MainLayout>
  );
};

export default HomePage;
