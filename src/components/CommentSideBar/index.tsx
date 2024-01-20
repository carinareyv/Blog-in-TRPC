import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { HiXMark } from "react-icons/hi2";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "../../utils/trpc";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

type CommentSideBarProps = {
  showCommentSideBar: boolean;
  setShowCommentSideBar: React.Dispatch<React.SetStateAction<boolean>>;
  postId: string;
};

type CommentFormType = {
  text: string;
};

export const commentFormSchema = z.object({
  text: z.string().min(3),
  postId: z.string(),
});

const CommentSideBar = ({
  showCommentSideBar,
  setShowCommentSideBar,
  postId,
}: CommentSideBarProps) => {
  const {
    register,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm<CommentFormType>({
    resolver: zodResolver(z.object({ text: z.string().min(3) })),
  });

  const postRoute = trpc.useContext().post;

  const commentPost = trpc.post.commentPost.useMutation({
    onSuccess: () => {
      toast.success("Comment received!");
      postRoute.getComments.invalidate({
        postId,
      });
      reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const getComments = trpc.post.getComments.useQuery({
    postId,
  });

  return (
    <Transition.Root show={showCommentSideBar} as={Fragment}>
      <Dialog as="div" onClose={() => setShowCommentSideBar(false)}>
        <div className="fixed right-0 top-0">
          <Transition.Child
            enter="transition duration-1000"
            leave="transition duration-500"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="relative h-screen w-[200px] max-w-md bg-white shadow-md sm:w-[400px]">
              <div className="flex h-full w-full flex-col overflow-scroll px-6 ">
                <div className="mb-5 mt-10 flex items-center justify-between text-xl">
                  <h2 className="font-medium">Responses({})</h2>
                  <div>
                    <HiXMark
                      className="cursor-pointer"
                      onClick={() => setShowCommentSideBar(false)}
                    />
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit((data) => {
                    commentPost.mutate({
                      ...data,
                      postId,
                    });
                  })}
                  className="my-6 flex flex-col items-end space-y-5"
                >
                  {" "}
                  <textarea
                    id="comment"
                    rows={3}
                    className="focus:border-grey-600 m-3 w-full rounded-xl border border-gray-300 p-4 shadow-lg outline-none"
                    placeholder="What are your thoughts?"
                    {...register("text")}
                  />
                  {isValid && (
                    <button
                      type="submit"
                      className="flex items-center space-x-3 rounded border  border-gray-300 px-4 py-2 transition hover:border-gray-900 hover:text-gray-900"
                    >
                      Comment
                    </button>
                  )}
                </form>

                <div className="flex flex-col items-center justify-center space-y-6">
                  {getComments.isSuccess &&
                    getComments.data.map((comment) => (
                      <div
                        className="flex w-full flex-col space-y-2 border-b border-gray-300 pb-3 last:border-none"
                        key={comment.id}
                      >
                        <div className="flex w-full items-center space-x-2 text-xs">
                          <div className="relative h-8 w-8 rounded-full bg-gray-400 "></div>
                          <div>
                            <p className="font-semibold">
                              {comment.user.name}{" "}
                            </p>
                            <p className="">
                              {dayjs(comment.createdAt).fromNow()}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm  text-gray-600">
                          {comment.text}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CommentSideBar;
