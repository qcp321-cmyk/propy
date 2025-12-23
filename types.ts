
export interface Property {
  id: string;
  title: string;
  price: number;
  address: string;
  beds: number;
  baths: number;
  sqft: number;
  type: 'House' | 'Condo' | 'Apartment' | 'Villa';
  imageUrl: string;
  description: string;
  features: string[];
  gallery?: string[];
  floorPlanUrl?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  developer?: string;
  completionYear?: string;
  reraId?: string;
  totalFloors?: number;
  // New Growth Features
  infrastructureTimeline?: {
    year: string;
    event: string;
    impact: string; // e.g., "+15% Appreciation"
    icon: 'metro' | 'road' | 'tech' | 'airport';
  }[];
  personas?: {
    techie: number; // Match score 0-100
    family: number;
    investor: number;
  };
  fairValue?: {
    marketAverage: number; // Per sqft
    projectPremium: number; // Percentage
    fairPrice: number; // Total Fair Price
  };
  // Audit Recommendation
  recommendation?: 'BUY' | 'AVOID';
  riskReason?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  type: 'Buy' | 'Sell' | 'Visit' | 'General' | 'EOI' | 'Brochure';
  details: string;
  timestamp: Date;
  status: 'New' | 'Contacted' | 'Closed';
}

export type UserRole = 'Super Admin' | 'Manager' | 'Agent';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'Active' | 'Inactive';
  lastActive: Date;
}

export interface Visitor {
  id: string;
  ip: string;
  location: string;
  device: string;
  page: string;
  status: 'Active' | 'Idle' | 'Blocked';
  coordinates: [number, number]; // lat, lng
  role?: UserRole;
  isLocal?: boolean;
}

export enum AppView {
  HOME = 'HOME',
  LISTINGS = 'LISTINGS',
  DETAILS = 'DETAILS',
  COMPARE = 'COMPARE',
  BUY = 'BUY',
  SELL = 'SELL',
  AGENTS = 'AGENTS',
  VISION = 'VISION'
}
