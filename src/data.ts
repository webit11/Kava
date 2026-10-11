import { KavaEvent, KavaContribution, KavaGuest, Testimonial, GlobalTestimonialStats, FAQItem, UnansweredSearchTerm } from './types';

export const INITIAL_EVENTS: KavaEvent[] = [
  {
    id: 'evt-1',
    name: "Sofia & Leo's Wedding",
    type: 'Wedding',
    date: '2026-06-20',
    location: 'The Glasshouse, Big Sur',
    code: 'SOFIA-LEO',
    coverUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    guestCount: 84,
    status: 'active',
    settings: {
      guestUploadAllowed: true,
      instantReveal: true,
      allowedTypes: ['photo', 'video', 'voice', 'wish'],
      requireApproval: false,
    }
  },
  {
    id: 'evt-2',
    name: 'Class of 2026 Reunion',
    type: 'Reunion',
    date: '2026-07-10',
    location: 'Cypress Grove Lodge, Oregon',
    code: 'CYPRESS-26',
    coverUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80',
    guestCount: 42,
    status: 'active',
    settings: {
      guestUploadAllowed: true,
      instantReveal: true,
      allowedTypes: ['photo', 'voice', 'wish'],
      requireApproval: true,
    }
  },
  {
    id: 'evt-3',
    name: "Marcus' 30th Birthday",
    type: 'Birthday',
    date: '2026-05-14',
    location: 'Penthouse Loft, Soho NY',
    code: 'MARCUS-30',
    coverUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
    guestCount: 31,
    status: 'archived',
    settings: {
      guestUploadAllowed: false,
      instantReveal: true,
      allowedTypes: ['photo', 'video', 'wish'],
      requireApproval: false,
    }
  }
];

export const INITIAL_CONTRIBUTIONS: KavaContribution[] = [
  {
    id: 'con-1',
    eventId: 'evt-1',
    type: 'photo',
    contributorName: 'Emma Stone',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    text: 'To the most beautiful couple. May your love grow stronger with every passing sunrise!',
    timestamp: '2026-06-20T17:34:00Z',
    isPinned: true,
  },
  {
    id: 'con-2',
    eventId: 'evt-1',
    type: 'wish',
    contributorName: 'Sarah Jenkins',
    text: 'Dearest Sofia & Leo, hearing your vows today made me believe in true destiny. Watching you walk down that aisle Sofia, with your father, brought tears to everyone’s eyes. Leo, you looked at her like she was the only star in the night sky. We love you both so incredibly much. Happy lifetime together!',
    timestamp: '2026-06-20T18:12:00Z',
    isPinned: false,
  },
  {
    id: 'con-3',
    eventId: 'evt-1',
    type: 'voice',
    contributorName: 'Uncle Marcus',
    text: 'Sofia, Leo, this is Uncle Marcus! Speaking from the garden lounge. I just want to say how incredibly proud I am of you both. Leo, welcome to our crazy family! Sofia, you look exactly like your grandmother did on her wedding day. God bless this beautiful journey.',
    audioDuration: '0:42',
    timestamp: '2026-06-20T19:05:00Z',
    isPinned: true,
  },
  {
    id: 'con-4',
    eventId: 'evt-1',
    type: 'photo',
    contributorName: 'Lucas Gray',
    url: 'https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&w=800&q=80',
    text: 'Can\'t believe we\'re finally here! Best wedding of the decade. Cheers to endless laughter!',
    timestamp: '2026-06-20T19:42:00Z',
    isPinned: false,
  },
  {
    id: 'con-5',
    eventId: 'evt-1',
    type: 'photo',
    contributorName: 'Diana Prince',
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
    text: 'The pure, raw emotion of this exact second is forever burned in our hearts. Love you guys!',
    timestamp: '2026-06-20T20:15:00Z',
    isPinned: false,
  },
  {
    id: 'con-6',
    eventId: 'evt-1',
    type: 'wish',
    contributorName: 'The Henderson Family',
    text: 'So blessed to share in your celebration. Every single detail of tonight is elegant, just like the two of you! Here\'s to forever.',
    timestamp: '2026-06-20T21:00:00Z',
    isPinned: false,
  },
  {
    id: 'con-7',
    eventId: 'evt-2',
    type: 'photo',
    contributorName: 'Aris Thorne',
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
    text: 'We did it! Class of 2026 Stanford graduation. What a phenomenal ride it has been!',
    timestamp: '2026-07-10T14:30:00Z',
    isPinned: true,
  },
  {
    id: 'con-8',
    eventId: 'evt-2',
    type: 'wish',
    contributorName: 'Professor Sterling',
    text: 'Congratulations to my brilliant students. The future is incredibly bright, and I can\'t wait to see how you change the world.',
    timestamp: '2026-07-10T15:15:00Z',
    isPinned: false,
  }
];

export const INITIAL_GUESTS: KavaGuest[] = [
  { id: 'gst-1', eventId: 'evt-1', name: 'Emma Stone', contributionsCount: 1, joinedAt: '2026-06-20T16:45:00Z' },
  { id: 'gst-2', eventId: 'evt-1', name: 'Sarah Jenkins', contributionsCount: 1, joinedAt: '2026-06-20T17:12:00Z' },
  { id: 'gst-3', eventId: 'evt-1', name: 'Uncle Marcus', contributionsCount: 1, joinedAt: '2026-06-20T17:30:00Z' },
  { id: 'gst-4', eventId: 'evt-1', name: 'Lucas Gray', contributionsCount: 1, joinedAt: '2026-06-20T18:02:00Z' },
  { id: 'gst-5', eventId: 'evt-1', name: 'Diana Prince', contributionsCount: 1, joinedAt: '2026-06-20T18:40:00Z' },
  { id: 'gst-6', eventId: 'evt-1', name: 'The Henderson Family', contributionsCount: 1, joinedAt: '2026-06-20T19:15:00Z' },
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'testim-1',
    sourceType: 'featured_event',
    eventId: 'evt-1',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80'
    ],
    hostName: 'Sofia & Leo Rodriguez-Chen',
    eventTitle: "Sofia & Leo's Big Sur Wedding",
    eventCategory: 'Wedding',
    testimonialTitle: 'Captured 850+ Raw, Unscripted Memories Without Any Guest App Friction',
    quote: "KAVA completely transformed our wedding experience. Instead of waiting weeks for guest photos or chasing people down via group chats, we woke up the morning after our wedding in Big Sur to a breathtaking digital vault. Watching voice notes from Uncle Marcus and candid sunset photos pop up on the live projector during dinner brought our families to tears.",
    rating: 5,
    guestCount: 240,
    uploadedPhotos: 850,
    isFeatured: true,
    isPublished: true,
    order: 1
  },
  {
    id: 'testim-2',
    sourceType: 'manual',
    coverImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80'
    ],
    hostName: 'Marcus & Jameson Miller',
    eventTitle: 'Silver Wedding Anniversary Gala',
    eventCategory: 'Anniversary',
    testimonialTitle: 'Live Screen Mode Created Pure Magic During Our Gala',
    quote: 'We set up a projector with the KAVA Live Screen during our 25th anniversary celebration. Seeing spontaneous guest wishes and voice notes stream onto the ballroom wall in real-time made the night feel so warm, collaborative, and deeply personal.',
    rating: 5,
    guestCount: 180,
    uploadedPhotos: 520,
    isFeatured: false,
    isPublished: true,
    order: 2
  },
  {
    id: 'testim-3',
    sourceType: 'manual',
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80'
    ],
    hostName: 'Elena Vance',
    eventTitle: 'Apex Tech Global Summit 2026',
    eventCategory: 'Corporate Summit',
    testimonialTitle: 'Seamless QR Onboarding for 1,200 Attendees',
    quote: 'The table QR code cards were an absolute hit across all keynote tracks. Attendees simply scanned and uploaded high-resolution photos and voice feedback instantly without downloading a single app. The quality exceeded our expectations.',
    rating: 5,
    guestCount: 1200,
    uploadedPhotos: 3400,
    isFeatured: false,
    isPublished: true,
    order: 3
  },
  {
    id: 'testim-4',
    sourceType: 'manual',
    coverImage: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80'
    ],
    hostName: 'Camilla & David Thorne',
    eventTitle: 'Elegance & Arts Charity Ball',
    eventCategory: 'Gala & Fundraiser',
    testimonialTitle: 'Original Full-Resolution Downloads Preserved Every Detail',
    quote: 'Most photo apps compress images down to tiny low-res files. KAVA preserved every RAW photo at full fidelity. Downloading the master ZIP archive after the gala gave our media team pristine assets for press releases.',
    rating: 5,
    guestCount: 450,
    uploadedPhotos: 1950,
    isFeatured: false,
    isPublished: true,
    order: 4
  }
];

export const INITIAL_TESTIMONIAL_STATS: GlobalTestimonialStats = {
  guestPhotosUploaded: '1,420,000+',
  eventsCreated: '12,850+',
  averageRating: '4.98 / 5.0',
  qrScans: '3,890,000+',
  memoryCapsulesCompleted: '99.4%',
  autoCalculateFromAnalytics: false
};

export const TESTIMONIALS = INITIAL_TESTIMONIALS;


export const INITIAL_FAQ_ITEMS: FAQItem[] = [
  {
    id: "faq-101",
    question: "Do guests need to download an app?",
    answer: "Absolutely not. Guests simply scan a custom QR code or click a short link to join in their browser on **iOS** or **Android**.\n\nKey advantages:\n- No app store downloads or logins required\n- Instant camera integration with zero latency\n- Instant guest contribution via [Web App QR Portal](https://kavamedia.io)",
    category: "Guest Experience",
    displayOrder: 1,
    language: "English",
    visibility: "Public",
    status: "Published",
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-07-20T10:00:00Z",
    analytics: {
      views: 1420,
      expansions: 980,
      helpfulYes: 412,
      helpfulNo: 8
    },
    versionHistory: [
      {
        version: 1,
        question: "Do guests need to download an app?",
        answer: "Absolutely not. Guests simply scan a custom QR code or click a short link to join in their browser on iOS or Android.",
        category: "Guest Experience",
        modifiedAt: "2026-01-10T08:00:00Z",
        modifiedBy: "SuperAdmin (System)"
      }
    ]
  },
  {
    id: "faq-102",
    question: "How do Voice Messages work?",
    answer: "Guests can record a voice message right inside the mobile browser. It feels just like sending a voice note to a friend, but is preserved permanently on your high-fidelity Event timeline.\n\n```audio-specs\nAudio Format: AAC/MP3 High Fidelity 320kbps\nMax Recording Duration: 5 minutes per note\nAuto Waveform Generation: Yes\n```",
    category: "Media & Audio",
    displayOrder: 2,
    language: "English",
    visibility: "Public",
    status: "Published",
    createdAt: "2026-01-12T09:30:00Z",
    updatedAt: "2026-07-21T11:15:00Z",
    analytics: {
      views: 1150,
      expansions: 740,
      helpfulYes: 320,
      helpfulNo: 5
    },
    versionHistory: [
      {
        version: 1,
        question: "How do Voice Messages work?",
        answer: "Guests record voice notes in the browser.",
        category: "Media & Audio",
        modifiedAt: "2026-01-12T09:30:00Z",
        modifiedBy: "SuperAdmin"
      }
    ]
  },
  {
    id: "faq-103",
    question: "Can we display memories live during the event?",
    answer: "Yes! KAVA features an elegant, presenter-ready **Live Experience Mode**. You can open it on any smart TV, HDMI display, or projector to display incoming photos, wishes, and voice note waveforms as they are contributed in real-time.\n\n- Supports custom transition speeds and backgrounds\n- Automated moderation controls to filter posts before showing on screen\n- Full 4K slideshow rendering",
    category: "Live Display & Broadcast",
    displayOrder: 3,
    language: "English",
    visibility: "Public",
    status: "Published",
    createdAt: "2026-02-01T14:00:00Z",
    updatedAt: "2026-07-25T16:00:00Z",
    analytics: {
      views: 990,
      expansions: 620,
      helpfulYes: 285,
      helpfulNo: 12
    }
  },
  {
    id: "faq-104",
    question: "What media formats can guests contribute?",
    answer: "Guests can upload:\n- **High-Resolution Photos**: JPG, PNG, HEIC, WebP up to 50MB\n- **Full HD & 4K Videos**: MP4, MOV up to 3 minutes duration\n- **Voice Notes**: Emotional audio recordings with ambient noise reduction\n- **Written Wishes**: Customizable guestbook signatures & typography notes",
    category: "Media & Audio",
    displayOrder: 4,
    language: "English",
    visibility: "Public",
    status: "Published",
    createdAt: "2026-02-15T10:00:00Z",
    updatedAt: "2026-07-22T09:00:00Z",
    analytics: {
      views: 840,
      expansions: 510,
      helpfulYes: 210,
      helpfulNo: 3
    }
  },
  {
    id: "faq-105",
    question: "How long are our event memories stored on KAVA?",
    answer: "All memory capsules are stored with **permanent cloud redundancy** on enterprise AWS infrastructure.\n\n1. **Free Tier**: Storage preserved for 30 days post-event.\n2. **Premium Tier**: Guaranteed 5-Year Vault Storage with ZIP raw download access.\n3. **Enterprise Tier**: Lifetime Immutable Archival Storage with custom domain preservation.",
    category: "Pricing & Plans",
    displayOrder: 5,
    language: "English",
    visibility: "Public",
    status: "Published",
    createdAt: "2026-03-01T12:00:00Z",
    updatedAt: "2026-07-24T15:20:00Z",
    analytics: {
      views: 1280,
      expansions: 890,
      helpfulYes: 390,
      helpfulNo: 14
    }
  },
  {
    id: "faq-106",
    question: "¿Los invitados necesitan descargar alguna application?",
    answer: "En absoluto. Los invitados solo escanean el código QR personalizado o hacen clic en un enlace corto para unirse desde su navegador en iOS o Android sin contraseñas ni descargas.",
    category: "Guest Experience",
    displayOrder: 6,
    language: "Spanish",
    visibility: "Public",
    status: "Published",
    createdAt: "2026-03-10T10:00:00Z",
    updatedAt: "2026-07-25T11:00:00Z",
    analytics: {
      views: 340,
      expansions: 210,
      helpfulYes: 95,
      helpfulNo: 2
    }
  }
];

export const FAQ_ITEMS = INITIAL_FAQ_ITEMS;

export const INITIAL_UNANSWERED_TERMS: UnansweredSearchTerm[] = [
  { id: "term-1", term: "Can I download all photos as a ZIP file?", count: 48, lastSearched: "2026-07-28T19:40:00Z" },
  { id: "term-2", term: "Is there a limit on video recording length?", count: 32, lastSearched: "2026-07-28T21:15:00Z" },
  { id: "term-3", term: "How do I print a customized QR code poster?", count: 24, lastSearched: "2026-07-29T01:05:00Z" },
  { id: "term-4", term: "Can multiple hosts collaborate on one wedding?", count: 18, lastSearched: "2026-07-29T02:50:00Z" },
  { id: "term-5", term: "Is internet / Wi-Fi required at the venue?", count: 14, lastSearched: "2026-07-29T05:10:00Z" }
];


export const COVER_PRESETS = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', // Elegant Gold Wedding
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80', // Celebration Party
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80', // Reunion Gatherings
  'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80', // Birthday Sparklers
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80', // Mountains / Outdoors
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', // Warm Concert/Lights
];
