export const SUPERADMIN_TABS = [
  {
    id: "chokhlas",
    label: "चौकला प्रबंधन",
    value: "chokhlas",
  },
  {
    id: "users",
    label: "उपयोगकर्ता प्रबंधन",
    value: "users",
  },
  {
    id: "reports",
    label: "रिपोर्ट्स",
    value: "reports",
  },
  {
    id: "settings",
    label: "सेटिंग्स",
    value: "settings",
  },
] as const

export type SuperAdminTab = (typeof SUPERADMIN_TABS)[number]["value"]
