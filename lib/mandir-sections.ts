export type SectionField = { key: string; label: string; type?: "text" | "textarea" | "richtext" | "image" | "pdf" | "date" | "images" }
export type SectionDef = {
  key: string
  title: string
  // html = single rich-text body; items = repeatable list of records; fields = single record of fields
  type: "html" | "items" | "fields"
  fields?: SectionField[]
  itemLabel?: string
  category: string
}

export const SECTION_CATEGORIES = [
  "सामान्य जानकारी",
  "लाइव व समय",
  "सूचियाँ",
  "नियम व संपर्क",
] as const

export const MANDIR_SECTIONS: SectionDef[] = [
  {
    key: "about-mandir", title: "मंदिर परिचय (About Mandir)", type: "fields", category: "सामान्य जानकारी",
    fields: [
      { key: "subtitle", label: "उपशीर्षक" },
      { key: "body", label: "विवरण (रिच-टेक्स्ट)", type: "richtext" },
      { key: "images", label: "मंदिर की इमेज (एक से अधिक — स्टोरेज सर्विस पर अपलोड होंगी)", type: "images" },
    ],
  },
  { key: "history", title: "इतिहास (History)", type: "html", category: "सामान्य जानकारी" },
  { key: "about-panchal-samaj", title: "पंचाल समाज (Panchal Samaj)", type: "html", category: "सामान्य जानकारी" },
  { key: "about-banswara", title: "बांसवाड़ा के बारे में (About Banswara)", type: "html", category: "सामान्य जानकारी" },
  { key: "about-rajasthan", title: "राजस्थान के बारे में (About Rajasthan)", type: "html", category: "सामान्य जानकारी" },
  {
    key: "live-darshan", title: "लाइव दर्शन (Live Darshan)", type: "fields", category: "लाइव व समय",
    fields: [
      { key: "streamUrl", label: "लाइव स्ट्रीम URL (जब लाइव चल रहा हो — YouTube लिंक या iframe कोड)", type: "textarea" },
      { key: "defaultUrl", label: "डिफ़ॉल्ट लिंक (जब लाइव उपलब्ध न हो तब दिखेगा)", type: "textarea" },
    ],
  },
  {
    key: "temple-timings", title: "मंदिर समय सारणी (Temple Timings)", type: "items", itemLabel: "समय", category: "लाइव व समय",
    fields: [
      { key: "activity", label: "गतिविधि" },
      { key: "summer", label: "ग्रीष्मकाल समय" },
      { key: "winter", label: "शीतकाल समय" },
    ],
  },
  {
    key: "temple-season-dates", title: "मंदिर ऋतु अवधि (Season Dates)", type: "fields", category: "लाइव व समय",
    fields: [
      { key: "winterRange", label: "शीतकाल अवधि (जैसे: 16 अक्टूबर – 28 फरवरी)" },
      { key: "summerRange", label: "ग्रीष्मकाल अवधि (जैसे: 1 मार्च – 15 अक्टूबर)" },
    ],
  },
  {
    key: "festivals", title: "त्योहार (Festivals)", type: "items", itemLabel: "त्योहार", category: "सूचियाँ",
    fields: [
      { key: "title", label: "शीर्षक" },
      { key: "description", label: "विवरण", type: "textarea" },
      { key: "images", label: "इमेज (एक से अधिक)", type: "images" },
    ],
  },
  {
    key: "faq", title: "सामान्य प्रश्न (FAQ)", type: "items", itemLabel: "प्रश्न", category: "सूचियाँ",
    fields: [{ key: "question", label: "प्रश्न" }, { key: "answer", label: "उत्तर", type: "textarea" }],
  },
  {
    key: "trust-mandal", title: "ट्रस्ट मंडल (Trust Mandal)", type: "items", itemLabel: "सदस्य", category: "सूचियाँ",
    fields: [{ key: "name", label: "नाम" }, { key: "role", label: "पद" }, { key: "phone", label: "फ़ोन" }, { key: "photo", label: "फ़ोटो", type: "image" }],
  },
  {
    key: "gallery", title: "गैलरी (Gallery)", type: "items", itemLabel: "इमेज", category: "सूचियाँ",
    fields: [{ key: "image", label: "इमेज", type: "image" }, { key: "caption", label: "कैप्शन" }],
  },
  {
    key: "media-handlers", title: "मीडिया हैंडलर (Media Handlers)", type: "items", itemLabel: "हैंडलर", category: "सूचियाँ",
    fields: [{ key: "name", label: "नाम" }, { key: "role", label: "भूमिका" }, { key: "contact", label: "संपर्क" }],
  },
  {
    key: "press-release", title: "प्रेस विज्ञप्ति (Press Release)", type: "items", itemLabel: "विज्ञप्ति", category: "सूचियाँ",
    fields: [{ key: "title", label: "शीर्षक" }, { key: "date", label: "दिनांक" }, { key: "summary", label: "सारांश", type: "textarea" }, { key: "link", label: "लिंक / PDF (अधिकतम 2MB)", type: "pdf" }],
  },
  {
    key: "recent-visits", title: "हाल की विज़िट (Recent Visits)", type: "items", itemLabel: "विज़िट", category: "सूचियाँ",
    fields: [
      { key: "name", label: "नाम" },
      { key: "designation", label: "पदनाम" },
      { key: "date", label: "दिनांक", type: "date" },
      { key: "photo", label: "मुख्य फ़ोटो", type: "image" },
      { key: "description", label: "विस्तृत विवरण", type: "textarea" },
      { key: "images", label: "अतिरिक्त इमेज (एक से अधिक)", type: "images" },
    ],
  },
  {
    key: "conduct-rules", title: "आचरण नियम (Do's & Don'ts)", type: "fields", category: "नियम व संपर्क",
    fields: [
      { key: "subtitle", label: "उपशीर्षक" },
      { key: "doList", label: "Do's (हर नियम एक नई पंक्ति में लिखें)", type: "textarea" },
      { key: "dontList", label: "Don'ts (हर नियम एक नई पंक्ति में लिखें)", type: "textarea" },
    ],
  },
  {
    key: "contact", title: "संपर्क (Contact)", type: "fields", category: "नियम व संपर्क",
    fields: [{ key: "address", label: "पता", type: "textarea" }, { key: "phone", label: "फ़ोन" }, { key: "email", label: "ईमेल" }, { key: "mapUrl", label: "मैप लिंक (embed URL)" }],
  },
]
