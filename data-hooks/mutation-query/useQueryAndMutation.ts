import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

// Types
interface Chokhla {
  id: string
  name: string
  email: string
  phone: string
  address?: string
  createdAt: string
  updatedAt: string
}

interface Village {
  id: string
  name: string
  chokhlaId: string
  population: number
  createdAt: string
  updatedAt: string
}

interface Family {
  id: string
  headName: string
  villageId: string
  members: number
  createdAt: string
  updatedAt: string
}

// API functions
const api = {
  // Chokhla APIs
  getAllChokhlas: async (): Promise<Chokhla[]> => {
    const response = await axios.get("/api/chokhlas")
    return response.data
  },

  getChokhlaById: async (id: string): Promise<Chokhla> => {
    const response = await axios.get(`/api/chokhlas/${id}`)
    return response.data
  },

  createChokhla: async (data: Omit<Chokhla, "id" | "createdAt" | "updatedAt">): Promise<Chokhla> => {
    const response = await axios.post("/api/chokhlas", data)
    return response.data
  },

  updateChokhla: async ({ id, ...data }: Partial<Chokhla> & { id: string }): Promise<Chokhla> => {
    const response = await axios.put(`/api/chokhlas/${id}`, data)
    return response.data
  },

  deleteChokhla: async (id: string): Promise<void> => {
    await axios.delete(`/api/chokhlas/${id}`)
  },

  // Village APIs
  getAllVillages: async (): Promise<Village[]> => {
    const response = await axios.get("/api/villages")
    return response.data
  },

  getVillageById: async (id: string): Promise<Village> => {
    const response = await axios.get(`/api/villages/${id}`)
    return response.data
  },

  getVillagesByChokhla: async (chokhlaId: string): Promise<Village[]> => {
    const response = await axios.get(`/api/villages?chokhlaId=${chokhlaId}`)
    return response.data
  },

  createVillage: async (data: Omit<Village, "id" | "createdAt" | "updatedAt">): Promise<Village> => {
    const response = await axios.post("/api/villages", data)
    return response.data
  },

  updateVillage: async ({ id, ...data }: Partial<Village> & { id: string }): Promise<Village> => {
    const response = await axios.put(`/api/villages/${id}`, data)
    return response.data
  },

  deleteVillage: async (id: string): Promise<void> => {
    await axios.delete(`/api/villages/${id}`)
  },

  // Family APIs
  getAllFamilies: async (): Promise<Family[]> => {
    const response = await axios.get("/api/families")
    return response.data
  },

  getFamilyById: async (id: string): Promise<Family> => {
    const response = await axios.get(`/api/families/${id}`)
    return response.data
  },

  getFamiliesByVillage: async (villageId: string): Promise<Family[]> => {
    const response = await axios.get(`/api/families?villageId=${villageId}`)
    return response.data
  },

  createFamily: async (data: Omit<Family, "id" | "createdAt" | "updatedAt">): Promise<Family> => {
    const response = await axios.post("/api/families", data)
    return response.data
  },

  updateFamily: async ({ id, ...data }: Partial<Family> & { id: string }): Promise<Family> => {
    const response = await axios.put(`/api/families/${id}`, data)
    return response.data
  },

  deleteFamily: async (id: string): Promise<void> => {
    await axios.delete(`/api/families/${id}`)
  },
}

// Query hooks
export const useAllChokhlas = () => {
  return useQuery({
    queryKey: ["chokhlas"],
    queryFn: api.getAllChokhlas,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useGetAllChokhlas = useAllChokhlas // Alias for backward compatibility

export const useChokhlaById = (id: string) => {
  return useQuery({
    queryKey: ["chokhla", id],
    queryFn: () => api.getChokhlaById(id),
    enabled: !!id,
  })
}

export const useAllVillages = () => {
  return useQuery({
    queryKey: ["villages"],
    queryFn: api.getAllVillages,
    staleTime: 5 * 60 * 1000,
  })
}

export const useVillageById = (id: string) => {
  return useQuery({
    queryKey: ["village", id],
    queryFn: () => api.getVillageById(id),
    enabled: !!id,
  })
}

export const useVillagesByChokhla = (chokhlaId: string) => {
  return useQuery({
    queryKey: ["villages", "chokhla", chokhlaId],
    queryFn: () => api.getVillagesByChokhla(chokhlaId),
    enabled: !!chokhlaId,
  })
}

export const useAllFamilies = () => {
  return useQuery({
    queryKey: ["families"],
    queryFn: api.getAllFamilies,
    staleTime: 5 * 60 * 1000,
  })
}

export const useFamilyById = (id: string) => {
  return useQuery({
    queryKey: ["family", id],
    queryFn: () => api.getFamilyById(id),
    enabled: !!id,
  })
}

export const useFamiliesByVillage = (villageId: string) => {
  return useQuery({
    queryKey: ["families", "village", villageId],
    queryFn: () => api.getFamiliesByVillage(villageId),
    enabled: !!villageId,
  })
}

// Mutation hooks
export const useCreateChokhla = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.createChokhla,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chokhlas"] })
    },
  })
}

export const useUpdateChokhla = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.updateChokhla,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["chokhlas"] })
      queryClient.invalidateQueries({ queryKey: ["chokhla", data.id] })
    },
  })
}

export const useDeleteChokhla = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.deleteChokhla,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chokhlas"] })
    },
  })
}

export const useCreateVillage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.createVillage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["villages"] })
    },
  })
}

export const useUpdateVillage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.updateVillage,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["villages"] })
      queryClient.invalidateQueries({ queryKey: ["village", data.id] })
    },
  })
}

export const useDeleteVillage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.deleteVillage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["villages"] })
    },
  })
}

export const useCreateFamily = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.createFamily,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["families"] })
    },
  })
}

export const useUpdateFamily = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.updateFamily,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["families"] })
      queryClient.invalidateQueries({ queryKey: ["family", data.id] })
    },
  })
}

export const useDeleteFamily = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.deleteFamily,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["families"] })
    },
  })
}
