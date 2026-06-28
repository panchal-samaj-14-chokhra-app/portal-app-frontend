export type SectionField = { key: string; label: string; type?: "text" | "textarea" | "image" }
export type SectionDef = {
  key: string
  title: string
  // html = single rich-text body; items = repeatable list of records; fields = single record of fields
  type: "html" | "items" | "fields"
  fields?: SectionField[]
  itemLabel?: string
}

export const MANDIR_SECTIONS: SectionDef[] = [
  { key: "history", title: "इतिहास (History)", type: "html" },
  { key: "about-panchal-samaj", title: "पंचाल समाज (Panchal Samaj)", type: "html" },
  { key: "about-banswara", title: "बांसवाड़ा के बारे में (About Banswara)", type: "html" },
  { key: "about-rajasthan", title: "राजस्थान के बारे में (About Rajasthan)", type: "html" },
  {
    key: "festivals", title: "त्योहार (Festivals)", type: "items", itemLabel: "त्योहार",
    fields: [{ key: "title", label: "शीर्षक" }, { key: "description", label: "विवरण", type: "textarea" }],
  },
  {
    key: "faq", title: "सामान्य प्रश्न (FAQ)", type: "items", itemLabel: "प्रश्न",
    fields: [{ key: "question", label: "प्रश्न" }, { key: "answer", label: "उत्तर", type: "textarea" }],
  },
  {
    key: "trust-mandal", title: "ट्रस्ट मंडल (Trust Mandal)", type: "items", itemLabel: "सदस्य",
    fields: [{ key: "name", label: "नाम" }, { key: "role", label: "पद" }, { key: "phone", label: "फ़ोन" }, { key: "photo", label: "फ़ोटो", type: "image" }],
  },
  {
    key: "gallery", title: "गैलरी (Gallery)", type: "items", itemLabel: "इमेज",
    fields: [{ key: "image", label: "इमेज", type: "image" }, { key: "caption", label: "कैप्शन" }],
  },
  {
    key: "media-handlers", title: "मीडिया हैंडलर (Media Handlers)", type: "items", itemLabel: "हैंडलर",
    fields: [{ key: "name", label: "नाम" }, { key: "role", label: "भूमिका" }, { key: "contact", label: "संपर्क" }],
  },
  {
    key: "press-release", title: "प्रेस विज्ञप्ति (Press Release)", type: "items", itemLabel: "विज्ञप्ति",
    fields: [{ key: "title", label: "शीर्षक" }, { key: "date", label: "दिनांक" }, { key: "summary", label: "सारांश", type: "textarea" }, { key: "link", label: "लिंक" }],
  },
  {
    key: "recent-visits", title: "हाल की विज़िट (Recent Visits)", type: "items", itemLabel: "विज़िट",
    fields: [{ key: "name", label: "नाम" }, { key: "designation", label: "पदनाम" }, { key: "date", label: "दिनांक" }, { key: "photo", label: "फ़ोटो", type: "image" }],
  },
  {
    key: "contact", title: "संपर्क (Contact)", type: "fields",
    fields: [{ key: "address", label: "पता", type: "textarea" }, { key: "phone", label: "फ़ोन" }, { key: "email", label: "ईमेल" }, { key: "mapUrl", label: "मैप लिंक (embed URL)" }],
  },
]
