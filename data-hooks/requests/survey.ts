import request from "@/config/request"

export type QuestionType =
  | "short_answer"
  | "long_answer"
  | "multiple_choice"
  | "checkboxes"
  | "dropdown"
  | "number"
  | "date"
  | "file_upload"
  | "phone"
  | "email"

export interface ShowIf {
  questionId: string
  value: string
}

export interface SurveyQuestion {
  id?: string
  formId?: string
  label: string
  type: QuestionType
  options?: string[] | null
  showIf?: ShowIf | null
  required: boolean
  order?: number
}

export interface SurveyForm {
  id: string
  title: string
  description?: string | null
  eventName?: string | null
  status: "draft" | "published" | "closed"
  createdAt: string
  updatedAt: string
  questions?: SurveyQuestion[]
  _count?: { questions: number; responses: number }
}

export interface SurveyResponseAnswer {
  questionId: string
  value?: string
  fileUrl?: string
}

export interface SurveyResponsePayload {
  formId: string
  respondentName: string
  mobileNumber: string
  email?: string
  villageId?: string
  district?: string
  answers: SurveyResponseAnswer[]
}

// ── Admin ──────────────────────────────────────────────────────────────────────

export const fetchAdminForms = async (): Promise<SurveyForm[]> => {
  const { data } = await request.get("/surveys")
  return data
}

export const fetchAdminForm = async (id: string): Promise<SurveyForm> => {
  const { data } = await request.get(`/surveys/${id}`)
  return data
}

export const createSurveyForm = async (payload: { title: string; description?: string; eventName?: string }): Promise<SurveyForm> => {
  const { data } = await request.post("/surveys", payload)
  return data
}

export const updateSurveyForm = async (id: string, payload: Partial<{ title: string; description: string; eventName: string; status: string }>): Promise<SurveyForm> => {
  const { data } = await request.put(`/surveys/${id}`, payload)
  return data
}

export const saveSurveyQuestions = async (id: string, questions: SurveyQuestion[]): Promise<SurveyForm> => {
  const { data } = await request.put(`/surveys/${id}/questions`, { questions })
  return data
}

export const deleteSurveyForm = async (id: string): Promise<void> => {
  await request.delete(`/surveys/${id}`)
}

export const fetchFormResponses = async (id: string, params?: Record<string, string>): Promise<any[]> => {
  const { data } = await request.get(`/surveys/${id}/responses`, { params })
  return data
}

// ── Public ─────────────────────────────────────────────────────────────────────

export const fetchPublishedForms = async (): Promise<SurveyForm[]> => {
  const { data } = await request.get("/surveys/public")
  return data
}

export const fetchPublishedForm = async (id: string): Promise<SurveyForm> => {
  const { data } = await request.get(`/surveys/public/${id}`)
  return data
}

export const submitSurveyResponse = async (payload: SurveyResponsePayload): Promise<any> => {
  const { data } = await request.post("/surveys/responses", payload)
  return data
}
