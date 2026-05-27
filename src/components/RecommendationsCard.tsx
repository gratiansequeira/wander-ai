import React from 'react';
import { DestinationRecommendation } from '../types';
import { Landmark, Check, Globe, MapPin, Sparkles, Clock, Compass } from 'lucide-react';

interface RecommendationsCardProps {
  recommendations: DestinationRecommendation[];
  onSelect: (destination: DestinationRecommendation) => void;
  selectedName?: string;
}

export default function RecommendationsCard({
  recommendations,
  onSelect,
  selectedName
}: RecommendationsCardProps) {
  return (
    <div id="recommendations-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-4">
      {recommendations.map((dest) => {
        const isSelected = selectedName?.toLowerCase().includes(dest.name.toLowerCase());

        return (
          <div
            key={dest.name}
            id={`rec-card-${dest.name.replace(/\s+/g, '-').toLowerCase()}`}
            onClick={() => onSelect(dest)}
            className={`group cursor-pointer rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
              isSelected
                ? 'border-indigo-500 bg-indigo-50/30 ring-2 ring-indigo-500/20'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg'
            }`}
          >
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start gap-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 gap-1">
                  <Globe className="w-3.5 h-3.5" />
                  {dest.country}
                </span>
                
                {isSelected && (
                  <span className="p-1 rounded-full bg-indigo-600 text-white">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              <h4 className="text-xl font-bold text-slate-950 mt-3 group-hover:text-indigo-700 transition-colors">
                {dest.name}
              </h4>
              <p className="text-xs font-medium text-indigo-600 mt-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {dest.tagline}
              </p>

              <p className="text-slate-600 text-sm mt-3 leading-relaxed line-clamp-3">
                {dest.description}
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-slate-400" />
                  Highlights
                </p>
                <div className="flex flex-col gap-1">
                  {dest.highlights.slice(0, 2).map((h, idx) => (
                    <span key={idx} className="text-xs text-slate-700 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className={`p-4 border-t flex items-center justify-between text-xs font-medium ${
              isSelected ? 'border-indigo-200 bg-indigo-50/50' : 'border-slate-100 bg-slate-50'
            }`}>
              <span className="text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Rec: {dest.recommendedDurationDays} Days
              </span>
              <span className="text-indigo-700 font-semibold bg-indigo-100/60 px-2 py-0.5 rounded-md">
                Est. ~${dest.estimatedBudgets.balanced}/Day
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
