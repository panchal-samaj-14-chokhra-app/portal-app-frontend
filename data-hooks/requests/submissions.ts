import request from "@/config/request"

export type SubmissionKind = "testimonial" | "grievance"
export type SubmissionStatus = "new" | "in_progress" | "resolved"

export type Submission = {
  id: string
  kind: SubmissionKind
  ref: string
  name: string
  phone: string | null
  email: string | null
  place: string | null
  subject: string | null
  message: string | null
  images: string[]
  status: SubmissionStatus
  adminNote: string | null
  createdAt: string
}

export type SubmissionList = {
  data: Submission[]
  total: number
  page: number
  pageSize: number
  counts: { kind: SubmissionKind; status: SubmissionStatus; n: number }[]
}

export const getSubmissions = async (params: { kind: SubmissionKind; status?: string; q?: string; page?: number }): Promise<SubmissionList> => {
  const { data } = await request.get("/submissions", { params: { pageSize: 20, ...params } })
  return data
}

export const updateSubmission = async (id: string, payload: { status?: SubmissionStatus; adminNote?: string }) => {
  const { data } = await request.patch(`/submissions/${id}`, payload)
  return data.data as Submission
}

export const deleteSubmission = async (id: string) => {
  const { data } = await request.delete(`/submissions/${id}`)
  return data
}
