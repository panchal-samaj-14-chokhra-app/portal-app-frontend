import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getSessions, getSession, createSession, updateSession, deleteSession,
  getKaryakarni, getKaryakarniAdmin,
  createKaryakarniMember, updateKaryakarniMember, deleteKaryakarniMember,
} from "@/data-hooks/requests/karyakarni"
import type { KaryakarniMember, KaryakarniSession } from "@/data-hooks/requests/karyakarni"

const KEY = ["karyakarni"]
const SESSION_KEY = [...KEY, "sessions"]

// ── Sessions ──────────────────────────────────────────────────────────────────

export const useSessions = (type?: string) =>
  useQuery({ queryKey: [...SESSION_KEY, type], queryFn: () => getSessions(type ? { type } : undefined), staleTime: 60_000 })

export const useSession = (id: string) =>
  useQuery({ queryKey: [...SESSION_KEY, id], queryFn: () => getSession(id), enabled: !!id })

export function useCreateSession() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: createSession, onSuccess: () => qc.invalidateQueries({ queryKey: SESSION_KEY }) })
}

export function useUpdateSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & Partial<KaryakarniSession>) => updateSession(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: SESSION_KEY }),
  })
}

export function useDeleteSession() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: deleteSession, onSuccess: () => qc.invalidateQueries({ queryKey: SESSION_KEY }) })
}

// ── Members ───────────────────────────────────────────────────────────────────

export const useKaryakarni = (type?: string, satraId?: string) =>
  useQuery({ queryKey: [...KEY, type, satraId], queryFn: () => getKaryakarni({ ...(type && { type }), ...(satraId && { satraId }) }), staleTime: 60_000 })

export const useKaryakarniAdmin = (type?: string, satraId?: string) =>
  useQuery({ queryKey: [...KEY, "admin", type, satraId], queryFn: () => getKaryakarniAdmin({ ...(type && { type }), ...(satraId && { satraId }) }) })

export function useCreateKaryakarniMember() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: createKaryakarniMember, onSuccess: () => qc.invalidateQueries({ queryKey: KEY }) })
}

export function useUpdateKaryakarniMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & Partial<KaryakarniMember>) => updateKaryakarniMember(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useDeleteKaryakarniMember() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: deleteKaryakarniMember, onSuccess: () => qc.invalidateQueries({ queryKey: KEY }) })
}
