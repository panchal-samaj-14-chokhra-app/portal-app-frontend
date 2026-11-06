"use client"

import Link from "next/link"
import Image from "next/image"
import { CalendarDays, MapPin, Phone, Calendar, Loader2 } from "lucide-react"
import { useSamajEvents } from "@/data-hooks/mutation-query/useSamajContent"
import type { SamajEvent } from "@/data-hooks/requests/samaj-content"
import PageHeader from "@/components/ui/PageHeader"

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
    <article className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border ${past ? "border-gray-100 opacity-80" : "border-orange-100 hover:border-orange-200"}`}>
      {event.imageUrl && (
        <div className="w-full overflow-hidden bg-gray-50">
          <Image src={event.imageUrl} alt={event.title} width={1200} height={900}
            className="w-full h-auto group-hover:scale-[1.01] transition-transform duration-500" unoptimized />
        </div>
      )}
      <div className="flex gap-4 p-5 sm:gap-6 sm:p-6">
        {parts && (
          <div className={`flex h-20 w-16 shrink-0 flex-col items-center justify-center rounded-2xl text-center shadow-md sm:h-24 sm:w-20 ${
            past
              ? "bg-gradient-to-b from-gray-400 to-gray-600 text-white"
              : "text-white"
          }`} style={past ? {} : { background: "linear-gradient(135deg,#c2410c,#ea580c,#f97316)" }}>
            <span className="font-extrabold text-3xl sm:text-4xl leading-none text-yellow-200">{parts.d}</span>
            <span className="mt-0.5 text-xs font-bold tracking-wide">{parts.mo}</span>
            <span className="text-[10px] opacity-75 font-medium">{parts.y}</span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          {!past && (
            <span className="inline-block text-[10px] font-bold bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full mb-2 tracking-wide uppercase">आगामी</span>
          )}
          <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 leading-snug mb-3 group-hover:text-orange-700 transition-colors">{event.title}</h3>
          <ul className="space-y-1.5 text-sm text-gray-500">
            {event.date && (
              <li className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 shrink-0 text-orange-400" />
                <span className="font-medium">{longDate(event.date)}{event.time && ` · ${event.time}`}</span>
              </li>
            )}
            {event.venue && (
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-orange-400" />
                <span>{event.venue}</span>
              </li>
            )}
            {event.contact && (
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-orange-400" />
                <a href={`tel:${event.contact.replace(/\D/g, "")}`}
                  className="font-semibold text-orange-600 hover:text-orange-800 hover:underline">
                  {event.contact}
                </a>
              </li>
            )}
          </ul>
          {event.description && (
            <p className="mt-3 text-sm text-gray-500 leading-relaxed whitespace-pre-line border-t border-gray-50 pt-3">{event.description}</p>
          )}
        </div>
      </div>
    </article>
  )
}

function SectionLabel({ label, count, past }: { label: string; count: number; past?: boolean }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className={`h-px flex-1 ${past ? "bg-gray-200" : "bg-gradient-to-r from-orange-300 to-transparent"}`} />
      <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold ${
        past ? "bg-gray-100 text-gray-500" : "text-white"
      }`} style={past ? {} : { background: "linear-gradient(90deg,#c2410c,#ea580c)" }}>
        {label}
        <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${past ? "bg-gray-200 text-gray-500" : "bg-white/25"}`}>{count}</span>
      </div>
      <div className={`h-px flex-1 ${past ? "bg-gray-200" : "bg-gradient-to-l from-orange-300 to-transparent"}`} />
    </div>
  )
}

export default function EventsPage() {
  const { data: events, isLoading } = useSamajEvents()
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
  const upcoming = (events || []).filter(e => !e.date || e.date >= today).sort((a, b) => (a.date || "9999").localeCompare(b.date || "9999"))
  const past     = (events || []).filter(e => e.date && e.date < today).sort((a, b) => (b.date || "").localeCompare(a.date || ""))

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg,#fff7ed 0%,#ffffff 50%,#fffbf5 100%)", fontFamily: "'Noto Sans Devanagari','Hind',sans-serif" }}>
      <PageHeader title="कार्यक्रम" subtitle="पंचाल समाज चौदह चौखरा के आयोजन" icon={Calendar} />

      <div className="max-w-4xl mx-auto px-4 py-10">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 text-orange-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm text-gray-400">लोड हो रहा है...</p>
          </div>
        )}
        {!isLoading && (!events || events.length === 0) && (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-3xl bg-orange-50 flex items-center justify-center mx-auto mb-5">
              <Calendar className="w-10 h-10 text-orange-200" />
            </div>
            <h3 className="font-bold text-gray-700 mb-1">कोई कार्यक्रम नहीं</h3>
            <p className="text-gray-400 text-sm">अभी कोई कार्यक्रम सूचीबद्ध नहीं है।</p>
          </div>
        )}
        {!isLoading && events && events.length > 0 && (
          <div className="space-y-14">
            {upcoming.length > 0 && (
              <section>
                <SectionLabel label="आगामी कार्यक्रम" count={upcoming.length} />
                <div className="space-y-5">
                  {upcoming.map(e => <EventCard key={e.id} event={e} />)}
                </div>
              </section>
            )}
            {past.length > 0 && (
              <section>
                <SectionLabel label="बीते कार्यक्रम" count={past.length} past />
                <div className="space-y-5">
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
