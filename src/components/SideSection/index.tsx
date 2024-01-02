import React from "react";

const SideSection = () => {
  return (
    <aside className="top-20 col-span-4 flex h-full w-full flex-col space-y-4 p-6">
      <div className="my-6 text-lg font-semibold">
        <h3>People you may know</h3>
        <div className="flex flex-col space-y-4"></div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-row items-center space-x-5">
            <div className="h-10 w-10 flex-none rounded-full bg-gray-300"></div>
            <div>
              <div className="text-sm font-bold text-gray-900">John Doe</div>
              <div className="text-xs">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Est
                blanditiis nobis accusantium itaque?
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
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sed,
                  fuga?
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
  );
};

export default SideSection;
