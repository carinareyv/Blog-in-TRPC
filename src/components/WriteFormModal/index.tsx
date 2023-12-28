import React, { useContext } from 'react'
import Modal from '../Modal'
import { GlobalContext } from '../../contexts/GlobalContextProvider'
import { useForm } from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod'
import { z } from 'zod';
import { trpc } from '../../utils/trpc';
import toast from 'react-hot-toast';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

type WriteFormType = {
    title: string
    description: string
    text: string
}

export const writePostSchema = z.object({
    title: z.string().min(10),
    description: z.string().min(60),
    text: z.string().min(100)
})

const WriteFormModal = () => {

  const {isWriteModalOpen, setIsWriteModalOpen} = useContext(GlobalContext);

  const {register, handleSubmit, formState:{errors}, reset} = useForm<WriteFormType>({
    resolver: zodResolver(writePostSchema)
  });

  const postRoute = trpc.useContext().post

  const createPost = trpc.post.createPost.useMutation({
    onSuccess: ()=> {
      toast.success("Post created successfully!")
      setIsWriteModalOpen(false)
      reset();
      postRoute.getPosts.invalidate()
    },
  })

  const onSubmit = (data: WriteFormType) => {
    createPost.mutate(data);

  };


  return (
    <Modal isOpen={isWriteModalOpen} onClose={()=>setIsWriteModalOpen(false)}> 
    <form onSubmit={handleSubmit(onSubmit)} className='flex relative flex-col space-y-4 justify-center items-center'>
    {createPost.isLoading && (<div className="absolute w-full h-full items-center justify-center">
    <AiOutlineLoading3Quarters className="animate-spin"/>
    </div>)}
        <input type="text" id="title" className="w-full h-full border border-gray-300 focus:border-grey-600 outline-none p-4 rounded-xl" placeholder="Title of the blog" {...register('title')}/> 
        <p className="text-sm text-red-500 text-left w-full pb-2">
            {errors.title?.message}
        </p>
        <input type="text"  id="shortDescription" className="w-full h-full border border-gray-300 focus:border-grey-600 outline-none p-4 rounded-xl" placeholder="Short Description about the blog" {...register('description')}/>
        <p className="text-sm text-red-500 text-left w-full pb-2">
            {errors.description?.message}
        </p>
        <textarea id="mainBody" cols={10} rows={10} className="w-full h-full border border-gray-300 focus:border-grey-600 outline-none p-4 rounded-xl" placeholder="Blog post main body" {...register('text')}/>
        <p className="text-sm text-red-500 text-left w-full pb-2">
            {errors.text?.message}
        </p>
        <div className="flex justify-end w-full">
           <button type="submit" className="flex items-center space-x-3 rounded border  border-gray-200 px-4 py-2 transition hover:border-gray-900 hover:text-gray-900">
              Post
            </button>
            </div>
    </form></Modal>
  )
}

export default WriteFormModal