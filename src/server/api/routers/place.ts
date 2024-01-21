import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const placesApiUrl = (place: string) =>
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${place}&key=AIzaSyALnd9Vz1KNL9vGgRYnlL_lyB9yQRqyzVI`;

export const placeRouter = createTRPCRouter({
  
  getPlaces: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return fetch(placesApiUrl(input.text))
    }),
})