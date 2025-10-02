"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

// Dummy activities - can be replaced with fetched data later
const DUMMY_ACTIVITIES = [
  { id: "running", name: "Running", icon: "🏃" },
  { id: "swimming", name: "Swimming", icon: "🏊" },
  { id: "hiking", name: "Hiking", icon: "🥾" },
  { id: "cycling", name: "Cycling", icon: "🚴" },
  { id: "yoga", name: "Yoga", icon: "🧘" },
  { id: "gym", name: "Gym", icon: "💪" },
  { id: "dancing", name: "Dancing", icon: "💃" },
  { id: "tennis", name: "Tennis", icon: "🎾" },
]

interface ActivitySelectorProps {
  name?: string
  label?: string
  defaultSelected?: string[]
  onChange?: (selected: string[]) => void
}

export function ActivitySelector({ name = "activities", label = "Activity", defaultSelected = [], onChange }: ActivitySelectorProps) {
  const [selectedActivities, setSelectedActivities] = useState<string[]>(defaultSelected)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    onChange?.(selectedActivities)
  }, [selectedActivities, onChange])

  const toggleActivity = (activityId: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activityId) ? prev.filter((id) => id !== activityId) : [...prev, activityId],
    )
  }

  const removeActivity = (activityId: string) => {
    setSelectedActivities((prev) => prev.filter((id) => id !== activityId))
  }

  const getSelectedActivityNames = () => {
    return DUMMY_ACTIVITIES.filter((activity) => selectedActivities.includes(activity.id)).map(
      (activity) => activity.name,
    )
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-300">{label}</label>

        {/* Quick select buttons - showing first 3 activities */}
        <div className="flex flex-wrap gap-2">
          {DUMMY_ACTIVITIES.slice(0, 3).map((activity) => (
            <Button
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
            className="flex items-center justify-between bg-[#585858] rounded-lg px-4 py-3 cursor-pointer  transition-colors"
          >
            <div className="flex-1 flex flex-wrap gap-2">
              {selectedActivities.length > 0 ? (
                selectedActivities.map((activityId) => {
                  const activity = DUMMY_ACTIVITIES.find((a) => a.id === activityId)
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
            <svg className="w-5 h-5 text-[#52B788]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>

          {/* Dropdown with all activities */}
          {isOpen && (
            <div className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {DUMMY_ACTIVITIES.map((activity) => (
                <div
                  key={activity.id}
                  onClick={() => toggleActivity(activity.id)}
                  className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-700 transition-colors ${selectedActivities.includes(activity.id) ? "bg-gray-700" : ""
                    }`}
                >
                  <span className="text-gray-300 flex items-center gap-2">
                    <span>{activity.icon}</span>
                    {activity.name}
                  </span>
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
