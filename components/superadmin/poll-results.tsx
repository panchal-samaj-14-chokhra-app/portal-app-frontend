"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import DonutChart, { DEFAULT_COLORS } from '@/components/ui/donut'

type PollOption = { id: string; optionText: string; votesCount?: number }
type Question = { id: string; questionText: string; options: PollOption[] }
type Poll = { id: string; title: string; description?: string; questions: Question[] }

export default function PollResults({ poll }: { poll: Poll }) {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{poll.title}</h1>
            {poll.description ? <p className="text-sm text-slate-600">{poll.description}</p> : null}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {poll.questions.map((q, qi) => {
          const options = q.options || []
          const total = options.reduce((s, o) => s + (o.votesCount || 0), 0)
          const donutData = options.map((o, i) => ({ label: o.optionText, value: o.votesCount || 0, color: DEFAULT_COLORS[i % DEFAULT_COLORS.length] }))

          return (
            <div key={q.id} className="bg-white shadow-sm rounded-lg p-5 border">
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="md:w-48 flex-shrink-0 flex flex-col items-center">
                  <DonutChart data={donutData} size={140} strokeWidth={20} showCenterPercent />
                  <div className="mt-2 text-sm text-slate-600 text-center">Total votes: <span className="font-semibold">{total}</span></div>
                </div>

                <div className="flex-1">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-slate-800">{q.questionText}</h3>
                  </div>

                  <div className="space-y-3">
                    {options.map((opt, i) => {
                      const count = opt.votesCount || 0
                      const pct = total ? Math.round((count / total) * 100) : 0
                      const color = DEFAULT_COLORS[i % DEFAULT_COLORS.length]
                      return (
                        <div key={opt.id} className="flex items-center gap-4">
                          <div className="w-2 h-8 rounded-full" style={{ background: color }} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-slate-800 font-medium" title={opt.optionText}>{opt.optionText}</div>
                              <div className="text-sm text-slate-600">{count} votes • {pct}%</div>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
                              <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: color }} />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
