"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import type { EventInput, DateSelectArg, EventClickArg, EventApi } from "@fullcalendar/core"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusIcon, ChevronDownIcon } from "lucide-react"
import EventModal from "./EventModal"
import { fetchEvents, createEvent, updateEvent, deleteEvent } from "../lib/api"
import { motion } from "framer-motion"
import { useAuth } from "@clerk/nextjs"

import { toast } from "sonner"

export default function Calendar() {
  const [events, setEvents] = useState<EventInput[]>([])
  const [selectedEvent, setSelectedEvent] = useState<EventInput | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const calendarRef = useRef<FullCalendar>(null)
  const {getToken} = useAuth()


  useEffect(() => { 

    const loadEvents = async () => {
      const token = await getToken()
      const fetchedEvents = await fetchEvents(token)
      console.log(fetchedEvents)
      setEvents(fetchedEvents)
    }
    loadEvents()
  }, [])

  const handleDateSelect = useCallback((selectInfo: DateSelectArg) => {
    setSelectedEvent(null)
    setIsModalOpen(true)
  }, [])

  const handleEventClick = useCallback((clickInfo: EventClickArg) => {
    if(clickInfo.event.extendedProps?.isGlobal){
      return;
    }

    setSelectedEvent(clickInfo.event.toPlainObject())
    setIsModalOpen(true)
  }, [])

  const handleEventAdd = useCallback(async (event: EventInput) => {
    const token = await getToken()
    const newEvent = await createEvent(event,token)
    const fetchedEvents = await fetchEvents(token);
  setEvents(fetchedEvents);
  }, [getToken])

  const handleEventUpdate = useCallback(async (updatedEvent: EventInput) => {
    if (!calendarRef.current) return;
    
    const calendarApi = calendarRef.current.getApi();
    const existingEvent = calendarApi.getEventById(updatedEvent.id as string);
    
    if (existingEvent) {
      const originalEvent = existingEvent.toPlainObject(); // Store original event data
      
      existingEvent.setProp('title', updatedEvent.title);
      
      // Add null checks for start and end dates
      if (updatedEvent.start) {
        existingEvent.setStart(updatedEvent.start);
      }
      
      if (updatedEvent.end) {
        existingEvent.setEnd(updatedEvent.end);
      }
      
      existingEvent.setExtendedProp('category', updatedEvent.extendedProps?.category);
      existingEvent.setAllDay(!!updatedEvent.allDay);
      
      try {
        await updateEvent(updatedEvent);
        toast.success('Event updated successfully');
      } catch (error) {
        toast.error('Failed to update event');
        // Revert changes on error
        existingEvent.remove();
        calendarApi.addEvent(originalEvent as EventInput);
      }
    }
  }, [])

  const handleEventDelete = useCallback(async (eventId: string) => {
    const eventToDelete = events.find((e) => e.id === eventId);
  if (eventToDelete?.extendedProps?.isGlobal) return;

    const token = await getToken()
    await deleteEvent(eventId,token)
    setEvents((prev) => prev.filter((e) => e.id !== eventId))
    
    // Force calendar to remove the deleted event
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi()
      const existingEvent = calendarApi.getEventById(eventId)
      if (existingEvent) {
        existingEvent.remove()
      }
    }
  }, [])

  const scrollToNextMonth = () => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi()
      api.next()
    }
  }

  return (
    <Card className="w-full h-full bg-white/80 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-blue-800">Financial Calendar</h2>
          <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <PlusIcon className="mr-2 h-4 w-4" /> Add Event
          </Button>
        </div>
        <div className="flex-grow overflow-hidden rounded-lg shadow-lg">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            initialView="dayGridMonth"
            height="100%"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={3}
            weekends={true}
            events={events}
            select={handleDateSelect}
            eventClick={handleEventClick}
            dayCellClassNames="p-3 border-2 border-black-100  rounded-md"
            eventContent={(eventInfo) => (
              <div className={`p-1 rounded text-xs ${getCategoryColor(eventInfo.event.extendedProps?.category)}`}>
                {eventInfo.event.title}
              </div>
            )}
          />

        </div>
        <motion.div className="flex justify-center mt-4" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
          <Button onClick={scrollToNextMonth} variant="outline" className="rounded-full">
            <ChevronDownIcon className="h-6 w-6 text-blue-600" />
          </Button>
        </motion.div>
        {isModalOpen && (
          <EventModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            event={selectedEvent}
            onEventAdd={handleEventAdd}
            onEventUpdate={handleEventUpdate}
            onEventDelete={handleEventDelete}
          />
        )}
      </CardContent>
    </Card>
  )
}

function getCategoryColor(category: string) {
  switch (category) {
    case "taxes":
      return "bg-red-200 text-red-800"
    case "bills":
      return "bg-blue-200 text-blue-800"
    case "investments":
      return "bg-green-200 text-green-800"
    case "savings":
      return "bg-yellow-200 text-yellow-800"
    default:
      return "bg-gray-200 text-gray-800"
  }
}



