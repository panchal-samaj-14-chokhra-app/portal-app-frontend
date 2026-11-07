import request from "@/config/request"
import publicRequest from "@/config/public-request"

export interface PortalConfig {
  id: string
  key: string
  value: string
  label: string
}

export const getPortalConfig = () =>
  publicRequest.get<{ success: boolean; data: PortalConfig[] }>("/portal-config").then(r => r.data.data)

export const updatePortalConfig = (key: string, value: string) =>
  request.put<{ success: boolean; data: PortalConfig }>(`/portal-config/${key}`, { value }).then(r => r.data.data)
