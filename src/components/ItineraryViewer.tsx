import React, { useState } from 'react';
import { TravelItinerary, ItineraryActivity, PreTravelCheck } from '../types';
import {
  Calendar, CheckSquare, Square, PiggyBank, Mail, Share2, Printer, 
  Trash2, Edit, AlertCircle, Clock, Link, Compass, Check, X, Tag, Plus, Filter, Navigation,
  DollarSign, TrendingUp, Wallet, Plane, TrendingDown, Sparkles
} from 'lucide-react';

const EXCHANGE_RATES: Record<string, { symbol: string; rate: number; name: string }> = {
  USD: { symbol: '$', rate: 1.0, name: 'USD ($)' },
  EUR: { symbol: '€', rate: 0.92, name: 'EUR (€)' },
  GBP: { symbol: '£', rate: 0.79, name: 'GBP (£)' },
  JPY: { symbol: '¥', rate: 156.40, name: 'JPY (¥)' },
  CAD: { symbol: 'C$', rate: 1.36, name: 'CAD (C$)' },
  AUD: { symbol: 'A$', rate: 1.51, name: 'AUD (A$)' },
  INR: { symbol: '₹', rate: 83.30, name: 'INR (₹)' },
  CHF: { symbol: 'CHF', rate: 0.91, name: 'CHF' },
  SGD: { symbol: 'S$', rate: 1.35, name: 'SGD (S$)' },
  NZD: { symbol: 'NZ$', rate: 1.63, name: 'NZD (NZ$)' },
};

const DESTINATION_GASTRONOMY: Record<string, {
  dishes: string[];
  drinks: string[];
  spotlightText: string;
}> = {
  "paris": {
    dishes: ["Croissants & Pain au Chocolat (at local boulangeries)", "Coq au Vin or Duck Confit (for traditional dinner)", "Escargots with garlic butter", "Macarons (at Pierre Hermé or Ladurée)"],
    drinks: ["Bordeaux Cabernet / Pinot Noir Wine", "Café au Lait (at a sidewalk patio)", "Chablis (White Burgundy)"],
    spotlightText: "Bask in standard Parisian bistro culture. Sip espresso slowly on roadside terraces and always pair croissants with morning papers."
  },
  "rome": {
    dishes: ["Rigatoni alla Carbonara (with egg yolk and guanciale)", "Pizza al Taglio (by the slice)", "Creamy Pistachio Gelato", "Cacio e Pepe pasta"],
    drinks: ["Aperol Spritz (ideal for golden aperitivo hour)", "Espresso Shot (drunk standing at the bar)", "Frascati Superiore white wine"],
    spotlightText: "Roman dining runs on rules: espresso is a quick counter affair, and pairing cheese with seafood is traditionally discouraged!"
  },
  "tokyo": {
    dishes: ["Otoro Sushi & Sashimi (at Tsukiji Outer Market)", "Rich Tonkotsu or Shoyu Ramen", "Crispy Prawn Tempura", "Sizzling Gyoza and Yakitori skewers"],
    drinks: ["Chilled Junmai Sake", "Japanese Suntory Whisky Highball", "Ceremonial Uji Matcha tea"],
    spotlightText: "Tokyo hosts the world's most Michelin stars. Stand in line for ramen vending-machine tickets or sit at intimate golden-gai tachinomis."
  },
  "london": {
    dishes: ["Traditional Fish & Chips with mushy peas", "Sunday Roast with Yorkshire Pudding", "Warm Scones with Clotted Cream & Jam", "Full English Breakfast"],
    drinks: ["Cask-conditioned Pale Ale / Bitter", "Artisanal Gin & Tonic", "Standard English Breakfast Tea"],
    spotlightText: "Indulge in cozy gastropubs or high-end Afternoon Tea service. Traditional pubs remain the heartbeat of London neighborhoods."
  },
  "new york": {
    dishes: ["Classic NY-style Thin Crust Pizza", "Hot Pastrami Sandwich at Katz's Delicatessen", "Toasted Bagel with Lox and cream cheese", "NY Baked Velvet Cheesecake"],
    drinks: ["Classic Manhattan or Penicillin Cocktail", "Local Brooklyn Craft IPA", "Cold Brew Coffee"],
    spotlightText: "From Michelin-starred dining to late-night dollar slices and dynamic food trucks, NY's gastronomy represents every corner of the earth."
  },
  "bangkok": {
    dishes: ["Pad Thai Boran (authentic stir-fried noodles)", "Tom Yum Goong (spicy lemongrass prawn soup)", "Sweet Mango Sticky Rice", "Crispy Som Tum (green papaya salad)"],
    drinks: ["Sweet Thai Iced Tea (Cha Yen)", "Singly-chilled Singha or Chang Beer", "Fresh Young Coconut water"],
    spotlightText: "Bangkok street food is legendary. Seek out night markets, look for long queues, and never shy away from authentic local spice!"
  },
  "cabo": {
    dishes: ["Ensenada-style Crispy Fish & Shrimp Tacos", "Spicy Aguachile with local ceviche", "Freshly baked warm Churros", "Carne Asada with handmade corn tortillas"],
    drinks: ["Smoky Mezcal Paloma", "Classic Lime Margarita with Tajín rim", "Chilled Pacifico Beer with key lime"],
    spotlightText: "Baja cuisine thrives on farm-to-table organic estates and fresh, lime-cured seafood overlooking the sea."
  },
  "hawaii": {
    dishes: ["Authentic Ahi Poke Bowl (with sea salt, limu, and shoyu)", "Kalua Pork with poi", "Lilikoi (passionfruit) Shave Ice", "Spam Musubi (perfect beach snack)"],
    drinks: ["Island-style Mai Tai (with dark rum float)", "Rich Kona Coffee blend", "Tropical POG juice (Passion, Orange, Guava)"],
    spotlightText: "Pacific Rim fusion meets ancient Polynesian roots. Hit local roadside fruit stands and enjoy plate lunches after a surf."
  },
  "singapore": {
    dishes: ["Sizzling Sweet & Spicy Chili Crab", "Hainanese Chicken Rice with dark soy & ginger", "Kaya Toast with soft-boiled eggs", "Rich Laksa soup with cockles"],
    drinks: ["Iconic Singapore Sling (at Raffles Hotel)", "Frothy pulled tea (Teh Tarik)", "Ice-cold Tiger Beer"],
    spotlightText: "Explore the bustling Hawker Centers (like Maxwell or Lau Pa Sat)—many hold historic Michelin Bib Gourmands for under $6!"
  },
  "spain": {
    dishes: ["Wood-fired Valencian Paella", "Assorted Tapas & Pinchos", "Churros con Chocolate at San Ginés", "Acorn-fed Jamón Ibérico de Bellota"],
    drinks: ["Refreshing Red Wine Sangria", "Crisp Albariño white wine", "Tempranillo / Rioja red wine"],
    spotlightText: "Spain eats late! Tapas crawls start at 9 PM. Enjoy long, relaxed lunch sessions that naturally roll into 'sobremesa' conversation."
  },
  "germany": {
    dishes: ["Oven-fresh soft Bavarian Pretzels", "Crispy Veal Wiener Schnitzel", "Grilled Thuringian Bratwurst with sauerkraut", "Savory Käsespätzle (German cheese noodles)"],
    drinks: ["Freshly poured Munich Helles / Weissbier", "Dry Off-dry Mosel Riesling Wine", "Apfelschorle (apple juice spritzer)"],
    spotlightText: "Embrace high-quality local beer gardens. Hearty plates are typically balanced with seasonal white asparagus (Spargel) in spring."
  },
  "bali": {
    dishes: ["Roasted Babi Guling (suckling pig)", "Nasi Goreng or Mie Goreng (fried rice/noodles)", "Sate Lilit (minced seafood on lemongrass skewers)", "Crispy Bebek Betutu (slow-cooked duck)"],
    drinks: ["Fresh Lemongrass Ginger iced infusion", "Famous Kopi Luwak / Balinese arabica coffee", "Chilled local Bintang Beer"],
    spotlightText: "Balinese dining features aromatic sambal pastes and local coconut husks wood-firing. Explore organic cafés in Ubud's lush terraces."
  },
  "costa rica": {
    dishes: ["Traditional Gallo Pinto (black beans and rice)", "Hearty Casado lunch plate with plantains", "Fresh sea bass Ceviche with lime", "Traditional Tres Leches cake"],
    drinks: ["Premium hand-dripped Costa Rican Coffee", "Tropical Refrescos Naturales (cas / maracuyá)", "Chilled Imperial or Pilsen Beer"],
    spotlightText: "Costa Rican cuisine centers around wholesome, local ingredients. Pure vida style means clean, home-styled sodas (family restaurants)."
  },
  "iceland": {
    dishes: ["Warm Icelandic Lamb Soup (Kjötsúpa)", "Silky Skyr with fresh berries", "Lava-baked Rye Bread with salted butter", "Plokkfiskur (creamy fish stew)"],
    drinks: ["Brennivín ('Black Death' schnapps)", "Chilled Icelandic Glacier Water", "Local Craft IPAs brewed with pure spring water"],
    spotlightText: "Nordic geothermal cooking emphasizes ocean-fresh cod, smokehouses, and greenhouse-grown sweet tomatoes."
  },
  "egypt": {
    dishes: ["Koshary (lentils, rice, chickpeas, macaroni with garlic tomato sauce)", "Crispy Fava Bean Falafel (Ta'ameya)", "Spiced Beef Shawarma wraps", "Sweet flaky Baklava or Basbousa"],
    drinks: ["Karkadeh (sweet Crimson Hibiscus tea)", "Rich Egyptian Mint Tea", "Strong Turkish Coffee in copper cezves"],
    spotlightText: "Dining is a warm communal affair. Street carts fill the air with cumin, coriander, and fresh-baked flatbreads (Aysh)."
  },
  "cape town": {
    dishes: ["Cape Malay Chicken Curry", "Biltong & Droëwors air-cured meats", "Traditional Braai barbecued chops", "Sweet, syrup-coated Koesisters / Koeksisters"],
    drinks: ["Cape Winelands Pinotage / Chenin Blanc", "Herbal Rooibos Tea", "Crisp Cape Town Craft Gin"],
    spotlightText: "Bask in oceanfront dining, world-class vineyard estates in Stellenbosch, and vibrant spices reflecting centuries of crossroads."
  },
  "brazil": {
    dishes: ["Rich Feijoada black bean & pork stew", "Warm, cheesy Pão de Queijo (tapioca cheese rolls)", "Sweet chocolate Brigadeiro truffles", "Churrasco flame-grilled steak cuts"],
    drinks: ["Fresh lime Caipirinha (with cachaça cane spirit)", "Ice-cold Guaraná Antarctica soda", "Chilled draft beer (Chopp)"],
    spotlightText: "Brazilians appreciate long Churrascaria barbecues and fresh coastal Moqueca stews. Eat pastel pastries after Sunday markets."
  }
};

const getLocalGastronomy = (destName: string) => {
  const term = destName.toLowerCase();
  const matchKey = Object.keys(DESTINATION_GASTRONOMY).find(key => 
    term.includes(key) || key.includes(term)
  );
  
  if (matchKey) {
    return DESTINATION_GASTRONOMY[matchKey];
  }
  
  return {
    dishes: [
      `Signature street-food specialities in ${destName}`,
      "Highly-rated locally-owned family bistros",
      "Famous native traditional sweet treats"
    ],
    drinks: [
      "Regionally brewed craft beers / spirits",
      "Native hot espresso / custom-pulled tea blends"
    ],
    spotlightText: `Savor the local palate of ${destName}. Seeking out street crowds and small neighborhood spots is the absolute best way to discover authentic regional flavor.`
  };
};

interface ItineraryViewerProps {
  itinerary: TravelItinerary;
  onUpdateItinerary: (updated: TravelItinerary) => void;
  departure?: string;
  citizenship?: string;
}

export default function ItineraryViewer({ 
  itinerary, 
  onUpdateItinerary,
  departure,
  citizenship 
}: ItineraryViewerProps) {
  const departureCity = departure || 'New York (JFK)';
  const gastronomy = getLocalGastronomy(itinerary.destination);
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [editingActivity, setEditingActivity] = useState<{ dayIdx: number; actIdx: number; activity: ItineraryActivity } | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<'booking' | 'documents' | 'packing' | 'visa' | 'other'>('booking');
  const [activeChecklistFilter, setActiveChecklistFilter] = useState<string>('all');

  // Currency Converter target selections
  const [homeCurrency, setHomeCurrency] = useState<string>('USD');

  // Currency Converter target formatter
  const formatCostInHomeCurrency = (usdCost: number) => {
    const data = EXCHANGE_RATES[homeCurrency] || EXCHANGE_RATES.USD;
    const value = usdCost * data.rate;
    return `${data.symbol}${Math.round(value).toLocaleString()} ${homeCurrency}`;
  };

  // Quick helper for currency translation notice
  const getExchangeFactorStr = () => {
    if (homeCurrency === 'USD') return 'Calibrated in USD.';
    const data = EXCHANGE_RATES[homeCurrency];
    return `Approx exchange rate: 1 USD = ${data.symbol}${data.rate.toFixed(2)} ${homeCurrency}`;
  };



  // AI Interactive Travel Companion Chat
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([
    { 
      sender: 'assistant', 
      text: `Hi there! I am your AI Travel Co-pilot chat assistant. I can co-edit and update this final travel itinerary live! Tell me what you'd like to adjust. For example:
- "Can you make Day 2 much more relaxed with fewer activities?"
- "Let's change the pace to adventurous and add wine tastings."
- "Scale the estimated accommodation budget to luxury and change transport to a sports rental car."`
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMessageText = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userMessageText }]);
    setChatInput('');
    setChatLoading(true);
    setChatError(null);

    try {
      const response = await fetch('/api/itinerary/modify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itinerary: itinerary,
          message: userMessageText
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || errData.details || 'Failed to modify itinerary');
      }

      const data = await response.json();
      
      setChatMessages(prev => [...prev, { sender: 'assistant', text: data.assistantMessage }]);
      
      if (data.updatedItinerary) {
        onUpdateItinerary(data.updatedItinerary);
      }
    } catch (err: any) {
      console.error(err);
      setChatError(err.message || 'Something went wrong while updating your package.');
      setChatMessages(prev => [...prev, { 
        sender: 'assistant', 
        text: `⚠️ Apologies, I ran into an error trying to apply those changes: ${err.message || 'Server timeout'}. Please try a simpler change or re-submit!` 
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Trigger Copy Share Link Flow
  const [shareStatus, setShareStatus] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const handleShareItinerary = async () => {
    if (shareLoading) return;
    setShareLoading(true);
    try {
      const response = await fetch('/api/itinerary/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itinerary: itinerary })
      });
      const data = await response.json();
      if (data.success) {
        const shareUrl = `${window.location.origin}${window.location.pathname}?share=${data.id}#itinerary`;
        await navigator.clipboard.writeText(shareUrl);
        setShareStatus(true);
        setTimeout(() => setShareStatus(false), 3000);
      } else {
        throw new Error(data.error || "Sharing retrieval failed");
      }
    } catch (err) {
      console.error("Failed to generate share link:", err);
      // Fallback in case of network issue
      const fallbackUrl = `${window.location.origin}${window.location.pathname}#itinerary`;
      await navigator.clipboard.writeText(fallbackUrl);
      setShareStatus(true);
      setTimeout(() => setShareStatus(false), 3000);
    } finally {
      setShareLoading(false);
    }
  };

  // Trigger Print Itinerary
  const handlePrintItinerary = () => {
    window.print();
  };

  // Delete Activity / Event
  const handleDeleteActivity = (dayIdx: number, actIdx: number) => {
    const updatedDays = [...itinerary.days];
    updatedDays[dayIdx].activities = updatedDays[dayIdx].activities.filter((_, idx) => idx !== actIdx);
    
    // Recalculate budgeting totals based on active remaining items
    let updatedCostForActivities = 0;
    updatedDays.forEach(d => {
      d.activities.forEach(a => {
        updatedCostForActivities += (a.estimatedCost || 0);
      });
    });

    const newTotal = (itinerary.budget.accommodation.estimatedCost || 0) + 
                     (itinerary.budget.transport.estimatedCost || 0) + 
                     updatedCostForActivities + 
                     (itinerary.budget.foodAndMisc.estimatedCost || 0);

    onUpdateItinerary({
      ...itinerary,
      days: updatedDays,
      budget: {
        ...itinerary.budget,
        activities: {
          ...itinerary.budget.activities,
          estimatedCost: updatedCostForActivities,
        },
        totalEstimated: newTotal
      }
    });
  };

  // Edit Activity Modal submission
  const handleSaveEditedActivity = () => {
    if (!editingActivity) return;
    const { dayIdx, actIdx, activity } = editingActivity;
    
    const updatedDays = [...itinerary.days];
    updatedDays[dayIdx].activities[actIdx] = activity;

    // Re-tally dynamic budget estimation
    let updatedCostForActivities = 0;
    updatedDays.forEach(d => {
      d.activities.forEach(a => {
        updatedCostForActivities += (a.estimatedCost || 0);
      });
    });

    const newTotal = (itinerary.budget.accommodation.estimatedCost || 0) + 
                     (itinerary.budget.transport.estimatedCost || 0) + 
                     updatedCostForActivities + 
                     (itinerary.budget.foodAndMisc.estimatedCost || 0);

    onUpdateItinerary({
      ...itinerary,
      days: updatedDays,
      budget: {
        ...itinerary.budget,
        activities: {
          ...itinerary.budget.activities,
          estimatedCost: updatedCostForActivities
        },
        totalEstimated: newTotal
      }
    });

    setEditingActivity(null);
  };

  // Toggle Checklist Checks
  const toggleChecklistTask = (taskId: string) => {
    const updatedChecks = itinerary.preTravelChecks.map((check) => {
      if (check.id === taskId) {
        return { ...check, completed: !check.completed };
      }
      return check;
    });
    onUpdateItinerary({
      ...itinerary,
      preTravelChecks: updatedChecks
    });
  };

  // Add Custom Checklist Item
  const handleAddCustomChecklistTask = () => {
    if (!newTaskText.trim()) return;
    
    const newTask: PreTravelCheck = {
      id: `check-${Date.now()}`,
      task: newTaskText,
      category: newTaskCategory,
      dueDate: 'Before Departure',
      notes: 'Added custom preparation parameter.',
      completed: false
    };

    onUpdateItinerary({
      ...itinerary,
      preTravelChecks: [newTask, ...itinerary.preTravelChecks]
    });

    setNewTaskText('');
    setIsAddingTask(false);
  };

  // Delete checklist item
  const handleDeleteChecklistItem = (taskId: string) => {
    onUpdateItinerary({
      ...itinerary,
      preTravelChecks: itinerary.preTravelChecks.filter((c) => c.id !== taskId)
    });
  };

  // Filter checklist
  const filteredChecks = itinerary.preTravelChecks.filter(check => {
    if (activeChecklistFilter === 'all') return true;
    if (activeChecklistFilter === 'completed') return check.completed;
    if (activeChecklistFilter === 'pending') return !check.completed;
    return check.category === activeChecklistFilter;
  });

  const activeDayObj = itinerary.days[activeDayIdx] || itinerary.days[0];

  return (
    <div id="itinerary-board" className="space-y-8 print:p-0">
      {/* Action Utilities Banner (Invisible when printing) */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 text-white rounded-2xl p-4 shadow-sm print:hidden">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" />
          <span className="text-xs font-mono uppercase text-slate-400">Share or Print itinerary</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Share Button */}
          <button
            id="btn-share-itinerary"
            type="button"
            disabled={shareLoading}
            onClick={handleShareItinerary}
            className={`px-3.5 py-1.5 rounded-lg bg-slate-850 text-xs font-semibold hover:bg-slate-800 transition flex items-center gap-1 ${shareLoading ? 'opacity-65 cursor-not-allowed' : ''}`}
          >
            {shareLoading ? (
              <span className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin shrink-0" />
            ) : shareStatus ? (
              <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            ) : (
              <Share2 className="w-3.5 h-3.5 shrink-0" />
            )}
            {shareLoading ? "Generating..." : shareStatus ? "Link Copied" : "Share Plan"}
          </button>

          {/* Print / Save to PDF */}
          <button
            id="btn-print-itinerary"
            type="button"
            onClick={handlePrintItinerary}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-xs font-semibold hover:bg-indigo-500 transition flex items-center gap-1"
          >
            <Compass className="w-3.5 h-3.5 animate-pulse" />
            Print / Save to PDF
          </button>
        </div>
      </div>

      {/* AI Status Banner */}
      <div className="print:hidden">
        {itinerary.isFallback ? (
          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-950">Active Flight Mode: Local Fallback Planner Active</p>
                <p className="text-amber-800 mt-0.5">We fell back to a localized package structure because the Gemini API timed out or encountered an error. To use active dynamic AI-generated itineraries, confirm that your <strong>GEMINI_API_KEY</strong> is configured in AI Studio under the <strong>Settings &gt; Secrets</strong> panel.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-indigo-50/50 border border-indigo-150/80 text-indigo-900 rounded-2xl text-xs flex items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mt-1.5 shrink-0" />
              <div>
                <p className="font-bold text-slate-905 flex items-center gap-1.5">
                  AI Generation Successful
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Gemini 3.5 Live</span>
                </p>
                <p className="text-slate-600 mt-0.5">Your itinerary has been custom generated in real-time by Google Gemini based on your departure, citizenship status, pace, and interests.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Print-Only Header */}
      <div className="hidden print:block mb-8 border-b-2 border-slate-900 pb-4">
        <h1 className="text-3xl font-black text-slate-900 uppercase">Wander AI Plan</h1>
        <p className="text-lg font-bold text-slate-800">{itinerary.destination} &bull; {itinerary.durationDays} Days</p>
        <p className="text-xs text-slate-500 mt-1">Prepared: May 25, 2026 &bull; Travel Dates Recommended: {itinerary.recommendedTravelDates}</p>
      </div>

      {/* Grid Layout: Left Column (Itinerary & Details) | Right Column (Visa & Checklist & Budget) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: ACTIVE ITINERARY TIMELINE (8 cols) */}
        <div className="lg:col-span-8 space-y-6 print:w-full">
          
          {/* FLIGHT RECOMMENDATIONS SECTION */}
          {itinerary.flightDetails && (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-5" id="flights-recommendations-section">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-50 rounded-2xl">
                    <Plane className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm md:text-base">Live Flight Finder & Direct Airfare Search</h3>
                    <p className="text-[10px] text-slate-500 font-medium font-sans">
                      Pre-filled search links from <strong>{departureCity}</strong> to <strong>{itinerary.destination}</strong>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg font-black uppercase border border-indigo-100/60 font-mono tracking-wider">
                    {itinerary.flightDetails.preferredStops === 'nonstop' ? 'Nonstop Flights preferred' : 
                     itinerary.flightDetails.preferredStops === 'one' ? 'Max 1 Stop preferred' : 'All Connections preferred'}
                  </span>
                </div>
              </div>

              {/* Informative advice / security */}
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl">
                <p className="text-xs text-slate-600 leading-relaxed">
                  To ensure you access <strong>100% accurate, live-market airfares, carrier updates, and direct schedule bookings</strong> without any outdated values or AI-modeled price hallucinations, use the verified airfare deep links below. Your exact route and preferences have been pre-mapped for you:
                </p>
              </div>

              {/* Price alerts and shifting recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {itinerary.flightDetails.dealAlert && (
                  <div className="p-3.5 bg-emerald-50/55 border border-emerald-100 rounded-2xl flex gap-2.5 items-start">
                    <TrendingDown className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wide text-emerald-800 font-sans block">Best Cost Deals</span>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">{itinerary.flightDetails.dealAlert}</p>
                    </div>
                  </div>
                )}
                {itinerary.flightDetails.bestPriceAdvice && (
                  <div className="p-3.5 bg-blue-50/45 border border-blue-100 rounded-2xl flex gap-2.5 items-start">
                    <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wide text-blue-800 font-sans block">Dynamic Advisory</span>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">{itinerary.flightDetails.bestPriceAdvice}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Link Options */}
              <div className="space-y-3 pt-1">
                <div className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Search Live Fares Instantly:</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  
                  {/* Google Flights */}
                  <a
                    href={itinerary.flightDetails.bookingDeepLink || `https://www.google.com/search?q=google+flights+from+${encodeURIComponent(departureCity)}+to+${encodeURIComponent(itinerary.destination)}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="p-4 bg-white border border-slate-150 hover:border-indigo-200 hover:shadow-xs rounded-2xl transition flex flex-col justify-between group h-full"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-950 font-sans tracking-tight">Google Flights</span>
                        <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded uppercase">Official</span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 leading-relaxed">
                        Compare live pricing grids, track trends, and purchase tickets directly from major airlines.
                      </p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                      <span>Search on Google &rarr;</span>
                    </div>
                  </a>

                  {/* Skyscanner */}
                  <a
                    href={`https://www.skyscanner.com/transport/flights/${encodeURIComponent(departureCity.split('(')[0].trim())}/${encodeURIComponent(itinerary.destination.split(',')[0].trim())}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="p-4 bg-white border border-slate-150 hover:border-indigo-200 hover:shadow-xs rounded-2xl transition flex flex-col justify-between group h-full"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-950 font-sans tracking-tight">Skyscanner</span>
                        <span className="text-[9px] bg-teal-50 text-teal-600 font-bold px-1.5 py-0.5 rounded uppercase">Metasearch</span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 leading-relaxed">
                        Check global budget carriers, multi-airline connections, and flexible date aggregators.
                      </p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-indigo-650 group-hover:text-indigo-750">
                      <span>Search Skyscanner &rarr;</span>
                    </div>
                  </a>

                  {/* Kayak */}
                  <a
                    href={`https://www.kayak.com/flights/${encodeURIComponent(departureCity.split('(')[0].trim())}-${encodeURIComponent(itinerary.destination.split(',')[0].trim())}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="p-4 bg-white border border-slate-150 hover:border-indigo-200 hover:shadow-xs rounded-2xl transition flex flex-col justify-between group h-full"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-950 font-sans tracking-tight">Kayak</span>
                        <span className="text-[9px] bg-orange-50 text-orange-600 font-bold px-1.5 py-0.5 rounded uppercase font-sans">Compare</span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 leading-relaxed">
                        Analyze optimal booking timing projections, hacker fares, and third-party discount options.
                      </p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-indigo-650 group-hover:text-indigo-750">
                      <span>Search Kayak &rarr;</span>
                    </div>
                  </a>

                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs">
            
            {/* Tab controls to toggle days */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6 print:hidden">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 flex items-center gap-1">
                <Compass className="w-4 h-4" />
                Select Daily Plan
              </span>
              <span className="text-xs text-slate-500">{itinerary.durationDays} Days Total</span>
            </div>

            {/* Scrolling tab segment */}
            <div className="flex space-x-2 overflow-x-auto pb-3 mb-6 print:hidden scrollbar-none" id="itinerary-days-tabs">
              {itinerary.days.map((day, idx) => (
                <button
                  key={day.dayNumber}
                  id={`tab-day-${day.dayNumber}`}
                  onClick={() => setActiveDayIdx(idx)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    activeDayIdx === idx
                      ? 'bg-slate-950 text-white shadow-sm'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Day {day.dayNumber}
                  <span className="block text-[10px] font-normal opacity-75">{day.activities.length} Events</span>
                </button>
              ))}
            </div>

            {/* Print-All Days indicator */}
            <div className="hidden print:block space-y-12">
              {itinerary.days.map((dayObj) => (
                <div key={dayObj.dayNumber} className="page-break-after">
                  <div className="border-b-2 border-slate-200 pb-2 mb-4">
                    <h2 className="text-xl font-extrabold text-slate-900">
                      Day {dayObj.dayNumber}: {dayObj.theme}
                    </h2>
                    <p className="text-xs text-slate-500">{dayObj.date}</p>
                  </div>
                  {renderActivitiesList(dayObj.activities, itinerary.days.indexOf(dayObj), true)}
                </div>
              ))}
            </div>

            {/* Active Displayed Screen (Visiable purely in interactive interface) */}
            <div className="print:hidden">
              {activeDayObj ? (
                <div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-indigo-50/15 p-4 rounded-2xl border border-indigo-100/45">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100/60 px-2.5 py-1 rounded-full">
                        Day {activeDayObj.dayNumber} Plan
                      </span>
                      <h3 className="text-lg font-bold text-slate-950 mt-1">{activeDayObj.theme}</h3>
                    </div>
                    <span className="text-xs font-mono text-slate-500">{activeDayObj.date}</span>
                  </div>

                  {/* Render activities list */}
                  {renderActivitiesList(activeDayObj.activities, activeDayIdx, false)}
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">Loading plan events...</div>
              )}
            </div>

          </div>

          {/* Location-based AI recommendations advice box */}
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-700 block mb-1">Local Concierge Tip</span>
            <p className="text-slate-700 text-sm leading-relaxed">{itinerary.whyThisRecommendation}</p>
            {itinerary.whyThisRecommendationLinks && itinerary.whyThisRecommendationLinks.length > 0 && (
              <div className="mt-4 pt-4 border-t border-indigo-100/60">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-700 font-mono block mb-2">
                  ℹ️ Supporting Research & Verification Source Links
                </span>
                <div className="flex flex-wrap gap-2">
                  {itinerary.whyThisRecommendationLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      id={`rec-link-${idx}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-indigo-50 text-indigo-900 text-xs font-semibold rounded-xl border border-indigo-100 transition shadow-xs group"
                    >
                      <Link size={12} className="text-indigo-600 group-hover:scale-110 transition-transform" />
                      <span>{link.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* GASTRONOMY & LOCAL DINING RECOMMENDATIONS */}
          <div className="bg-amber-50/40 border border-amber-100/60 rounded-3xl p-6 shadow-xs relative overflow-hidden animate-fade-in" id="gastronomy-card">
            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-550/5 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-amber-100/40">
              <span className="p-1.5 bg-amber-100/60 text-amber-800 rounded-lg text-xs font-bold leading-none shrink-0 inline-block">🍽️</span>
              <div>
                <h4 className="font-bold text-slate-950 text-sm">Gourmet Food & Drink Guide</h4>
                <p className="text-[10px] text-amber-850 uppercase tracking-wider font-extrabold font-mono">Local Culinary Highlights</p>
              </div>
            </div>

            <p className="text-slate-700 text-xs leading-relaxed italic mb-4 font-semibold">
              &ldquo;{gastronomy.spotlightText}&rdquo;
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Famous Dishes */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-800 font-mono block">🥗 Must-Try Dishes</span>
                <ul className="space-y-1.5">
                  {gastronomy.dishes.map((dish, i) => (
                    <li key={i} className="flex gap-1.5 items-start text-xs text-slate-700 leading-relaxed font-semibold">
                      <span className="text-amber-500 mt-1 shrink-0 bg-amber-300 w-1.5 h-1.5 rounded-full" />
                      <span>{dish}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Famous Drinks */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-800 font-mono block">🥃 Local Drinks & Coffee</span>
                <ul className="space-y-1.5">
                  {gastronomy.drinks.map((drink, i) => (
                    <li key={i} className="flex gap-1.5 items-start text-xs text-slate-700 leading-relaxed font-semibold">
                      <span className="text-amber-500 mt-1 shrink-0 bg-amber-300 w-1.5 h-1.5 rounded-full" />
                      <span>{drink}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-amber-100/45 flex flex-wrap gap-3 items-center justify-between text-[11px] font-bold">
              <span className="text-slate-400 font-mono text-[9px] font-normal italic">Curation derived from regional taste catalogs</span>
              <a
                href={`https://www.google.com/search?q=must+try+signature+local+food+and+restaurants+in+${encodeURIComponent(itinerary.destination)}`}
                target="_blank"
                rel="noreferrer referrer"
                className="inline-flex items-center gap-1 text-amber-850 hover:text-amber-950 hover:underline transition font-bold"
              >
                <Link className="w-2.5 h-2.5" />
                Find Hot Spots
              </a>
            </div>
          </div>

          {/* AI Interactive Co-pilot Chat Panel */}
          <div className="bg-slate-900 text-white rounded-3xl border border-slate-850 p-6 relative overflow-hidden print:hidden" id="ai-chat-co-pilot-card">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-3">
              <div className="p-2 bg-indigo-600 rounded-xl text-white flex items-center justify-center shadow-md">
                <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '10s' }} />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-150 flex items-center gap-1.5">
                  AI Itinerary Co-pilot
                  <span className="text-[9px] bg-indigo-500/25 text-indigo-300 border border-indigo-500/35 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">Live co-editor</span>
                </h4>
                <p className="text-[10px] text-slate-400">Refine details, swap events, or adjust travel pacing with total cost recalculations.</p>
              </div>
            </div>

            {/* Chat Messages Log */}
            <div className="space-y-4 max-h-[280px] overflow-y-auto mb-4 p-3.5 bg-slate-950/45 rounded-2xl border border-slate-800 scrollbar-thin">
              {chatMessages.map((msg, midx) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={midx}
                    className={`flex items-start gap-2.5 max-w-[90%] text-xs ${
                      isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg shrink-0 ${isUser ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-indigo-300'}`}>
                      {isUser ? (
                        <span className="font-bold text-[8px] uppercase">Me</span>
                      ) : (
                        <Compass className="w-3.5 h-3.5" />
                      )}
                    </div>
                    
                    <div className={`p-3 rounded-2xl ${
                      isUser 
                        ? 'bg-indigo-600 text-white rounded-tr-none shadow-sm' 
                        : 'bg-slate-850 text-slate-200 border border-slate-800 rounded-tl-none leading-relaxed'
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                );
              })}
              
              {chatLoading && (
                <div className="flex items-center gap-2 mr-auto max-w-[80%] text-xs">
                  <div className="p-1.5 rounded-lg bg-slate-800 text-indigo-300 shrink-0">
                    <Compass className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <div className="p-3 bg-slate-850 text-slate-400 border border-slate-800 rounded-2xl rounded-tl-none flex items-center gap-2 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="font-bold tracking-wide text-[10px] uppercase text-slate-500">Updating active schedule...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input submission box */}
            <form onSubmit={handleSendChatMessage} className="flex gap-2">
              <input
                type="text"
                id="input-copilot-text"
                value={chatInput}
                disabled={chatLoading}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Can you swap Day 2 morning hiking with a relaxed cafe crawl instead?"
                className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 text-xs rounded-xl text-slate-150 placeholder-slate-500 focus:outline-none focus:border-indigo-500 disabled:opacity-50 font-medium"
              />
              <button
                type="submit"
                id="btn-send-copilot"
                disabled={!chatInput.trim() || chatLoading}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-xs transition flex items-center justify-center cursor-pointer shrink-0"
              >
                Refine Itinerary
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: VISA CHECKS, PRE-TRAVEL PREPARATIONS & DYNAMIC BUDGETING GRAPH (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. ENTRY VISA CONDITIONS PANEL */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 space-y-3" id="visa-conditions-card">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              Visa & Entry Requirements
            </h4>
            <div className="text-xs text-slate-700 leading-relaxed font-medium">
              <p className="mb-2">
                Citizenship status: <span className="font-black underline uppercase text-slate-950">{itinerary.citizenshipStatus}</span>
              </p>
              <div className="p-3 bg-white/70 border border-amber-200 rounded-xl rounded-tl-none font-normal text-[11px]">
                {itinerary.visaConditions}
              </div>
            </div>
          </div>
          {/* 2. DYNAMIC BUDGET ESTIMATIONS PANEL WITH CURRENCY CONVERTER */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs" id="budget-summary-card">
            <div className="flex flex-col gap-2 mb-4 pb-4 border-b border-slate-100">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-slate-950 flex items-center gap-2">
                  <PiggyBank className="w-5 h-5 text-indigo-600" />
                  Cost Breakdowns & Convert Currency
                </h4>
              </div>
              
              {/* Currency Converter Selector Panel */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100/80 flex items-center justify-between text-xs mt-1">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[9px] flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-indigo-500" />
                  Convert To Home Currency:
                </span>
                <select
                  id="currency-converter-select"
                  value={homeCurrency}
                  onChange={(e) => setHomeCurrency(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg py-1 px-2 text-[11px] font-bold text-slate-800 shrink-0 focus:outline-none focus:border-indigo-500"
                >
                  {Object.entries(EXCHANGE_RATES).map(([code, config]) => (
                    <option key={code} value={code}>
                      {config.name}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-[9px] text-slate-400 font-mono text-right italic pt-0.5">
                {getExchangeFactorStr()}
              </p>
            </div>
            
            <div className="space-y-4">
              
              {/* Category: Hotel / Accomodations */}
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">Accommodations</span>
                  <span className="font-mono text-slate-900 font-extrabold flex flex-col items-end text-right">
                    <span>${itinerary.budget.accommodation.estimatedCost.toLocaleString()}</span>
                    {homeCurrency !== 'USD' && (
                      <span className="text-[10px] text-indigo-600 font-extrabold">
                        &asymp; {formatCostInHomeCurrency(itinerary.budget.accommodation.estimatedCost)}
                      </span>
                    )}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Type: {itinerary.budget.accommodation.type} &bull; {itinerary.budget.accommodation.explanation}
                </p>
                <a
                  href={itinerary.budget.accommodation.deepLink}
                  target="_blank"
                  rel="noreferrer referrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-650 hover:text-indigo-800 hover:underline transition"
                >
                  <Link className="w-3 h-3" />
                  Search Hotels/Airbnb Booking
                </a>
              </div>

              {/* Category: Flights & Jet Fare */}
              <div className="p-3 bg-indigo-50/45 border border-indigo-100 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-950 flex items-center gap-1.5">
                    <Plane className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                    Flights & Jet Fare
                  </span>
                  <span className="font-mono text-slate-900 font-extrabold flex flex-col items-end text-right">
                    <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-bold font-mono">LIVE LOOKUP</span>
                  </span>
                </div>
                <p className="text-[10px] text-slate-650 leading-tight">
                  Search live flight schedules, airlines, and cheap airfares from <strong className="text-slate-950 font-bold">{departureCity}</strong> to <strong className="text-slate-950 font-bold">{itinerary.destination}</strong>.
                </p>
                <a
                  href={`https://www.google.com/search?q=google+flights+from+${encodeURIComponent(departureCity)}+to+${encodeURIComponent(itinerary.destination)}`}
                  target="_blank"
                  rel="noreferrer referrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-650 hover:text-indigo-850 hover:underline transition font-sans"
                >
                  <Link className="w-3 h-3" />
                  Search Flights (Google Flights)
                </a>
              </div>

              {/* Category: Transport */}
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">Transit & Bookings</span>
                  <span className="font-mono text-slate-900 font-extrabold flex flex-col items-end text-right">
                    <span>${itinerary.budget.transport.estimatedCost.toLocaleString()}</span>
                    {homeCurrency !== 'USD' && (
                      <span className="text-[10px] text-indigo-600 font-extrabold">
                        &asymp; {formatCostInHomeCurrency(itinerary.budget.transport.estimatedCost)}
                      </span>
                    )}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Type: {itinerary.budget.transport.type} &bull; {itinerary.budget.transport.explanation}
                </p>
                <a
                  href={itinerary.budget.transport.deepLink}
                  target="_blank"
                  rel="noreferrer referrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-650 hover:text-indigo-800 hover:underline transition"
                >
                  <Link className="w-3 h-3" />
                  Search Tickets & Flights Room
                </a>
              </div>

              {/* Category: Activities */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">Activities / Admissions</span>
                  <span className="font-mono text-slate-900 font-extrabold flex flex-col items-end text-right">
                    <span>${itinerary.budget.activities.estimatedCost.toLocaleString()}</span>
                    {homeCurrency !== 'USD' && (
                      <span className="text-[10px] text-indigo-600 font-extrabold">
                        &asymp; {formatCostInHomeCurrency(itinerary.budget.activities.estimatedCost)}
                      </span>
                    )}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  {itinerary.budget.activities.explanation}
                </p>
              </div>

              {/* Category: Food */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">Daily Meals & Misc</span>
                  <span className="font-mono text-slate-900 font-extrabold flex flex-col items-end text-right">
                    <span>${itinerary.budget.foodAndMisc.estimatedCost.toLocaleString()}</span>
                    {homeCurrency !== 'USD' && (
                      <span className="text-[10px] text-indigo-600 font-extrabold">
                        &asymp; {formatCostInHomeCurrency(itinerary.budget.foodAndMisc.estimatedCost)}
                      </span>
                    )}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  {itinerary.budget.foodAndMisc.explanation}
                </p>
              </div>

            </div>
          </div>

          {/* 3. PRE-TRAVEL CHECKLIST COMPONENT */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs relative print:hidden" id="checklist-card">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-slate-950 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-indigo-600" />
                Pre-Travel Checklist
              </h4>
              <button
                id="btn-trigger-add-task"
                type="button"
                onClick={() => setIsAddingTask(!isAddingTask)}
                className="p-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-600"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Filter checklist tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 shrink-0 select-none">
              {['all', 'booking', 'visa', 'packing', 'documents', 'completed'].map((f) => (
                <button
                  key={f}
                  type="button"
                  id={`checklist-filter-${f}`}
                  onClick={() => setActiveChecklistFilter(f)}
                  className={`px-2 py-1 rounded text-[10px] font-bold capitalize transition shrink-0 ${
                    activeChecklistFilter === f
                      ? 'bg-slate-950 text-white'
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Adding Task Section Form */}
            {isAddingTask && (
              <div className="my-3 p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-200 animate-slide-down">
                <input
                  type="text"
                  placeholder="e.g. Purchase travel adapters"
                  value={newTaskText}
                  id="input-new-task-text"
                  onChange={(e) => setNewTaskText(e.target.value)}
                  className="w-full px-2 py-1 bg-white border border-slate-250 text-xs rounded"
                />
                
                <div className="flex justify-between items-center gap-2">
                  <select
                    id="select-new-task-category"
                    value={newTaskCategory}
                    onChange={(e: any) => setNewTaskCategory(e.target.value)}
                    className="text-[10px] px-1.5 py-1 bg-white border border-slate-250 rounded font-semibold text-slate-800"
                  >
                    <option value="booking">Booking</option>
                    <option value="documents">Documents</option>
                    <option value="packing">Packing</option>
                    <option value="visa">Visa Info</option>
                    <option value="other">Other</option>
                  </select>

                    <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingTask(false)}
                      className="p-1 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      id="btn-save-new-task"
                      onClick={handleAddCustomChecklistTask}
                      className="px-2 py-0.5 whitespace-nowrap bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded"
                    >
                      Add Task
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Render Checklist */}
            <div className="mt-4 space-y-2 max-h-[290px] overflow-y-auto scrollbar-thin">
              {filteredChecks.length === 0 ? (
                <p className="text-center py-6 text-[11px] text-slate-400">No matching preparation tasks found.</p>
              ) : (
                filteredChecks.map((item) => (
                  <div
                    key={item.id}
                    id={`checklist-item-${item.id}`}
                    className={`flex items-start justify-between p-3 rounded-xl border transition ${
                      item.completed
                        ? 'bg-indigo-50/20 border-indigo-100/50 text-slate-400 animate-slide-down'
                        : 'bg-white border-slate-100 hover:border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex gap-2.5 items-start flex-1 min-w-0">
                      <button
                        type="button"
                        id={`btn-toggle-checklist-${item.id}`}
                        onClick={() => toggleChecklistTask(item.id)}
                        className="text-slate-500 mt-0.5 cursor-pointer hover:text-indigo-600 shrink-0"
                      >
                        {item.completed ? (
                          <CheckSquare className="w-4 h-4 text-indigo-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300" />
                        )}
                      </button>
                      
                      <div className="min-w-0">
                        <p className={`text-xs font-semibold leading-relaxed truncate-3 ${item.completed ? 'line-through' : ''}`}>
                          {item.task}
                        </p>
                        <div className="flex gap-2 items-center text-[9px] text-slate-400 mt-1 uppercase font-bold font-mono">
                          <span className="bg-slate-100 text-slate-500 px-1 py-0.5 rounded text-[8px]">
                            {item.category}
                          </span>
                          <span>&bull;</span>
                          <span>{item.dueDate}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      id={`btn-delete-checklist-${item.id}`}
                      onClick={() => handleDeleteChecklistItem(item.id)}
                      className="text-slate-300 hover:text-rose-500 shrink-0 self-center ml-2 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div> {/* Close Right Column lg:col-span-4 */}
      </div> {/* Close main Grid grid-cols-12 */}

      {/* 4. MODAL EDIT DIALOG SCREEN */}
      {editingActivity && (
        <div id="modal-edit-event" className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 w-full max-w-lg p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-150">
              <h5 className="font-bold text-slate-950 text-base">Modify Activity Event</h5>
              <button
                type="button"
                id="btn-close-edit-modal"
                onClick={() => setEditingActivity(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              
              <div>
                <label className="block text-slate-600 mb-1 font-bold">Activity / Event Name</label>
                <input
                  type="text"
                  value={editingActivity.activity.activityName}
                  id="modal-input-name"
                  onChange={(e) => setEditingActivity({
                    ...editingActivity,
                    activity: { ...editingActivity.activity, activityName: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-white border border-slate-250 text-slate-900 rounded-xl font-medium focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-bold">Planned Time Slot</label>
                  <input
                    type="text"
                    value={editingActivity.activity.time}
                    id="modal-input-time"
                    onChange={(e) => setEditingActivity({
                      ...editingActivity,
                      activity: { ...editingActivity.activity, time: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-white border border-slate-250 text-slate-900 rounded-xl font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-bold">Estimated Cost (USD)</label>
                  <input
                    type="number"
                    value={editingActivity.activity.estimatedCost}
                    id="modal-input-cost"
                    onChange={(e) => setEditingActivity({
                      ...editingActivity,
                      activity: { ...editingActivity.activity, estimatedCost: Number(e.target.value) }
                    })}
                    className="w-full px-3 py-2 bg-white border border-slate-250 text-slate-900 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-bold">Specific Location</label>
                <input
                  type="text"
                  value={editingActivity.activity.locationName}
                  id="modal-input-location"
                  onChange={(e) => setEditingActivity({
                    ...editingActivity,
                    activity: { ...editingActivity.activity, locationName: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-white border border-slate-250 text-slate-900 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-bold">Event Description / Tips</label>
                <textarea
                  rows={3}
                  value={editingActivity.activity.description}
                  id="modal-input-description"
                  onChange={(e) => setEditingActivity({
                    ...editingActivity,
                    activity: { ...editingActivity.activity, description: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-white border border-slate-250 text-slate-900 rounded-xl leading-relaxed font-normal"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-slate-600 mb-1 font-bold">Travel Details To Next Activity</label>
                  <input
                    type="text"
                    value={editingActivity.activity.travelDetailsToNext || ''}
                    placeholder="e.g. Drive 10 min via route 1"
                    onChange={(e) => setEditingActivity({
                      ...editingActivity,
                      activity: { ...editingActivity.activity, travelDetailsToNext: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-white border border-slate-250 text-slate-900 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-bold">Travel Duration (Minutes)</label>
                  <input
                    type="number"
                    value={editingActivity.activity.travelTimeToNextMs || 0}
                    onChange={(e) => setEditingActivity({
                      ...editingActivity,
                      activity: { ...editingActivity.activity, travelTimeToNextMs: Number(e.target.value) }
                    })}
                    className="w-full px-3 py-2 bg-white border border-slate-250 text-slate-900 rounded-xl font-mono"
                  />
                </div>
              </div>

            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-150">
              <button
                type="button"
                onClick={() => setEditingActivity(null)}
                className="px-4 py-2 border border-slate-250 text-slate-700 font-medium rounded-xl text-xs hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-modal-save"
                onClick={handleSaveEditedActivity}
                className="px-4 py-2 bg-slate-950 text-white font-semibold rounded-xl text-xs hover:bg-slate-800"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );

  // Reusable sub-renderer for active list of planned day actions
  function renderActivitiesList(activitiesList: ItineraryActivity[], dayIndex: number, isPrintableMode: boolean) {
    if (!activitiesList || activitiesList.length === 0) {
      return (
        <div className="text-center py-10 border-2 border-dashed border-slate-150 rounded-2xl">
          <p className="text-xs text-slate-400">All activities have been deleted/canceled. Click Edit or reset trip parameters above.</p>
        </div>
      );
    }

    return (
      <div className="relative border-l-2 border-slate-100 pl-4 space-y-6 ml-2 text-xs">
        {activitiesList.map((act, actIdx) => {
          return (
            <div key={act.id || actIdx} className="relative group/item">
              
              {/* Timeline bubble node indicator */}
              <span className="absolute -left-[24px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white bg-slate-950 flex items-center justify-center ring-4 ring-slate-100" />

              <div className="bg-white border hover:border-slate-250 rounded-2xl p-4 transition-all duration-200 shadow-2xs">
                
                {/* Header Row: Duration & Edit/Delete Actions */}
                <div className="flex justify-between items-start gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{act.time}</span>
                  </div>

                  {!isPrintableMode && (
                    <div className="flex gap-1.5 opacity-0 group-hover/item:opacity-100 transition-opacity print:hidden">
                      <button
                        title="Edit Activity"
                        id={`btn-edit-act-${dayIndex}-${actIdx}`}
                        onClick={() => setEditingActivity({ dayIdx: dayIndex, actIdx, activity: { ...act } })}
                        className="p-1 rounded bg-slate-50 text-slate-500 hover:text-indigo-600 transition"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Cancel Event"
                        id={`btn-delete-act-${dayIndex}-${actIdx}`}
                        onClick={() => handleDeleteActivity(dayIndex, actIdx)}
                        className="p-1 rounded bg-slate-50 text-slate-500 hover:text-rose-500 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Name and Specific Venue locations */}
                <h4 className="text-sm font-extrabold text-slate-950 mt-1.5">
                  {act.activityName}
                </h4>
                
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                  Venue: {act.locationName}
                </p>

                {/* Substantive descriptions and context values */}
                <p className="text-slate-600 mt-2 leading-relaxed text-[11px] font-normal">
                  {act.description}
                </p>

                {/* Micro Cost label */}
                <div className="mt-3 pt-3 border-t border-slate-100/80 flex flex-wrap gap-4 items-center justify-between text-[11px] font-medium font-sans">
                  {act.estimatedCost > 0 ? (
                    <span className="text-slate-500">
                      Est Expense: <span className="font-mono text-slate-900 font-bold">${act.estimatedCost}</span>
                    </span>
                  ) : (
                    <span className="text-indigo-700 font-bold bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">Free Activity</span>
                  )}

                  {act.bookingNeeded && act.bookingDeepLink && (
                    <a
                      href={act.bookingDeepLink}
                      target="_blank"
                      rel="noreferrer referrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline transition"
                    >
                      <Link className="w-3 h-3" />
                      Secure Online Booking
                    </a>
                  )}
                </div>

              </div>

              {/* Transit Details Spacer block */}
              {act.travelDetailsToNext && act.travelTimeToNextMs && (
                <div className="my-3 pl-4 py-1.5 border-l-2 border-dashed border-indigo-200 flex items-center gap-2 text-[10px] font-semibold text-indigo-700 bg-indigo-50/40 rounded-r-xl max-w-fit pr-3 animate-fade-in">
                  <Navigation className="w-3 h-3" />
                  <span>Transfer: {act.travelDetailsToNext} (~{act.travelTimeToNextMs} mins)</span>
                </div>
              )}

            </div>
          );
        })}
      </div>
    );
  }
}
