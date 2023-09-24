import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const calendarRouter = createTRPCRouter({
  getAllCalendars: publicProcedure.query(({ ctx }) => {
    return ctx.db.calendar.findMany();
  }),

  getCalendarById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input, ctx }) => {
      return ctx.db.calendar.findUnique({
        where: { id: input.id },
      });
    }),

  createCalendar: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        url: z.string(),
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.db.calendar.create({
        data: input,
      });
    }),

  updateCalendar: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        userId: z.string().optional(),
        url: z.string().optional(),
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.db.calendar.update({
        where: { id: input.id },
        data: input,
      });
    }),

  deleteCalendar: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input, ctx }) => {
      return ctx.db.calendar.delete({
        where: { id: input.id },
      });
    }),
});
