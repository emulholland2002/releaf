"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"

const eventTypes = [
  { type: "Tree Planting", color: "bg-green-100 text-green-800 hover:bg-green-100" },
  { type: "Forest Restoration", color: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" },
  { type: "Community Workshop", color: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
  { type: "Volunteer Training", color: "bg-amber-100 text-amber-800 hover:bg-amber-100" },
]

export function EventForm({ selectedDate, onSuccess }: { selectedDate: Date; onSuccess: () => void }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    date: format(selectedDate, "yyyy-MM-dd'T'HH:mm"),
    location: "",
    type: "Tree Planting",
    duration: 2,
    volunteers: 10,
    description: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Find the color for the selected type
      const selectedType = eventTypes.find((t) => t.type === formData.type)
      const typeColor = selectedType ? selectedType.color : ""

      const eventData = {
        ...formData,
        type_color: typeColor,
        // Convert string date to ISO string
        date: new Date(formData.date).toISOString(),
      }

      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      })

      if (!response.ok) {
        throw new Error("Failed to create event")
      }

      // Refresh data and close form
      router.refresh()
      onSuccess()
    } catch (error) {
      console.error("Error creating event:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Event</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Event Title</label>
            <Input name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Date & Time</label>
            <Input type="datetime-local" name="date" value={formData.date} onChange={handleChange} required />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Location</label>
            <Input name="location" value={formData.location} onChange={handleChange} required />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Event Type</label>
            <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type.type} value={type.type}>
                    {type.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Duration (hours)</label>
              <Input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="1"
                max="8"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Volunteers Needed</label>
              <Input
                type="number"
                name="volunteers"
                value={formData.volunteers}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <Textarea name="description" value={formData.description} onChange={handleChange} rows={3} />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Event"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
