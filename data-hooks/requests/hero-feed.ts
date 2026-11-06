import request from "@/config/request"

export type HeroFeedType = "badhai" | "shok" | "shubhkamna" | "janmdin" | "vivah" | "other"

export interface HeroFeed {
  id: string
  type: HeroFeedType
  heading: string
  personName: string
  details?: string | null
  imageUrl: string
  likesCount: number
  status: string
  publishedAt: string
  createdAt: string
  _count?: { comments: number }
}

export interface HeroFeedComment {
  id: string
  feedId: string
  authorName: string
  content: string
  createdAt: string
}

const BASE = "/hero-feed"

export const getHeroFeed      = (params?: { take?: string }) =>
  request.get<{ success: boolean; data: HeroFeed[] }>(BASE, { params }).then(r => r.data.data)

export const getHeroFeedAdmin = (params?: { take?: string }) =>
  request.get<{ success: boolean; data: HeroFeed[] }>(`${BASE}/admin/all`, { params }).then(r => r.data.data)

export const createHeroFeed   = (body: Partial<HeroFeed>) =>
  request.post<{ success: boolean; data: HeroFeed }>(BASE, body).then(r => r.data.data)

export const updateHeroFeed   = (id: string, body: Partial<HeroFeed>) =>
  request.put<{ success: boolean; data: HeroFeed }>(`${BASE}/${id}`, body).then(r => r.data.data)

export const deleteHeroFeed   = (id: string) =>
  request.delete(`${BASE}/${id}`)

export const likeHeroFeed     = (id: string) =>
  request.post(`${BASE}/${id}/like`)

export const getHeroFeedComments = (id: string) =>
  request.get<{ success: boolean; data: HeroFeedComment[] }>(`${BASE}/${id}/comments`).then(r => r.data.data)

export const addHeroFeedComment = (id: string, body: { authorName: string; content: string }) =>
  request.post<{ success: boolean; data: HeroFeedComment }>(`${BASE}/${id}/comments`, body).then(r => r.data.data)

export const FEED_TYPES: { value: HeroFeedType; label: string; color: string; bg: string }[] = [
  { value: "badhai",   label: "बधाई संदेश",      color: "text-green-700",  bg: "bg-green-100" },
  { value: "janmdin",  label: "जन्मदिवस",         color: "text-pink-700",   bg: "bg-pink-100" },
  { value: "vivah",    label: "विवाह बधाई",       color: "text-purple-700", bg: "bg-purple-100" },
  { value: "shubhkamna", label: "शुभकामनाएं",    color: "text-blue-700",   bg: "bg-blue-100" },
  { value: "shok",     label: "शोक संदेश",        color: "text-gray-700",   bg: "bg-gray-100" },
  { value: "other",    label: "अन्य",             color: "text-orange-700", bg: "bg-orange-100" },
]
