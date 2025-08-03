export const TABS = [
  { key: "village", label: "गांव प्रबंधन" },
  { key: "statics", label: "आँकड़े" },
  { key: "reports", label: "रिपोर्ट्स" },
  { key: "profile", label: "चौकला प्रोफ़ाइल" },
]

export const VALIDATION_MESSAGES = {
  REQUIRED: "यह फील्ड आवश्यक है",
  EMAIL_INVALID: "वैध ईमेल पता दर्ज करें",
  PHONE_INVALID: "वैध मोबाइल नंबर दर्ज करें",
  PASSWORD_MIN_LENGTH: "कम से कम 8 अक्षर",
  PASSWORD_STRONG: "पासवर्ड मजबूत होना चाहिए (एक बड़ा, एक छोटा, एक संख्या, एक विशेष चिन्ह)",
  PASSWORD_MISMATCH: "पासवर्ड मेल नहीं खाते",
  AGE_INVALID: "वैध आयु दर्ज करें",
  COORDINATES_INVALID: "वैध निर्देशांक दर्ज करें",
}

export const SUCCESS_MESSAGES = {
  VILLAGE_CREATED: "गांव सफलतापूर्वक जोड़ा गया",
  PROFILE_UPDATED: "प्रोफ़ाइल सफलतापूर्वक अपडेट की गई",
  OPERATION_SUCCESS: "ऑपरेशन सफल रहा",
}

export const ERROR_MESSAGES = {
  GENERIC: "कुछ गलत हो गया। कृपया पुनः प्रयास करें।",
  NETWORK: "नेटवर्क की समस्या। कृपया अपना कनेक्शन जांचें।",
  UNAUTHORIZED: "आपको इस कार्य की अनुमति नहीं है।",
  NOT_FOUND: "डेटा नहीं मिला।",
}
