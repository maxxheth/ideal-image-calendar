import React from "react";
import { api } from "~/utils/api";
import { type Item, type Calendar } from "@prisma/client"; // Import the Item type

type CalendarCardProps = {
  id: number;
};

type CalendarWithItems = Calendar & { items: Item[] };
// Add a property to a type

export const CalendarCard: React.FC<CalendarCardProps> = ({ id }) => {
  // Fetch the calendar by its ID
  const calendarQuery = api.calendar.getCalendarById.useQuery({ id });

  if (calendarQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (calendarQuery.isError) {
    return <div>Error loading calendar</div>;
  }

  const calendar = calendarQuery.data as CalendarWithItems;

  return (
    <div className="mx-auto max-w-md rounded-lg bg-white shadow">
      <div className="p-4">
        <h3 className="text-xl font-medium text-gray-900">Calendar Details</h3>
        <div className="mt-1 text-gray-500">
          <p>
            <strong>URL:</strong> {calendar?.url}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {calendar?.created
              ? new Date(calendar.created).toLocaleDateString()
              : "N/A"}
          </p>
          <p>
            <strong>Updated At:</strong>{" "}
            {calendar?.updated
              ? new Date(calendar?.updated).toLocaleDateString()
              : "N/A"}
          </p>
          <p>
            <strong>User ID:</strong> {calendar?.userId}
          </p>
          {/* If items are available in the calendar data, you can display them here */}
          {calendar?.items && (
            <div>
              <strong>Items:</strong>
              <ul>
                {calendar.items.map(
                  (
                    item: Item,
                    index: number, // Specify the types here
                  ) => (
                    <li key={index}>{item.title}</li>
                  ),
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
