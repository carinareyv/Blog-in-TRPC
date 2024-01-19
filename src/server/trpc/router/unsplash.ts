import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { env } from "../../../env/server.mjs";
import { createApi } from "unsplash-js";
import { TRPCError } from "@trpc/server";
import { unsplashSearchSchema } from "../../../components/UnsplashGallery";

const unsplash = createApi({
  accessKey: env.UNSPLASH_API_ACCESS_KEY,
});

export const unsplashRouter = router({
  getImages: protectedProcedure
    .input(unsplashSearchSchema)
    .query(async ({ input: { searchQuery } }) => {
      try {
        const imagesData = await unsplash.search.getPhotos({
          query: searchQuery,
          orientation: "landscape",
        });
        return imagesData.response;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "External API error",
        });
      }
    }),
});
