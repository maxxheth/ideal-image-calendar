import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Sidebar } from "~/components/sidebar";
import { CalendarComponent } from "~/components/calendar-component";

type DashboardProps = {
  id: number; // The ID of the calendar you want to display
};

export const Dashboard: React.FC<DashboardProps> = ({ id }) => {
  const { data: sessionData } = useSession();

  if (!sessionData) {
    return (
      <div
        id="login"
        className="z-1000 absolute left-1/2 top-1/2 flex h-screen min-h-screen w-screen -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center bg-white"
      >
        <p>Please sign in to access the dashboard.</p>
        <button
          className="transform rounded-lg bg-blue-600 px-6 py-2 font-medium capitalize tracking-wide text-white transition-colors duration-300 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
          onClick={() => {
            signIn();
          }}
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow p-4">
        {/* Display the CalendarComponent */}
        <CalendarComponent id={id} />
      </div>

      {/* Sign Out Button */}
      <button
        className="absolute right-4 top-4 transform rounded-lg bg-blue-600 px-6 py-2 font-medium capitalize tracking-wide text-white transition-colors duration-300 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
        onClick={() => {
          signOut();
        }}
      >
        Sign Out
      </button>
    </div>
  );
};
