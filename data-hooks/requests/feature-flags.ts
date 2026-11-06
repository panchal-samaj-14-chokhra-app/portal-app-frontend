import request from "@/config/request"

export interface FeatureFlag {
  id: string
  key: string
  label: string
  description?: string
  enabled: boolean
  updatedAt: string
}

export const getFeatureFlags = async (): Promise<FeatureFlag[]> => {
  const { data } = await request.get("/feature-flags")
  return data.data
}

export const updateFeatureFlag = async (key: string, payload: Partial<FeatureFlag>): Promise<FeatureFlag> => {
  const { data } = await request.put(`/feature-flags/${key}`, payload)
  return data.data
}
