import React from "react";
import { api } from "~/utils/api";
import Sidebar from "./Sidebar";
import CalendarCard from "./CalendarCard"; // Make sure to import the refactored CalendarCard component

const Dashboard: React.FC = () => {
  // Fetch all calendars
  const calendarsQuery = api.calendar.getAllCalendars.useQuery();

  if (calendarsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (calendarsQuery.isError) {
    return <div>Error loading calendars</div>;
  }

  const calendars = calendarsQuery.data;

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {calendars.map((calendar) => (
            <CalendarCard key={calendar.id} id={calendar.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
