// ============================================
// MEIN-BEREICH API MOCK DATA & SHAPES
// ============================================

// Expected API Response Shapes
export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  preferences: {
    contactMethod: 'whatsapp' | 'email';
    marketingOptIn: boolean;
  };
}

export interface NextAppointment {
  id: number;
  treatmentName: string;
  dateIso: string; // ISO 8601 format
  time: string;
  note?: string;
  stylistName: string;
  reschedulable: boolean;
}

export interface HistoryEntry {
  id: number;
  treatmentName: string;
  dateIso: string; // ISO 8601 format
  relativeTime: string; // e.g., "vor 2 Monaten"
  note?: string;
}

export interface LoyaltyData {
  stampsTotal: number;
  stampsFilled: number;
  vouchers: Array<{
    id: number;
    title: string;
    expires?: string; // ISO date string
  }>;
}

export interface BookingSuggestionRequest {
  intent: string;
  treatmentId?: number;
  preferredRange?: string;
  contactMethod: string;
  name: string;
  contact: string;
}

export interface BookingSuggestionResponse {
  requestId: string;
}

export interface RescheduleRequest {
  appointmentId: number;
  preferredRange: string;
}

export interface RescheduleResponse {
  success: boolean;
}

export interface AvailabilityRange {
  ranges: string[]; // e.g., ["Diese Woche", "Nächste Woche"]
  sampleSlots?: string[]; // e.g., ["Mo 14:30", "Di 16:00", "Mi 15:30"]
}

// ============================================
// MOCK DATA
// ============================================

export const mockUserProfile: UserProfile = {
  id: 1,
  firstName: 'Anna',
  lastName: 'Müller',
  email: 'anna.mueller@example.com',
  phone: '+49 123 456789',
  avatarUrl: '/images/avatars/anna.jpg',
  preferences: {
    contactMethod: 'whatsapp',
    marketingOptIn: true
  }
};

export const mockNextAppointment: NextAppointment = {
  id: 1,
  treatmentName: 'Wimpernverlängerung Classic',
  dateIso: '2024-01-15T14:30:00Z',
  time: '14:30',
  note: 'Ich freue mich auf deinen zurückkehrenden Glam-Look.',
  stylistName: 'Lisa',
  reschedulable: true
};

export const mockHistory: HistoryEntry[] = [
  {
    id: 1,
    treatmentName: 'Wimpernverlängerung Classic',
    dateIso: '2023-11-15T14:30:00Z',
    relativeTime: 'vor 2 Monaten',
    note: 'Natürlicher Look'
  },
  {
    id: 2,
    treatmentName: 'Hybridtechnik',
    dateIso: '2023-09-20T16:00:00Z',
    relativeTime: 'vor 4 Monaten',
    note: 'Perfekt für den Alltag'
  },
  {
    id: 3,
    treatmentName: 'Volumentechnik',
    dateIso: '2023-07-10T15:30:00Z',
    relativeTime: 'vor 6 Monaten',
    note: 'Glamouröser Event-Look'
  }
];

export const mockLoyaltyData: LoyaltyData = {
  stampsTotal: 10,
  stampsFilled: 7,
  vouchers: [
    {
      id: 1,
      title: '10% Rabatt auf nächste Behandlung',
      expires: '2024-03-31'
    },
    {
      id: 2,
      title: 'Gratis Wimpernlifting',
      expires: '2024-06-30'
    }
  ]
};

export const mockAvailabilityRanges: AvailabilityRange = {
  ranges: ['Diese Woche', 'Nächste Woche'],
  sampleSlots: ['Mo 14:30', 'Di 16:00', 'Mi 15:30']
};

// ============================================
// API ENDPOINT SPECIFICATIONS
// ============================================

/*
Expected Backend Endpoints:

GET /api/me
Response: UserProfile
Description: Get current user profile and preferences

GET /api/me/next-appointment
Response: NextAppointment | null
Description: Get user's next upcoming appointment, null if none

GET /api/me/history
Response: HistoryEntry[]
Description: Get user's appointment history in chronological order

GET /api/me/loyalty
Response: LoyaltyData
Description: Get user's loyalty status and available vouchers

POST /api/me/book-suggestion
Body: BookingSuggestionRequest
Response: BookingSuggestionResponse
Description: Submit a booking suggestion request

POST /api/me/reschedule
Body: RescheduleRequest
Response: RescheduleResponse
Description: Request to reschedule an existing appointment

GET /api/availability/ranges?treatmentId=<id>
Response: AvailabilityRange
Description: Get available time ranges and sample slots for a treatment

PUT /api/me
Body: Partial<UserProfile>
Response: UserProfile
Description: Update user profile information
*/

// ============================================
// TREATMENT DATA
// ============================================

export const treatmentsByIntent = {
  'Natürlich & gepflegt': [
    {
      id: 1,
      name: 'Einzeltechnik',
      description: 'Feiner, natürlicher Aufschlag. Perfekt für Alltag und Pflege.'
    }
  ],
  'Mehr Ausdruck': [
    {
      id: 2,
      name: 'Hybridtechnik',
      description: 'Mehr Dichte mit natürlicher Bewegung.'
    },
    {
      id: 3,
      name: 'Volumentechnik',
      description: 'Glamouröser Look, besonders für Events.'
    }
  ],
  'Frischer Blick ohne Extensions': [
    {
      id: 4,
      name: 'Wimpernlifting',
      description: 'Natürliche Wimpern werden geformt und betont.'
    }
  ],
  'Beratung gewünscht': [
    {
      id: 5,
      name: 'Beratungstermin',
      description: 'Persönliche Beratung für deinen perfekten Look.'
    }
  ]
};

export const intentOptions = [
  'Natürlich & gepflegt',
  'Mehr Ausdruck',
  'Frischer Blick ohne Extensions',
  'Beratung gewünscht'
];

// ============================================
// COPY STRINGS (German)
// ============================================

export const copyStrings = {
  // Header Carousel
  headerHeadline: 'Dein Moment der Schönheit.',
  headerAccentWord: 'Schönheit',
  headerSubline: 'Kleine Ruhe, große Wirkung — wir kümmern uns.',
  headerCta: 'Termin vormerken',

  // Next Moment
  nextMomentTitle: 'Dein nächster Termin',
  noAppointmentPrompt: 'Kein Termin geplant — willst du dir etwas vormerken?',
  detailsAction: 'Details ansehen',
  rescheduleAction: 'Verschieben',
  bookAction: 'Termin vormerken',

  // Intent Selector
  intentPrompt: 'Wie möchtest du dich fühlen?',

  // Availability
  availabilityPrompt: 'Freie Termine sind in den nächsten Tagen verfügbar.',
  rangeLabels: ['Diese Woche', 'Nächste Woche'],

  // Commitment
  commitmentSummary: 'Wir planen einen passenden Termin für deinen Look. Ich melde mich mit Vorschlägen.',
  commitmentAction: 'Vormerken',

  // Acknowledgement
  acknowledgementMessage: 'Danke! Ich melde mich mit passenden Terminvorschlägen.',

  // History
  historyTitle: 'Deine Beauty-Reise',
  rebookAction: 'Noch einmal buchen',

  // Loyalty
  loyaltyTitle: 'Treue',
  loyaltySubtitle: 'Deine Treue wird gesehen — ganz ohne Druck.',
  redeemAction: 'Einlösen',

  // Review
  reviewCta: 'Wenn du zufrieden warst: Bewertung abgeben',
  reviewSubtitle: 'Deine Worte helfen — nur, wenn du magst.',
  reviewAction: 'Auf Google bewerten',

  // Profile
  profileTitle: 'Dein Profil',
  contactLabel: 'So erreichst du mich',
  saveAction: 'Änderungen speichern',

  // Support
  supportMessage: 'Fragen oder Wünsche? Schreib mir gern.',
  supportActions: ['WhatsApp', 'E-Mail']
};