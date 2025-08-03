import type { TabKey, ChokhlaFormData } from "./types"

export const TABS: { key: TabKey; label: string }[] = [
  { key: "village", label: "गांव प्रबंधन" },
  { key: "chokhla", label: "चौकला प्रबंधन" },
  { key: "statics", label: "आँकड़े" },
  { key: "user", label: "यूज़र प्रबंधन" },
  { key: "profile", label: "सुपर एडमिन प्रोफ़ाइल" },
]

export const INITIAL_CHOKHLA_FORM: ChokhlaFormData = {
  name: "",
  adhyaksh: "",
  contactNumber: "",
  state: "",
  district: "",
  villageName: "",
  email: "",
  password: "",
  repeatPassword: "",
}

export const VALIDATION_MESSAGES = {
  REQUIRED: "यह फील्ड आवश्यक है",
  INVALID_EMAIL: "मान्य ईमेल दर्ज करें",
  WEAK_PASSWORD: "पासवर्ड मजबूत होना चाहिए (कम से कम 8 अक्षर, एक बड़ा, एक छोटा, एक संख्या, एक विशेष चिन्ह)",
  PASSWORD_MISMATCH: "पासवर्ड मेल नहीं खाते",
  INVALID_PHONE: "मान्य फोन नंबर दर्ज करें (10 अंक)",
}
