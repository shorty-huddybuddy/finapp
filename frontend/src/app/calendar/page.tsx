"use client";

import Calendar from "../../components/Calendar";
import Sidebar from "../../components/Sidebar_for_calendar";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";

export default function Home() {
  return (
    <div>
      <Navbar/>
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

// import { useState, useEffect } from 'react';
// import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from 'date-fns';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';

// export default function CalendarPage() {
//     const [selectedDate, setSelectedDate] = useState(new Date());
//     const [events, setEvents] = useState({});

//     useEffect(() => {
//         fetchData();
//     }, [selectedDate]);

//     async function fetchData() {
//         try {
//             const monthStart = format(startOfMonth(selectedDate), 'yyyy-MM-dd');
//             const monthEnd = format(endOfMonth(selectedDate), 'yyyy-MM-dd');
//             const response = await fetch(`/api/getEvents?start=${monthStart}&end=${monthEnd}`);
//             const result = await response.json();
//             setEvents(result);
//         } catch (error) {
//             console.error('Error fetching data:', error);
//         }
//     }

//     const daysInMonth = eachDayOfInterval({
//         start: startOfMonth(selectedDate),
//         end: endOfMonth(selectedDate)
//     });

//     return (
//         <div className="p-6">
//             <h1 className="text-xl font-bold mb-4">Monthly Calendar</h1>
//             <div className="flex justify-between mb-4">
//                 <Button onClick={() => setSelectedDate(subMonths(selectedDate, 1))}>Previous Month</Button>
//                 <h2 className="text-lg font-bold">{format(selectedDate, 'MMMM yyyy')}</h2>
//                 <Button onClick={() => setSelectedDate(addMonths(selectedDate, 1))}>Next Month</Button>
//             </div>
//             <div className="grid grid-cols-7 gap-2 border p-4">
//                 {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
//                     <div key={day} className="font-bold text-center">{day}</div>
//                 ))}
//                 {daysInMonth.map(day => (
//                     <Card key={day} className="p-2 h-24">
//                         <CardContent>
//                             <div className="text-sm font-bold">{format(day, 'd')}</div>
//                             {events[format(day, 'yyyy-MM-dd')]?.map((event, index) => (
//                                 <div key={index} className="text-xs bg-gray-200 p-1 rounded mt-1">
//                                     {event.title} {event.time && `- ${event.time}`}
//                                 </div>
//                             ))}
//                         </CardContent>
//                     </Card>
//                 ))}
//             </div>
//             <Button onClick={fetchData} className="mt-4">Refresh Events</Button>
//         </div>
//     );
// }
