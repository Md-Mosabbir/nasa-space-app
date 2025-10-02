"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type DateRange = {
  from?: Date
  to?: Date
}

export function EventDatePicker() {
  const [dateRange, setDateRange] = useState<DateRange>({})
  const [open, setOpen] = useState(false)

  // Display for user (MM/DD/YYYY)
  const formatDisplayDate = (date?: Date) => date?.toLocaleDateString("en-US") || ""

  // Form submission (YYYYMMDD)
  const formatFormDate = (date?: Date) => {
    if (!date) return ""
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}${month}${day}`
  }

  // Quick selectors
  const setToday = () => setDateRange({ from: new Date(), to: new Date() })
  const setTomorrow = () => {
    const t = new Date()
    t.setDate(t.getDate() + 1)
    setDateRange({ from: t, to: t })
  }
  const setThisWeekend = () => {
    const today = new Date()
    const day = today.getDay()
    const saturday = new Date(today)
    saturday.setDate(today.getDate() + ((6 - day + 7) % 7 || 7))
    const sunday = new Date(saturday)
    sunday.setDate(saturday.getDate() + 1)
    setDateRange({ from: saturday, to: sunday })
  }

  return (
    <div className="space-y-4 w-full max-w-md">
      {/* Quick-select buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button type="button" size="sm" onClick={setToday} className="bg-[#52B788] hover:bg-[#52B788]/90 text-white">
          Today
        </Button>
        <Button type="button" size="sm" onClick={setTomorrow} className="bg-[#52B788] hover:bg-[#52B788]/90 text-white">
          Tomorrow
        </Button>
        <Button type="button" size="sm" onClick={setThisWeekend} className="bg-[#52B788] hover:bg-[#52B788]/90 text-white">
          This Weekend
        </Button>
      </div>

      {/* Calendar popover */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-between bg-[#585858] hover:bg-[#585858] hover:text-[#d9d9d9] border-none text-[#d9d9d9] placeholder:text-[#d9d9d9] font-normal pl-4 pr-10 py-6 rounded-lg "
          >
            {dateRange.from
              ? dateRange.to && dateRange.to.getTime() !== dateRange.from.getTime()
                ? `${formatDisplayDate(dateRange.from)} → ${formatDisplayDate(dateRange.to)}`
                : formatDisplayDate(dateRange.from)
              : "Choose your event date(s)"}
            <CalendarIcon className="h-5 w-5 text-[#52B788]" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={(range) => range && setDateRange(range)}
            numberOfMonths={2}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Hidden form values */}
      <input type="hidden" name="from" value={formatFormDate(dateRange.from)} />
      <input type="hidden" name="to" value={formatFormDate(dateRange.to)} />
    </div>
  )
}
