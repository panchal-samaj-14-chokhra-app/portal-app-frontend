import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getOrders, getOrderById, getNextOrderNumber, createOrder, updateOrder, deleteOrder } from "@/data-hooks/requests/orderBook"

export const useOrders = (params?: { status?: string; search?: string; dateFrom?: string; dateTo?: string }) =>
  useQuery({ queryKey: ["orders", params], queryFn: () => getOrders(params) })

export const useOrder = (id?: string) =>
  useQuery({ queryKey: ["order", id], queryFn: () => getOrderById(id as string), enabled: !!id })

export const useNextOrderNumber = (enabled = true) =>
  useQuery({ queryKey: ["order-next-number"], queryFn: getNextOrderNumber, enabled, staleTime: 0 })

export const useCreateOrder = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: any) => createOrder(payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["orders"] }); qc.invalidateQueries({ queryKey: ["order-next-number"] }) },
  })
}

export const useUpdateOrder = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => updateOrder(id, payload),
    onSuccess: (_, { id }) => { qc.invalidateQueries({ queryKey: ["orders"] }); qc.invalidateQueries({ queryKey: ["order", id] }) },
  })
}

export const useDeleteOrder = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteOrder(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  })
}
