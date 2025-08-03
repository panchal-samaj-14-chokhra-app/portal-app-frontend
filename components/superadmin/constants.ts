import type { SidebarItem } from "./types"

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    id: "dashboard",
    label: "डैशबोर्ड",
    icon: "LayoutDashboard",
    description: "मुख्य डैशबोर्ड",
  },
  {
    id: "users",
    label: "उपयोगकर्ता प्रबंधन",
    icon: "Users",
    description: "सभी उपयोगकर्ताओं का प्रबंधन",
  },
  {
    id: "villages",
    label: "गांव प्रबंधन",
    icon: "MapPin",
    description: "गांवों की जानकारी और प्रबंधन",
  },
  {
    id: "chokhlas",
    label: "चोखला प्रबंधन",
    icon: "Crown",
    description: "चोखला अधिकारियों का प्रबंधन",
  },
  {
    id: "statistics",
    label: "आंकड़े और रिपोर्ट",
    icon: "BarChart3",
    description: "विस्तृत आंकड़े और रिपोर्ट",
  },
  {
    id: "profile",
    label: "प्रोफाइल सेटिंग्स",
    icon: "Settings",
    description: "अकाउंट सेटिंग्स",
  },
]

export const USER_ROLES = {
  superadmin: "सुपर एडमिन",
  chokhla: "चोखला",
  village: "गांव प्रबंधक",
} as const

export const USER_STATUS = {
  active: "सक्रिय",
  inactive: "निष्क्रिय",
  pending: "लंबित",
} as const

export const INDIAN_STATES = [
  "आंध्र प्रदेश",
  "अरुणाचल प्रदेश",
  "असम",
  "बिहार",
  "छत्तीसगढ़",
  "गोवा",
  "गुजरात",
  "हरियाणा",
  "हिमाचल प्रदेश",
  "झारखंड",
  "कर्नाटक",
  "केरल",
  "मध्य प्रदेश",
  "महाराष्ट्र",
  "मणिपुर",
  "मेघालय",
  "मिजोरम",
  "नागालैंड",
  "ओडिशा",
  "पंजाब",
  "राजस्थान",
  "सिक्किम",
  "तमिलनाडु",
  "तेलंगाना",
  "त्रिपुरा",
  "उत्तर प्रदेश",
  "उत्तराखंड",
  "पश्चिम बंगाल",
]

export const CHART_COLORS = {
  primary: "#3b82f6",
  secondary: "#10b981",
  accent: "#f59e0b",
  danger: "#ef4444",
  warning: "#f97316",
  info: "#06b6d4",
}
