import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { memories } from "~/server/db/schema";
import { createSchema } from "~/types";

export const memoryRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createSchema)
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.db.insert(memories).values({
        title: input.title,
        description: input.description,
        streetViewUrl: input.streetViewUrl,
        createdById: ctx.session.user.id,
      });
      return { id: res.insertId };
    }),
});

