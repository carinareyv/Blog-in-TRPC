import { router, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { decode } from "base64-arraybuffer";
import { createClient } from "@supabase/supabase-js";
import { env } from "../../../env/server.mjs";
import { isDataURI } from "validator";
import { TRPCError } from "@trpc/server";

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL,
  env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY
);
export const userRouter = router({
  getUserProfile: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx: { prisma }, input: { username } }) => {
      return await prisma.user.findUnique({
        where: {
          username: username,
        },
        select: {
          name: true,
          image: true,
          id: true,
          username: true,
          _count: {
            select: {
              posts: true,
            },
          },
        },
      });
    }),

  getUserPosts: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx: { prisma, session }, input: { username } }) => {
      return await prisma.user.findUnique({
        where: {
          username,
        },
        select: {
          posts: {
            select: {
              id: true,
              slug: true,
              title: true,
              description: true,
              createdAt: true,
              author: {
                select: {
                  name: true,
                  image: true,
                  username: true,
                },
              },
              bookmarks: session?.user?.id
                ? {
                    where: {
                      userId: session?.user?.id,
                    },
                  }
                : false,
            },
          },
        },
      });
    }),

  uploadAvatar: protectedProcedure
    .input(
      z.object({
        imageAsDataUrl: z.string().refine((val) => isDataURI(val)),
        mimetype: z.string(),
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input }) => {
      const imageBase64Str = input.imageAsDataUrl.replace(/^.+,/, "");
      const { data, error } = await supabase.storage
        .from("publicAvatar")
        .upload(`avatars/${session.user.name}.png`, decode(imageBase64Str), {
          contentType: "image/png",
          upsert: true,
        });
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "upload failed to supabase",
        });
      }
      const {
        data: { publicUrl },
      } = supabase.storage.from("publicAvatar").getPublicUrl(data?.path);

      await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          image: publicUrl,
        },
      });
    }),
});

/*{
  path: 'avatars/Carina Rey.png',
  id: 'dd5828fb-fe39-4df2-a564-2f7729f7233b',
  fullPath: 'publicAvatar/avatars/Carina Rey.png'
} null*/
