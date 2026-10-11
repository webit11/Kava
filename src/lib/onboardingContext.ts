import { CATEGORY_BACKGROUND_IMAGES } from './createExperienceThemes';

export interface EventTypeContext {
  id: string;
  name: string;
  badgeTag: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  defaultTitle: string;
  placeholderTitle: string;
  placeholderLocation: string;
  step1Desc: string;
  step2Title: string;
  step2Subtitle: string;
  step3Subtitle: string;
  step4Subtitle: string;
  step4Tip: string;
  step5TimelineTitle: string;
  step5TimelineSubtitle: string;
  step6PhotoPrompt: string;
  step6VideoPrompt: string;
  step6VoicePrompt: string;
  step6WishPrompt: string;
  recommendedCovers: string[];
  suggestedWishes?: string[];
  sampleGuests: {
    author: string;
    avatar: string;
    message: string;
    type: 'photo' | 'wish' | 'voice';
    photoUrl?: string;
    timeAgo: string;
  }[];
}

const DEFAULT_COVER_PRESETS = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200', // Wedding flowers
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200', // Wedding celebration
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=1200', // Party sparks
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=1200', // Confetti
  'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=1200', // Toast glasses
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200', // Graduation caps
];

export function getEventContext(eventType: string): EventTypeContext {
  const normalized = (eventType || '').toLowerCase().trim();

  if (normalized.includes('wedding')) {
    return {
      id: 'wedding',
      name: 'Wedding',
      badgeTag: 'WEDDING',
      badgeBg: 'bg-[#00A88F]/10',
      badgeText: 'text-[#008f7a] dark:text-[#00E5C0]',
      badgeBorder: 'border-[#00A88F]/20',
      defaultTitle: "Sofia & Leo's Wedding",
      placeholderTitle: "e.g. Sofia & Leo's Wedding",
      placeholderLocation: 'e.g. The Glasshouse, Big Sur',
      step1Desc: 'Preserve vows, speech audios, ceremony photos & polaroids.',
      step2Title: 'Tell us about the wedding',
      step2Subtitle: 'These details appear at the top of your guest invitation page and live presentation wall.',
      step3Subtitle: 'Select a cover photo that sets the romantic atmosphere for your wedding capsule.',
      step4Subtitle: 'Choose privacy rules for wedding guest uploads, speeches, and photo sharing.',
      step4Tip: 'For weddings, hosts often enable guest approval so toasts and ceremony photos can be curated before broadcasting on the live screen.',
      step5TimelineTitle: 'Wedding Reception Live Feed',
      step5TimelineSubtitle: 'Configure when guests can upload ceremony moments and speech audio notes.',
      step6PhotoPrompt: 'High-resolution ceremony photos & polaroids',
      step6VideoPrompt: '4K speech videos & first dance clips',
      step6VoicePrompt: 'Audio guestbook & verbal wedding toasts',
      step6WishPrompt: 'Written blessings & advice for the newlyweds',
      suggestedWishes: [
        'Best wishes for a lifetime of love and happiness!',
        'Thank you for letting us share in your special day!',
        'May your joining together bring you more joy than you can imagine.'
      ],
      recommendedCovers: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1200',
      ],
      sampleGuests: [
        {
          author: 'Aunt Clara',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
          message: 'So happy to celebrate with you both! Wishing you a lifetime of love & laughter.',
          type: 'wish',
          timeAgo: '2m ago',
        },
        {
          author: 'Marcus (Best Man)',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
          message: 'Captured the first dance moment! Absolutely magical night.',
          type: 'photo',
          photoUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80',
          timeAgo: '5m ago',
        },
      ],
    };
  }

  if (normalized.includes('reunion') || normalized.includes('family')) {
    return {
      id: 'reunion',
      name: 'Family Reunion',
      badgeTag: 'FAMILY REUNION',
      badgeBg: 'bg-sky-500/10',
      badgeText: 'text-sky-700 dark:text-sky-400',
      badgeBorder: 'border-sky-500/20',
      defaultTitle: 'The Miller Family Reunion',
      placeholderTitle: 'e.g. Miller Family Reunion 2026',
      placeholderLocation: 'e.g. Lake Tahoe Lodge, California',
      step1Desc: 'Bridge generations with memories, stories & family wishes.',
      step2Title: 'Tell us about the family reunion',
      step2Subtitle: 'Set the title and location for family members joining across generations.',
      step3Subtitle: 'Choose a warm cover photo that brings the family history together.',
      step4Subtitle: 'Manage sharing permissions for family photos, old archive scans, and voice notes.',
      step4Tip: 'Family reunions thrive when all family members can contribute old photos and voice recordings without restrictions.',
      step5TimelineTitle: 'Reunion Live Photo Wall',
      step5TimelineSubtitle: 'Keep the memory feed open so relatives near and far can add moments.',
      step6PhotoPrompt: 'Vintage family scans & group reunion portraits',
      step6VideoPrompt: 'Multi-generational video interviews & laughter',
      step6VoicePrompt: 'Family stories & oral history recordings',
      step6WishPrompt: 'Messages of love across generations',
      suggestedWishes: [
        'So blessed to have all of us together under one roof!',
        "Here's to family traditions, endless laughter, and cherished memories.",
        'Distance means so little when family means so much.'
      ],
      recommendedCovers: [
        'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=1200',
      ],
      sampleGuests: [
        {
          author: 'Grandma Rose',
          avatar: 'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?auto=format&fit=crop&w=100&q=80',
          message: 'Seeing 4 generations in one picture warms my heart so much.',
          type: 'wish',
          timeAgo: 'Just now',
        },
        {
          author: 'Cousin Tom',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
          message: 'Found this classic photo from 1998 in the attic!',
          type: 'photo',
          photoUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80',
          timeAgo: '12m ago',
        },
      ],
    };
  }

  if (normalized.includes('birthday')) {
    return {
      id: 'birthday',
      name: 'Birthday Celebration',
      badgeTag: 'BIRTHDAY',
      badgeBg: 'bg-amber-500/10',
      badgeText: 'text-amber-700 dark:text-amber-400',
      badgeBorder: 'border-amber-500/20',
      defaultTitle: "Marcus' 30th Birthday",
      placeholderTitle: "e.g. Marcus' 30th Birthday Bash",
      placeholderLocation: 'e.g. Sunset Rooftop Lounge, NYC',
      step1Desc: 'Capture active party clips, sparkler videos & cheers.',
      step2Title: 'Tell us about the birthday',
      step2Subtitle: 'Let friends know where and when to upload party clips and birthday wishes.',
      step3Subtitle: 'Pick a high-energy cover photo for the birthday celebration page.',
      step4Subtitle: 'Set instant upload settings so guests can post party photos live.',
      step4Tip: 'Instant upload mode allows birthday guests to project party photos on the big screen without delay.',
      step5TimelineTitle: 'Birthday Party Live Stream',
      step5TimelineSubtitle: 'Allow guests to drop photos during the party and keep uploads open after.',
      step6PhotoPrompt: 'Party snapshots, cake cutting & guest selfies',
      step6VideoPrompt: 'Cake candle blowing & surprise reaction clips',
      step6VoicePrompt: 'Live party cheers & funny voice notes',
      step6WishPrompt: 'Heartfelt birthday wishes & funny memories',
      suggestedWishes: [
        'Wishing you the happiest of birthdays and an unforgettable year ahead!',
        'May all your birthday wishes come true!',
        'Cheers to another fantastic trip around the sun!'
      ],
      recommendedCovers: [
        'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=1200',
      ],
      sampleGuests: [
        {
          author: 'Elena',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
          message: 'Happy 30th Birthday Marcus! May this year be your absolute best chapter yet!',
          type: 'wish',
          timeAgo: '3m ago',
        },
        {
          author: 'Dave',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
          message: 'Cake time! Here is the candle blow-out shot!',
          type: 'photo',
          photoUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80',
          timeAgo: '8m ago',
        },
      ],
    };
  }

  if (normalized.includes('anniversary')) {
    return {
      id: 'anniversary',
      name: 'Anniversary',
      badgeTag: 'ANNIVERSARY',
      badgeBg: 'bg-amber-500/10',
      badgeText: 'text-amber-700 dark:text-amber-400',
      badgeBorder: 'border-amber-500/20',
      defaultTitle: "David & Ellen's 25th Anniversary",
      placeholderTitle: "e.g. David & Ellen's 25th Anniversary",
      placeholderLocation: 'e.g. Grand Ballroom, The Ritz',
      step1Desc: 'Celebrate continuous years of love, memories & laughter.',
      step2Title: 'Tell us about the anniversary',
      step2Subtitle: 'Gather tribute messages and golden memories from friends and family.',
      step3Subtitle: 'Choose an elegant backdrop for the anniversary memory capsule.',
      step4Subtitle: 'Set privacy rules for toasts, tribute messages, and nostalgia photos.',
      step4Tip: 'Anniversaries are ideal for collecting voice toasts and written blessings from lifelong friends.',
      step5TimelineTitle: 'Anniversary Celebration Stream',
      step5TimelineSubtitle: 'Keep the guest book open for friends who wish to leave long-distance toasts.',
      step6PhotoPrompt: 'Throwback photos, then & now side-by-sides',
      step6VideoPrompt: 'Tribute speeches & anniversary dance clips',
      step6VoicePrompt: 'Voice toasts & long-distance audio messages',
      step6WishPrompt: 'Anniversary blessings & wisdom on lasting love',
      suggestedWishes: [
        'Happy Anniversary! Your love story continues to inspire us all.',
        'Wishing you many more years of love, laughter, and togetherness.',
        'Cheers to a lifetime of beautiful memories together!'
      ],
      recommendedCovers: [
        'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200',
      ],
      sampleGuests: [
        {
          author: 'The Johnsons',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
          message: 'Happy 25th Anniversary! Your partnership inspires all of us so much.',
          type: 'wish',
          timeAgo: '10m ago',
        },
        {
          author: 'Sarah',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80',
          message: 'Toast to 25 wonderful years together!',
          type: 'photo',
          photoUrl: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=600&q=80',
          timeAgo: '15m ago',
        },
      ],
    };
  }

  if (normalized.includes('graduation')) {
    return {
      id: 'graduation',
      name: 'Graduation',
      badgeTag: 'GRADUATION',
      badgeBg: 'bg-blue-500/10',
      badgeText: 'text-blue-700 dark:text-blue-400',
      badgeBorder: 'border-blue-500/20',
      defaultTitle: 'Stanford Class of 2026',
      placeholderTitle: "e.g. Maya's Graduation Ceremony & Party",
      placeholderLocation: 'e.g. Stanford University Quad',
      step1Desc: 'Share final caps-off moments, memories & advice.',
      step2Title: 'Tell us about the graduation',
      step2Subtitle: 'Collect graduation photos, career advice, and cap-toss memories.',
      step3Subtitle: 'Select a celebratory cover photo for the graduate capsule.',
      step4Subtitle: 'Configure photo limits and access rules for classmates and family.',
      step4Tip: 'Allowing classmates to upload high-res photos ensures no graduation ceremony angle is missed.',
      step5TimelineTitle: 'Graduation Day Live Wall',
      step5TimelineSubtitle: 'Stream cap toss moments and party wishes directly to the live display.',
      step6PhotoPrompt: 'Cap & gown portraits, diploma hand-offs & campus memories',
      step6VideoPrompt: 'Cap toss videos & commencement speech clips',
      step6VoicePrompt: 'Audio congratulations & words of wisdom',
      step6WishPrompt: 'Future wishes & career advice for the graduate',
      suggestedWishes: [
        'So proud of your incredible achievements! The future is yours!',
        'Congratulations graduate! Dream big and shine bright.',
        'Caps off to your hard work and bright future!'
      ],
      recommendedCovers: [
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=1200',
      ],
      sampleGuests: [
        {
          author: 'Uncle James',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
          message: 'So proud of you Maya! Your hard work paid off. Congratulations Graduate!',
          type: 'wish',
          timeAgo: '1m ago',
        },
        {
          author: 'Chloe (Roommate)',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
          message: 'From freshman dorms to cap & gown! WE DID IT!',
          type: 'photo',
          photoUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80',
          timeAgo: '4m ago',
        },
      ],
    };
  }

  // Custom Occasion / Other / Default
  return {
    id: 'other',
    name: 'Custom Occasion',
    badgeTag: 'CUSTOM OCCASION',
    badgeBg: 'bg-[#00A88F]/10',
    badgeText: 'text-[#00A88F]',
    badgeBorder: 'border-[#00A88F]/20',
    defaultTitle: 'A Special Memory Capsule',
    placeholderTitle: 'e.g. Summer Beach Gathering 2026',
    placeholderLocation: 'e.g. Serene Garden Pavilion',
    step1Desc: 'Any intimate gathering of people who share moments.',
    step2Title: 'Tell us about your occasion',
    step2Subtitle: 'These details appear at the top of your guest invitation page and live presentation wall.',
    step3Subtitle: 'Select a cover visual that captures the spirit of your memory capsule.',
    step4Subtitle: 'Set contributor settings and privacy controls for your guests.',
    step4Tip: 'Tailor guest permissions according to how public or private your gathering is.',
    step5TimelineTitle: 'Event Live Memory Stream',
    step5TimelineSubtitle: 'Choose when guest contributions open and close.',
    step6PhotoPrompt: 'High-quality event photos & candid snapshots',
    step6VideoPrompt: 'Highlight video clips & memorable moments',
    step6VoicePrompt: 'Voice notes, audio messages & toasts',
    step6WishPrompt: 'Written notes, blessings & guestbook wishes',
    suggestedWishes: [
      'So happy to be part of this special memory capsule!',
      'Thank you for bringing us all together for this great occasion!',
      'Creating memories that will last a lifetime.'
    ],
    recommendedCovers: DEFAULT_COVER_PRESETS,
    sampleGuests: [
      {
        author: 'Rachel',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
        message: 'Such a wonderful gathering! Thank you for creating this memory capsule for us.',
        type: 'wish',
        timeAgo: '2m ago',
      },
      {
        author: 'Sam',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
        message: 'Sharing our favorite moments from the day!',
        type: 'photo',
        photoUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80',
        timeAgo: '6m ago',
      },
    ],
  };
}
