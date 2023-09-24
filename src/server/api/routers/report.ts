import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const reportRouter = createTRPCRouter({
  getAllReports: publicProcedure.query(({ ctx }) => {
    return ctx.db.report.findMany();
  }),

  getReportById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input, ctx }) => {
      return ctx.db.report.findUnique({
        where: { id: input.id },
      });
    }),

  createReport: protectedProcedure
    .input(
      z.object({
        itemId: z.number(),
        content: z.string(),
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.db.report.create({
        data: input,
      });
    }),

  updateReport: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        content: z.string(),
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.db.report.update({
        where: { id: input.id },
        data: input,
      });
    }),

  deleteReport: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input, ctx }) => {
      return ctx.db.report.delete({
        where: { id: input.id },
      });
    }),
});
