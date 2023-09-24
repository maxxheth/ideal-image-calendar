import React, { useEffect, useRef } from "react";
import Tabulator from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";
import { api } from "~/utils/api";

export const ListItems: React.FC = () => {
  const tableRef = useRef(null);
  const allItems = api.itemRouter.getAllItems.useQuery();
  const deleteItemMutation = api.itemRouter.deleteItem.useMutation();

  useEffect(() => {
    if (tableRef.current) {
      new Tabulator(tableRef.current, {
        data: allItems.data ?? [],
        reactiveData: true,
        columns: [
          { title: "ID", field: "id" },
          { title: "Title", field: "title" },
          { title: "Status", field: "status" },
          {
            title: "Actions",
            field: "actions",
            formatter: "html",
            formatterParams: {
              target: "_blank",
            },
            cellClick: function (e, cell) {
              const id = cell.getRow().getData().id;
              deleteItemMutation.mutate({ id });
            },
          },
        ],
      });
    }
  }, [allItems.data, deleteItemMutation]);

  return <div ref={tableRef}></div>;
};
