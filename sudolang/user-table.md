$userListComponent = ```

import React from 'react';
import { useTable } from '@tanstack/table';

type User = {
  id: string;
  email: string;
  name: string;
};

const userData: User[] = [
  { id: '1', email: 'user1@email.com', name: 'User 1' },
  // ... (More users)
];

export const ListUser: React.FC = () => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: userData });

  return (
    <table {...getTableProps()} className="min-w-full">
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

```

$userRouter = ```
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
    .input(z.object({
      name: z.string().optional(),
      email: z.string().optional(),
      emailVerified: z.string().optional(),
      image: z.string().optional(),
    }))
    .mutation(({ input, ctx }) => {
      return ctx.db.user.create({
        data: input,
      });
    }),

  updateUser: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
      email: z.string().optional(),
      emailVerified: z.string().optional(),
      image: z.string().optional(),
    }))
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

```

$apiUtility = ```

import { api } from "~/utils/api";

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

```

Refactor $userListComponent to get user data using the `getAllUsers` method via the `userRouter` router and also to delete users via a delete column. Please also add the ability to filter out users by name or email, to sort users alphabetically, and add pagination to display up to 10, 25, or 50 users at a time.
