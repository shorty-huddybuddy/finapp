"use client"

import Calendar from "../../components/calendar";
import Sidebar from "../../components/Sidebar_for_calendar";
import { Navbar2 } from "../../components/Navbar2";
import { Footer } from "../../components/Footer";

export default function Home() {
  return (
    <div>
      <Navbar2/>
      <div className="flex h-screen bg-gradient-to-br from-blue-100 to-indigo-200 overflow-hidden">
        <div className="flex-grow p-6">
          <Calendar />
        </div>
        <div className="w-96 bg-white shadow-lg">
          <Sidebar />
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
}
