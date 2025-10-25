import React from 'react'
import PollResults from '@/components/superadmin/poll-results'
import SuperAdminHeader from '@/components/superadmin/superadmin-header'

interface PageProps {
  params: { pollId: string }
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: PageProps) {
  const { pollId } = params
  try {
    const res = await fetch(`http://31.97.237.171:10000/polls/results/${pollId}`, { cache: 'no-store' })
    if (!res.ok) return { title: 'Poll Results' }
    const json = await res.json()
    const poll = json?.data
    return { title: poll?.title ? `पोल परिणाम — ${poll.title}` : 'Poll Results' }
  } catch (e) {
    return { title: 'Poll Results' }
  }
}

export default async function Page({ params }: PageProps) {
  const { pollId } = params

  let resp
  try {
    resp = await fetch(`http://31.97.237.171:10000/polls/results/${pollId}`, { cache: 'no-store' })
  } catch (e) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-lg font-semibold">सर्वर से जुड़ने में त्रुटि</h2>
          <p className="text-sm text-gray-600 mt-2">कृपया नेटवर्क कनेक्शन और सर्वर URL की जाँच करें।</p>
        </div>
      </div>
    )
  }

  if (!resp.ok) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-lg font-semibold">पोल परिणाम लाने में त्रुटि</h2>
          <p className="text-sm text-gray-600 mt-2">सर्वर ने {resp.status} उत्तर भेजा।</p>
        </div>
      </div>
    )
  }

  const json = await resp.json()
  const poll = json?.data || null

  if (!poll) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-lg font-semibold">कोई पोल नहीं मिला</h2>
        </div>
      </div>
    )
  }

  // compute total votes across all questions
  const totalVotes = (poll.questions || []).reduce((acc: number, q: any) => acc + ((q.options || []).reduce((s: number, o: any) => s + (o.votesCount || 0), 0)), 0)

  // header is a client component

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <SuperAdminHeader />
      <div className="container mx-auto">
        <header className="mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">पोल परिणाम</h1>
              <p className="text-sm text-slate-600 mt-1">{poll.title} — {poll.description || ''}</p>
              <div className="text-xs text-slate-500 mt-2">Poll ID: <span className="font-mono text-xs">{poll.id}</span> • Questions: {(poll.questions || []).length} • Total Votes: {totalVotes}</div>
            </div>
          </div>
        </header>

        <PollResults poll={poll} />
      </div>
      {/* header handles logout UI */}
    </div>
  )
}
