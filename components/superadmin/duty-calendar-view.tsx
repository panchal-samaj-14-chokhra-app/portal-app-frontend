"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { DutyRegisterEntry } from "@/data-hooks/requests/duty-register"
import type { ShiftItem, DutyTypeItem, StatusItem } from "@/data-hooks/requests/duty-settings"

const WEEK_DAYS = ["सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि", "रवि"]
const MONTHS_HI = [
  "जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून",
  "जुलाई", "अगस्त", "सितंबर", "अक्तूबर", "नवंबर", "दिसंबर",
]

function isoDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
}

function attColor(key: string) {
  if (key?.toLowerCase().includes("present") || key?.toLowerCase().includes("उपस्थित")) return "bg-green-100 text-green-700"
  if (key?.toLowerCase().includes("absent") || key?.toLowerCase().includes("अनुपस्थित")) return "bg-red-100 text-red-700"
  return "bg-orange-100 text-orange-700"
}

type Props = {
  entries: DutyRegisterEntry[]
  dutyTypes: DutyTypeItem[]
  shifts: ShiftItem[]
  attendanceStatuses: StatusItem[]
  calView: "month" | "week"
}

function DayCell({
  dateStr,
  entries,
  dutyTypes,
  shifts,
  attendanceStatuses,
  isToday,
  isOtherMonth,
}: {
  dateStr: string
  entries: DutyRegisterEntry[]
  dutyTypes: DutyTypeItem[]
  shifts: ShiftItem[]
  attendanceStatuses: StatusItem[]
  isToday: boolean
  isOtherMonth: boolean
}) {
  const day = Number(dateStr.split("-")[2])
  const MAX_SHOW = 3

  return (
    <div className={`min-h-[90px] p-1.5 border-b border-r ${isOtherMonth ? "bg-gray-50" : "bg-white"}`}>
      <div className={`text-xs font-semibold mb-1 w-6 h-6 flex items-center justify-center rounded-full
        ${isToday ? "bg-orange-500 text-white" : isOtherMonth ? "text-gray-300" : "text-gray-600"}`}>
        {day}
      </div>
      <div className="space-y-0.5">
        {entries.slice(0, MAX_SHOW).map((e) => {
          const attKey = e.attendanceStatus
          return (
            <Link key={e.id} href={`/mandir-admin/duty-register/register/${e.id}/view`}>
              <div className={`text-[10px] leading-tight px-1 py-0.5 rounded truncate cursor-pointer hover:opacity-80 ${attColor(attKey)}`}>
                {e.memberName}
              </div>
            </Link>
          )
        })}
        {entries.length > MAX_SHOW && (
          <div className="text-[10px] text-gray-400 pl-1">+{entries.length - MAX_SHOW} और</div>
        )}
      </div>
    </div>
  )
}

export default function DutyCalendarView({ entries, dutyTypes, shifts, attendanceStatuses, calView }: Props) {
  const today = new Date()
  const todayStr = isoDate(today.getFullYear(), today.getMonth(), today.getDate())

  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date(today)
    const day = (d.getDay() + 6) % 7
    d.setDate(d.getDate() - day)
    d.setHours(0, 0, 0, 0)
    return d
  })

  // Group entries by date
  const byDate: Record<string, DutyRegisterEntry[]> = {}
  for (const e of entries) {
    if (!byDate[e.dutyDate]) byDate[e.dutyDate] = []
    byDate[e.dutyDate].push(e)
  }

  // ── MONTH VIEW ──
  if (calView === "month") {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()

    // Build calendar grid (Mon-start)
    const firstDay = new Date(year, month, 1)
    // 0=Sun..6=Sat → shift to Mon=0
    const startOffset = (firstDay.getDay() + 6) % 7
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrev = new Date(year, month, 0).getDate()

    const cells: { dateStr: string; otherMonth: boolean }[] = []
    for (let i = startOffset - 1; i >= 0; i--) {
      cells.push({ dateStr: isoDate(year, month - 1, daysInPrev - i), otherMonth: true })
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ dateStr: isoDate(year, month, d), otherMonth: false })
    }
    while (cells.length % 7 !== 0) {
      cells.push({ dateStr: isoDate(year, month + 1, cells.length - daysInMonth - startOffset + 1), otherMonth: true })
    }

    return (
      <Card>
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <Button variant="ghost" size="icon" onClick={() => setViewDate(new Date(year, month - 1, 1))}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-semibold text-gray-800">
              {MONTHS_HI[month]} {year}
            </span>
            <Button variant="ghost" size="icon" onClick={() => setViewDate(new Date(year, month + 1, 1))}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b">
            {WEEK_DAYS.map((d) => (
              <div key={d} className="text-center text-xs font-medium text-gray-500 py-2 border-r last:border-r-0">{d}</div>
            ))}
          </div>
          {/* Grid */}
          <div className="grid grid-cols-7">
            {cells.map(({ dateStr, otherMonth }) => (
              <DayCell
                key={dateStr}
                dateStr={dateStr}
                entries={byDate[dateStr] || []}
                dutyTypes={dutyTypes}
                shifts={shifts}
                attendanceStatuses={attendanceStatuses}
                isToday={dateStr === todayStr}
                isOtherMonth={otherMonth}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // ── WEEK VIEW ──
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    return {
      dateStr: isoDate(d.getFullYear(), d.getMonth(), d.getDate()),
      day: d.getDate(),
      month: d.getMonth(),
    }
  })

  const prevWeek = () => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() - 7)
    setWeekStart(d)
  }
  const nextWeek = () => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + 7)
    setWeekStart(d)
  }

  const weekLabel = (() => {
    const s = weekDays[0]
    const e = weekDays[6]
    if (s.month === e.month) return `${s.day} – ${e.day} ${MONTHS_HI[e.month]}`
    return `${s.day} ${MONTHS_HI[s.month]} – ${e.day} ${MONTHS_HI[e.month]}`
  })()

  return (
    <Card>
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <Button variant="ghost" size="icon" onClick={prevWeek}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="font-semibold text-gray-800">{weekLabel}</span>
          <Button variant="ghost" size="icon" onClick={nextWeek}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        {/* 7-column week grid */}
        <div className="grid grid-cols-7 border-b">
          {weekDays.map(({ dateStr, day, month }, i) => (
            <div
              key={dateStr}
              className={`text-center py-2 border-r last:border-r-0 ${dateStr === todayStr ? "bg-orange-50" : ""}`}
            >
              <div className="text-xs text-gray-500">{WEEK_DAYS[i]}</div>
              <div className={`text-sm font-semibold mx-auto mt-0.5 w-7 h-7 flex items-center justify-center rounded-full
                ${dateStr === todayStr ? "bg-orange-500 text-white" : "text-gray-700"}`}>
                {day}
              </div>
              <div className="text-[10px] text-gray-400">{MONTHS_HI[month]}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 min-h-[200px]">
          {weekDays.map(({ dateStr }) => {
            const dayEntries = byDate[dateStr] || []
            return (
              <div key={dateStr} className={`p-1.5 border-r last:border-r-0 space-y-0.5 ${dateStr === todayStr ? "bg-orange-50/40" : ""}`}>
                {dayEntries.length === 0 ? (
                  <div className="text-[10px] text-gray-300 text-center mt-4">—</div>
                ) : (
                  dayEntries.map((e) => (
                    <Link key={e.id} href={`/mandir-admin/duty-register/register/${e.id}/view`}>
                      <div className={`text-[10px] leading-tight px-1 py-0.5 rounded truncate cursor-pointer hover:opacity-80 ${attColor(e.attendanceStatus)}`}>
                        <div className="font-medium truncate">{e.memberName}</div>
                        <div className="text-[9px] opacity-75 truncate">
                          {shifts.find(s => s.key === e.shift)?.label || e.shift}
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
