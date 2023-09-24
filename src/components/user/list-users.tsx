import React, { useEffect, useRef } from "react";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";
import { api } from "~/utils/api";
import { type UseMutationResult } from "react-query";

interface User {
  id: string;
  email: string;
  name: string;
}

interface DeleteUserVariables {
  id: string;
}

interface DeletedUserResponse {
  id: string;
  name?: string;
  email?: string;
  emailVerified?: string;
  image?: string;
}

export const ListUsers: React.FC = () => {
  const tableRef = useRef(null);
  const allUsers = api.user.getAllUsers.useQuery();
  const deleteUserMutation: UseMutationResult<
    DeletedUserResponse,
    unknown,
    DeleteUserVariables
  > = api.user.deleteUser.useMutation();

  useEffect(() => {
    if (tableRef.current) {
      new Tabulator(tableRef.current, {
        data: allUsers.data ?? [],
        reactiveData: true,
        columns: [
          { title: "ID", field: "id" },
          { title: "Email", field: "email" },
          { title: "Name", field: "name" },
          {
            title: "Actions",
            field: "actions",
            formatter: "html",
            formatterParams: {
              target: "_blank",
            },
            cellClick: function (e, cell) {
              const id = cell.getRow().getData().id;
              deleteUserMutation.mutate({ id });
            },
          },
        ],
      });
    }
  }, [allUsers.data, deleteUserMutation]);

  return <div ref={tableRef}></div>;
};
