"use client"

import { Calendar, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export interface WeekData {
  id: string
  label: string
  date: string
  isCurrent: boolean
}

interface WeekSelectorProps {
  selectedWeek: string
  onWeekChange: (weekId: string) => void
  weeks: WeekData[]
}

export function WeekSelector({ selectedWeek, onWeekChange, weeks }: WeekSelectorProps) {
  const currentWeek = weeks.find(week => week.id === selectedWeek)
  
  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-gray-600" />
      <span className="text-sm font-medium text-gray-700">Week:</span>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-8 px-3">
            <span className="flex items-center gap-2">
              {currentWeek?.label || "Select Week"}
              {currentWeek?.isCurrent && (
                <Badge variant="secondary" className="text-xs">
                  Current
                </Badge>
              )}
              <ChevronDown className="h-3 w-3" />
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {weeks.map((week) => (
            <DropdownMenuItem
              key={week.id}
              onClick={() => onWeekChange(week.id)}
              className="flex items-center justify-between"
            >
              <div className="flex flex-col">
                <span className="font-medium">{week.label}</span>
                <span className="text-xs text-muted-foreground">{week.date}</span>
              </div>
              {week.isCurrent && (
                <Badge variant="secondary" className="text-xs">
                  Current
                </Badge>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
} 