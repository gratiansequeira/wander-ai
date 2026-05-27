import React, { useState, useEffect } from 'react';
import { 
  Compass, Plane, MapPin, Calendar, Clock, Sparkles, AlertTriangle, 
  ChevronRight, RefreshCw, Layers, Star, Info, HelpCircle, Users, CheckSquare,
  Home, Car, Sliders, Flame, Tags, ShieldAlert, Check
} from 'lucide-react';
import { PlannerPreferences, TravelItinerary, DestinationRecommendation } from './types';
import RecommendationsCard from './components/RecommendationsCard';
import BudgetSlider from './components/BudgetSlider';
import ItineraryViewer from './components/ItineraryViewer';

const PREDEFINED_INTERESTS = [
  { id: 'hiking', label: 'Hiking & Trails' },
  { id: 'beaches', label: 'Beaches & Oceans' },
  { id: 'distilleries', label: 'Distilleries & Breweries' },
  { id: 'museums', label: 'Museums & Art history' },
  { id: 'food', label: 'Culinary & Dinners' },
  { id: 'wildlife', label: 'Wildlife & Nature Safari' },
  { id: 'shopping', label: 'Shopping & Markets' },
  { id: 'nightlife', label: 'Nightlife & Bars' },
  { id: 'adventure', label: 'Adventure Sports' },
  { id: 'relaxed', label: 'Spas & Wellness' }
];

const INITIAL_PREFERENCES: PlannerPreferences = {
  citizenship: '',
  departure: '',
  destination: '',
  isInternational: true,
  isRoadtrip: false,
  roadtripType: 'at_destination',
  hasDates: false,
  startDate: '',
  endDate: '',
  durationDays: 5,
  departureTime: '10:00 AM',
  arrivalTime: '04:00 PM',
  accommodationType: 'both',
  transportType: 'ai_recommended',
  pace: 'balanced',
  peopleCount: 1,
  selectedInterests: [],
  customTags: [],
  avoidTags: [],
  budgetType: 'balanced',
  customDailyBudgetLimit: 230,
  preferredStops: 'any'
};

// Loading cycling statements to showcase high-quality AI interaction
const CONCIERGE_LOAD_STATEMENTS = [
  "Analyzing citizenship entry and visa guidelines...",
  "Running timing calculations for check-ins, local transfer transits, and itineraries...",
  "Structuring real-world search links for flights, hotels, and rentals...",
  "Formatting comprehensive meal allotments and travel checklists...",
  "Coordinating specific spots matching selected interests and pace preferences...",
  "Tailoring custom trip timeline structures..."
];

const THEME_PRESETS = {
  indigo: {
    id: 'indigo',
    name: 'Indigo Voyage',
    primary: '#4f46e5',
    primaryHover: '#4338ca',
    bgLight: '#f5f3ff',
    textDark: '#3730a3',
    borderLight: '#e0e7ff',
    glow: 'rgba(79, 70, 229, 0.05)',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Forest (Default)',
    primary: '#059669',
    primaryHover: '#047857',
    bgLight: '#ecfdf5',
    textDark: '#065f46',
    borderLight: '#d1fae5',
    glow: 'rgba(5, 150, 105, 0.05)',
  },
  rose: {
    id: 'rose',
    name: 'Rose Terracotta',
    primary: '#e11d48',
    primaryHover: '#be123c',
    bgLight: '#fff1f2',
    textDark: '#9f1239',
    borderLight: '#ffe4e6',
    glow: 'rgba(225, 29, 72, 0.05)',
  },
  amber: {
    id: 'amber',
    name: 'Warm Sunset',
    primary: '#d97706',
    primaryHover: '#b45309',
    bgLight: '#fffbeb',
    textDark: '#92400e',
    borderLight: '#fef3c7',
    glow: 'rgba(217, 119, 6, 0.05)',
  }
};

const POPULAR_DEPARTURES = [
  "Phoenix Sky Harbor (PHX)",
  "New York (JFK)",
  "Los Angeles (LAX)",
  "San Francisco (SFO)",
  "Chicago O'Hare (ORD)",
  "Seattle-Tacoma (SEA)",
  "Miami International (MIA)",
  "Boston Logan (BOS)",
  "Honolulu Inouye (HNL)",
  "Dallas/Fort Worth (DFW)",
  "Denver International (DEN)",
  "Atlanta Hartsfield-Jackson (ATL)",
  "Houston George Bush (IAH)",
  "Toronto Pearson (YYZ)",
  "Vancouver International (YVR)",
  "London Heathrow (LHR)",
  "Paris Charles de Gaulle (CDG)",
  "Frankfurt Airport (FRA)",
  "Amsterdam Schiphol (AMS)",
  "Tokyo Haneda (HND)",
  "Singapore Changi (SIN)",
  "Sydney Kingsford Smith (SYD)",
  "Dubai International (DXB)",
  "Seoul Incheon (ICN)",
  "Munich Airport (MUC)",
  "Zurich Airport (ZRH)"
];

const POPULAR_DESTINATIONS = [
  "Big Island (Island of Hawaii), Hawaii, USA",
  "Maui (Kahului), Hawaii, USA",
  "Oahu (Honolulu), Hawaii, USA",
  "Kauai (Lihue), Hawaii, USA",
  "Phoenix, Arizona, USA",
  "New York City, New York, USA",
  "Los Angeles, California, USA",
  "San Francisco, California, USA",
  "Amalfi Coast, Italy",
  "Kyoto, Japan",
  "Tokyo, Japan",
  "Banff & Jasper National Parks, Canada",
  "Paris, France",
  "London, United Kingdom",
  "Rome, Italy",
  "Sydney, Australia",
  "Vancouver, Canada",
  "Cabo San Lucas, Mexico",
  "Costa Rica",
  "Barcelona, Spain",
  "Reykjavik, Iceland",
  "Bangkok, Thailand",
  "Bali, Indonesia",
  "Cape Town, South Africa",
  "Cairo, Egypt",
  "Rio de Janeiro, Brazil",
  "New Zealand South Island",
  "Amsterdam, Netherlands",
  "Munich, Germany",
  "Santorini, Greece"
];

const POPULAR_CITIZENSHIPS = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Australia",
  "Japan",
  "Singapore",
  "India",
  "Mexico",
  "Brazil",
  "South Korea",
  "Spain",
  "Italy",
  "Netherlands",
  "Switzerland",
  "New Zealand",
  "Sweden",
  "Norway",
  "Denmark",
  "Ireland"
];

export default function App() {
  const [selectedTheme, setSelectedTheme] = useState<'indigo' | 'emerald' | 'rose' | 'amber'>('emerald');
  const currentTheme = THEME_PRESETS[selectedTheme];

  const [preferences, setPreferences] = useState<PlannerPreferences>(INITIAL_PREFERENCES);
  const [recommendations, setRecommendations] = useState<DestinationRecommendation[]>([]);
  const [isShowingRecs, setIsShowingRecs] = useState(false);
  const [searchRecQuery, setSearchRecQuery] = useState('');

  // Suggestions state
  const [showDepartureSuggest, setShowDepartureSuggest] = useState(false);
  const [showDestinationSuggest, setShowDestinationSuggest] = useState(false);
  const [showCitizenshipSuggest, setShowCitizenshipSuggest] = useState(false);
  
  // Navigation Steps: 1 = Route, 2 = Crew & Visa, 3 = Timing, 4 = Style & Interests, 5 = Budget Slider, 6 = Output Screen
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(() => {
    try {
      if (window.location.search.includes('share=') || window.location.hash.includes('share=')) {
        return 1;
      }
      const saved = localStorage.getItem('active_travel_itinerary');
      return saved ? 6 : 1;
    } catch {
      return 1;
    }
  });

  const [itinerary, setItinerary] = useState<TravelItinerary | null>(() => {
    try {
      if (window.location.search.includes('share=') || window.location.hash.includes('share=')) {
        return null;
      }
      const saved = localStorage.getItem('active_travel_itinerary');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retrievingShare, setRetrievingShare] = useState(false);

  // Tag inputs state
  const [customTagInput, setCustomTagInput] = useState('');
  const [avoidTagInput, setAvoidTagInput] = useState('');

  // Settle loading statement cycles
  const [loadMsgIdx, setLoadMsgIdx] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadMsgIdx((prev) => (prev + 1) % CONCIERGE_LOAD_STATEMENTS.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Load recommendations on mount
  useEffect(() => {
    fetch('/api/itinerary/recommendations')
      .then((res) => res.json())
      .then((data) => setRecommendations(data))
      .catch((err) => console.error("Failed to load curated recommendations:", err));
  }, []);

  // Sync itinerary changes to localStorage
  useEffect(() => {
    if (itinerary) {
      localStorage.setItem('active_travel_itinerary', JSON.stringify(itinerary));
    } else {
      localStorage.removeItem('active_travel_itinerary');
    }
  }, [itinerary]);

  // Handle shared link auto-retrieval
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let shareId = params.get('share');
    
    // Fallback hash check
    if (!shareId && window.location.hash.includes('share=')) {
      const match = window.location.hash.match(/[?&]share=([^&#]+)/);
      if (match) {
        shareId = match[1];
      }
    }

    if (shareId) {
      setRetrievingShare(true);
      setLoading(true);
      fetch(`/api/itinerary/share/${shareId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Could not retrieve shared itinerary");
          return res.json();
        })
        .then((data) => {
          if (data.success && data.itinerary) {
            setItinerary(data.itinerary);
            setActiveStep(6);
          }
        })
        .catch((err) => {
          console.error("Failed to load shared query:", err);
          setError("This shared travel package link could not be loaded or is invalid.");
        })
        .finally(() => {
          setRetrievingShare(false);
          setLoading(false);
        });
    }
  }, []);

  // Core destination analysis to set dynamic defaults (duration, roadtrip, transit modes)
  const handleSelectDestination = (destName: string) => {
    const isInt = !destName.toLowerCase().includes("usa") && 
                  !destName.toLowerCase().includes("hawaii") && 
                  !destName.toLowerCase().includes("arizona") &&
                  !destName.toLowerCase().includes("california") &&
                  !destName.toLowerCase().includes("new york") &&
                  !destName.toLowerCase().includes("phoenix") &&
                  !destName.toLowerCase().includes("island");

    let dur = 5;
    let autoRoadtrip = false;
    let autoCar = "ai_recommended";
    const lower = destName.toLowerCase();
    
    if (lower.includes("big island") || lower.includes("hawaii")) {
      dur = 6;
      autoRoadtrip = true;
      autoCar = "rental";
    } else if (lower.includes("amalfi")) {
      dur = 5;
      autoRoadtrip = true;
    } else if (lower.includes("kyoto") || lower.includes("tokyo")) {
      dur = 5;
      autoCar = "taxi_public";
    } else if (lower.includes("new york") || lower.includes("nyc")) {
      dur = 4;
      autoCar = "taxi_public";
    } else if (lower.includes("banff")) {
      dur = 6;
      autoRoadtrip = true;
      autoCar = "rental";
    } else if (lower.includes("phoenix")) {
      dur = 4;
      autoRoadtrip = false;
      autoCar = "rental";
    }

    setPreferences(prev => {
      const updated = {
        ...prev,
        destination: destName,
        isInternational: isInt,
        durationDays: dur,
        isRoadtrip: autoRoadtrip,
        transportType: autoCar
      };
      
      if (prev.hasDates && prev.startDate) {
        const start = new Date(prev.startDate);
        const returnDate = new Date(start);
        returnDate.setDate(start.getDate() + dur - 1);
        
        const year = returnDate.getFullYear();
        const month = String(returnDate.getMonth() + 1).padStart(2, '0');
        const day = String(returnDate.getDate()).padStart(2, '0');
        updated.endDate = `${year}-${month}-${day}`;
      }
      return updated;
    });
    
    setShowDestinationSuggest(false);
  };

  const handleSelectRecommendation = (rec: DestinationRecommendation) => {
    handleSelectDestination(rec.name + ", " + rec.country);
    setIsShowingRecs(false);
  };

  // Intelligent Date and Duration Change Handlers to ensure perfect semantic synchronization
  const handleStartDateChange = (dateStr: string) => {
    setPreferences(prev => {
      const updated = { ...prev, startDate: dateStr };
      if (dateStr && prev.durationDays) {
        const start = new Date(dateStr);
        const returnDate = new Date(start);
        returnDate.setDate(start.getDate() + prev.durationDays - 1);
        
        const year = returnDate.getFullYear();
        const month = String(returnDate.getMonth() + 1).padStart(2, '0');
        const day = String(returnDate.getDate()).padStart(2, '0');
        updated.endDate = `${year}-${month}-${day}`;
      }
      return updated;
    });
  };

  const handleEndDateChange = (dateStr: string) => {
    setPreferences(prev => {
      const updated = { ...prev, endDate: dateStr };
      if (prev.startDate && dateStr) {
        const start = new Date(prev.startDate);
        const end = new Date(dateStr);
        const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        if (daysDiff > 0) {
          updated.durationDays = daysDiff;
        }
      }
      return updated;
    });
  };

  const handleDurationDaysChangeForDates = (days: number) => {
    setPreferences(prev => {
      const updated = { ...prev, durationDays: days };
      if (prev.startDate && days > 0) {
        const start = new Date(prev.startDate);
        const returnDate = new Date(start);
        returnDate.setDate(start.getDate() + days - 1);
        
        const year = returnDate.getFullYear();
        const month = String(returnDate.getMonth() + 1).padStart(2, '0');
        const day = String(returnDate.getDate()).padStart(2, '0');
        updated.endDate = `${year}-${month}-${day}`;
      }
      return updated;
    });
  };

  // Multiple Choice Interest pill toggles
  const handleToggleInterest = (interestId: string) => {
    setPreferences(prev => {
      const exists = prev.selectedInterests.includes(interestId);
      const updated = exists 
        ? prev.selectedInterests.filter(i => i !== interestId)
        : [...prev.selectedInterests, interestId];
      return { ...prev, selectedInterests: updated };
    });
  };

  // Add Custom tag
  const handleAddCustomTag = () => {
    if (customTagInput.trim() && !preferences.customTags.includes(customTagInput.trim())) {
      setPreferences(prev => ({
        ...prev,
        customTags: [...prev.customTags, customTagInput.trim()]
      }));
      setCustomTagInput('');
    }
  };

  // Delete Custom tag
  const handleRemoveCustomTag = (tag: string) => {
    setPreferences(prev => ({
      ...prev,
      customTags: prev.customTags.filter(t => t !== tag)
    }));
  };

  // Add Avoid tag
  const handleAddAvoidTag = () => {
    if (avoidTagInput.trim() && !preferences.avoidTags.includes(avoidTagInput.trim())) {
      setPreferences(prev => ({
        ...prev,
        avoidTags: [...prev.avoidTags, avoidTagInput.trim()]
      }));
      setAvoidTagInput('');
    }
  };

  // Delete Avoid tag
  const handleRemoveAvoidTag = (tag: string) => {
    setPreferences(prev => ({
      ...prev,
      avoidTags: prev.avoidTags.filter(t => t !== tag)
    }));
  };

  // Perform Gemini full-itinerary dispatch call
  const handleFetchItinerary = async () => {
    setLoading(true);
    setError(null);
    setActiveStep(6);

    try {
      const response = await fetch('/api/itinerary/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...preferences,
          existingItinerary: itinerary
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Itinerary generation failed");
      }

      const generatedItinerary: TravelItinerary = await response.json();
      setItinerary(generatedItinerary);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during planning. Check connection and try again.");
      setActiveStep(5); // bounce back to budget to retry safely
    } finally {
      setLoading(false);
    }
  };

  // Quick reset parameters to re-plan everything
  const handleResetPlanner = () => {
    setItinerary(null);
    setPreferences(INITIAL_PREFERENCES);
    setActiveStep(1);
    setError(null);
  };

  // Keep existing preferences and just go back to form to adjust
  const handleAdjustPlanner = () => {
    // Keep itinerary loaded so we can merge/modify it instead of starting from scratch
    setActiveStep(1);
    setError(null);
  };

  // Filtering recommendation options
  const filteredRecs = recommendations.filter((rec) => {
    const term = searchRecQuery.toLowerCase();
    return (
      rec.name.toLowerCase().includes(term) ||
      rec.country.toLowerCase().includes(term) ||
      rec.themeTags.some((t) => t.toLowerCase().includes(term))
    );
  });

  return (
    <div id="travel-planner-app" className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Dynamic Styling override block for seamless real-time theme switcher */}
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --theme-primary: ${currentTheme.primary};
          --theme-primary-hover: ${currentTheme.primaryHover};
          --theme-bg-light: ${currentTheme.bgLight};
          --theme-text-dark: ${currentTheme.textDark};
          --theme-border-light: ${currentTheme.borderLight};
          --theme-glow: ${currentTheme.glow};
          --theme-shadow-sm: ${currentTheme.glow.replace('0.05', '0.15')};
        }
        
        .text-indigo-400 { color: var(--theme-primary) !important; }
        .text-indigo-600 { color: var(--theme-primary) !important; }
        .text-indigo-650 { color: var(--theme-primary) !important; }
        .text-indigo-705 { color: var(--theme-primary) !important; }
        .text-indigo-700 { color: var(--theme-primary) !important; }
        .text-indigo-750:hover { color: var(--theme-primary-hover) !important; }
        .text-indigo-800 { color: var(--theme-text-dark) !important; }
        .text-indigo-805 { color: var(--theme-text-dark) !important; }
        
        .bg-indigo-50 { background-color: var(--theme-bg-light) !important; }
        .bg-indigo-50\\/5 { background-color: var(--theme-glow) !important; }
        .bg-indigo-50\\/8 { background-color: var(--theme-glow) !important; }
        .bg-indigo-50\\/15 { background-color: var(--theme-glow) !important; }
        .bg-indigo-100 { background-color: var(--theme-bg-light) !important; }
        .bg-indigo-100\\/60 { background-color: var(--theme-bg-light) !important; }
        .bg-indigo-600 { background-color: var(--theme-primary) !important; }
        .hover\\:bg-indigo-500:hover { background-color: var(--theme-primary-hover) !important; }
        
        .border-indigo-100 { border-color: var(--theme-border-light) !important; }
        .border-indigo-150 { border-color: var(--theme-border-light) !important; }
        .border-indigo-205 { border-color: var(--theme-border-light) !important; }
        .border-indigo-100\\/45 { border-color: var(--theme-border-light) !important; }
        .shadow-indigo-500\\/10 { --tw-shadow-color: var(--theme-primary) !important; }
        .bg-indigo-500\\/5 { background-color: var(--theme-glow) !important; }
        .bg-indigo-500\\/8 { background-color: var(--theme-glow) !important; }
        
        .focus\\:outline-indigo-500\\/20:focus { outline-color: var(--theme-primary) !important; }
      `}} />

      {/* Dynamic Floating Outer Background Circle Accents */}
      <div className="fixed top-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[450px] h-[450px] bg-indigo-500/8 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Main Container Wrapper */}
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Block with humbler descriptive brand naming */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-md shadow-indigo-500/10">
                <Compass className="w-6 h-6 text-indigo-400 animate-pulse" />
              </div>
              <div>
                <h1 id="app-title" className="text-2xl font-black text-slate-950 tracking-tight flex items-center gap-2">
                  Wander AI
                </h1>
                <p className="text-xs text-slate-500 font-semibold tracking-wider">
                  Tailor pristine, bespoke journeys in real-time with AI
                </p>
              </div>
            </div>

            {/* Mood Theme selection controls */}
            <div className="flex items-center gap-2 bg-white/80 p-1 rounded-2xl border border-slate-200/60 shadow-3xs select-none">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Mood Theme:</span>
              <div className="flex gap-1">
                {Object.entries(THEME_PRESETS).map(([id, t]) => {
                  const isSelected = selectedTheme === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      id={`theme-pill-${id}`}
                      title={t.name}
                      onClick={() => setSelectedTheme(id as any)}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition cursor-pointer flex items-center gap-1 border ${
                        isSelected 
                          ? 'bg-slate-950 text-white border-slate-950 shadow-2xs' 
                          : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200/60'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: t.primary }} />
                      <span>{t.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Controls to reset parameters or reselect */}
          {activeStep > 1 && (
            <button
              onClick={handleResetPlanner}
              id="btn-restart-planning"
              type="button"
              className="px-4 py-2 text-xs font-bold text-slate-650 hover:text-rose-600 bg-white border rounded-xl hover:bg-slate-50 transition shadow-2xs flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset & Replan Trip
            </button>
          )}
        </header>

        {/* Global Actionable Error notification Banner */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-start gap-2.5 animate-slide-down">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Execution Incident Detected:</p>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Dynamic Nav Stepper Progress indicator (Invisible when printing) */}
        {activeStep < 6 && (
          <div id="planner-stepper" className="flex items-center gap-2 select-none print:hidden bg-white/70 backdrop-blur-md border border-slate-100 p-2 rounded-2xl max-w-fit flex-wrap">
            <button 
              onClick={() => preferences.destination && setActiveStep(1)} 
              disabled={activeStep === 1}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${activeStep === 1 ? 'bg-slate-950 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              1. Route
            </button>
            <span className="text-slate-305 text-xs font-mono select-none">&bull;</span>
            <button 
              onClick={() => preferences.destination && setActiveStep(2)}
              disabled={activeStep <= 2 || !preferences.destination}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${activeStep === 2 ? 'bg-slate-950 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50 disabled:opacity-50'}`}
            >
              2. Crew & Visa
            </button>
            <span className="text-slate-305 text-xs font-mono select-none">&bull;</span>
            <button 
              onClick={() => preferences.destination && setActiveStep(3)}
              disabled={activeStep <= 3 || !preferences.destination}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${activeStep === 3 ? 'bg-slate-950 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50 disabled:opacity-50'}`}
            >
              3. Timing
            </button>
            <span className="text-slate-305 text-xs font-mono select-none">&bull;</span>
            <button 
              onClick={() => preferences.destination && setActiveStep(4)}
              disabled={activeStep <= 4 || !preferences.destination}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${activeStep === 4 ? 'bg-slate-950 text-white shadow-xs' : 'text-slate-605 hover:bg-slate-50 disabled:opacity-50'}`}
            >
              4. Style
            </button>
            <span className="text-slate-305 text-xs font-mono select-none">&bull;</span>
            <button 
              onClick={() => preferences.destination && setActiveStep(5)}
              disabled={activeStep <= 5 || !preferences.destination}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${activeStep === 5 ? 'bg-slate-950 text-white shadow-xs' : 'text-slate-400 disabled:opacity-50'}`}
            >
              5. Budget
            </button>
          </div>
        )}

        {/* Layout Step render dispatcher */}
        <main className="min-h-[480px]">
          {retrievingShare ? (
            /* Elegant animated concierge loading sequence for shared retrieval */
            <div id="loading-portal" className="bg-white rounded-3xl border border-slate-150 p-8 py-16 text-center shadow-lg space-y-6 flex flex-col items-center max-w-xl mx-auto animate-fade-in my-10">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <Compass className="absolute top-5 left-5 w-6 h-6 text-indigo-600 animate-pulse" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-950 tracking-tight flex items-center gap-2 justify-center">
                  Retrieving Shared Travel Plan
                </h3>
                <p className="text-indigo-600 text-[11px] font-semibold tracking-wide uppercase">Connecting to Database</p>
                <p className="text-slate-500 text-xs font-mono px-4 leading-relaxed">
                  Calibrating travel preferences, customized budgets, visa entry controls, and flight connections...
                </p>
              </div>
            </div>
          ) : (
            <>
          
          {/* STEP 1: ROUTE & PORT CORRIDORS */}
          {activeStep === 1 && (
            <div id="step-1-basics" className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xs space-y-8 animate-fade-in">
              <div className="max-w-xl">
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">Step 1 of 5: The Route</span>
                <h3 className="text-xl font-bold text-slate-950 tracking-tight mt-3">Where & whence are you exploring?</h3>
                <p className="text-slate-500 text-xs mt-1">Select your hometown origin and your dream travel coordinates.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Field 1: Departure origin city with typeahead suggestions */}
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-705 uppercase tracking-widest mb-1.5">
                    Departure Location / Town
                  </label>
                  <input
                    type="text"
                    id="input-departure"
                    value={preferences.departure}
                    onChange={(e) => {
                      setPreferences({ ...preferences, departure: e.target.value });
                      setShowDepartureSuggest(true);
                    }}
                    onFocus={() => setShowDepartureSuggest(true)}
                    onBlur={() => setTimeout(() => setShowDepartureSuggest(false), 200)}
                    placeholder="e.g. Phoenix Sky Harbor (PHX)"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-indigo-500/20"
                  />
                  
                  {/* Suggestions dropdown */}
                  {showDepartureSuggest && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto divide-y divide-slate-100">
                      {POPULAR_DEPARTURES.filter(item => 
                        item.toLowerCase().includes(preferences.departure.toLowerCase())
                      ).map((item) => (
                        <button
                          key={item}
                          type="button"
                          onMouseDown={() => {
                            setPreferences(prev => ({ ...prev, departure: item }));
                            setShowDepartureSuggest(false);
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-xs font-semibold text-slate-850 flex items-center gap-2 transition cursor-pointer"
                        >
                          <Plane className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{item}</span>
                        </button>
                      ))}
                      {POPULAR_DEPARTURES.filter(item => 
                        item.toLowerCase().includes(preferences.departure.toLowerCase())
                      ).length === 0 && (
                        <div className="px-4 py-3 text-xs italic text-slate-400">
                          Press Tab to keep &ldquo;{preferences.departure}&rdquo;
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Field 2: Sphere Mode Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-705 uppercase tracking-widest mb-1.5">
                    Sphere Atmosphere Standard
                  </label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200/50">
                    <button
                      type="button"
                      id="opt-domestic"
                      onClick={() => setPreferences({ ...preferences, isInternational: false })}
                      className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer ${!preferences.isInternational ? 'bg-white shadow-xs text-slate-950' : 'text-slate-500'}`}
                    >
                      Domestic Voyage
                    </button>
                    <button
                      type="button"
                      id="opt-international"
                      onClick={() => setPreferences({ ...preferences, isInternational: true })}
                      className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer ${preferences.isInternational ? 'bg-white shadow-xs text-slate-950' : 'text-slate-500'}`}
                    >
                      International Voyage
                    </button>
                  </div>
                </div>

                {/* Field 3: Target Coordinates with sparkles recommendation trigger and typeahead suggestion search */}
                <div className="md:col-span-2 space-y-3 relative">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <label className="block text-xs font-bold text-slate-705 uppercase tracking-widest">
                      Destination City / Country Coordinates
                    </label>
                    <button
                      type="button"
                      id="btn-choose-for-me"
                      onClick={() => setIsShowingRecs(!isShowingRecs)}
                      className="text-xs font-bold text-indigo-650 hover:text-indigo-750 flex items-center gap-1.5 mt-0.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      I don't know, help me choose!
                    </button>
                  </div>

                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      id="input-destination"
                      value={preferences.destination}
                      onChange={(e) => {
                        setPreferences({ ...preferences, destination: e.target.value });
                        setShowDestinationSuggest(true);
                      }}
                      onFocus={() => setShowDestinationSuggest(true)}
                      onBlur={() => setTimeout(() => setShowDestinationSuggest(false), 200)}
                      placeholder="e.g. Big Island, Hawaii"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white"
                    />

                    {/* Suggestions dropdown */}
                    {showDestinationSuggest && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto divide-y divide-slate-100">
                        {POPULAR_DESTINATIONS.filter(item => 
                          item.toLowerCase().includes(preferences.destination.toLowerCase())
                        ).map((item) => (
                          <button
                            key={item}
                            type="button"
                            onMouseDown={() => handleSelectDestination(item)}
                            className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-xs font-semibold text-slate-850 flex items-center gap-2 transition cursor-pointer"
                          >
                            <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                            <span>{item}</span>
                          </button>
                        ))}
                        {POPULAR_DESTINATIONS.filter(item => 
                          item.toLowerCase().includes(preferences.destination.toLowerCase())
                        ).length === 0 && (
                          <div className="px-4 py-3 text-xs italic text-slate-400">
                            Press Tab or continue to keep &ldquo;{preferences.destination}&rdquo;
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Recommendation modal block */}
                  {isShowingRecs && (
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4 animate-slide-down" id="help-me-choose-panel">
                      <div className="flex justify-between items-center flex-wrap gap-4">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">Top Seasonal Recommendations (Summer 2026)</h4>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Info className="w-3 h-3 text-indigo-500" />
                            Pre-calculated indices are automatically loaded upon click.
                          </p>
                        </div>
                        <input
                          type="text"
                          placeholder="Search themes (e.g. hiking, beaches)..."
                          value={searchRecQuery}
                          id="search-recs-input"
                          onChange={(e) => setSearchRecQuery(e.target.value)}
                          className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium max-w-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                      <RecommendationsCard
                        recommendations={filteredRecs}
                        onSelect={handleSelectRecommendation}
                        selectedName={preferences.destination}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Step Navigation bar */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  id="btn-next-to-step-2"
                  type="button"
                  onClick={() => {
                    if (!preferences.destination) {
                      setError("Please provide or pick a destination city/region to continue.");
                      return;
                    }
                    setError(null);
                    setActiveStep(2);
                  }}
                  className="px-6 py-3 rounded-xl bg-slate-950 text-white font-semibold text-xs transition hover:bg-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  Continue to Crew & Visa
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CREW COUNT & CITIZENSHIP VISA STATUS */}
          {activeStep === 2 && (
            <div id="step-2-crew" className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xs space-y-8 animate-fade-in">
              <div className="max-w-xl">
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">Step 2 of 5: Crew & Visa Check</span>
                <h3 className="text-xl font-bold text-slate-950 tracking-tight mt-3">Traveler counts and Legal clearance</h3>
                <p className="text-slate-500 text-xs mt-1">Provide passport coordinates to trace entry exceptions & configure companion lists.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Field 1: Passport declaration */}
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-705 uppercase tracking-widest mb-1.5">
                    Your Citizenship (Exclusion & Visa logic)
                  </label>
                  <input
                    type="text"
                    id="input-citizenship"
                    value={preferences.citizenship}
                    onChange={(e) => {
                      setPreferences({ ...preferences, citizenship: e.target.value });
                      setShowCitizenshipSuggest(true);
                    }}
                    onFocus={() => setShowCitizenshipSuggest(true)}
                    onBlur={() => setTimeout(() => setShowCitizenshipSuggest(false), 200)}
                    placeholder="e.g. United States, Canada, Germany"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-indigo-500/20"
                  />
                  
                  {/* Suggestions dropdown */}
                  {showCitizenshipSuggest && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto divide-y divide-slate-100">
                      {POPULAR_CITIZENSHIPS.filter(item => 
                        item.toLowerCase().includes(preferences.citizenship.toLowerCase())
                      ).map((item) => (
                        <button
                          key={item}
                          type="button"
                          onMouseDown={() => {
                            setPreferences(prev => ({ ...prev, citizenship: item }));
                            setShowCitizenshipSuggest(false);
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-xs font-semibold text-slate-850 flex items-center gap-2 transition cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5 text-indigo-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
                          <span>{item}</span>
                        </button>
                      ))}
                      {POPULAR_CITIZENSHIPS.filter(item => 
                        item.toLowerCase().includes(preferences.citizenship.toLowerCase())
                      ).length === 0 && (
                        <div className="px-4 py-3 text-xs italic text-slate-400">
                          Press Tab to keep &ldquo;{preferences.citizenship}&rdquo;
                        </div>
                      )}
                    </div>
                  )}
                  <span className="text-[10px] text-slate-400 mt-1 block">Exquisite visa guidelines will be derived by Gemini.</span>
                </div>

                {/* Field 2: People count multiplier */}
                <div>
                  <label className="block text-xs font-bold text-slate-705 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-slate-400" />
                    Number of Travelers / Companions
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      id="input-people-count"
                      min={1}
                      max={20}
                      value={preferences.peopleCount}
                      onChange={(e) => setPreferences({ ...preferences, peopleCount: Number(e.target.value) })}
                      className="w-[100px] px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-black text-center text-slate-950 focus:bg-white"
                    />
                    <span className="text-xs text-slate-500 font-semibold">traveler(s) &bull; Budgets scale dynamically per person.</span>
                  </div>
                </div>
              </div>

              {/* Step Navigation bar */}
              <div className="pt-4 border-t border-slate-100 flex justify-between">
                <button
                  id="btn-back-to-step-1"
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition cursor-pointer"
                >
                  Back
                </button>
                <button
                  id="btn-next-to-step-3"
                  type="button"
                  onClick={() => {
                    setError(null);
                    setActiveStep(3);
                  }}
                  className="px-6 py-3 rounded-xl bg-slate-950 text-white font-semibold text-xs transition hover:bg-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  Continue to Timing
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: TRIP TIMING & SCENIC ROADTRIPS */}
          {activeStep === 3 && (
            <div id="step-3-timing" className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xs space-y-8 animate-fade-in">
              <div className="max-w-xl">
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">Step 3 of 5: Timing & Transit</span>
                <h3 className="text-xl font-bold text-slate-950 tracking-tight mt-3">Trip timing & roadtrip options</h3>
                <p className="text-slate-500 text-xs mt-1">Define calendar targets, trip durations, and scenic road trips.</p>
              </div>

              <div className="space-y-6">
                {/* Switcher dates options */}
                <div className="bg-slate-50/50 p-5 rounded-2xl border border-dashed border-slate-250 space-y-4">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <span className="text-xs font-bold text-slate-805 uppercase tracking-wider block">When are you traveling?</span>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-1 text-xs font-bold text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          id="date-opt-choose"
                          name="dateOpt"
                          checked={preferences.hasDates}
                          onChange={() => {
                            const todayStr = new Date().toISOString().split('T')[0];
                            setPreferences(prev => {
                              const updated = { ...prev, hasDates: true };
                              if (!prev.startDate) {
                                updated.startDate = todayStr;
                              }
                              if (updated.startDate && prev.durationDays) {
                                const start = new Date(updated.startDate);
                                const returnDate = new Date(start);
                                returnDate.setDate(start.getDate() + prev.durationDays - 1);
                                const year = returnDate.getFullYear();
                                const month = String(returnDate.getMonth() + 1).padStart(2, '0');
                                const day = String(returnDate.getDate()).padStart(2, '0');
                                updated.endDate = `${year}-${month}-${day}`;
                              }
                              return updated;
                            });
                          }}
                        />
                        Specific Dates
                      </label>
                      <label className="flex items-center gap-1 text-xs font-bold text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          id="date-opt-rec"
                          name="dateOpt"
                          checked={!preferences.hasDates}
                          onChange={() => setPreferences({ ...preferences, hasDates: false })}
                        />
                        AI Recommendations
                      </label>
                    </div>
                  </div>

                  {preferences.hasDates ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in text-slate-900" id="dates-subform">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-505 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                          Departure Date
                        </label>
                        <input
                          type="date"
                          id="start-date-input"
                          value={preferences.startDate || ''}
                          onChange={(e) => handleStartDateChange(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-250 rounded-xl text-xs font-bold text-slate-900"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-[11px] font-bold text-slate-505 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-indigo-600" />
                          Trip Duration (Days)
                        </label>
                        <input
                          type="number"
                          id="duration-days-input-dates"
                          min={1}
                          max={21}
                          value={preferences.durationDays}
                          onChange={(e) => handleDurationDaysChangeForDates(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-white border border-slate-250 rounded-xl text-xs font-black font-mono text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-505 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-indigo-605" />
                          Return Date
                        </label>
                        <input
                          type="date"
                          id="end-date-input"
                          value={preferences.endDate || ''}
                          onChange={(e) => handleEndDateChange(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-250 rounded-xl text-xs font-bold text-slate-900"
                        />
                      </div>
                      
                      <p className="col-span-1 md:col-span-3 text-[10px] text-slate-400 font-medium">
                        * Note: Dates are fully linked. Adjusting any single input recalculates the others instantly under the hood.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 animate-fade-in">
                      <p className="text-xs text-slate-650 font-normal leading-relaxed">
                        We will automatically recommend the best seasons (e.g., late Spring/early Fall), along with the suggested duration for <strong className="text-indigo-700">{preferences.destination || "your selection"}</strong>.
                      </p>
                      
                      <div className="flex items-center gap-3">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider shrink-0">Trip Duration:</label>
                        <div className="flex items-center gap-1.5 max-w-[120px]">
                          <input
                            type="number"
                            id="duration-days-input"
                            min={1}
                            max={21}
                            value={preferences.durationDays}
                            onChange={(e) => setPreferences({ ...preferences, durationDays: Number(e.target.value) })}
                            className="w-full px-2 py-1 bg-white border border-slate-250 rounded-lg text-xs font-black font-mono text-center"
                          />
                          <span className="text-xs text-slate-500">Days</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Desired Flight / Travel Times */}
                <div className="p-5 bg-slate-50/50 rounded-2xl border border-dashed border-slate-250 space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-805 uppercase tracking-wider block">Desired Arrival & Departure Times</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Help us customize the scheduling on Day 1 (Arrival) and your final day (Departure) based on your flight or transit times.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="arrival-time-select" className="block text-[11px] font-bold text-slate-505 uppercase tracking-wider mb-1">
                        Preferred Arrival Time at Destination
                      </label>
                      <select
                        id="arrival-time-select"
                        value={preferences.arrivalTime || '04:00 PM'}
                        onChange={(e) => setPreferences({ ...preferences, arrivalTime: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-250 rounded-xl text-xs font-bold text-slate-900"
                      >
                        <option value="08:00 AM">08:00 AM (Morning / Early Arrival)</option>
                        <option value="10:00 AM">10:00 AM (Mid-Morning)</option>
                        <option value="12:00 PM">12:00 PM (Noon / Lunch Flight)</option>
                        <option value="02:00 PM">02:00 PM (Early Afternoon)</option>
                        <option value="04:00 PM">04:00 PM (Afternoon Check-in / Standard)</option>
                        <option value="06:00 PM">06:00 PM (Late Afternoon / Evening)</option>
                        <option value="08:00 PM">08:00 PM (Night Arrival)</option>
                        <option value="10:00 PM">10:00 PM (Late Night Arrival)</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="departure-time-select" className="block text-[11px] font-bold text-slate-505 uppercase tracking-wider mb-1">
                        Preferred Departure Time from Destination
                      </label>
                      <select
                        id="departure-time-select"
                        value={preferences.departureTime || '10:00 AM'}
                        onChange={(e) => setPreferences({ ...preferences, departureTime: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-250 rounded-xl text-xs font-bold text-slate-900"
                      >
                        <option value="06:00 AM">06:00 AM (Early Departure)</option>
                        <option value="08:00 AM">08:00 AM (Morning Departure)</option>
                        <option value="10:00 AM">10:00 AM (Late Morning / Standard)</option>
                        <option value="12:00 PM">12:00 PM (Noon / Lunchtime Flight)</option>
                        <option value="02:00 PM">02:00 PM (Early Afternoon)</option>
                        <option value="04:00 PM">04:00 PM (Late Afternoon)</option>
                        <option value="06:00 PM">06:00 PM (Evening / Dinner flight)</option>
                        <option value="08:00 PM">08:00 PM (Night Flight)</option>
                        <option value="11:00 PM">11:00 PM (Late Night Red-eye)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Roadtrip checkbox and detail modifiers */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/50 space-y-3.5">
                  <span className="block text-xs font-bold text-slate-705 uppercase tracking-widest">
                    Incorporate Roadtrip elements?
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="checkbox-is-roadtrip"
                      checked={preferences.isRoadtrip}
                      onChange={(e) => setPreferences({ ...preferences, isRoadtrip: e.target.checked })}
                      className="w-4.5 h-4.5 text-indigo-650 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                    />
                    <label htmlFor="checkbox-is-roadtrip" className="text-xs font-semibold text-slate-700 cursor-pointer">
                      Yes, structure trip around beautiful road corridors
                    </label>
                  </div>

                  {preferences.isRoadtrip && (
                    <div className="p-3 bg-white border rounded-xl flex gap-4 text-xs select-none shadow-3xs animate-fade-in" id="roadtrip-details-subform">
                      <label className="flex items-center gap-1.5 font-semibold text-slate-755 cursor-pointer">
                        <input
                          type="radio"
                          id="roadtrip-to"
                          name="roadType"
                          checked={preferences.roadtripType === 'to_destination'}
                          onChange={() => setPreferences({ ...preferences, roadtripType: 'to_destination' })}
                          className="text-indigo-650 accent-indigo-600 focus:ring-indigo-500"
                        />
                        Roadtrip TO the destination
                      </label>
                      <label className="flex items-center gap-1.5 font-semibold text-slate-755 cursor-pointer">
                        <input
                          type="radio"
                          id="roadtrip-at"
                          name="roadType"
                          checked={preferences.roadtripType === 'at_destination'}
                          onChange={() => setPreferences({ ...preferences, roadtripType: 'at_destination' })}
                          className="text-indigo-650 accent-indigo-600 focus:ring-indigo-500"
                        />
                        Roadtrip AT the destination
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Step Navigation bar */}
              <div className="pt-4 border-t border-slate-100 flex justify-between">
                <button
                  id="btn-back-to-step-2"
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition cursor-pointer"
                >
                  Back
                </button>
                <button
                  id="btn-next-to-step-4"
                  type="button"
                  onClick={() => setActiveStep(4)}
                  className="px-6 py-3 rounded-xl bg-slate-950 text-white font-semibold text-xs transition hover:bg-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  Continue to Style & Interests
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: COMFORT OR AIRBNB CHOICES & INTEREST PILL CLASSIFIERS */}
          {activeStep === 4 && (
            <div id="step-4-styles" className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xs space-y-8 animate-fade-in text-slate-900">
              <div className="max-w-xl">
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">Step 4 of 5: Style & Interests</span>
                <h3 className="text-xl font-bold text-slate-950 tracking-tight mt-3">Refine Comfort & Passions</h3>
                <p className="text-slate-500 text-xs mt-1">Configure your personal comfort standards, transport styles, interests, and guardrails.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Panel Left: Comfort & Transit Specifications */}
                <div className="bg-slate-50/40 p-5 md:p-6 rounded-2xl border border-slate-200/60 space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
                    <Sliders className="w-4 h-4 text-indigo-600" />
                    <h4 className="font-bold text-slate-850 text-xs uppercase tracking-wider">Housing & Transit Setup</h4>
                  </div>
                  
                  {/* Accommodation type */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-650 uppercase tracking-widest flex items-center gap-1.5">
                      <Home className="w-3.5 h-3.5 text-indigo-505" />
                      Housing Preferred
                    </label>
                    <select
                      id="select-accommodation-type"
                      value={preferences.accommodationType}
                      onChange={(e: any) => setPreferences({ ...preferences, accommodationType: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-indigo-500/20"
                    >
                      <option value="both">Both Hotels & Airbnbs at destination</option>
                      <option value="hotel">Hotels (Comfort & premium services)</option>
                      <option value="airbnb">Airbnb (Local villas & entire homes)</option>
                    </select>
                  </div>

                  {/* Local travel transit type */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-655 uppercase tracking-widest flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-indigo-505" />
                      Transit at Destination
                    </label>
                    <select
                      id="select-transport-type"
                      value={preferences.transportType}
                      onChange={(e: any) => setPreferences({ ...preferences, transportType: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-indigo-500/20"
                    >
                      <option value="ai_recommended">Recommended by AI</option>
                      <option value="rental">Private Rental Car / SUV</option>
                      <option value="taxi_public">Taxis & local metro networks</option>
                    </select>
                  </div>

                  {/* Trip pacing select */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-655 uppercase tracking-widest flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-indigo-505" />
                      Daily Schedule Pace
                    </label>
                    <div className="grid grid-cols-3 gap-2 bg-white p-1.5 border border-slate-200 rounded-xl">
                      {['relaxed', 'balanced', 'adventurous'].map((p) => (
                        <button
                          key={p}
                          type="button"
                          id={`opt-pace-${p}`}
                          onClick={() => setPreferences({ ...preferences, pace: p as any })}
                          className={`py-2 rounded-lg text-[11px] font-bold capitalize transition cursor-pointer ${preferences.pace === p ? 'bg-slate-950 text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Flight Stops/Connections Option selection */}
                  <div className="space-y-1.5 pt-1.5 border-t border-slate-100">
                    <label className="text-[11px] font-bold text-slate-655 uppercase tracking-widest flex items-center gap-1.5">
                      <Plane className="w-3.5 h-3.5 text-indigo-505 animate-pulse" />
                      Flight Stops Preference
                    </label>
                    <div className="grid grid-cols-3 gap-2 bg-white p-1.5 border border-slate-200 rounded-xl">
                      {[
                        { id: 'nonstop', label: 'Nonstop' },
                        { id: 'one', label: '1 Stop' },
                        { id: 'any', label: 'Any Stops' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          id={`opt-stops-${item.id}`}
                          onClick={() => setPreferences({ ...preferences, preferredStops: item.id as any })}
                          className={`py-2 rounded-lg text-[11px] font-bold transition cursor-pointer ${preferences.preferredStops === item.id ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Panel Right: Interests, Passions & Guardrails */}
                <div className="bg-slate-50/40 p-5 md:p-6 rounded-2xl border border-slate-200/60 space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
                    <Tags className="w-4 h-4 text-indigo-650" />
                    <h4 className="font-bold text-slate-850 text-xs uppercase tracking-wider">Interests & Custom Passions</h4>
                  </div>

                  {/* Predefined selection tags */}
                  <div className="space-y-2">
                    <span className="block text-[11px] font-bold text-slate-650 uppercase tracking-widest">
                      Mark Core Travel Interests
                    </span>
                    <div className="flex flex-wrap gap-1.5" id="predefined-interests-box">
                      {PREDEFINED_INTERESTS.map((interest) => {
                        const isSelected = preferences.selectedInterests.includes(interest.id);
                        return (
                          <button
                            key={interest.id}
                            type="button"
                            id={`interest-tag-${interest.id}`}
                            onClick={() => handleToggleInterest(interest.id)}
                            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer select-none ${
                              isSelected
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-600'
                            }`}
                          >
                            {isSelected ? (
                              <Check className="w-3 h-3 text-white shrink-0" />
                            ) : (
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                            )}
                            {interest.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom passions input */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-slate-650 uppercase tracking-widest">
                      Add Custom Passions
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Scuba diving, Opera, Coffee, Yoga"
                        value={customTagInput}
                        id="input-custom-tag"
                        onChange={(e) => setCustomTagInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTag())}
                        className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white"
                      />
                      <button
                        type="button"
                        id="btn-add-custom-tag"
                        onClick={handleAddCustomTag}
                        className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
                      >
                        Add
                      </button>
                    </div>

                    {preferences.customTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1.5" id="custom-tags-container">
                        {preferences.customTags.map((t) => (
                          <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-800 border border-indigo-100 rounded-lg text-[10px] font-bold">
                            {t}
                            <button type="button" onClick={() => handleRemoveCustomTag(t)} className="text-indigo-500 hover:text-indigo-900 ml-1 font-bold cursor-pointer">
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Must Avoid inputs (Guardrails) */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-200/50">
                    <label className="text-[11px] font-bold text-rose-700 uppercase tracking-widest flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                      Things to AVOID
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Heights, Crowded Museums, Heavy steps"
                        value={avoidTagInput}
                        id="input-avoid-tag"
                        onChange={(e) => setAvoidTagInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAvoidTag())}
                        className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white"
                      />
                      <button
                        type="button"
                        id="btn-add-avoid-tag"
                        onClick={handleAddAvoidTag}
                        className="px-3 py-2 bg-rose-950 hover:bg-rose-900 text-white font-bold text-xs rounded-xl cursor-pointer"
                      >
                        Add
                      </button>
                    </div>

                    {preferences.avoidTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1.5" id="avoid-tags-container">
                        {preferences.avoidTags.map((t) => (
                          <span key={t} className="inline-flex items-center gap-1 px-2 py-1 bg-rose-50 text-rose-800 border border-rose-100 rounded-lg text-[10px] font-black">
                            Avoid: {t}
                            <button type="button" onClick={() => handleRemoveAvoidTag(t)} className="text-rose-500 hover:text-rose-900 ml-1 font-bold cursor-pointer">
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Step Navigation bar */}
              <div className="pt-5 border-t border-slate-100 flex justify-between">
                <button
                  id="btn-back-to-step-3"
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition cursor-pointer"
                >
                  Back
                </button>
                <button
                  id="btn-next-to-step-5"
                  type="button"
                  onClick={() => setActiveStep(5)}
                  className="px-6 py-3 rounded-xl bg-slate-950 text-white font-semibold text-xs transition hover:bg-indigo-900 flex items-center gap-1 cursor-pointer"
                >
                  Configure Budget limits
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: DYNAMIC SLIDING BUDGET CONFIGURATORS */}
          {activeStep === 5 && (
            <div className="animate-fade-in text-slate-900">
              <BudgetSlider
                destination={preferences.destination}
                durationDays={preferences.durationDays || 5}
                peopleCount={preferences.peopleCount}
                selectedBudgetType={preferences.budgetType}
                onBudgetTypeChange={(type) => setPreferences({ ...preferences, budgetType: type })}
                customDailyBudgetLimit={preferences.customDailyBudgetLimit || 220}
                onCustomDailyBudgetLimitChange={(val) => setPreferences({ ...preferences, customDailyBudgetLimit: val })}
                onNextStep={handleFetchItinerary}
                onPrevStep={() => setActiveStep(4)}
              />
            </div>
          )}

          {/* STEP 6: INTERACTIVE PLANNING DISPLAY OR ACTIVE IN-FLIGHT GENERATOR */}
          {activeStep === 6 && (
            <div>
              {loading ? (
                /* Elegant animated cycling concierge loading sequence */
                <div id="loading-portal" className="bg-white rounded-3xl border border-slate-150 p-8 py-16 text-center shadow-lg space-y-6 flex flex-col items-center max-w-xl mx-auto animate-fade-in">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <Compass className="absolute top-5 left-5 w-6 h-6 text-indigo-600 animate-pulse" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-950 tracking-tight">Designing Personalized Itinerary</h3>
                    <p className="text-indigo-600 text-[11px] font-semibold tracking-wide uppercase">Assembling Local Indexes</p>
                    <p className="text-slate-500 text-xs font-mono select-none px-4 min-h-[36px] items-center text-center leading-relaxed">
                      &ldquo;{CONCIERGE_LOAD_STATEMENTS[loadMsgIdx]}&rdquo;
                    </p>
                  </div>
                  
                  <div className="w-full max-w-[280px] bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full animate-loader-bar" style={{ width: '60%' }} />
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">Structuring timelines, prechecklists, and maps...</p>
                </div>
              ) : (
                /* Main Active Generated Custom Itinerary */
                itinerary && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-800 bg-indigo-50 border border-indigo-150 px-2.5 py-1 rounded-full">
                          Your custom itinerary is ready
                        </span>
                        <h2 className="text-2xl font-extrabold text-slate-950 mt-2">
                          Trip Planner Overview &bull; <span className="text-indigo-700">{itinerary.destination}</span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-1 flex flex-wrap gap-4 font-medium">
                          <span>Dates/Season: <strong className="text-slate-800 font-bold">{itinerary.recommendedTravelDates}</strong></span>
                          <span>&bull;</span>
                          <span>Trip length: <strong className="text-slate-800 font-bold">{itinerary.durationDays} Days</strong></span>
                          <span>&bull;</span>
                          <span>Citizenship checked: <strong className="text-slate-800 font-bold">{itinerary.citizenshipStatus}</strong></span>
                        </p>
                      </div>

                      <button
                        id="btn-re-create"
                        type="button"
                        onClick={handleAdjustPlanner}
                        className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-750 font-bold text-xs rounded-xl border border-slate-205 transition shrink-0 cursor-pointer"
                      >
                        Adjust planning elements
                      </button>
                    </div>

                    <ItineraryViewer
                      itinerary={itinerary}
                      onUpdateItinerary={(updated) => setItinerary(updated)}
                      departure={preferences.departure}
                      citizenship={preferences.citizenship}
                    />
                  </div>
                )
              )}
            </div>
          )}

            </>
          )}
        </main>

        {/* Humbler, minimalist trademark footer */}
        <footer className="pt-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-400 font-medium">
          <p>&copy; 2026 Wander AI. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 md:mt-0 font-mono">
            <span>Location indices updated real-time</span>
          </p>
        </footer>

      </div>
    </div>
  );
}
