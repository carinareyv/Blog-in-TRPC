import React, { useState } from "react";
import Modal from "../Modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import useDebounce from "../../hooks/useDebounce";
import { trpc } from "../../utils/trpc";
import { z } from "zod";
import { BiLoaderAlt } from "react-icons/bi";
import toast from "react-hot-toast";

export const unsplashSearchSchema = z.object({
  searchQuery: z.string().min(2),
});

type UnsplashGalleryProps = {
  isUnsplashModalOpen: boolean;
  setIsUnsplashModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  postId: string;
  slug: string;
};

const UnsplashGallery = ({
  isUnsplashModalOpen,
  setIsUnsplashModalOpen,
  postId,
  slug,
}: UnsplashGalleryProps) => {
  const { register, watch, reset } = useForm<{ searchQuery: string }>({
    resolver: zodResolver(unsplashSearchSchema),
  });
  const watchSearchQuery = watch("searchQuery");

  const debouncedSearchQuery = useDebounce(watchSearchQuery, 3000);

  const fetchUnsplashImages = trpc.unsplash.getImages.useQuery(
    {
      searchQuery: debouncedSearchQuery,
    },
    {
      enabled: Boolean(debouncedSearchQuery),
    }
  );

  const [selectedImage, setSelectedImage] = useState("");

  const utils = trpc.useContext();

  const updatePostFeaturedImage = trpc.post.updatePostFeaturedImage.useMutation(
    {
      onSuccess: () => {
        setIsUnsplashModalOpen(false);
        reset();
        toast.success("Featured image updated!");
        utils.post.getPost.invalidate({ slug });
      },
    }
  );

  return (
    <Modal
      isOpen={isUnsplashModalOpen}
      onClose={() => setIsUnsplashModalOpen(false)}
    >
      <div className="flex w-full flex-col items-center justify-center space-y-4">
        <input
          type="text"
          id="search"
          placeholder="What are we looking for?"
          {...register("searchQuery")}
          className="h-full w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-gray-600"
        />
        {debouncedSearchQuery && fetchUnsplashImages.isLoading && (
          <div className="flex h-56 w-full items-center justify-center">
            <BiLoaderAlt className="animate-spin" />
          </div>
        )}
        <div className="relative grid h-96 w-full grid-cols-3 place-items-center gap-4 overflow-y-scroll">
          {fetchUnsplashImages.isSuccess &&
            fetchUnsplashImages.data?.results.map((imageData) => (
              <div
                key={imageData.id}
                className="group relative aspect-video h-full w-full cursor-pointer rounded-md"
                onClick={() => setSelectedImage(imageData.urls.full)}
              >
                <div
                  className={`absolute inset-0 z-10 h-full w-full rounded-md group-hover:bg-black/40 ${
                    selectedImage === imageData.urls.full && "bg-black/40"
                  }`}
                ></div>
                <Image
                  src={imageData.urls.regular}
                  alt={imageData.alt_description ?? ""}
                  fill
                  sizes="(max-width: 768px) 100vw,
                  (max-width: 1200px) 50vw,
                  33vw"
                  className="rounded-md"
                />
              </div>
            ))}
        </div>
        {selectedImage && (
          <button
            type="submit"
            className="flex items-center space-x-3 rounded border  border-gray-200 px-4 py-2 transition hover:border-gray-900 hover:text-gray-900"
            onClick={() => {
              updatePostFeaturedImage.mutate({
                imageUrl: selectedImage,
                postId,
              });
            }}
            disabled={updatePostFeaturedImage.isLoading}
          >
            {updatePostFeaturedImage.isLoading ? "Loading..." : "Confirm"}
          </button>
        )}
      </div>
    </Modal>
  );
};

export default UnsplashGallery;
