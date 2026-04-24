"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker({
  date,
  setDate,
  name
}: {
  date?: Date;
  setDate?: (date: Date | undefined) => void;
  name?: string;
}) {
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(date)

  const handleSelect = (newDate: Date | undefined) => {
    setInternalDate(newDate)
    setDate?.(newDate)
  }

  return (
    <>
      {name && <input type="hidden" name={name} value={internalDate ? format(internalDate, "yyyy-MM-dd") : ""} />}
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal bg-background border-border text-foreground rounded-xl px-4 py-2.5 h-auto",
                !internalDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {internalDate ? format(internalDate, "PPP") : <span>Pick a date</span>}
            </Button>
          }
        />
        <PopoverContent className="w-auto p-0 bg-background border-border" align="start">
          <Calendar
            mode="single"
            selected={internalDate}
            onSelect={handleSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </>
  )
}
