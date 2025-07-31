import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

// Chokhla operations
export const useAllChokhlas = () => {
  return useQuery({
    queryKey: ["chokhlas"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/chokhlas`)
      return response.data
    },
  })
}

export const useGetAllChokhlas = useAllChokhlas // Alias for backward compatibility

export const useCreateChokhla = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      name: string
      adminName: string
      adminEmail: string
      adminPassword: string
    }) => {
      const response = await axios.post(`${API_BASE_URL}/chokhlas`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chokhlas"] })
    },
  })
}

export const useChokhlaById = (id: string) => {
  return useQuery({
    queryKey: ["chokhla", id],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/chokhlas/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

export const useChokhlaDetails = (id: string) => {
  return useQuery({
    queryKey: ["chokhla", id],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/chokhlas/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

export const useUpdateChokhla = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await axios.put(`${API_BASE_URL}/chokhlas/${id}`, data)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["chokhla", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["chokhlas"] })
    },
  })
}

// Village operations
export const useVillagesByChokhla = (chokhlaId: string) => {
  return useQuery({
    queryKey: ["villages", chokhlaId],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/chokhlas/${chokhlaId}/villages`)
      return response.data
    },
    enabled: !!chokhlaId,
  })
}

export const useGetAllVillageswithChokhlaID = (chokhlaId: string) => {
  return useQuery({
    queryKey: ["villages", chokhlaId],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/chokhlas/${chokhlaId}/villages`)
      return response.data
    },
    enabled: !!chokhlaId,
  })
}

export const useCreateVillage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      name: string
      chokhlaId: string
    }) => {
      const response = await axios.post(`${API_BASE_URL}/villages`, data)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["villages", variables.chokhlaId] })
    },
  })
}

export const useVillageDetails = (id: string) => {
  return useQuery({
    queryKey: ["village", id],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/villages/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

// Family operations
export const useFamiliesByVillage = (villageId: string) => {
  return useQuery({
    queryKey: ["families", villageId],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/villages/${villageId}/families`)
      return response.data
    },
    enabled: !!villageId,
  })
}

export const useCreateFamily = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post(`${API_BASE_URL}/families`, data)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["families", variables.villageId] })
    },
  })
}

export const useFamilyById = (id: string) => {
  return useQuery({
    queryKey: ["family", id],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/families/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

export const useGetFamilyDetails = (id: string) => {
  return useQuery({
    queryKey: ["family", id],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/families/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

export const useUpdateFamily = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await axios.put(`${API_BASE_URL}/families/${id}`, data)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["family", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["families"] })
    },
  })
}

export const useDeleteFamilyUsingID = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`${API_BASE_URL}/families/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["families"] })
    },
  })
}
