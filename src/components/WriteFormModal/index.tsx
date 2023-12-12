import React, { useContext } from 'react'
import Modal from '../Modal'
import { GlobalContext } from '../../contexts/GlobalContextProvider'
import { useForm } from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod'
import { z } from 'zod';

type WriteFormType = {
    title: string
    description: string
    body: string
}

const writePostSchema = z.object({
    title: z.string().min(10),
    description: z.string().min(60),
    body: z.string().min(100)
})

const WriteFormModal = () => {

  const {isWriteModalOpen, setIsWriteModalOpen} = useContext(GlobalContext);

  const {register, handleSubmit, formState:{errors}} = useForm<WriteFormType>({
    resolver: zodResolver(writePostSchema)
  });

  const onSubmit = (data: WriteFormType) => console.log(data);


  return (
    <Modal isOpen={isWriteModalOpen} onClose={()=>setIsWriteModalOpen(false)}> 
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col space-y-4 justify-center items-center'>
        
        <input type="text" id="title" className="w-full h-full border border-gray-300 focus:border-grey-600 outline-none p-4 rounded-xl" placeholder="Title of the blog" {...register('title')}/> 
        <p className="text-sm text-red-500 text-left w-full pb-2">
            {errors.title?.message}
        </p>
        <input type="text"  id="shortDescription" className="w-full h-full border border-gray-300 focus:border-grey-600 outline-none p-4 rounded-xl" placeholder="Short Description about the blog" {...register('description')}/>
        <p className="text-sm text-red-500 text-left w-full pb-2">
            {errors.description?.message}
        </p>
        <textarea id="mainBody" cols={10} rows={10} className="w-full h-full border border-gray-300 focus:border-grey-600 outline-none p-4 rounded-xl" placeholder="Blog post main body" {...register('body')}/>
        <p className="text-sm text-red-500 text-left w-full pb-2">
            {errors.body?.message}
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