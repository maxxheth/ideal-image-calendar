$fullCalendar = https://github.com/fullcalendar/fullcalendar-react

$item = ```

import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

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

  createItem: protectedProcedure
    .input(z.object({
      title: z.string(),
      status: z.enum(['PLANNED', 'BRIEFED', 'IN_PROGRESS', 'COMPLETE']),
      color: z.string(),
      channelType: z.enum(['EMAIL', 'TEXT', 'OTHER']),
      leadForecast: z.number(),
      leadActual: z.number(),
      date: z.string(),
    }))
    .mutation(({ input, ctx }) => {
      return ctx.db.item.create({
        data: input,
      });
    }),

  updateItem: protectedProcedure
    .input(z.object({
      id: z.number(),
      title: z.string(),
      status: z.enum(['PLANNED', 'BRIEFED', 'IN_PROGRESS', 'COMPLETE']),
      color: z.string(),
      channelType: z.enum(['EMAIL', 'TEXT', 'OTHER']),
      leadForecast: z.number(),
      leadActual: z.number(),
      date: z.string(),
    }))
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

```

$report = ```

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
    .input(z.object({
      itemId: z.number(),
      content: z.string(),
    }))
    .mutation(({ input, ctx }) => {
      return ctx.db.report.create({
        data: input,
      });
    }),

  updateReport: protectedProcedure
    .input(z.object({
      id: z.number(),
      content: z.string(),
    }))
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

```

Write a calendar component that does the following:

1. Email & Text Items

  - As a user, I should be able to add email and text items to the calendar.

2. Item Status & Color Coding
  As a user, I should see each item color-coded based on its status (Planned, Briefed, In-Progress, Complete).o

  Note: Defer to using the `Status` enum to change each item's status via Zod & tRPC.

enum Status {
  PLANNED
  BRIEFED
  IN_PROGRESS
  COMPLETE
}


