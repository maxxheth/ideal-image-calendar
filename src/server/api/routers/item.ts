import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { Prisma } from "@prisma/client";

export const itemRouter = createTRPCRouter({
  getAllItems: publicProcedure.query(({ ctx }) => {
    return ctx.db.item.findMany();
  }),

  getItemById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input, ctx }) => {
      return ctx.db.item.findUnique({
        where: { id: input.id },
      });
    }),

  getItemsByRawSQL: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.$executeRaw`SELECT * FROM Item`; // Replace with your actual SQL query
    return result;
  }),

  //  executeRawSQL: publicProcedure
  //    .input(z.object({ sqlQuery: z.string(), parameters: z.array(z.any()).optional() }))
  //    .query(async ({ input, ctx }) => {
  //      const { sqlQuery } = input;
  //      try {
  //        return await ctx.db.$executeRaw`${sqlQuery}`;
  //      } catch (error) {
  //        return `Error executing raw SQL: ${error.message}`;
  //      }
  //    }),

  //  executeRawSQL: publicProcedure
  //  .input(z.object({ sqlQuery: z.string(), parameters: z.array(z.any()).optional() }))
  //  .query(async ({ input, ctx }) => {
  //    const { sqlQuery, parameters } = input;
  //    const formattedQuery = Prisma.sql`${sqlQuery}`;
  //    return await ctx.db.$executeRawUnsafe(formattedQuery, ...parameters);
  //  }),

  executeRawSQL: publicProcedure
    .input(
      z.object({
        sqlQuery: z.string(),
        parameters: z.array(z.any()).optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { sqlQuery, parameters } = input;
      try {
        return await ctx.db.$executeRawUnsafe(sqlQuery, ...parameters);
      } catch (error) {
        return `Error executing raw SQL: ${error.message}`;
      }
    }),

  createItem: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        status: z.enum(["PLANNED", "BRIEFED", "IN_PROGRESS", "COMPLETE"]),
        color: z.string(),
        channelType: z.enum(["EMAIL", "TEXT", "OTHER"]),
        channelId: z.string(),
        leadForecast: z.number(),
        leadActual: z.number(),
        date: z.string(),
        calendarId: z.number(),
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.db.item.create({
        data: input,
      });
    }),

  updateItem: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string(),
        status: z.enum(["PLANNED", "BRIEFED", "IN_PROGRESS", "COMPLETE"]),
        color: z.string(),
        channelType: z.enum(["EMAIL", "TEXT", "OTHER"]),
        leadForecast: z.number(),
        leadActual: z.number(),
        calendarId: z.number(),
        date: z.string(),
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.db.item.update({
        where: { id: input.id },
        data: input,
      });
    }),

  deleteItem: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input, ctx }) => {
      return ctx.db.item.delete({
        where: { id: input.id },
      });
    }),
});
