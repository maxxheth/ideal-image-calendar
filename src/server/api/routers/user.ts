import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getAllUsers: publicProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany();
  }),

  getUserById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.db.user.findUnique({
        where: { id: input.id },
      });
    }),

  createUser: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        email: z.string().optional(),
        emailVerified: z.string().optional(),
        image: z.string().optional(),
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.db.user.create({
        data: input,
      });
    }),

  updateUser: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        email: z.string().optional(),
        emailVerified: z.string().optional(),
        image: z.string().optional(),
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.db.user.update({
        where: { id: input.id },
        data: input,
      });
    }),

  deleteUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.db.user.delete({
        where: { id: input.id },
      });
    }),
});
