export const ADMIN_TABS = [
  {
    id: "chokhlas",
    label: "चौकला प्रबंधन",
    value: "chokhlas",
  },
  {
    id: "villages",
    label: "गांव प्रबंधन",
    value: "villages",
  },
  {
    id: "families",
    label: "परिवार प्रबंधन",
    value: "families",
  },
  {
    id: "reports",
    label: "रिपोर्ट्स",
    value: "reports",
  },
] as const

export type AdminTabValue = (typeof ADMIN_TABS)[number]["value"]
