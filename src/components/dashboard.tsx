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
        <button onClick={() => signIn()}>Sign In</button>
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
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
};
