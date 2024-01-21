import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { memories } from "~/server/db/schema";
import { createSchema } from "~/types";

const editSchema = z.object({
  id: z.number(),
  title: z.string().min(1, {
    message: "Title must be at least 1 characters.",
  }),
  description: z.string().min(1, {
    message: "Description must be at least 1 characters.",
  }),
  streetViewUrl: z.string().url({
    message: "Street view url must be a valid url.",
  }),
});

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
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({
        id: memories.id,
        title: memories.title,
        description: memories.description,
        date: memories.createdAt,
      })
      .from(memories)
      .where(eq(memories.createdById, ctx.session.user.id))
      .orderBy(desc(memories.createdAt));
  }),
  publicGetAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({
        id: memories.id,
        title: memories.title,
        description: memories.description,
        date: memories.createdAt,
        streetViewUrl: memories.streetViewUrl,
      })
      .from(memories)
      .orderBy(desc(memories.createdAt));
  }),
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const res = await ctx.db
        .selectDistinct({
          id: memories.id,
          title: memories.title,
          description: memories.description,
          date: memories.createdAt,
          streetViewUrl: memories.streetViewUrl,
        })
        .from(memories)
        .where(eq(memories.id, input.id));
      return res[0];
    }),
  edit: protectedProcedure
    .input(editSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(memories)
        .set({
          title: input.title,
          description: input.description,
          streetViewUrl: input.streetViewUrl,
        })
        .where(
          and(
            eq(memories.id, input.id),
            eq(memories.createdById, ctx.session.user.id),
          ),
        );
      return { id: input.id };
    }),
});
