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
              featuredImage: true,
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
                tags: {
                  select: {
                    name: true,
                    id: true,
                    slug: true,
                  },
                },
            },
          },
        },
      });
    }),

  getUsersSuggestions: protectedProcedure.query(
    async ({ ctx: { prisma, session } }) => {
      //we suggest users based on the tags of the posts saved and bookmarked

      const tagsToSuggest = {
        where: {
          userId: session.user.id,
        },
        select: {
          post: {
            select: {
              tags: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        take: 10,
      };

      const likedPostsTags = await prisma.like.findMany(tagsToSuggest);

      const bookmarkedPostsTags = await prisma.bookmark.findMany(tagsToSuggest);

      const interestedTags: string[] = [];

      likedPostsTags.forEach((like) => {
        interestedTags.push(...like.post.tags.map((tag) => tag.name));
      });
      bookmarkedPostsTags.forEach((bm) => {
        interestedTags.push(...bm.post.tags.map((tag) => tag.name));
      });

      const suggestions = await prisma.user.findMany({
        where: {
          OR: [
            {
              likes: {
                some: {
                  post: {
                    tags: {
                      some: {
                        name: {
                          in: interestedTags,
                        },
                      },
                    },
                  },
                },
              },
            },
            {
              bookmarks: {
                some: {
                  post: {
                    tags: {
                      some: {
                        name: {
                          in: interestedTags,
                        },
                      },
                    },
                  },
                },
              },
            },
          ],
          NOT: {
            id: session.user.id,
          },
        },
        select: {
          image: true,
          name: true,
          username: true,
          id: true,
        },
        take: 5,
      });
      return suggestions;
    }
  ),

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
