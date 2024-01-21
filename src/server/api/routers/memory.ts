import { desc, eq } from "drizzle-orm";
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
  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.select({ id: memories.id, title: memories.title, description: memories.description, date: memories.createdAt })
        .from(memories).where(eq(memories.createdById, ctx.session.user.id)).orderBy(desc(memories.createdAt));
    }),
});

