"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { EventInput } from "@fullcalendar/core"
import { motion } from "framer-motion"

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  event: EventInput | null
  onEventAdd: (event: EventInput) => void
  onEventUpdate: (event: EventInput) => void
  onEventDelete: (eventId: string) => void
}

export default function EventModal({
  isOpen,
  onClose,
  event,
  onEventAdd,
  onEventUpdate,
  onEventDelete,
}: EventModalProps) {
  const [title, setTitle] = useState("")
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [category, setCategory] = useState("")
  const [recurrence, setRecurrence] = useState("")

  useEffect(() => {
    if (event) {
      setTitle(event.title || "")
      setStart(event.start ? new Date(event.start).toISOString().slice(0, 16) : "")
      setEnd(event.end ? new Date(event.end).toISOString().slice(0, 16) : "")
      setCategory(event.extendedProps?.category || "")
      setRecurrence(event.extendedProps?.recurrence || "")
    } else {
      setTitle("")
      setStart("")
      setEnd("")
      setCategory("")
      setRecurrence("")
    }
  }, [event])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const eventData: EventInput = {
      id: event?.id || Date.now().toString(),
      title,  
      start,
      end,
      extendedProps: {
        category,
        recurrence,
      },
    }
    if (event) {
      onEventUpdate(eventData)
    } else {
      onEventAdd(eventData)
    }
    onClose()
  }

  const handleDelete = () => {
    if (event && event.id) {
      onEventDelete(event.id)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-indigo-800">{event ? "Edit Event" : "Add Event"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
              Title
            </Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Label htmlFor="start" className="text-sm font-medium text-gray-700">
              Start
            </Label>
            <Input
              id="start"
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              required
              className="mt-1"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Label htmlFor="end" className="text-sm font-medium text-gray-700">
              End
            </Label>
            <Input
              id="end"
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="mt-1"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Label htmlFor="category" className="text-sm font-medium text-gray-700">
              Category
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="taxes">Taxes</SelectItem>
                <SelectItem value="bills">Bills</SelectItem>
                <SelectItem value="investments">Investments</SelectItem>
                <SelectItem value="savings">Savings</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Label htmlFor="recurrence" className="text-sm font-medium text-gray-700">
              Recurrence
            </Label>
            <Select value={recurrence} onValueChange={setRecurrence}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select recurrence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
          <motion.div
            className="flex justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {event ? "Update" : "Add"} Event
            </Button>
            {event && (
              <Button type="button" variant="destructive" onClick={handleDelete}>
                Delete Event
              </Button>
            )}
          </motion.div>
        </form>
      </DialogContent>
    </Dialog> 
  )
}

