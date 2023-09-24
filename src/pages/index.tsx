import React from "react";
import { api } from "~/utils/api";
import { Dashboard } from "~/components/dashboard"; // Import the Dashboard

export default function Home() {
  return <Dashboard id={1} />;
}
