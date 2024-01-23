import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React from "react";
import Modal from "../Modal";
import { z } from "zod";
import { trpc } from "../../utils/trpc";
import toast from "react-hot-toast";
import { messages } from "./messages";

export const createTagSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
});

type TagFormProps = {
  isOpen: boolean;
  onClose: () => void;
};
const TagForm = ({ isOpen, onClose }: TagFormProps) => {
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<{
    name: string;
    description: string;
  }>({
    resolver: zodResolver(createTagSchema),
  });

  const createTag = trpc.tag.createTag.useMutation({
    onSuccess: () => {
      toast.success(messages.tag);
      reset();
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form
        onSubmit={handleSubmit((data) => createTag.mutate(data))}
        className="relative flex flex-col items-center justify-center space-y-4"
      >
        <input
          type="text"
          id="name"
          className="focus:border-grey-600 h-full w-full rounded-xl border border-gray-300 p-4 outline-none"
          placeholder={messages.name}
          {...register("name")}
        />
        <p className="w-full pb-2 text-left text-sm text-red-500">
          {errors.name?.message}
        </p>
        <input
          type="text"
          id="description"
          className="focus:border-grey-600 h-full w-full rounded-xl border border-gray-300 p-4 outline-none"
          placeholder={messages.description}
          {...register("description")}
        />
        <p className="w-full pb-2 text-left text-sm text-red-500">
          {errors.description?.message}
        </p>
        <div className="flex w-full justify-end">
          <button
            type="submit"
            className="w-fit space-x-3 whitespace-nowrap rounded border border-gray-200 px-4  py-2 text-right text-sm transition hover:border-gray-900 hover:text-gray-900"
          >
            {messages.create}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TagForm;
