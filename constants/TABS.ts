export const ADMIN_TABS = {
  CHOKHLA: "chokhla",
  VILLAGE: "village",
  FAMILY: "family",
  USERS: "users",
  REPORTS: "reports",
  SETTINGS: "settings",
} as const

export const CHOKHLA_TABS = {
  OVERVIEW: "overview",
  VILLAGES: "villages",
  STATISTICS: "statistics",
  SETTINGS: "settings",
} as const

export const VILLAGE_TABS = {
  OVERVIEW: "overview",
  FAMILIES: "families",
  STATISTICS: "statistics",
  SETTINGS: "settings",
} as const

export type AdminTab = (typeof ADMIN_TABS)[keyof typeof ADMIN_TABS]
export type ChokhlaTab = (typeof CHOKHLA_TABS)[keyof typeof CHOKHLA_TABS]
export type VillageTab = (typeof VILLAGE_TABS)[keyof typeof VILLAGE_TABS]
