import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { blockDates, createBooking, deleteBooking, listBookings, updateBooking, type Booking } from "@/data-hooks/requests/shringar"

const KEY = ["shringar-bookings"]

// Always show the latest bookings (visitors can book at any time)
export const useShringarBookings = () => useQuery({ queryKey: KEY, queryFn: listBookings, staleTime: 0, retry: false })

function useInvalidating<TVars, TRes>(fn: (v: TVars) => Promise<TRes>) {
  const qc = useQueryClient()
  return useMutation({ mutationFn: fn, onSuccess: () => qc.invalidateQueries({ queryKey: KEY }) })
}

export const useCreateBooking = () => useInvalidating((p: Partial<Booking>) => createBooking(p))
export const useUpdateBooking = () => useInvalidating((v: { id: string; payload: Partial<Booking> }) => updateBooking(v.id, v.payload))
export const useDeleteBooking = () => useInvalidating((id: string) => deleteBooking(id))
export const useBlockDates = () => useInvalidating((p: { dates: string[]; note?: string }) => blockDates(p))
