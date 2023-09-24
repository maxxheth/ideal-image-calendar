import React, { useMemo, useState } from "react";
import {
  useTable,
  usePagination,
  useSortBy,
  useFilters,
} from "@tanstack/table";
import { api } from "~/utils/api";

export const ListReports: React.FC = () => {
  const [pageSize, setPageSize] = useState(10);
  const allReports = api.reportRouter.getAllReports.useQuery();
  const deleteReportMutation = api.reportRouter.deleteReport.useMutation();

  const data = useMemo(() => allReports.data || [], [allReports.data]);

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Item ID",
        accessor: "itemId",
        Filter: TextFilter,
      },
      {
        Header: "Content",
        accessor: "content",
        Filter: TextFilter,
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <button
            onClick={() => deleteReportMutation.mutate({ id: row.original.id })}
          >
            Delete
          </button>
        ),
      },
    ],
    [deleteReportMutation],
  );

  // ... (rest of the code is the same as ListUsers)
};

// TextFilter for filtering
function TextFilter({ column: { filterValue, setFilter } }) {
  return (
    <input
      value={filterValue || ""}
      onChange={(e) => setFilter(e.target.value)}
      placeholder={`Search...`}
    />
  );
}
