"use client"

import Link from "next/link"
import Image from "next/image"
import { CalendarDays, MapPin, Phone, Calendar, ArrowLeft, Loader2 } from "lucide-react"
import { useSamajEvents } from "@/data-hooks/mutation-query/useSamajContent"
import type { SamajEvent } from "@/data-hooks/requests/samaj-content"

const MONTHS_HI = ["जन","फ़र","मार्च","अप्रै","मई","जून","जुला","अग","सित","अक्टू","नव","दिस"]

function dateParts(d: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d || "")
  if (!m) return null
  return { y: m[1], mo: MONTHS_HI[Number(m[2]) - 1], d: String(Number(m[3])) }
}

function longDate(d: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d || "")
  if (!m) return d
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])).toLocaleDateString("hi-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  })
}

function EventCard({ event, past }: { event: SamajEvent; past?: boolean }) {
  const parts = dateParts(event.date)
  return (
    <article className={`bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${past ? "opacity-85" : ""}`}>
      {event.imageUrl && (
        <div className="w-full bg-gray-50">
          <Image src={event.imageUrl} alt={event.title} width={1200} height={900} className="w-full h-auto" unoptimized />
        </div>
      )}
      <div className="flex gap-4 p-5 sm:gap-6 sm:p-7">
        {parts && (
          <div className={`flex h-20 w-16 shrink-0 flex-col items-center justify-center rounded-xl text-center shadow sm:h-24 sm:w-20 ${
            past ? "bg-gradient-to-b from-gray-500 to-gray-700 text-white" : "bg-gradient-to-b from-orange-500 to-orange-700 text-white"
          }`}>
            <span className="font-extrabold text-3xl sm:text-4xl leading-none text-yellow-200">{parts.d}</span>
            <span className="mt-1 text-xs font-semibold tracking-wide">{parts.mo}</span>
            <span className="text-[10px] opacity-80">{parts.y}</span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-extrabold text-gray-800 leading-snug sm:text-2xl">{event.title}</h3>
          <ul className="mt-3 space-y-1.5 text-sm text-gray-600">
            {event.date && (
              <li className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 shrink-0 text-orange-500" />
                {longDate(event.date)}{event.time && ` · ${event.time}`}
              </li>
            )}
            {event.venue && (
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-orange-500" />
                {event.venue}
              </li>
            )}
            {event.contact && (
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 shrink-0 text-orange-500" />
                <a href={`tel:${event.contact.replace(/\D/g, "")}`} className="font-medium text-orange-600 hover:underline">
                  {event.contact}
                </a>
              </li>
            )}
          </ul>
          {event.description && (
            <p className="mt-4 text-sm text-gray-600 leading-relaxed whitespace-pre-line">{event.description}</p>
          )}
        </div>
      </div>
    </article>
  )
}

export default function EventsPage() {
  const { data: events, isLoading } = useSamajEvents()
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
  const upcoming = (events || []).filter(e => !e.date || e.date >= today).sort((a, b) => (a.date || "9999").localeCompare(b.date || "9999"))
  const past     = (events || []).filter(e => e.date && e.date < today).sort((a, b) => (b.date || "").localeCompare(a.date || ""))
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50" style={{ fontFamily: "'Noto Sans Devanagari','Hind',sans-serif" }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="p-2 rounded-lg hover:bg-orange-50 text-gray-500 hover:text-orange-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">कार्यक्रम</h1>
            <p className="text-xs text-gray-400">पंचाल समाज चौदह चौखरा के आगामी एवं बीते आयोजन</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {isLoading && (
          <div className="text-center py-20 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin inline" />
          </div>
        )}
        {!isLoading && (!events || events.length === 0) && (
          <div className="text-center py-20">
            <Calendar className="w-12 h-12 mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400">अभी कोई कार्यक्रम सूचीबद्ध नहीं है।</p>
          </div>
        )}
        {!isLoading && events && events.length > 0 && (
          <div className="space-y-14">
            {upcoming.length > 0 && (
              <section>
                <h2 className="text-2xl font-extrabold text-orange-700 mb-6">आगामी कार्यक्रम</h2>
                <div className="space-y-6">
                  {upcoming.map(e => <EventCard key={e.id} event={e} />)}
                </div>
              </section>
            )}
            {past.length > 0 && (
              <section>
                <h2 className="text-2xl font-extrabold text-gray-500 mb-6">बीते कार्यक्रम</h2>
                <div className="space-y-6">
                  {past.map(e => <EventCard key={e.id} event={e} past />)}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
