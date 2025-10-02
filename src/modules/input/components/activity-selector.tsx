"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface Activity {
  id: string
  name: string
}

interface ActivitySelectorProps {
  name?: string
  label?: string
  defaultSelected?: string[]
  onChange?: (selected: string[]) => void
}

/**
 * Returns the full API URL depending on environment
 */
function getApiUrl(path: string) {
  if (process.env.NODE_ENV === "development") {
    return `http://localhost:8000${path}`
  }
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || ""
  return `${base}${path}`
}

export function ActivitySelector({
  name = "activities",
  label = "Activity",
  defaultSelected = [],
  onChange,
}: ActivitySelectorProps) {
  const [selectedActivities, setSelectedActivities] = useState<string[]>(defaultSelected)
  const [activities, setActivities] = useState<Activity[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    onChange?.(selectedActivities)
  }, [selectedActivities, onChange])

  // Fetch activities from API
  useEffect(() => {
    async function fetchActivities() {
      try {
        const res = await fetch(getApiUrl("/analyse/activities"))
        if (!res.ok) throw new Error("Failed to fetch activities")
        const dataObj = await res.json() as Record<string, any>

        // Convert object keys to array of { id, name: id }
        const data: Activity[] = Object.keys(dataObj).map((key) => ({
          id: key,
          name: key, // show id as name
        }))

        setActivities(data)
        console.log("Fetched activities:", data)
      } catch (e) {
        console.error("Fetch activities failed, using fallback", e)
        setActivities([
          { id: "hiking", name: "hiking" },
          { id: "fishing", name: "fishing" },
          { id: "festival", name: "festival" },
          { id: "generic", name: "generic" },
        ])
      }
    }
    fetchActivities()
  }, [])

  const toggleActivity = (activityId: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activityId) ? prev.filter((id) => id !== activityId) : [...prev, activityId],
    )
  }

  const removeActivity = (activityId: string) => {
    setSelectedActivities((prev) => prev.filter((id) => id !== activityId))
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-300">{label}</label>

        {/* Quick select buttons - showing first 3 activities */}
        <div className="flex flex-wrap gap-2">
          {activities.slice(0, 3).map((activity) => (
            <Button
              type="button"
              key={activity.id}
              onClick={() => toggleActivity(activity.id)}
              variant={selectedActivities.includes(activity.id) ? "default" : "outline"}
              className={
                selectedActivities.includes(activity.id)
                  ? "bg-[#52B788] hover:bg-none text-white border-none"
                  : "bg-[#282828] hover:bg-white border-none text-gray-300 "
              }
              size="sm"
            >
              {activity.name}
            </Button>
          ))}
        </div>

        {/* Input field that opens dropdown */}
        <div className="relative">
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between bg-[#585858] rounded-lg px-4 py-3 cursor-pointer transition-colors"
          >
            <div className="flex-1 flex flex-wrap gap-2">
              {selectedActivities.length > 0 ? (
                selectedActivities.map((activityId) => {
                  const activity = activities.find((a) => a.id === activityId)
                  return (
                    <Badge
                      key={activityId}
                      className="bg-[#52B788] hover:bg-[#52B788]/90 text-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeActivity(activityId)
                      }}
                    >
                      {activity?.name}
                      <X className="ml-1 h-3 w-3" />
                    </Badge>
                  )
                })
              ) : (
                <span className="text-[#d9d9d9]">Choose your activities</span>
              )}
            </div>
            <svg
              className="w-5 h-5 text-[#52B788]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>

          {/* Dropdown with all activities */}
          {isOpen && (
            <div className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  onClick={() => toggleActivity(activity.id)}
                  className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-700 transition-colors ${selectedActivities.includes(activity.id) ? "bg-gray-700" : ""
                    }`}
                >
                  <span className="text-gray-300">{activity.name}</span>
                  {selectedActivities.includes(activity.id) && (
                    <svg className="w-5 h-5 text-[#52B788]" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={selectedActivities.join(",")} />
    </div>
  )
}
