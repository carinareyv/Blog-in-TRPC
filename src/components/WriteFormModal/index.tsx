import React, { useContext, useState } from "react";
import Modal from "../Modal";
import { GlobalContext } from "../../contexts/GlobalContextProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "../../utils/trpc";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Tags from "../Tags";
import TagForm from "../TagForm";
import {FaTimes} from 'react-icons/fa';

export type Tag = { id: string; name: string };

type WriteFormType = {
  title: string;
  description: string;
  text: string;
};

export const writePostSchema = z.object({
  title: z.string().min(10),
  description: z.string().min(60),
  text: z.string().min(100),
});

const WriteFormModal = () => {
  const { isWriteModalOpen, setIsWriteModalOpen } = useContext(GlobalContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WriteFormType>({
    resolver: zodResolver(writePostSchema),
  });

  const postRoute = trpc.useContext().post;

  const createPost = trpc.post.createPost.useMutation({
    onSuccess: () => {
      toast.success("Post created successfully!");
      setIsWriteModalOpen(false);
      reset();
      postRoute.getPosts.invalidate();
    },
  });
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const onSubmit = (data: WriteFormType) => {
    createPost.mutate(
      selectedTags.length > 0 ? { ...data, tagsIds: selectedTags } : data
    );
  };

  const [isCreateTagModalOpen, setIsCreateTagModalOpen] = useState(false);

  const getTags = trpc.tag.getTags.useQuery();

  return (
    <>
      <Modal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
      >
        {getTags.isSuccess && (
          <>
            {" "}
            <TagForm
              isOpen={isCreateTagModalOpen}
              onClose={() => {
                setIsCreateTagModalOpen(false);
              }}
            />
            <div className="my-4 flex w-full items-center space-x-4">
              <div className="z-10 w-4/5">
                <Tags tags={getTags.data} setSelectedTags={setSelectedTags} selectedTags={selectedTags} />
              </div>

              <button
                onClick={() => setIsCreateTagModalOpen(true)}
                className="space-x-3 whitespace-nowrap rounded border border-gray-200  px-4 py-2 text-sm transition hover:border-gray-900 hover:text-gray-900"
              >
                Create Tag
              </button>
            </div>
            <div className="w-full flex items-center my-4 flex-wrap ">
              {selectedTags.map((tag) => (
                <div
                key={tag.id}
                className="flex items-center justify-center space-x-2 rounded-2xl bg-gray-200/50 px-5 py-3 m-2 whitespace-nowrap"
                >
                <div>{tag.name}</div>
                <div className="cursor-pointer" onClick={()=> setSelectedTags((prev)=>(prev.filter((currentTag)=>currentTag.id !== tag.id)))}><FaTimes/></div>
                </div>
                ))}
            </div>
          </>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative flex flex-col items-center justify-center space-y-4"
        >
          {createPost.isLoading && (
            <div className="absolute h-full w-full items-center justify-center">
              <AiOutlineLoading3Quarters className="animate-spin" />
            </div>
          )}
          <input
            type="text"
            id="title"
            className="focus:border-grey-600 h-full w-full rounded-xl border border-gray-300 p-4 outline-none"
            placeholder="Title of the blog"
            {...register("title")}
          />
          <p className="w-full pb-2 text-left text-sm text-red-500">
            {errors.title?.message}
          </p>
          <input
            type="text"
            id="shortDescription"
            className="focus:border-grey-600 h-full w-full rounded-xl border border-gray-300 p-4 outline-none"
            placeholder="Short Description about the blog"
            {...register("description")}
          />
          <p className="w-full pb-2 text-left text-sm text-red-500">
            {errors.description?.message}
          </p>
          <textarea
            id="mainBody"
            cols={10}
            rows={10}
            className="focus:border-grey-600 h-full w-full rounded-xl border border-gray-300 p-4 outline-none"
            placeholder="Blog post main body"
            {...register("text")}
          />
          <p className="w-full pb-2 text-left text-sm text-red-500">
            {errors.text?.message}
          </p>
          <div className="flex w-full justify-end">
            <button
              type="submit"
              className="flex items-center space-x-3 rounded border  border-gray-200 px-4 py-2 transition hover:border-gray-900 hover:text-gray-900"
            >
              Post
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default WriteFormModal;
