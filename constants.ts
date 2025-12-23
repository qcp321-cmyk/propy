import { Property } from './types';

export const TAGLINE = "Redefining innovations, We're curiousminds";

export const TOP_LOCATIONS = [
  {
    name: 'Hebbal',
    description: 'The Elite Gateway to North Bengaluru',
    image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Aerospace Park',
    description: 'High-Growth Tech & Aviation Hub',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Devanahalli',
    description: 'The Future Tech Capital',
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80&w=800'
  }
];

export const ROADMAP = [
  { quarter: 'Q1 2026', title: 'Neural Search', detail: 'Deploying high-accuracy search patterns for discerning property seekers.', color: '#8b5cf6' },
  { quarter: 'Q2 2026', title: 'Elite Vision VR', detail: 'Real-time 1:1 scale virtual walk-throughs using high-fidelity rendering.', color: '#6366f1' },
  { quarter: 'Q3 2026', title: 'Secure Escrow', detail: 'Securing high-value property transactions via verified digital pathways.', color: '#3b82f6' },
  { quarter: 'Q4 2026', title: 'Global Portfolio', detail: 'Expanding Propertyfie Intel Unit to Dubai and London luxury markets.', color: '#ec4899' }
];

export const MOCK_PROPERTIES: Property[] = [
  {
    id: '9',
    title: 'Embassy Verde - Phase Two',
    price: 12100000, 
    address: 'Hebbal North, Bengaluru',
    beds: 3,
    baths: 3,
    sqft: 1344,
    type: 'Apartment',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200',
    gallery: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1597526714070-65d83636f322?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200',
    ],
    floorPlanUrl: 'https://images.unsplash.com/photo-1580820267682-426da823b514?auto=format&fit=crop&q=80&w=800',
    description: 'AN ELITE OPPORTUNITY. Phase 2 of Embassy Verde offers premium configurations from 1 BHK to 3 BHK. Featuring a Professional Sports Court, Private Pet Park, and expansive Landscaped Lawns. Pricing starts at ₹61L* for priority EOI submissions.',
    features: ['Elite Pet Park', 'Professional Sports Court', '13 Units/Floor', 'Stunning Views'],
    coordinates: { lat: 13.0600, lng: 77.5900 },
    developer: 'Embassy Group',
    completionYear: '2028 (Est)',
    reraId: 'PRM/KA/RERA/APPLYING/2025',
    totalFloors: 18,
    recommendation: 'BUY',
    infrastructureTimeline: [
        { year: '2026', event: 'Airport Line Metro', impact: '+18% Growth', icon: 'metro' },
        { year: '2027', event: 'Tech Park Expansion', impact: '+10% Growth', icon: 'tech' }
    ],
    personas: { techie: 95, family: 98, investor: 99 },
    fairValue: { marketAverage: 11000, projectPremium: 5, fairPrice: 13500000 }
  },
  {
    id: 'provident-flow',
    title: 'Provident Codename Flow',
    price: 8800000,
    address: 'Near Airport Road, North Bengaluru',
    beds: 3,
    baths: 2,
    sqft: 1150,
    type: 'Apartment',
    imageUrl: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&q=80&w=1200',
    description: 'Designed for the modern family. Codename Flow by Provident is strategically located to offer seamless connectivity to the tech hubs of Hebbal and Devanahalli.',
    features: ['Smart Home Automation', 'Olympic Size Pool', 'Fluid Living Spaces'],
    coordinates: { lat: 13.1200, lng: 77.6200 },
    developer: 'Provident Housing',
    completionYear: '2027',
    reraId: 'PRM/KA/RERA/1251/446/PR/2025',
    recommendation: 'BUY',
    infrastructureTimeline: [
        { year: '2026', event: 'Hebbal Flyover Redesign', impact: '+10% Appreciation', icon: 'road' }
    ],
    personas: { techie: 92, family: 88, investor: 94 },
    fairValue: { marketAverage: 7200, projectPremium: 8, fairPrice: 9200000 }
  },
  {
    id: 'purva-aerospace',
    title: 'Purva Aerocity - The Elite Zone',
    price: 14500000,
    address: 'Aerospace Park, Bengaluru North',
    beds: 3,
    baths: 3,
    sqft: 1650,
    type: 'Apartment',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
    description: 'EXCLUSIVE PRE-LAUNCH. Command the heart of the 3000-acre KIADB Aerospace Park. High rental yields secured by tech giants Boeing and Airbus.',
    features: ['High-Growth Zone', 'Premium Clubhouse', 'Elite Living'],
    coordinates: { lat: 13.2100, lng: 77.7100 },
    developer: 'Puravankara',
    completionYear: '2028',
    reraId: 'PRM/KA/RERA/APPLIED/AERO',
    recommendation: 'BUY',
    infrastructureTimeline: [
        { year: '2026', event: 'Boeing Campus Launch', impact: '+25% Yield', icon: 'tech' }
    ],
    personas: { techie: 98, family: 80, investor: 100 },
    fairValue: { marketAverage: 8200, projectPremium: 12, fairPrice: 15500000 }
  },
  {
    id: 'godrej-woodscapes',
    title: 'Godrej Woodscapes',
    price: 17500000,
    address: 'Budigere Cross, North Corridor',
    beds: 3,
    baths: 3,
    sqft: 1800,
    type: 'Apartment',
    imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=1200',
    description: 'A forest-themed sanctuary. Godrej Woodscapes offers a lush, sustainable environment with over 1000 trees on-site. The ultimate eco-luxury estate.',
    features: ['Forest Living', 'Zero Waste Asset', 'Private Spa'],
    coordinates: { lat: 13.0400, lng: 77.7500 },
    developer: 'Godrej Properties',
    completionYear: '2028',
    reraId: 'PRM/KA/RERA/1251/446/PR/220524',
    recommendation: 'BUY',
    infrastructureTimeline: [
        { year: '2026', event: 'PRR Road Access', impact: '+15% Growth', icon: 'road' }
    ],
    personas: { techie: 85, family: 95, investor: 88 },
    fairValue: { marketAverage: 8800, projectPremium: 10, fairPrice: 18200000 }
  }
];

export const AGENTS_LIST = [
  {
    id: 1,
    name: "Sanskriti Singh",
    role: "Lead Architect",
    specialty: "Hebbal Luxury Portfolio",
    gender: "female",
    phone: "+91 79707 50727"
  },
  {
    id: 2,
    name: "Seikh Mahiya",
    role: "Investment Consultant",
    specialty: "Aerospace Park Specialist",
    gender: "female",
    phone: "+91 98765 43210"
  },
  {
    id: 3,
    name: "Aman Kumar Singh",
    role: "Chief Auditor",
    specialty: "Global Asset Strategy",
    gender: "male",
    phone: "+91 99887 76655"
  }
];

export const INITIAL_CHAT_MESSAGE = "Welcome to Propertyfie. I am your Elite Concierge, specializing in North Bengaluru's high-growth corridor. How may I assist your search today? Instant brochures are available—no OTP required.";