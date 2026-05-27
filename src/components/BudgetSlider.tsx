import React, { useEffect, useState } from 'react';
import { DollarSign, Landmark, HelpCircle, Sparkles, Zap, Shield, ChevronRight } from 'lucide-react';

interface LocalBudgetBenchmarks {
  budget: number;
  balanced: number;
  luxury: number;
}

interface BudgetSliderProps {
  destination: string;
  durationDays: number;
  peopleCount: number;
  selectedBudgetType: 'budget' | 'balanced' | 'luxury';
  onBudgetTypeChange: (type: 'budget' | 'balanced' | 'luxury') => void;
  customDailyBudgetLimit: number;
  onCustomDailyBudgetLimitChange: (val: number) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
}

export default function BudgetSlider({
  destination,
  durationDays,
  peopleCount,
  selectedBudgetType,
  onBudgetTypeChange,
  customDailyBudgetLimit,
  onCustomDailyBudgetLimitChange,
  onNextStep,
  onPrevStep
}: BudgetSliderProps) {
  const [benchmarks, setBenchmarks] = useState<LocalBudgetBenchmarks>({
    budget: 100,
    balanced: 230,
    luxury: 600
  });
  const [loading, setLoading] = useState(false);

  // Fetch dynamic standard benchmarks for the selected city
  useEffect(() => {
    if (!destination) return;
    setLoading(true);
    fetch(`/api/itinerary/calculate-local-budget?destination=${encodeURIComponent(destination)}`)
      .then((res) => res.json())
      .then((data: LocalBudgetBenchmarks) => {
        setBenchmarks(data);
        // Automatically default custom slider depending on baseline selected types
        if (selectedBudgetType === 'budget') {
          onCustomDailyBudgetLimitChange(data.budget);
        } else if (selectedBudgetType === 'balanced') {
          onCustomDailyBudgetLimitChange(data.balanced);
        } else {
          onCustomDailyBudgetLimitChange(data.luxury);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load local budget benchmarks:", err);
        setLoading(false);
      });
  }, [destination]);

  // Handle Quick Category selectors
  const handleTypeSelect = (type: 'budget' | 'balanced' | 'luxury') => {
    onBudgetTypeChange(type);
    if (type === 'budget') {
      onCustomDailyBudgetLimitChange(benchmarks.budget);
    } else if (type === 'balanced') {
      onCustomDailyBudgetLimitChange(benchmarks.balanced);
    } else {
      onCustomDailyBudgetLimitChange(benchmarks.luxury);
    }
  };

  // Live Slider Category classification descriptor
  const getExperienceDescription = (val: number) => {
    if (val <= benchmarks.budget * 1.1) {
      return {
        title: "Smart Budget Traveler",
        desc: "Cozy local hostels, homestays, or budget Airbnbs. Public transit, street food stalls, and prioritizing free sights.",
        icon: <DollarSign className="w-5 h-5 text-indigo-500" />
      };
    } else if (val <= benchmarks.balanced * 1.15) {
      return {
        title: "Balanced comfort Explorer",
        desc: "Highly-rated boutique hotels or private Airbnbs. Mixed transit (trains + occasional rideshares), charming local restaurants, and standard museum passes.",
        icon: <Sparkles className="w-5 h-5 text-indigo-500" />
      };
    } else {
      return {
        title: "Elite Premium / Luxury Luxury",
        desc: "Top 4-5 star hotels or luxury apartments. Chauffeurs or premium rental cars, fine dining, private guides, and VIP skip-the-line admissions.",
        icon: <Zap className="w-5 h-5 text-amber-500" />
      };
    }
  };

  const experience = getExperienceDescription(customDailyBudgetLimit);

  // Totals calculations
  const totalCost = customDailyBudgetLimit * durationDays * peopleCount;

  return (
    <div id="budget-slider-module" className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm">
      <div className="mb-6">
        <h3 id="budget-heading" className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          Configure Your Perfect Budget Limit
        </h3>
        <p className="text-slate-500 text-sm mt-1">
          Personalized dynamic estimates modeled specifically for <span className="font-semibold text-slate-800">{destination || 'your destination'}</span>.
        </p>
      </div>

      {loading ? (
        <div className="py-12 flex flex-col justify-center items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 font-mono">Analyzing local pricing indexes...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Quick Choice Segment Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="budget-tier-grid">
            {/* Budget Button */}
            <button
              type="button"
              id="btn-budget"
              onClick={() => handleTypeSelect('budget')}
              className={`p-5 rounded-2xl border text-left transition-all ${
                selectedBudgetType === 'budget'
                  ? 'border-indigo-500 bg-indigo-50/20 ring-2 ring-indigo-500/10'
                  : 'border-slate-100 hover:border-slate-200 bg-white'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  Tier 1
                </span>
                <span className="text-sm font-semibold text-slate-500">~${benchmarks.budget}/day</span>
              </div>
              <p className="font-bold text-slate-950 text-base">Budget Saving</p>
              <p className="text-xs text-slate-500 mt-1">Maximize experiences, minimize costs. Homestays & public transport.</p>
            </button>

            {/* Balanced Button */}
            <button
              type="button"
              id="btn-balanced"
              onClick={() => handleTypeSelect('balanced')}
              className={`p-5 rounded-2xl border text-left transition-all ${
                selectedBudgetType === 'balanced'
                  ? 'border-indigo-500 bg-indigo-50/20 ring-2 ring-indigo-500/10'
                  : 'border-slate-100 hover:border-slate-200 bg-white'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                  Tier 2
                </span>
                <span className="text-sm font-semibold text-slate-500">~${benchmarks.balanced}/day</span>
              </div>
              <p className="font-bold text-slate-950 text-base">Balanced Travel</p>
              <p className="text-xs text-slate-500 mt-1">Optimal value. Clean hotels, cozy bistros, and convenient transit.</p>
            </button>

            {/* Luxury Button */}
            <button
              type="button"
              id="btn-luxury"
              onClick={() => handleTypeSelect('luxury')}
              className={`p-5 rounded-2xl border text-left transition-all ${
                selectedBudgetType === 'luxury'
                  ? 'border-amber-500 bg-amber-50/20 ring-2 ring-amber-500/10'
                  : 'border-slate-100 hover:border-slate-200 bg-white'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                  Tier 3
                </span>
                <span className="text-sm font-semibold text-slate-500">~${benchmarks.luxury}/day</span>
              </div>
              <p className="font-bold text-slate-950 text-base">Elite Luxury</p>
              <p className="text-xs text-slate-500 mt-1">Ultimate premium relaxation. Michelin stars & curated private bookings.</p>
            </button>
          </div>

          {/* Sliding Scale */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-slate-700">Daily Multiplier Limit (Per Person)</span>
              <span className="text-2xl font-black text-slate-950 font-mono bg-white border px-3 py-1 rounded-xl shadow-xs">
                ${customDailyBudgetLimit}<span className="text-xs text-slate-500 font-normal">/day</span>
              </span>
            </div>

            <input
              type="range"
              id="budget-scale-slider"
              min={Math.max(20, Math.floor(benchmarks.budget * 0.5))}
              max={Math.floor(benchmarks.luxury * 2.2)}
              value={customDailyBudgetLimit}
              onChange={(e) => onCustomDailyBudgetLimitChange(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />

            <div className="flex justify-between text-xs font-mono text-slate-400 mt-2">
              <span>Min: ${Math.max(20, Math.floor(benchmarks.budget * 0.5))}</span>
              <span>Local Avg: ${benchmarks.balanced}</span>
              <span>Max: ${Math.floor(benchmarks.luxury * 2.2)}</span>
            </div>
          </div>

          {/* Current Experience Classification feedback */}
          <div className="flex gap-4 p-5 rounded-2xl bg-slate-50/50 border border-dashed border-slate-250">
            <div className="p-3 bg-white rounded-xl shadow-xs self-start">
              {experience.icon}
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">{experience.title}</h4>
              <p className="text-slate-600 text-xs mt-1 leading-relaxed">{experience.desc}</p>
            </div>
          </div>

          {/* Visual Trip Totals Card */}
          <div className="bg-slate-950 text-white rounded-2.5xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Estimated Budget Limit</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-black text-indigo-400 font-mono">${totalCost.toLocaleString()}</span>
                  <span className="text-xs text-slate-400">USD estimate</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Duration: <span className="text-slate-200 font-semibold">{durationDays} days</span> &bull; Travelers: <span className="text-slate-200 font-semibold">{peopleCount} traveler(s)</span>
                </p>
              </div>

              <div className="border-t border-slate-800 md:border-t-0 md:border-l md:pl-6 pt-4 md:pt-0 text-xs space-y-1 text-slate-300">
                <p className="flex justify-between gap-8">
                  <span>Accomm allocation:</span>
                  <span className="font-mono text-white font-semibold">${(totalCost * 0.45).toLocaleString()}</span>
                </p>
                <p className="flex justify-between gap-8">
                  <span>Transit allocation:</span>
                  <span className="font-mono text-white font-semibold">${(totalCost * 0.2).toLocaleString()}</span>
                </p>
                <p className="flex justify-between gap-8">
                  <span>Activities allowance:</span>
                  <span className="font-mono text-white font-semibold">${(totalCost * 0.15).toLocaleString()}</span>
                </p>
                <p className="flex justify-between gap-8">
                  <span>Food & incidentals:</span>
                  <span className="font-mono text-white font-semibold">${(totalCost * 0.2).toLocaleString()}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Navigation action buttons */}
          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              id="btn-prev-budget"
              onClick={onPrevStep}
              className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition"
            >
              Back to Preferences
            </button>
            <button
              type="button"
              id="btn-next-budget"
              onClick={onNextStep}
              className="px-6 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition flex items-center gap-1"
            >
              Continue to Planning
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
