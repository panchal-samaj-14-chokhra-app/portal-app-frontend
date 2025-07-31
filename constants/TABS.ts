export const ADMIN_TABS = {
  OVERVIEW: "overview",
  VILLAGES: "villages",
  FAMILIES: "families",
  STATISTICS: "statistics",
  SETTINGS: "settings",
} as const

export const SUPERADMIN_TABS = {
  CHOKHLAS: "chokhlas",
  USERS: "users",
  ANALYTICS: "analytics",
  SYSTEM: "system",
} as const

export type AdminTab = (typeof ADMIN_TABS)[keyof typeof ADMIN_TABS]
export type SuperAdminTab = (typeof SUPERADMIN_TABS)[keyof typeof SUPERADMIN_TABS]
