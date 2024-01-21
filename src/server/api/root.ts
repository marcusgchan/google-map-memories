import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { memoryRouter } from "./routers/memory";
import { placeRouter } from "./routers/place";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  memory: memoryRouter,
  place: placeRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
