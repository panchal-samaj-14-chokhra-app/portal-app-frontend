import request from "@/config/request"

export interface PortalConfig {
  id: string
  key: string
  value: string
  label: string
}

export const getPortalConfig = () =>
  request.get<{ success: boolean; data: PortalConfig[] }>("/portal-config").then(r => r.data.data)

export const updatePortalConfig = (key: string, value: string) =>
  request.put<{ success: boolean; data: PortalConfig }>(`/portal-config/${key}`, { value }).then(r => r.data.data)
