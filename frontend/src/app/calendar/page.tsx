"use client"

import Calendar from "../../components/calendar";
import { Sidebar_for_calendar } from "../../components/Sidebar_for_calendar";
import { Navbar2 } from "../../components/Navbar2";

export default function CalendarPage() {
  return (
    <div>
      <Navbar2/>
      <div className="flex h-screen bg-gradient-to-br from-blue-100 to-indigo-200 overflow-hidden">
        <div className="flex-grow p-6">
          <Calendar />
        </div>
        <div className="w-96 bg-white shadow-lg">
          <Sidebar_for_calendar />
        </div>
      </div>
    </div>
  );
}
