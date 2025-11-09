'use client'

import React from 'react'
import PollResults from '@/components/superadmin/poll-results'
import { useGetPollResultsById } from '@/data-hooks/mutation-query/useQueryAndMutation'
import { useParams } from 'next/navigation'
import SuperAdminHeader from '@/components/superadmin/superadmin-header'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import SuperAdminLoading from '../../loading'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { format } from 'date-fns'
interface VoteData {
  chakolaName: string
  chakolaId: string
  villages: {
    villageName: string
    votes: {
      questionText: string
      selectedOption: string
      voterName: string
      votedAt: string
    }[]
  }[]
}

interface PollResultsProps {
  poll: {
    votes: VoteData[]
  }
}
// import { HiOutlineOfficeBuilding } from 'react-icons/hi'


interface Props {
  pollId: string
}
interface PollData {
  id: string
  title: string
  description: string
  questions: any[]
}
interface ApiResponse {
  success: boolean
  message: string
  data: PollData
  votes: VoteData[]
}

export default function PollResultsClient({ pollId }: Props) {
  const param = useParams()
  const router = useRouter()
  const { data: pollData, isLoading, isError } = useGetPollResultsById(param.pollId as string)

  if (isLoading) return <SuperAdminLoading />

  if (isError || !pollData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        पोल नहीं मिला।
      </div>
    )
  }


  const apiResponse: ApiResponse = pollData
  const totalVotes = (apiResponse.data.questions || []).reduce(
    (acc: number, q: any) =>
      acc + (q.options || []).reduce((s: number, o: any) => s + (o.votesCount || 0), 0),
    0
  )

  return (
    <div className="">
      <SuperAdminHeader />

      {/* Removed container padding by using full-width div */}
      <div className="w-full mx-auto p-2">
        {/* Header Section */}
        <header className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>

          </div>
        </header>

        {/* ---- Responsive Info Card ---- */}
        <div className="bg-white shadow-sm rounded-xl border border-slate-200 p-4 sm:p-6 mb-6 transition hover:shadow-md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Header Text */}
            <div className="text-center sm:text-left">
              <h2 className="text-lg font-semibold text-slate-800">Poll Result</h2>
              <p className="text-sm text-slate-500 mt-1">Detailed stats about this poll</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 w-full sm:w-auto">
              {/* Poll ID */}
              <div className="bg-slate-50 rounded-md px-3 py-2 text-center sm:min-w-[140px]">
                <p className="text-xs text-slate-500 font-medium">Poll ID</p>
                <p className="font-mono text-[13px] text-slate-700 truncate">{pollData.data.id}</p>
              </div>

              {/* Questions */}
              <div className="bg-slate-50 rounded-md px-3 py-2 text-center sm:min-w-[140px]">
                <p className="text-xs text-slate-500 font-medium">Questions</p>
                <p className="text-sm font-semibold text-slate-700">
                  {(pollData.data.questions || []).length}
                </p>
              </div>

              {/* Total Votes */}
              <div className="bg-slate-50 rounded-md px-3 py-2 text-center sm:min-w-[140px]">
                <p className="text-xs text-slate-500 font-medium">Total Votes</p>
                <p className="text-sm font-semibold text-slate-700">{totalVotes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ---- Poll Results Section ---- */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <PollResults poll={pollData.data} />
        </div>
        <br />
        <div className="bg-white shadow-sm rounded-xl border border-slate-200 p-4 sm:p-6 mb-6 transition hover:shadow-md">
          <PollResultsAccordion votes={apiResponse.votes} />
        </div>
      </div>
    </div>
  )
}




const PollResultsAccordion = ({ votes }: { votes: VoteData[] }) => {
  if (!votes?.length) {
    return <div className="text-center text-slate-500 py-6">कोई वोट डेटा उपलब्ध नहीं है।</div>
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {votes.map((chakola, index) => (
        <AccordionItem key={chakola.chakolaId} value={`chakola-${index}`}>
          <AccordionTrigger className="flex items-center gap-2 text-lg">
            <h2 className="text-lg font-semibold text-slate-800">
              {chakola.chakolaName}   <span className='text-sm text-slate-500 mt-1'> {chakola.villages?.length ? `(${chakola.villages.length} गाँव)` : '(कोई गाँव नहीं)'}</span>
            </h2>

          </AccordionTrigger>

          <AccordionContent>
            {chakola.villages?.length ? (
              <div className="overflow-x-auto mt-4">
                <Table className="min-w-full border">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-left">गाँव का नाम</TableHead>
                      <TableHead className="text-left">चयनित विकल्प</TableHead>
                      <TableHead className="text-left">वोटर का नाम</TableHead>
                      <TableHead className="text-left">वोट की तिथि</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {chakola.villages.map((village) =>
                      village.votes.map((vote, i) => (
                        <TableRow key={i}>
                          <TableCell>{village.villageName}</TableCell>
                          <TableCell>{vote.selectedOption}</TableCell>
                          <TableCell>{vote.voterName}</TableCell>
                          <TableCell>
                            {format(new Date(vote.votedAt), 'dd-MM-yyyy HH:mm')}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-slate-500 italic mt-2">इस चकोला में कोई वोट नहीं मिला।</p>
            )}
          </AccordionContent>
        </AccordionItem>
      ))
      }
    </Accordion >
  )
}
