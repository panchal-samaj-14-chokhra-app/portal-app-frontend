"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useCreatePoll, useUpdatePoll, useDeletePoll } from '@/data-hooks/mutation-query/useQueryAndMutation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Users, Eye, Edit2, Trash } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'


interface PollOption {
    id: string
    questionId: string
    optionText: string
    createdAt: string
    votesCount?: number
}

interface PollQuestion {
    id: string
    pollId: string
    questionText: string
    questionType: string
    createdAt: string
    options: PollOption[]
}

interface Poll {
    id: string
    title: string
    description?: string
    createdById?: string
    isActive?: boolean
    isExpired?: boolean
    createdAt?: string
    expiresAt?: string | null
    questions?: PollQuestion[]
}

type FormOption = { id?: string; optionText: string; votesCount?: number }
type FormQuestion = { id?: string; questionText: string; questionType: string; options: FormOption[] }

// The API sends a readable (Hindi) reason for every rejected request; show that instead of "Request failed with status 409"
const apiMessage = (err: any, fallback: string) => err?.response?.data?.message || fallback

const questionVotes = (q: { options: FormOption[] }) => q.options.reduce((n, o) => n + (o.votesCount || 0), 0)
const pollVotes = (poll?: Poll) => (poll?.questions || []).reduce((n, q) => n + (q.options || []).reduce((m, o) => m + (o.votesCount || 0), 0), 0)

interface PollsProps {
    polls?: Poll[]
    isLoading?: boolean
    error?: any
}

function Polls({ polls = [], isLoading = false, error = null }: PollsProps) {
    const [createOpen, setCreateOpen] = useState(false)
    const [viewOpen, setViewOpen] = useState(false)
    const [viewIndex, setViewIndex] = useState(0)

    const [editingPollId, setEditingPollId] = useState<string | null>(null)

    const [form, setForm] = useState({
        title: '',
        description: '',
        isActive: true,
        expiresAt: '' as string | null,
        // questions contain optional id and options are objects (may include id when editing)
        questions: [] as FormQuestion[],
    })
    const [errors, setErrors] = useState<{
        title?: string
        questions?: { questionText?: string; options?: (string | null)[] }[]
    }>({})

    const handleAddQuestion = () => {
        setForm((s) => ({ ...s, questions: [...s.questions, { questionText: '', questionType: 'SINGLE_CHOICE', options: [{ optionText: '' }] }] }))
    }

    const handleQuestionChange = (qIdx: number, value: string) => {
        setForm((s) => {
            const questions = [...s.questions]
            questions[qIdx] = { ...questions[qIdx], questionText: value }
            return { ...s, questions }
        })
    }

    const handleQuestionTypeChange = (qIdx: number, value: string) => {
        setForm((s) => {
            const questions = [...s.questions]
            questions[qIdx] = { ...questions[qIdx], questionType: value }
            return { ...s, questions }
        })
    }

    const handleOptionChange = (qIdx: number, oIdx: number, value: string) => {
        setForm((s) => {
            const questions = [...s.questions]
            const options = [...questions[qIdx].options]
            options[oIdx] = { ...options[oIdx], optionText: value }
            questions[qIdx] = { ...questions[qIdx], options }
            return { ...s, questions }
        })
    }

    const handleAddOption = (qIdx: number) => {
        setForm((s) => {
            const questions = [...s.questions]
            questions[qIdx] = { ...questions[qIdx], options: [...questions[qIdx].options, { optionText: '' }] }
            return { ...s, questions }
        })
    }

    const handleRemoveQuestion = (qIdx: number) => {
        if (questionVotes(form.questions[qIdx]) > 0) {
            toast({ title: 'प्रश्न हटाया नहीं जा सकता', description: 'इस प्रश्न पर वोट दर्ज हैं, इसलिए इसे हटाया नहीं जा सकता।', variant: 'destructive' })
            return
        }
        setForm((s) => ({ ...s, questions: s.questions.filter((_, i) => i !== qIdx) }))
    }

    const handleRemoveOption = (qIdx: number, oIdx: number) => {
        if ((form.questions[qIdx].options[oIdx].votesCount || 0) > 0) {
            toast({ title: 'विकल्प हटाया नहीं जा सकता', description: 'इस विकल्प पर वोट दर्ज हैं, इसलिए इसे हटाया नहीं जा सकता।', variant: 'destructive' })
            return
        }
        setForm((s) => {
            const questions = [...s.questions]
            const options = [...questions[qIdx].options]
            options.splice(oIdx, 1)
            questions[qIdx] = { ...questions[qIdx], options }
            return { ...s, questions }
        })
    }

    const validateForm = () => {
        const newErrors: any = {}
        if (!form.title || !form.title.trim()) {
            newErrors.title = 'पोल शीर्षक आवश्यक है'
        }

        if (!form.questions || form.questions.length === 0) {
            newErrors.questions = [{ questionText: 'कम से कम एक प्रश्न जोड़ें', options: [] }]
        } else {
            newErrors.questions = []
            form.questions.forEach((q, qi) => {
                const qErr: any = {}
                if (!q.questionText || !q.questionText.trim()) qErr.questionText = 'प्रश्न आवश्यक है'
                const opts = q.options || []
                const filled = opts.filter((o) => o.optionText && o.optionText.trim())
                const distinct = new Set(filled.map((o) => o.optionText.trim().toLowerCase()))
                if (filled.length === 0) {
                    qErr.options = ['कम से कम एक विकल्प आवश्यक है']
                } else if (!q.id && filled.length < 2) {
                    qErr.options = ['कम से कम 2 विकल्प आवश्यक हैं']
                } else if (distinct.size !== filled.length) {
                    qErr.options = ['विकल्प अलग-अलग होने चाहिए (एक जैसे विकल्प नहीं)']
                } else {
                    // per-option placeholders (null means ok)
                    qErr.options = opts.map((o) => (o.optionText && o.optionText.trim() ? null : 'खाली विकल्प'))
                }
                newErrors.questions[qi] = qErr
            })
        }

        setErrors(newErrors)

        // Return boolean valid
        const invalidTitle = !!newErrors.title
        const invalidQuestions = !!(newErrors.questions && newErrors.questions.some((q: any) => q && (q.questionText || (q.options && q.options.some((o: any) => o)))))
        return !(invalidTitle || invalidQuestions)
    }

    const session = useSession()
    const router = useRouter()
    const createPollMutation = useCreatePoll()
    const updatePollMutation = useUpdatePoll()
    const deletePollMutation = useDeletePoll()
    const { toast } = useToast()

    const isEditing = !!editingPollId

    const [confirmOpen, setConfirmOpen] = useState(false)
    const [confirmTargetPollId, setConfirmTargetPollId] = useState<string | null>(null)
    const [deletingPollId, setDeletingPollId] = useState<string | null>(null)

    const openEdit = (poll: Poll) => {
        // Prefill form with poll data, preserving ids
        const expiresAt = poll.expiresAt ? (poll.expiresAt.split && poll.expiresAt.split('T')[0]) : null
        const questions = (poll.questions || []).map((q) => ({
            id: q.id,
            questionText: q.questionText || '',
            questionType: q.questionType || 'SINGLE_CHOICE',
            options: (q.options || []).map((o) => ({ id: o.id, optionText: o.optionText || '', votesCount: o.votesCount || 0 })),
        }))

        setEditingPollId(poll.id)
        setForm({ title: poll.title || '', description: poll.description || '', isActive: poll.isActive ?? true, expiresAt: expiresAt as string | null, questions })
        setErrors({})
        setCreateOpen(true)
    }

    const openCreate = () => {
        setEditingPollId(null)
        setForm({ title: '', description: '', isActive: true, expiresAt: null, questions: [] })
        setErrors({})
        setCreateOpen(true)
    }

    const handleDeletePoll = (pollId: string) => {
        // open confirmation dialog
        setConfirmTargetPollId(pollId)
        setConfirmOpen(true)
    }

    const performDeletePoll = (pollId: string | null) => {
        if (!pollId) return
        setDeletingPollId(pollId)
        deletePollMutation.mutate(pollId, {
            onSuccess: () => {
                toast({ title: 'पोल हटाया गया', description: 'पोल सफलतापूर्वक हटा दिया गया।', variant: 'success' })
            },
            onError: (err: any) => {
                console.error('Delete poll failed', err)
                toast({ title: 'हटाने में त्रुटि', description: apiMessage(err, 'पोल हटाने में समस्या हुई'), variant: 'destructive' })
            },
            onSettled: () => {
                setDeletingPollId(null)
                setConfirmOpen(false)
                setConfirmTargetPollId(null)
            }
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const isValid = validateForm()
        if (!isValid) {
            toast({ title: 'फ़ॉर्म त्रुटि', description: 'कृपया फ़ॉर्म में दिए गए त्रुटियों को ठीक करें।' })
            return
        }
        const basePayload: any = {
            title: form.title,
            description: form.description,
            isActive: form.isActive,
            // null (not undefined) so that clearing the date while editing really removes the expiry
            expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
        }

        if (isEditing && editingPollId) {
            // include ids for questions/options where present
            const payload = {
                ...basePayload,
                questions: form.questions.map((q) => ({
                    ...(q.id ? { id: q.id } : {}),
                    questionText: q.questionText,
                    questionType: q.questionType || 'SINGLE_CHOICE',
                    options: q.options.map((o) => ({ ...(o.id ? { id: o.id } : {}), optionText: o.optionText })),
                })),
            }

            updatePollMutation.mutate({ id: editingPollId, payload }, {
                onSuccess: () => {
                    setCreateOpen(false)
                    setEditingPollId(null)
                    setForm({ title: '', description: '', isActive: true, expiresAt: null, questions: [] })
                    setErrors({})
                    toast({ title: 'पोल सफलतापूर्वक अपडेट किया गया', description: 'पोल सूची अपडेट हो रही है।', variant: 'success' })
                },
                onError: (err: any) => {
                    console.error('Update poll failed', err)
                    toast({ title: 'पोल अपडेट करते समय त्रुटि', description: apiMessage(err, 'पोल अपडेट करने में समस्या हुई।'), variant: 'destructive' })
                },
            })
        } else {
            const payload = {
                ...basePayload,
                questions: form.questions.map((q) => ({
                    questionText: q.questionText,
                    questionType: q.questionType || 'SINGLE_CHOICE',
                    options: q.options.map((o) => ({ optionText: o.optionText })),
                })),
            }

            createPollMutation.mutate(payload, {
                onSuccess: () => {
                    setCreateOpen(false)
                    setForm({ title: '', description: '', isActive: true, expiresAt: null, questions: [] })
                    setErrors({})
                    toast({
                        title: 'पोल सफलतापूर्वक बनाया गया',
                        description: 'नया पोल सफलतापूर्वक बनाया गया और सूची अपडेट हो रही है।',
                    })
                },
                onError: (err: any) => {
                    console.error('Create poll failed', err)
                    toast({
                        title: 'पोल बनाते समय त्रुटि',
                        description: apiMessage(err, 'पोल बनाने में समस्या हुई। कृपया बाद में पुनः प्रयास करें।'),
                        variant: 'destructive',
                    })
                },
            })
        }
    }
    if (isLoading) return <div>Loading polls...</div>
    if (error) return <div>Error loading polls</div>

    const totalPolls = polls.length
    const activePolls = polls.filter((p) => p.isActive).length
    const inactivePolls = totalPolls - activePolls

    const statusOf = (poll: Poll) =>
        !poll.isActive ? <span className="text-red-600">Inactive</span> : poll.isExpired ? <span className="text-amber-600">Expired</span> : <span className="text-green-600">Active</span>
    // the expiry is a calendar date stored as midnight UTC, so read it back in UTC to show the date that was picked
    const formatExpiry = (poll: Poll) => (poll.expiresAt ? new Date(poll.expiresAt).toLocaleDateString('hi-IN', { timeZone: 'UTC' }) : 'कोई सीमा नहीं')
    const deleteTarget = polls.find((p) => p.id === confirmTargetPollId)

    const formatDate = (iso?: string | null) => {
        if (!iso) return '-'
        try {
            return new Date(iso).toLocaleDateString('hi-IN')
        } catch (e) {
            return iso
        }
    }

    const openView = (idx: number) => {
        const poll = polls[idx]
        if (poll?.id) {
            router.push(`/admin/superadmin/poll/${poll.id}`)
            return
        }
        setViewIndex(idx)
        setViewOpen(true)
    }

    const prevView = () => setViewIndex((i) => (i - 1 + polls.length) % polls.length)
    const nextView = () => setViewIndex((i) => (i + 1) % polls.length)

    return (<>
        <div className="w-full space-y-6">

            {/* Create Poll Dialog */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="w-full max-w-[95vw] sm:max-w-5xl h-[95vh] sm:max-h-[90vh] p-4 sm:p-6 rounded-lg">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-orange-800 text-center">{isEditing ? 'पोल संपादित करें' : 'नया पोल बनाएं'}</DialogTitle>
                        <p className="text-center text-sm text-gray-600 mt-1">{isEditing ? 'पोल विवरण और प्रश्न/विकल्प संपादित करें' : 'पोल का शीर्षक, विवरण और प्रश्न/विकल्प भरें'}</p>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6 max-h-[72vh] sm:max-h-[75vh] overflow-y-auto px-0 sm:px-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">पोल शीर्षक <span className="text-red-600">*</span></label>
                            <Input value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} className={errors.title ? 'border-red-300' : ''} />
                            {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">विवरण</label>
                            <Input value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">समाप्ति तिथि (वैकल्पिक)</label>
                                <Input type="date" value={form.expiresAt || ''} onChange={(e) => setForm((s) => ({ ...s, expiresAt: e.target.value || null }))} />
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="text-sm">सक्रिय</label>
                                <Switch checked={form.isActive} onCheckedChange={(val) => setForm((s) => ({ ...s, isActive: val }))} />
                            </div>
                        </div>

                        {isEditing && form.questions.some((q) => questionVotes(q) > 0) && (
                            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                                इस पोल पर वोट दर्ज हैं। वोट सुरक्षित रहेंगे — जिन विकल्पों पर वोट हैं उन्हें हटाया नहीं जा सकता। ध्यान दें: किसी विकल्प का शब्द बदलने पर पुराने वोट उसी (बदले हुए) विकल्प के माने जाएंगे।
                            </div>
                        )}
                        <div>
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold">प्रश्न</h4>
                                <Button type="button" onClick={handleAddQuestion} size="sm">प्रश्न जोड़ें</Button>
                            </div>
                            <div className="space-y-4 mt-3">
                                {form.questions.map((q, qi) => (
                                    <div key={qi} className="bg-white shadow-sm rounded-lg p-4 md:p-5 border border-gray-100">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-orange-50 text-orange-700 text-sm font-semibold px-3 py-1 rounded-full">प्रश्न {qi + 1}</div>
                                                <div className="text-sm text-gray-600">{(q.options?.length || 0)} विकल्प</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button type="button" variant="ghost" size="sm" onClick={() => handleAddOption(qi)}>
                                                    विकल्प जोड़ें
                                                </Button>
                                                <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveQuestion(qi)} aria-label={`प्रश्न ${qi + 1} हटाएँ`}>
                                                    <Trash className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="mb-2">
                                                <Input placeholder={`प्रश्न ${qi + 1} लिखें`} value={q.questionText} onChange={(e) => handleQuestionChange(qi, e.target.value)} className={(errors.questions && errors.questions[qi] && errors.questions[qi].questionText) ? 'border-red-300' : ''} />
                                                {errors.questions && errors.questions[qi] && errors.questions[qi].questionText && (
                                                    <p className="text-red-600 text-xs mt-1">{errors.questions[qi].questionText}</p>
                                                )}
                                            </div>
                                            <div className="mb-3">
                                                <label className="block text-sm text-gray-700 mb-1">प्रश्न प्रकार</label>
                                                <select value={q.questionType} disabled={questionVotes(q) > 0} onChange={(e) => handleQuestionTypeChange(qi, e.target.value)} className="w-full max-w-xs border rounded-md px-2 py-1 text-sm disabled:opacity-60">
                                                    <option value="SINGLE_CHOICE">SINGLE_CHOICE</option>
                                                    <option value="MULTIPLE_CHOICE">MULTIPLE_CHOICE</option>
                                                </select>
                                                {questionVotes(q) > 0 && <p className="text-xs text-gray-500 mt-1">इस प्रश्न पर {questionVotes(q)} वोट दर्ज हैं — प्रकार बदला नहीं जा सकता और प्रश्न हटाया नहीं जा सकता।</p>}
                                            </div>

                                            <div className="grid gap-2">
                                                {q.options.map((opt, oi) => (
                                                    <div key={oi} className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                                                        <div className="flex items-center gap-2 w-full">
                                                            <span className="inline-flex items-center justify-center  text-sm text-gray-700 bg-gray-50 border border-gray-100 rounded-md px-2 py-1">{oi + 1}</span>
                                                            <Input className="flex-1" value={opt.optionText} onChange={(e) => handleOptionChange(qi, oi, e.target.value)} />
                                                            {isEditing && (opt.votesCount || 0) > 0 && (
                                                                <span className="whitespace-nowrap text-xs text-orange-700 bg-orange-50 border border-orange-100 rounded-full px-2 py-1">{opt.votesCount} वोट</span>
                                                            )}
                                                            <Button type="button" variant="ghost" size="sm" disabled={(opt.votesCount || 0) > 0} onClick={() => handleRemoveOption(qi, oi)} aria-label={`विकल्प ${oi + 1} हटाएँ`}>
                                                                <Trash className={`w-4 h-4 ${(opt.votesCount || 0) > 0 ? 'text-gray-300' : 'text-red-600'}`} />
                                                            </Button>
                                                        </div>
                                                        {errors.questions && errors.questions[qi] && errors.questions[qi].options && errors.questions[qi].options[oi] && (
                                                            <p className="text-red-600 text-xs mt-1">{errors.questions[qi].options[oi]}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                    setCreateOpen(false)
                                    setEditingPollId(null)
                                }}
                                className="w-full sm:w-auto"
                            >
                                रद्द करें
                            </Button>
                            <Button type="submit" disabled={isEditing ? updatePollMutation.isPending : createPollMutation.isPending} className="w-full sm:w-auto">
                                {isEditing ? (updatePollMutation.isPending ? 'सहेजा जा रहा है...' : 'सहेजें') : (createPollMutation.isPending ? 'बना रहे हैं...' : 'बनाएं')}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
            {/* Header and Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-white/90">
                    <CardContent>
                        <div>
                            <p className="text-sm text-gray-600">कुल पोल</p>
                            <h3 className="text-2xl font-bold text-gray-900">{totalPolls}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white/90">
                    <CardContent>
                        <div>
                            <p className="text-sm text-green-600">सक्रिय पोल</p>
                            <h3 className="text-2xl font-bold text-gray-900">{activePolls}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white/90">
                    <CardContent>
                        <div>
                            <p className="text-sm text-red-600">निष्क्रिय पोल</p>
                            <h3 className="text-2xl font-bold text-gray-900">{inactivePolls}</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* View Poll Dialog (carousel) */}
            <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                <DialogContent className="w-full max-w-[95vw] sm:max-w-3xl h-[90vh] p-4 sm:p-6 rounded-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-center">पोल विवरण</DialogTitle>
                    </DialogHeader>
                    <div className="flex items-start gap-4 mt-4">
                        <div className="flex-shrink-0 flex flex-col items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={prevView} aria-label="Previous poll">Prev</Button>
                            <div className="text-sm text-gray-500">{viewIndex + 1} / {polls.length}</div>
                            <Button variant="ghost" size="sm" onClick={nextView} aria-label="Next poll">Next</Button>
                        </div>

                        <div className="flex-1 overflow-y-auto max-h-[70vh]">
                            {polls.length === 0 ? (
                                <div className="text-center text-sm text-gray-600">No polls available</div>
                            ) : (
                                (() => {
                                    const poll = polls[viewIndex]
                                    return (
                                        <div>
                                            <h3 className="text-lg font-semibold">{poll.title}</h3>
                                            <p className="text-sm text-gray-600 mb-3">{poll.description}</p>
                                            <div className="text-xs text-gray-500 mb-3">Created: {formatDate(poll.createdAt)}</div>
                                            <div className="space-y-4">
                                                {(poll.questions || []).map((q) => (
                                                    <div key={q.id} className="p-3 border rounded-md">
                                                        <div className="font-medium mb-2">{q.questionText}</div>
                                                        <div className="space-y-2">
                                                            {(q.options || []).map((o) => (
                                                                <label key={o.id} className="flex items-center gap-3">
                                                                    <input
                                                                        type={q.questionType === 'MULTIPLE_CHOICE' ? 'checkbox' : 'radio'}
                                                                        name={`view-q-${q.id}`}
                                                                        disabled
                                                                        className="w-4 h-4"
                                                                    />
                                                                    <span className="text-sm">{o.optionText}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })()
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Mobile Cards */}
            <div className="block md:hidden space-y-4">
                {polls.length === 0 ? (
                    <div className="text-center py-12">
                        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">कोई पोल नहीं मिला</h3>
                        <p className="text-gray-600">नया पोल जोड़ें या फिर से प्रयास करें</p>

                    </div>
                ) : (
                    polls.map((poll, idx) => (
                        <Card key={poll.id} className="border">
                            <CardHeader>
                                <CardTitle className="text-base font-semibold">{poll.title}</CardTitle>
                                <CardDescription className="text-sm">{poll.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="text-sm text-gray-600">Created: {formatDate(poll.createdAt)}</div>
                                    <div className="text-sm">Status: {statusOf(poll)}</div>
                                </div>
                                <div className="text-sm text-gray-600 mb-2">समाप्ति: {formatExpiry(poll)}</div>
                                <div className="text-sm text-gray-700 mb-3">Questions: {poll.questions?.length || 0}</div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => openView(idx)}>
                                        <Eye className="w-4 h-4 mr-2" /> View
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => openEdit(poll)}>
                                        <Edit2 className="w-4 h-4 mr-2" /> Edit
                                    </Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDeletePoll(poll.id)} disabled={deletingPollId === poll.id}>
                                            <Trash className="w-4 h-4 mr-2" /> Delete
                                        </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
                <Card className="bg-white/90">
                    <CardHeader>
                        <CardTitle className="flex items-center text-orange-700">Polls</CardTitle>
                        <CardDescription>List of polls and brief details</CardDescription>
                        <div className="flex items-center justify-end">
                            <Button onClick={openCreate} className="bg-orange-600 hover:bg-orange-700 text-white">
                                नया पोल बनाएं
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">#</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Created Date</TableHead>
                                    <TableHead>Questions</TableHead>
                                    <TableHead>Expires</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {polls.map((poll, idx) => (
                                    <TableRow key={poll.id} className="hover:bg-gray-50">
                                        <TableCell>{idx + 1}</TableCell>
                                        <TableCell className="font-medium">{poll.title}</TableCell>
                                        <TableCell className="text-sm text-gray-600">{poll.description || '-'}</TableCell>
                                        <TableCell className="text-sm text-gray-600">{formatDate(poll.createdAt)}</TableCell>
                                        <TableCell className="text-sm">{poll.questions?.length || 0}</TableCell>
                                        <TableCell className="text-sm text-gray-600">{formatExpiry(poll)}</TableCell>
                                        <TableCell>{statusOf(poll)}</TableCell>
                                        <TableCell className="text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Button variant="outline" size="sm" onClick={() => openView(idx)}>
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm" onClick={() => openEdit(poll)}>
                                                            <Edit2 className="w-4 h-4" />
                                                        </Button>
                                                                            <Button variant="destructive" size="sm" onClick={() => handleDeletePoll(poll.id)} disabled={deletingPollId === poll.id}>
                                                                                <Trash className="w-4 h-4" />
                                                                            </Button>
                                                    </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
        {/* Delete Confirmation AlertDialog */}
        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <AlertDialogContent className="sm:max-w-[420px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>क्या आप वाकई इस पोल को हटाना चाहते हैं?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {pollVotes(deleteTarget) > 0
                            ? `इस पोल पर दर्ज सभी ${pollVotes(deleteTarget)} वोट भी हमेशा के लिए हट जाएंगे। यह कार्रवाई पूर्ववत नहीं की जा सकती। (सिर्फ़ वोट रोकने के लिए पोल को "सक्रिय" बंद करें।)`
                            : 'यह कार्रवाई पूर्ववत नहीं की जा सकती।'}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => { setConfirmOpen(false); setConfirmTargetPollId(null); }}>रद्द करें</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={() => performDeletePoll(confirmTargetPollId)}>
                        हां, हटाएं
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>)
}

export default Polls
