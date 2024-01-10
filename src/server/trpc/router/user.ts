import { router, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";

export const userRouter = router({

    getUserProfile: publicProcedure.input(
    
        z.object({
          username: z.string()
        })
      
    ).query(async({ctx: {prisma}, input: {username}}) => {
      return await prisma.user.findUnique({
        where: {
          username: username,
        },
        select: {
          name: true,
          image: true,
          id: true,
          username: true,
        }
      })
    }),






});