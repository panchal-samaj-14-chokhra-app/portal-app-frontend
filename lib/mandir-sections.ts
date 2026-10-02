export type SectionField = {
  key: string
  label: string
  type?: "text" | "textarea" | "richtext" | "image" | "pdf" | "video" | "date" | "images" | "select" | "rows"
  // select: dropdown choices
  options?: { value: string; label: string }[]
  // rows: a repeatable list of small records (e.g. label / value / phone).
  // options = dropdown for that cell; suggestions = free text with a list of ready-made choices.
  rowFields?: { key: string; label: string; options?: { value: string; label: string }[]; suggestions?: { value: string; label: string }[] }[]
}

// Pages of the website, offered as ready-made choices when picking a link (any other address can still be typed)
export const SITE_LINK_SUGGESTIONS = [
  { value: "/", label: "होम पेज" },
  { value: "/about", label: "मंदिर परिचय" },
  { value: "/history", label: "इतिहास" },
  { value: "/trust-mandal", label: "ट्रस्ट मंडल" },
  { value: "/contact", label: "संपर्क" },
  { value: "/events", label: "कार्यक्रम" },
  { value: "/festivals", label: "त्योहार" },
  { value: "/about-panchal-samaj", label: "पंचाल समाज" },
  { value: "/temple-images", label: "गैलरी" },
  { value: "/blog", label: "ब्लॉग" },
  { value: "/press-release", label: "प्रेस विज्ञप्ति" },
  { value: "/media-handlers", label: "मीडिया" },
  { value: "/faq", label: "सामान्य प्रश्न" },
  { value: "/estore", label: "ई-स्टोर" },
  { value: "/donation", label: "दान" },
  { value: "/shringar", label: "श्रृंगार बुकिंग" },
  { value: "/vip-visitors-all", label: "विशिष्ट अतिथि" },
  { value: "/about-banswara", label: "बांसवाड़ा" },
  { value: "/about-rajasthan", label: "राजस्थान" },
  { value: "/#darshan-live", label: "होम: लाइव दर्शन" },
  { value: "/#temple-timings", label: "होम: मंदिर समय" },
  { value: "/#contact", label: "होम: संपर्क फ़ॉर्म" },
]

export const PLATFORM_OPTIONS = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "whatsapp", label: "WhatsApp (चैनल / समुदाय)" },
  { value: "twitter", label: "X (Twitter)" },
  { value: "telegram", label: "Telegram" },
  { value: "website", label: "वेबसाइट / अन्य" },
]
export type SectionDef = {
  key: string
  title: string
  // html = single rich-text body; items = repeatable list of records; fields = single record of fields
  type: "html" | "items" | "fields"
  fields?: SectionField[]
  itemLabel?: string
  category: string
  // shown (and saved) the first time, so the editor starts from what the website currently displays
  defaults?: Record<string, any>
}

export const SECTION_CATEGORIES = [
  "सामान्य जानकारी",
  "लाइव व समय",
  "सूचियाँ",
  "नियम व संपर्क",
  "ई-स्टोर व दान",
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
  {
    key: "hero-video", title: "होम पेज बैकग्राउंड वीडियो (Home Background Video)", type: "fields", category: "सामान्य जानकारी",
    fields: [
      { key: "video", label: "बैकग्राउंड वीडियो — होम पेज के ऊपरी हिस्से में बिना आवाज़ के चलेगा (MP4, 10–30 सेकंड, अधिकतम 15MB)", type: "video" },
    ],
  },
  {
    key: "footer", title: "फ़ुटर (Footer)", type: "fields", category: "सामान्य जानकारी",
    fields: [
      { key: "greeting", label: "ऊपर की पंक्ति (जैसे: ॥ जय श्री माँ त्रिपुरा सुंदरी ॥)" },
      { key: "quickLinksTitle", label: "लिंक वाले हिस्से का शीर्षक" },
      { key: "quickLinks", label: "Quick Links — नाम और लिंक (सूची से पेज चुनें या कोई भी लिंक लिखें)", type: "rows", rowFields: [{ key: "label", label: "नाम" }, { key: "url", label: "लिंक (/page, #हिस्सा या https://…)", suggestions: SITE_LINK_SUGGESTIONS }] },
      { key: "trustTitle", label: "ट्रस्ट मंडल का शीर्षक" },
      { key: "trustMembers", label: "ट्रस्ट मंडल — पद और नाम", type: "rows", rowFields: [{ key: "role", label: "पद (जैसे: अध्यक्ष)" }, { key: "name", label: "नाम" }] },
      { key: "followTitle", label: "सोशल मीडिया का शीर्षक" },
      { key: "social", label: "सोशल मीडिया (खाली छोड़ने पर 'मीडिया लिंक' वाले लिंक ही दिखेंगे)", type: "rows", rowFields: [{ key: "platform", label: "प्लेटफ़ॉर्म", options: PLATFORM_OPTIONS }, { key: "label", label: "नाम" }, { key: "url", label: "लिंक (https://…)" }] },
      { key: "contactTitle", label: "पता व संपर्क का शीर्षक" },
      { key: "placeName", label: "स्थान का नाम" },
      { key: "addressLine1", label: "पता — पंक्ति 1" },
      { key: "addressLine2", label: "पता — पंक्ति 2" },
      { key: "phone", label: "फ़ोन नंबर (जैसे: +91 8696851900)" },
      { key: "email", label: "ईमेल" },
      { key: "mapUrl", label: "Google Maps लिंक" },
      { key: "mapLabel", label: "मैप बटन का नाम" },
      { key: "copyright", label: "कॉपीराइट पंक्ति (साल अपने-आप आगे जुड़ता है)" },
      { key: "closing", label: "अंतिम पंक्ति (जैसे: माँ त्रिपुरा सुंदरी की जय)" },
    ],
    defaults: {
      greeting: "॥ जय श्री माँ त्रिपुरा सुंदरी ॥",
      quickLinksTitle: "Quick Links",
      quickLinks: [
        { label: "About Mandir", url: "/about" },
        { label: "Live Darshan", url: "/#darshan-live" },
        { label: "Online Pujas", url: "/#online-pujas" },
        { label: "Donations", url: "/donation" },
        { label: "E-Store", url: "/estore" },
        { label: "Events", url: "/events" },
        { label: "VIP Visitors", url: "/vip-visitors-all" },
        { label: "Contact", url: "/#contact" },
      ],
      trustTitle: "Trust Mandal",
      trustMembers: [
        { role: "अध्यक्ष", name: "श्रीमान धूलजी भाई पंचाल" },
        { role: "महामंत्री", name: "श्रीमान नटवरलालजी पंचाल" },
      ],
      followTitle: "Follow us",
      social: [],
      contactTitle: "Location & Contact",
      placeName: "Maa Tripura Sundari Temple",
      addressLine1: "Near Umrai Village, Banswara",
      addressLine2: "Rajasthan – 327001",
      phone: "+91 8696851900",
      email: "shreetripurasundarimandir@gmail.com",
      mapUrl: "https://www.google.com/maps/place/Maa+Tripura+Sundri+Temple/@23.5323482,74.321633,727m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3966da0646045a3d:0xe998c21391584afc!8m2!3d23.5323482!4d74.321633!16s%2Fg%2F1tfj1l4c?entry=ttu&g_ep=EgoyMDI2MDMxOC4xIKXMDSoASAFQAw%3D%3D",
      mapLabel: "View on Google Maps",
      copyright: "Shree Tripura Sundari Mandir & Panchal Samaj. All rights reserved.",
      closing: "माँ त्रिपुरा सुंदरी की जय",
    },
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
    key: "events", title: "कार्यक्रम (Events)", type: "items", itemLabel: "कार्यक्रम", category: "सूचियाँ",
    fields: [
      { key: "name", label: "कार्यक्रम का नाम" },
      { key: "date", label: "दिनांक", type: "date" },
      { key: "venue", label: "स्थान (Venue)" },
      { key: "contact", label: "संपर्क (नाम / फ़ोन नंबर)" },
      { key: "description", label: "विवरण", type: "textarea" },
      { key: "images", label: "इमेज (एक से अधिक — पहली इमेज कवर बनेगी)", type: "images" },
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
    key: "media-handlers", title: "मीडिया लिंक (Media / Social Links)", type: "items", itemLabel: "लिंक", category: "सूचियाँ",
    fields: [
      { key: "label", label: "नाम (जैसे: Facebook, YouTube चैनल)" },
      { key: "platform", label: "प्लेटफ़ॉर्म", type: "select", options: PLATFORM_OPTIONS },
      { key: "url", label: "लिंक (URL)" },
    ],
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
    key: "contact", title: "संपर्क कार्ड (Contact Cards)", type: "items", itemLabel: "कार्ड", category: "नियम व संपर्क",
    fields: [
      { key: "title", label: "कार्ड का शीर्षक (जैसे: मंदिर ट्रस्ट मण्डल)" },
      {
        key: "rows", label: "विवरण पंक्तियाँ", type: "rows",
        rowFields: [
          { key: "label", label: "नाम (जैसे: अध्यक्ष)" },
          { key: "value", label: "जानकारी (जैसे: श्री ... पंचाल)" },
          { key: "phone", label: "फ़ोन (वैकल्पिक)" },
        ],
      },
    ],
  },
  {
    key: "estore", title: "ई-स्टोर उत्पाद (E-Store Products)", type: "items", itemLabel: "उत्पाद", category: "ई-स्टोर व दान",
    fields: [
      { key: "name", label: "उत्पाद का नाम" },
      { key: "price", label: "मूल्य (जैसे: ₹251)" },
      { key: "availability", label: "उपलब्धता", type: "select", options: [{ value: "available", label: "उपलब्ध" }, { value: "out", label: "स्टॉक में नहीं" }] },
      { key: "description", label: "विवरण", type: "textarea" },
      { key: "image", label: "उत्पाद की इमेज", type: "image" },
    ],
  },
  {
    key: "estore-contact", title: "ई-स्टोर संपर्क विवरण (E-Store Contact)", type: "fields", category: "ई-स्टोर व दान",
    fields: [
      { key: "intro", label: "परिचय / ऑर्डर कैसे करें", type: "textarea" },
      {
        key: "contacts", label: "संपर्क व्यक्ति", type: "rows",
        rowFields: [
          { key: "label", label: "पद / नाम (जैसे: प्रभारी)" },
          { key: "value", label: "जानकारी (जैसे: श्री ... पंचाल)" },
          { key: "phone", label: "फ़ोन" },
        ],
      },
      { key: "whatsapp", label: "ऑर्डर के लिए WhatsApp नंबर (जैसे: 9876543210)" },
      { key: "email", label: "ईमेल" },
      { key: "address", label: "पता / पिकअप स्थान", type: "textarea" },
      { key: "timings", label: "समय (जैसे: सुबह 9 – शाम 7)" },
    ],
  },
  {
    key: "donation", title: "दान खाता विवरण (Donation Accounts)", type: "items", itemLabel: "खाता", category: "ई-स्टोर व दान",
    fields: [
      { key: "title", label: "खाते का शीर्षक (जैसे: सामान्य दान / गौशाला)" },
      { key: "accountName", label: "खाताधारक का नाम (Account Name)" },
      { key: "bankName", label: "बैंक का नाम" },
      { key: "accountNumber", label: "खाता संख्या (Account Number)" },
      { key: "ifsc", label: "IFSC कोड" },
      { key: "branch", label: "शाखा (Branch)" },
      { key: "upiId", label: "UPI ID (जैसे: mandir@sbi)" },
      { key: "qrImage", label: "UPI / भुगतान QR कोड इमेज", type: "image" },
    ],
  },
  {
    key: "donation-contact", title: "दान संपर्क विवरण (Donation Contact)", type: "fields", category: "ई-स्टोर व दान",
    fields: [
      { key: "intro", label: "अपील / परिचय संदेश", type: "textarea" },
      {
        key: "contacts", label: "संपर्क व्यक्ति", type: "rows",
        rowFields: [
          { key: "label", label: "पद (जैसे: अध्यक्ष)" },
          { key: "value", label: "नाम" },
          { key: "phone", label: "फ़ोन" },
        ],
      },
      { key: "note", label: "विशेष सूचना (जैसे: दान के बाद रसीद अवश्य लें)", type: "textarea" },
    ],
  },
]
