export const TABS = [
  { key: "village", label: "गांव प्रबंधन" },
  { key: "chokhla", label: "चौकला प्रबंधन" },
  { key: "statics", label: "आँकड़े" },
  { key: "user", label: "यूज़र प्रबंधन" },
  { key: "profile", label: "सुपर एडमिन प्रोफ़ाइल" },
] as const

export type TabKey = (typeof TABS)[number]["key"]
