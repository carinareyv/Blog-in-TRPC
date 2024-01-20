import slugify from "slugify";
import { writePostSchema } from "../../../components/WriteFormModal";
import { router, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { commentFormSchema } from "../../../components/CommentSideBar";
import { TRPCError } from "@trpc/server";

const limit = 10;

export const postRouter = router({
  //bookmarks
  bookmarkPost: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input: { postId } }) => {
      await prisma.bookmark.create({
        data: {
          userId: session.user.id,
          postId,
        },
      });
    }),

  getReadingList: protectedProcedure.query(
    async ({ ctx: { prisma, session } }) => {
      const allBookmarks = await prisma.bookmark.findMany({
        where: {
          userId: session.user.id,
        },
        take: 4,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          post: {
            select: {
              title: true,
              description: true,
              createdAt: true,
              slug: true,
              featuredImage: true,
              author: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      });
      return allBookmarks;
    }
  ),

  removeBookmark: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input: { postId } }) => {
      await prisma.bookmark.delete({
        where: {
          userId_postId: {
            postId: postId,
            userId: session.user.id,
          },
        },
      });
    }),

  //comments
  commentPost: protectedProcedure
    .input(commentFormSchema)
    .mutation(async ({ ctx: { prisma, session }, input: { text, postId } }) => {
      await prisma.comment.create({
        data: {
          text,
          user: {
            connect: {
              id: session.user.id,
            },
          },
          post: {
            connect: {
              id: postId,
            },
          },
        },
      });
    }),

  getComments: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .query(async ({ ctx: { prisma }, input: { postId } }) => {
      const comments = await prisma.comment.findMany({
        where: {
          postId,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          createdAt: true,
          text: true,
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });
      return comments;
    }),

  //posts
  createPost: protectedProcedure
    .input(
      writePostSchema.and(
        z.object({
          tagsIds: z
            .array(
              z.object({
                id: z.string(),
              })
            )
            .optional(),
        })
      )
    )
    .mutation(
      async ({
        ctx: { prisma, session },
        input: { title, description, text, tagsIds, html },
      }) => {
        await prisma.post.create({
          data: {
            title,
            description,
            text,
            html,
            slug: slugify(title),
            tags: {
              connect: tagsIds,
            },
            author: {
              connect: {
                id: session.user.id,
              },
            },
          },
        });
      }
    ),

  dislikePost: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input: { postId } }) => {
      await prisma.like.delete({
        where: {
          userId_postId: {
            postId: postId,
            userId: session.user.id,
          },
        },
      });
    }),

  getPost: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ ctx: { prisma, session }, input: { slug } }) => {
      const post = await prisma.post.findUnique({
        where: {
          slug,
        },
        select: {
          id: true,
          description: true,
          title: true,
          text: true,
          html: true,
          likes: session?.user?.id
            ? {
                where: {
                  userId: session?.user?.id,
                },
              }
            : false,
          authorId: true,
          slug: true,
          featuredImage: true,
        },
      });
      return post;
    }),

  getPosts: publicProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx: { prisma, session }, input: { cursor } }) => {
      const posts = await prisma.post.findMany({
        orderBy: {
          createdAt: "desc",
        },
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
          tags: {
            select: {
              name: true,
              id: true,
              slug: true,
            },
          },
          featuredImage: true,
        },
        cursor: cursor ? { id: cursor } : undefined,
        take: limit + 1,
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        if (nextItem) nextCursor = nextItem.id;
      }
      return { posts, nextCursor };
    }),

  likePost: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input: { postId } }) => {
      await prisma.like.create({
        data: {
          userId: session.user.id,
          postId,
        },
      });
    }),

  updatePostFeaturedImage: protectedProcedure
    .input(
      z.object({
        imageUrl: z.string().url(),
        postId: z.string(),
      })
    )
    .mutation(
      async ({ ctx: { prisma, session }, input: { imageUrl, postId } }) => {
        const postData = await prisma.post.findUnique({
          where: {
            id: postId,
          },
        });

        if (postData?.authorId !== session.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only the owner of the post can update the image",
          });
        }

        await prisma.post.update({
          where: {
            id: postId,
          },
          data: {
            featuredImage: imageUrl,
          },
        });
      }
    ),
});
