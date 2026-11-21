import React, { createContext, useContext, useState, ReactNode } from 'react';

export type SupportedLanguage = 'en' | 'ta' | 'hi';

export interface Translations {
  // Brand
  brandName: string;
  brandCity: string;
  topBanner: string;
  demoMode: string;

  // Nav
  navReport: string;
  navTrack: string;
  navDashboard: string;
  navMap: string;
  navProof: string;
  navPulse: string;
  navOfficer: string;
  navAdmin: string;
  navTrackComplaintBtn: string;
  highContrast: string;

  // Auth Page / Image 4
  authTabCitizen: string;
  authTabAdmin: string;
  authTitleCreate: string;
  authTitleLogin: string;
  authSubtitle: string;
  authFullName: string;
  authFullNamePlaceholder: string;
  authEmail: string;
  authEmailPlaceholder: string;
  authPassword: string;
  authPasswordPlaceholder: string;
  authMobile: string;
  authZone: string;
  authCreateBtn: string;
  authLoginBtn: string;
  authAlreadyRegistered: string;
  authDontHaveAccount: string;
  pillGisMap: string;
  pillAiPipeline: string;
  pillDashboard: string;

  // Report Form
  reportTitle: string;
  reportSubtitle: string;
  trySampleReport: string;
  samplePothole: string;
  sampleGarbage: string;
  sampleWire: string;
  samplePipe: string;
  sampleLights: string;
  descLabel: string;
  descPlaceholder: string;
  titleLabel: string;
  titlePlaceholder: string;
  categoryLabel: string;
  categoryAuto: string;
  locationLabel: string;
  locationPlaceholder: string;
  gpsButton: string;
  photoLabel: string;
  photoHelp: string;
  nameLabel: string;
  namePlaceholder: string;
  submitButton: string;
  submittingText: string;

  // Success Card
  successTitle: string;
  ticketLabel: string;
  triagedBadge: string;
  detectedCategory: string;
  priorityAssessment: string;
  assignedDepartment: string;
  resolutionSla: string;
  whyPriorityScore: string;
  trackThisIssue: string;
  reportAnotherIssue: string;

  // CivicProof
  proofTitle: string;
  proofSubtitle: string;
  beforeRepair: string;
  afterRepair: string;
  voteResolved: string;
  votePartial: string;
  voteStillExists: string;
  officerNotesLabel: string;
  aiVerificationLabel: string;
  verifyRate: string;
  auditWindow: string;

  // Administrator (Distinct Command & Control Center)
  adminTitle: string;
  adminSubtitle: string;
  adminBadge: string;
  exportCsvBtn: string;
  totalGrievances: string;
  inProgressCount: string;
  resolvedCount: string;
  criticalUrgency: string;
  resolutionRate: string;
  reassignDept: string;
  auditLog: string;
  wardDistribution: string;

  // Track Complaint
  trackTitle: string;
  trackSubtitle: string;
  trackInputPlaceholder: string;
  trackSearchBtn: string;
  currentStatus: string;
  assignedSquad: string;
  targetSla: string;

  // Chatbot
  chatTitle: string;
  chatSubtitle: string;
  chatPlaceholder: string;
  chatSend: string;
  chatReset: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, Translations> = {
  en: {
    brandName: "CivicResolver",
    brandCity: "Coimbatore",
    topBanner: "• Municipal Grievance and Civic Intelligence Platform • Coimbatore",
    demoMode: "Coimbatore Municipal Corporation • 100 Wards Live System",

    navReport: "Report Issue",
    navTrack: "Track Issue",
    navDashboard: "Public Dashboard",
    navMap: "Live GIS Map",
    navProof: "CivicProof",
    navPulse: "CivicPulse",
    navOfficer: "Officer Portal",
    navAdmin: "Administrator",
    navTrackComplaintBtn: "Track complaint",
    highContrast: "High Contrast",

    authTabCitizen: "Citizen",
    authTabAdmin: "Admin",
    authTitleCreate: "Create your citizen account",
    authTitleLogin: "Sign in to CivicResolver",
    authSubtitle: "Report civic issues, track progress and see them resolved.",
    authFullName: "Full name",
    authFullNamePlaceholder: "Alex Mercer",
    authEmail: "Email address",
    authEmailPlaceholder: "alex@example.com",
    authPassword: "Password",
    authPasswordPlaceholder: "At least 6 characters",
    authMobile: "Mobile number",
    authZone: "Zone",
    authCreateBtn: "Create account",
    authLoginBtn: "Sign in",
    authAlreadyRegistered: "Already registered? Sign in",
    authDontHaveAccount: "Don't have an account? Sign up",
    pillGisMap: "GIS map",
    pillAiPipeline: "AI pipeline",
    pillDashboard: "Dashboard",

    reportTitle: "Report a Civic Grievance",
    reportSubtitle: "Submit municipal issues with instant priority scoring and department routing.",
    trySampleReport: "Try a Sample Report:",
    samplePothole: "Pothole near School",
    sampleGarbage: "Overflowing Garbage",
    sampleWire: "Exposed Live Wire",
    samplePipe: "Water Pipe Burst",
    sampleLights: "Broken Streetlights",
    descLabel: "Description (Required - any language) *",
    descPlaceholder: "Describe the civic issue in detail. You can use English, Tamil, Hindi, or any language...",
    titleLabel: "Issue Title (Optional)",
    titlePlaceholder: "Brief headline, or leave blank for automatic suggestion",
    categoryLabel: "Category (Optional)",
    categoryAuto: "Auto-detect category",
    locationLabel: "Location / Landmark",
    locationPlaceholder: "e.g. DB Road, opposite Govt Girls High School",
    gpsButton: "GPS",
    photoLabel: "Attach Photo (Optional, auto-resized <= 300KB)",
    photoHelp: "Client-side resized to max 800px JPEG <= 300KB",
    nameLabel: "Your Name (Optional)",
    namePlaceholder: "e.g. Anand Kumar",
    submitButton: "Submit Grievance",
    submittingText: "Analyzing & Submitting...",

    successTitle: "Grievance Lodged Successfully!",
    ticketLabel: "Ticket ID:",
    triagedBadge: "Municipal Triage Verified",
    detectedCategory: "DETECTED CATEGORY:",
    priorityAssessment: "PRIORITY ASSESSMENT:",
    assignedDepartment: "ASSIGNED DEPARTMENT:",
    resolutionSla: "RESOLUTION SLA:",
    whyPriorityScore: "Priority Score Analysis:",
    trackThisIssue: "Track This Issue",
    reportAnotherIssue: "Report Another Issue",

    proofTitle: "CivicProof: Community Audit",
    proofSubtitle: "Audit on-site repair photographic evidence before final administrative sign-off.",
    beforeRepair: "Before Repair",
    afterRepair: "Field Rectification (After)",
    voteResolved: "Resolved",
    votePartial: "Partially",
    voteStillExists: "Still Exists",
    officerNotesLabel: "Official Rectification Summary:",
    aiVerificationLabel: "AI Vision Verification Assessment:",
    verifyRate: "Verify Rate",
    auditWindow: "Audit Window",

    adminTitle: "Municipal Command & Control Center",
    adminSubtitle: "Executive oversight, squad dispatch, and resolution audit across Coimbatore.",
    adminBadge: "Administrative Authority",
    exportCsvBtn: "Export Non-PII Audit CSV",
    totalGrievances: "Total Grievances",
    inProgressCount: "In Progress",
    resolvedCount: "Resolved",
    criticalUrgency: "Critical Urgency",
    resolutionRate: "Resolution Rate",
    reassignDept: "Reassign Department",
    auditLog: "Audit Logs",
    wardDistribution: "Ward Distribution",

    trackTitle: "Track Civic Grievance",
    trackSubtitle: "Inspect live municipal progress, assigned engineering crews, and verification status.",
    trackInputPlaceholder: "Enter ticket number (e.g. #80019, #80001)",
    trackSearchBtn: "Track",
    currentStatus: "Current Status",
    assignedSquad: "Assigned Squad",
    targetSla: "Target SLA",

    chatTitle: "Civic AI Assistant",
    chatSubtitle: "Coimbatore Municipal Intelligence",
    chatPlaceholder: "Ask question (no emojis)...",
    chatSend: "Send",
    chatReset: "Reset"
  },

  ta: {
    brandName: "CivicResolver",
    brandCity: "கோயம்புத்தூர்",
    topBanner: "• நகராட்சி குறைதீர்ப்பு மற்றும் பொது நுண்ணறிவு தளம் • கோயம்புத்தூர்",
    demoMode: "கோயம்புத்தூர் மாநகராட்சி • 100 வார்டுகள் நேரலை அமைப்பு",

    navReport: "குறை பதிவு",
    navTrack: "நிலை கண்காணிப்பு",
    navDashboard: "பொது டாஷ்போர்டு",
    navMap: "நேரலை வரைபடம்",
    navProof: "பணிச் சான்று",
    navPulse: "முன்னறிவிப்பு ரேடார்",
    navOfficer: "அதிகாரி போர்ட்டல்",
    navAdmin: "நிர்வாகி",
    navTrackComplaintBtn: "குறை கண்காணிக்க",
    highContrast: "உயர் மாறுபாடு",

    authTabCitizen: "குடிமகன்",
    authTabAdmin: "நிர்வாகி",
    authTitleCreate: "குடிமக்கள் கணக்கை உருவாக்கவும்",
    authTitleLogin: "CivicResolver உள்நுழையவும்",
    authSubtitle: "குறைகளைப் பதிவு செய்து, முன்னேற்றத்தைக் கண்காணித்துத் தீர்வு காணுங்கள்.",
    authFullName: "முழு பெயர்",
    authFullNamePlaceholder: "அலெக்ஸ் மெர்சர்",
    authEmail: "மின்னஞ்சல் முகவரி",
    authEmailPlaceholder: "alex@example.com",
    authPassword: "கடவுச்சொல்",
    authPasswordPlaceholder: "குறைந்தது 6 எழுத்துக்கள்",
    authMobile: "மொபைல் எண்",
    authZone: "மண்டலம்",
    authCreateBtn: "கணக்கை உருவாக்கு",
    authLoginBtn: "உள்நுழைய",
    authAlreadyRegistered: "ஏற்கனவே கணக்கு உள்ளதா? உள்நுழைக",
    authDontHaveAccount: "கணக்கு இல்லையா? பதிவு செய்க",
    pillGisMap: "ஜிஐஎஸ் வரைபடம்",
    pillAiPipeline: "ஏஐ பைப்லைன்",
    pillDashboard: "டாஷ்போர்டு",

    reportTitle: "நகராட்சி குறை பதிவு செய்யவும்",
    reportSubtitle: "உடனடி முன்னுரிமை மதிப்பீட்டுடன் புகார்களை மாநகராட்சிக்கு அனுப்பவும்.",
    trySampleReport: "மாதிரி புகாரை முயற்சிக்கவும்:",
    samplePothole: "பள்ளி அருகே குழி",
    sampleGarbage: "குப்பை நிரம்பி வழிகிறது",
    sampleWire: "மின் கம்பி அறுந்து விழுந்துள்ளது",
    samplePipe: "குடிநீர் குழாய் உடைப்பு",
    sampleLights: "எரியாத தெருவிளக்குகள்",
    descLabel: "விளக்கம் (கட்டாயம்) *",
    descPlaceholder: "புகாரை விரிவாக விவரிக்கவும். தமிழ், ஆங்கிலம் அல்லது எந்த மொழியிலும் எழுதலாம்...",
    titleLabel: "தலைப்பு (விருப்பத்திற்குரியது)",
    titlePlaceholder: "சுருக்கமான தலைப்பு",
    categoryLabel: "வகை (விருப்பத்திற்குரியது)",
    categoryAuto: "தானாக வகைப்படுத்தவும்",
    locationLabel: "இடம் / மைல்கல்",
    locationPlaceholder: "எ.கா. டி.பி. சாலை, ஆர்.எஸ்.புரம், கோயம்புத்தூர்",
    gpsButton: "ஜிபிஎஸ்",
    photoLabel: "புகைப்படம் இணைக்கவும் (<= 300KB)",
    photoHelp: "தானாக சுருக்கப்பட்ட புகைப்படம்",
    nameLabel: "உங்கள் பெயர் (விருப்பத்திற்குரியது)",
    namePlaceholder: "எ.கா. ஆனந்த் குமார்",
    submitButton: "புகார் சமர்ப்பிக்க",
    submittingText: "பதிவு செய்யப்படுகிறது...",

    successTitle: "புகார் வெற்றிகரமாக பதிவு செய்யப்பட்டது!",
    ticketLabel: "டிக்கெட் எண்:",
    triagedBadge: "தானியங்கி மதிப்பீடு",
    detectedCategory: "கண்டறியப்பட்ட வகை:",
    priorityAssessment: "முன்னுரிமை மதிப்பீடு:",
    assignedDepartment: "ஒதுக்கப்பட்ட துறை:",
    resolutionSla: "தீர்வு காலக்கெடு:",
    whyPriorityScore: "முன்னுரிமை பகுப்பாய்வு:",
    trackThisIssue: "இந்த புகாரைக் கண்காணிக்க",
    reportAnotherIssue: "மற்றொரு புகார் பதிவு செய்க",

    proofTitle: "பணிச் சான்று: பொதுமக்கள் தணிக்கை",
    proofSubtitle: "அதிகாரப்பூர்வ முடிவுக்கு முன் பொதுமக்கள் சீரமைப்பு புகைப்படங்களை சரிபார்க்கவும்.",
    beforeRepair: "பழுதுபார்க்கும் முன்",
    afterRepair: "பழுதுபார்க்கப்பட்ட பின் (முடிவு)",
    voteResolved: "சரிசெய்யப்பட்டது",
    votePartial: "பகுதி தீர்வு",
    voteStillExists: "இன்னும் உள்ளது",
    officerNotesLabel: "அதிகாரப்பூர்வ பழுதுபார்ப்பு சுருக்கம்:",
    aiVerificationLabel: "AI புகைப்பட சரிபார்ப்பு அறிக்கை:",
    verifyRate: "சரிபார்ப்பு விகிதம்",
    auditWindow: "தணிக்கை காலம்",

    adminTitle: "நகராட்சி முதன்மை கட்டுப்பாட்டு மையம்",
    adminSubtitle: "கோயம்புத்தூரின் 100 வார்டுகளின் நேரலை நிர்வாக மேற்பார்வை.",
    adminBadge: "நிர்வாக அதிகாரம்",
    exportCsvBtn: "சிஎஸ்வி அறிக்கையை பதிவிறக்கு",
    totalGrievances: "மொத்த புகார்கள்",
    inProgressCount: "நடவடிக்கையில் உள்ளவை",
    resolvedCount: "தீர்க்கப்பட்டவை",
    criticalUrgency: "அவசர முன்னுரிமை",
    resolutionRate: "தீர்வு விகிதம்",
    reassignDept: "துறையை மாற்றியமைக்க",
    auditLog: "தணிக்கை பதிவுகள்",
    wardDistribution: "வார்டு விநியோகம்",

    trackTitle: "குறையின் நிலையை கண்காணிக்கவும்",
    trackSubtitle: "நேரலை தீர்வு முன்னேற்றம் மற்றும் களப் பொறியாளர்களை கண்காணிக்கவும்.",
    trackInputPlaceholder: "டிக்கெட் எண்ணை உள்ளிடவும் (எ.கா. #80019, #80001)",
    trackSearchBtn: "கண்காணி",
    currentStatus: "தற்போதைய நிலை",
    assignedSquad: "ஒதுக்கப்பட்ட குழு",
    targetSla: "காலக்கெடு",

    chatTitle: "உதவி அரட்டை (AI)",
    chatSubtitle: "கோயம்புத்தூர் நகராட்சி பொது நுண்ணறிவு",
    chatPlaceholder: "கேள்வி கேட்கவும்...",
    chatSend: "அனுப்பு",
    chatReset: "மீட்டமை"
  },

  hi: {
    brandName: "CivicResolver",
    brandCity: "कोयंबटूर",
    topBanner: "• नगर शिकायत एवं नागरिक बुद्धिमत्ता मंच • कोयंबटूर",
    demoMode: "कोयंबटूर नगर निगम • 100 वार्ड लाइव प्रणाली",

    navReport: "शिकायत दर्ज करें",
    navTrack: "स्थिति ट्रैक करें",
    navDashboard: "सार्वजनिक डैशबोर्ड",
    navMap: "लाइव जीआईएस मैप",
    navProof: "कार्य प्रमाण",
    navPulse: "पूर्वानुमान रडार",
    navOfficer: "अधिकारी पोर्टल",
    navAdmin: "प्रशासक",
    navTrackComplaintBtn: "शिकायत ट्रैक करें",
    highContrast: "उच्च कंट्रास्ट",

    authTabCitizen: "नागरिक",
    authTabAdmin: "प्रशासक",
    authTitleCreate: "नागरिक खाता बनाएं",
    authTitleLogin: "CivicResolver में साइन इन करें",
    authSubtitle: "समस्याएं दर्ज करें, प्रगति ट्रैक करें और समाधान पाएं।",
    authFullName: "पूरा नाम",
    authFullNamePlaceholder: "एलेक्स मर्सर",
    authEmail: "ईमेल पता",
    authEmailPlaceholder: "alex@example.com",
    authPassword: "पासवर्ड",
    authPasswordPlaceholder: "कम से कम 6 अक्षर",
    authMobile: "मोबाइल नंबर",
    authZone: "जोन",
    authCreateBtn: "खाता बनाएं",
    authLoginBtn: "साइन इन",
    authAlreadyRegistered: "पहले से पंजीकृत हैं? साइन इन करें",
    authDontHaveAccount: "खाता नहीं है? साइन अप करें",
    pillGisMap: "जीआईएस मैप",
    pillAiPipeline: "एआई पाइपलाइन",
    pillDashboard: "डैशबोर्ड",

    reportTitle: "नागरिक शिकायत दर्ज करें",
    reportSubtitle: "त्वरित प्राथमिकता अंक और विभागीय आवंटन के साथ शिकायत दर्ज करें।",
    trySampleReport: "नमूना रिपोर्ट आज़माएं:",
    samplePothole: "स्कूल के पास गड्ढा",
    sampleGarbage: "कचरे का ढेर",
    sampleWire: "खुला बिजली का तार",
    samplePipe: "पानी का पाइप फटा",
    sampleLights: "खराब स्ट्रीट लाइट",
    descLabel: "विवरण (आवश्यक) *",
    descPlaceholder: "समस्या का विस्तार से वर्णन करें। हिंदी, तमिल या अंग्रेजी में लिख सकते हैं...",
    titleLabel: "शीर्षक (वैकल्पिक)",
    titlePlaceholder: "संक्षिप्त शीर्षक",
    categoryLabel: "श्रेणी (वैकल्पिक)",
    categoryAuto: "स्वतः श्रेणी चुनें",
    locationLabel: "स्थान / लैंडमार्क",
    locationPlaceholder: "उदा. डीबी रोड, आरएस पुरम, कोयंबटूर",
    gpsButton: "जीपीएस",
    photoLabel: "फोटो संलग्न करें (<= 300KB)",
    photoHelp: "आकार स्वतः संकुचित होगा",
    nameLabel: "आपका नाम (वैकल्पिक)",
    namePlaceholder: "उदा. आनंद कुमार",
    submitButton: "शिकायत दर्ज करें",
    submittingText: "दर्ज हो रहा है...",

    successTitle: "शिकायत सफलतापूर्वक दर्ज की गई!",
    ticketLabel: "टिकट संख्या:",
    triagedBadge: "स्वचालित मूल्यांकित",
    detectedCategory: "पहचानी गई श्रेणी:",
    priorityAssessment: "प्राथमिकता मूल्यांकन:",
    assignedDepartment: "आवंटित विभाग:",
    resolutionSla: "समाधान समय सीमा:",
    whyPriorityScore: "प्राथमिकता अंक विश्लेषण:",
    trackThisIssue: "इसे ट्रैक करें",
    reportAnotherIssue: "दूसरी शिकायत दर्ज करें",

    proofTitle: "कार्य प्रमाण: नागरिक ऑडिट",
    proofSubtitle: "अंतिम प्रशासनिक अनुमोदन से पहले फील्ड मरम्मत साक्ष्यों का सत्यापन करें।",
    beforeRepair: "मरम्मत से पहले",
    afterRepair: "मरम्मत के बाद",
    voteResolved: "हल हुआ",
    votePartial: "आंशिक हल",
    voteStillExists: "अभी भी मौजूद है",
    officerNotesLabel: "आधिकारिक मरम्मत सारांश:",
    aiVerificationLabel: "एआई फोटो सत्यापन रिपोर्ट:",
    verifyRate: "सत्यापन दर",
    auditWindow: "ऑडिट खिड़की",

    adminTitle: "नगर पालिका कमांड एवं नियंत्रण केंद्र",
    adminSubtitle: "कोयंबटूर के सभी 100 वार्डों का प्रशासनिक नियंत्रण।",
    adminBadge: "प्रशासनिक अधिकार",
    exportCsvBtn: "सीएसवी रिपोर्ट डाउनलोड करें",
    totalGrievances: "कुल शिकायतें",
    inProgressCount: "प्रगति में",
    resolvedCount: "समाधान हुआ",
    criticalUrgency: "अति आवश्यक",
    resolutionRate: "समाधान दर",
    reassignDept: "विभाग पुनरावंटित करें",
    auditLog: "ऑडिट लॉग",
    wardDistribution: "वार्ड वितरण",

    trackTitle: "शिकायत की स्थिति ट्रैक करें",
    trackSubtitle: "लाइव समाधान प्रगति और फील्ड इंजीनियरों की जांच करें।",
    trackInputPlaceholder: "टिकट संख्या दर्ज करें (उदा. #80019, #80001)",
    trackSearchBtn: "ट्रैक करें",
    currentStatus: "वर्तमान स्थिति",
    assignedSquad: "आवंटित दस्ता",
    targetSla: "लक्षित समय",

    chatTitle: "नागरिक एआई सहायक",
    chatSubtitle: "कोयंबटूर नगर निगम",
    chatPlaceholder: "सवाल पूछें...",
    chatSend: "भेजें",
    chatReset: "रीसेट"
  }
};

interface LanguageContextProps {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextProps>({
  language: 'en',
  setLanguage: () => {},
  t: TRANSLATIONS.en
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return React.createElement(
    LanguageContext.Provider,
    { value: { language, setLanguage, t } },
    children
  );
};

export const useTranslation = () => useContext(LanguageContext);

