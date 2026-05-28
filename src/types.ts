export interface ItineraryActivity {
  id: string;
  time: string; // e.g., "10:00 AM - 11:30 AM"
  activityName: string;
  description: string;
  locationName: string;
  estimatedCost: number;
  bookingNeeded: boolean;
  bookingDeepLink?: string;
  travelTimeToNextMs?: number; // in minutes
  travelDetailsToNext?: string; // details on how to get to next activity
}

export interface ItineraryDay {
  dayNumber: number;
  date: string;
  theme: string;
  activities: ItineraryActivity[];
}

export interface PreTravelCheck {
  id: string;
  task: string;
  category: 'booking' | 'documents' | 'packing' | 'visa' | 'other';
  dueDate: string;
  notes: string;
  completed: boolean;
}

export interface BudgetEstimation {
  accommodation: {
    type: string;
    estimatedCost: number;
    explanation: string;
    deepLink: string;
  };
  transport: {
    type: string;
    estimatedCost: number;
    explanation: string;
    deepLink: string;
  };
  activities: {
    estimatedCost: number;
    explanation: string;
  };
  foodAndMisc: {
    estimatedCost: number;
    explanation: string;
  };
  totalEstimated: number;
  currency: string;
}

export interface RecommendationLink {
  title: string;
  url: string;
}

export interface FlightOption {
  airline: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  stopsDetail?: string;
  priceUSD: number;
  cabinClass: string;
}

export interface FlightDetailsSection {
  preferredStops: 'nonstop' | 'one' | 'any';
  recommendedFlights: FlightOption[];
  dealAlert?: string;
  bestPriceAdvice: string;
  bookingDeepLink: string;
}

export interface TravelItinerary {
  destination: string;
  durationDays: number;
  citizenshipStatus: string;
  visaConditions: string;
  recommendedTravelDates: string;
  whyThisRecommendation: string;
  whyThisRecommendationLinks?: RecommendationLink[];
  days: ItineraryDay[];
  preTravelChecks: PreTravelCheck[];
  budget: BudgetEstimation;
  flightDetails?: FlightDetailsSection;
  isFallback?: boolean;
  accommodationRecommendation?: {
    stayType: string; // e.g., "hotel", "airbnb", "split"
    heading: string;
    locationStrategy: string;
    detailedReasoning: string;
  };
}

export interface DestinationRecommendation {
  name: string;
  country: string;
  tagline: string;
  whyNow: string;
  description: string;
  themeTags: string[];
  recommendedDurationDays: number;
  estimatedBudgets: {
    budget: number;
    balanced: number;
    luxury: number;
  }; // Typical cost per day for sliding scale comparison
  highlights: string[];
}

export interface PlannerPreferences {
  citizenship: string;
  departure: string;
  destination: string;
  isInternational: boolean;
  isRoadtrip: boolean;
  roadtripType?: 'to_destination' | 'at_destination';
  hasDates: boolean;
  startDate?: string;
  endDate?: string;
  durationDays?: number;
  departureTime?: string;
  arrivalTime?: string;
  accommodationType: 'hotel' | 'airbnb' | 'both' | 'ai_recommended';
  transportType: 'rental' | 'taxi_public' | 'ai_recommended';
  pace: 'relaxed' | 'balanced' | 'adventurous';
  peopleCount: number;
  selectedInterests: string[];
  customTags: string[];
  avoidTags: string[];
  budgetType: 'budget' | 'balanced' | 'luxury';
  customDailyBudgetLimit?: number;
  preferredStops?: 'nonstop' | 'one' | 'any';
}
