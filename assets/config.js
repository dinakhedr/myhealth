// ============================================================
// CONFIG.JS — Health Tracker constants (fixed theme)
// ============================================================

// Google OAuth Client ID
const CLIENT_ID = '152235789997-ma74t430sqgsim9hn8sqhc6gskvddv0a.apps.googleusercontent.com';

// Drive folder and spreadsheet names
const FOLDER_NAME      = 'Health Tracker';
const SPREADSHEET_NAME = 'My Health Log';

// Sheet (tab) names – new structure
const PRODUCTS_SHEET      = 'Products';            // Master product list
const ROUTINE_SHEET       = 'Routine';             // Assignments (ProductID + Phase + Step)
const ROUTINE_LOG_SHEET   = 'Routine Log';         // Logs of completed steps
const SUPPLEMENTS_SHEET   = 'Supplements';         // Master supplement list
const SUPPLEMENT_ROUTINE_SHEET = 'Supplement Routine'; // Assignments (SupplementID + TimeSlot + Frequency + Notes)
const SUPPLEMENTS_LOG_SHEET = 'Supplements Log';   // Logs of taken supplements

// Google API scopes
const SCOPES = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets';

// Discovery docs
const DISCOVERY_DOCS = [
  'https://sheets.googleapis.com/$discovery/rest?version=v4',
  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
];

// Brands for skincare products
const BRANDS = [
  { id: 'alejon', name: 'Alejon', logo: 'Alejon.png' },
  { id: 'beesline', name: 'Beesline', logo: 'Beesline.png' },
  { id: 'bioderma', name: 'Bioderma', logo: 'Bioderma.png' },
  { id: 'laroche', name: 'LaRoche Posay', logo: 'LaRoche.png' },
  { id: 'loreal', name: 'L\'Oréal', logo: 'Loreal.png' },
  { id: 'melatime', name: 'Melatime', logo: 'Melatime.png' },
  { id: 'sophia', name: 'Sophia', logo: 'Sophia.png' },
  { id: 'vichy', name: 'Vichy', logo: 'Vichy.png' }
];

// Use for options
const USE_FOR_OPTIONS = [
  'Cleansing',
  'Clogged pores',
  'Acne / pimples',
  'Dry skin',
  'Oily skin',
  'Wrinkles / aging',
  'Dark spots',
  'Redness / sensitivity',
  'Sun protection'
];

// Use for options for supplements (health concerns)
const USE_FOR_OPTIONS_SUPP = [
  'Acid reflux / heartburn',
  'Bone health',
  'Cough / bronchial congestion',
  'Energy & metabolism',
  'Fatigue / low energy',
  'Hair & Nair Growth',
  'Heart health / cholesterol balance',
  'Immune support',
  'Iron deficiency / anemia',
  'Joint health',
  'Nerve function & neuropathy',
  'Pregnancy support / fetal development',
  'Skin health (acne, wound healing)'
];

// Prefix for Product IDs (e.g., PROD-7f3a9c)
const PRODUCT_ID_PREFIX = 'PROD-';

function generateProductId() {
  return PRODUCT_ID_PREFIX + Math.random().toString(36).substring(2, 10);
}

// Prefix for Assignment IDs
const ASSIGNMENT_ID_PREFIX = 'ASG-';

function generateAssignmentId() {
  return ASSIGNMENT_ID_PREFIX + Math.random().toString(36).substring(2, 10);
}

// Prefix for Supplement IDs
const SUPPLEMENT_ID_PREFIX = 'SUP-';

function generateSupplementId() {
  return SUPPLEMENT_ID_PREFIX + Math.random().toString(36).substring(2, 10);
}

// Prefix for Supplement Assignment IDs
const SUPP_ASSIGNMENT_ID_PREFIX = 'SUPASG-';

function generateSupplementAssignmentId() {
  return SUPP_ASSIGNMENT_ID_PREFIX + Math.random().toString(36).substring(2, 10);
}
