/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ShieldAlert, BadgeInfo, CheckCircle, Flame, Filter, Sparkles, MessageCircle, AlertTriangle } from 'lucide-react';
import { PlaceRecommendation, PlaceReview, ReviewTrendAnalysis } from '../types';
import { mockPlaces } from '../mockData';

interface ReviewTrendModalProps {
  place: PlaceRecommendation;
  onClose: () => void;
  onDecision: (decision: 'keep' | 'flag' | 'replace', replacementId?: string) => void;
}

export default function ReviewTrendModal({ place, onClose, onDecision }: ReviewTrendModalProps) {
  const [step, setStep] = useState<number>(3); // Matches Steps 3-9 in Flowchart (since we opened place card)
  const [filterDate, setFilterDate] = useState<'all' | 'recent' | 'older'>('all');
  const [filterSentiment, setFilterSentiment] = useState<'all' | 'positive' | 'negative'>('all');
  const [analyzing, setAnalyzing] = useState(false);
  const [trendAnalysis, setTrendAnalysis] = useState<ReviewTrendAnalysis | null>(null);

  // Initialize or fetch analysis on load
  useEffect(() => {
    if (place.trendAnalysis) {
      setTrendAnalysis(place.trendAnalysis);
    } else {
      // Assemble default trend if missing
      const recent = place.reviews.filter(r => r.isRecent);
      const older = place.reviews.filter(r => !r.isRecent);
      const pos = place.reviews.filter(r => r.sentiment === 'positive').length;
      const neg = place.reviews.filter(r => r.sentiment === 'negative').length;

      setTrendAnalysis({
        recentRatingAvg: recent.length ? Number((recent.reduce((acc, r) => acc + r.rating, 0) / recent.length).toFixed(1)) : place.rating,
        olderRatingAvg: older.length ? Number((older.reduce((acc, r) => acc + r.rating, 0) / older.length).toFixed(1)) : place.rating - 0.5,
        recentConsensus: `Strong consensus of ${pos} positive reviews vs ${neg} minor issues. Safe and accessible for family members.`,
        positiveKeywords: ['accessible', 'friendly', 'clean'],
        negativeKeywords: ['stairs', 'busy', 'pricey'],
        recentReviewsCount: recent.length || 1,
        olderReviewsCount: older.length || 1
      });
    }
  }, [place]);

  const handleFetchAiInsights = async () => {
    setAnalyzing(true);
    // Request server to run trend analysis
    try {
      const response = await fetch('/api/analyze-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placeName: place.name, reviews: place.reviews })
      });
      const data = await response.json();
      if (data.analysis) {
        setTrendAnalysis(data.analysis);
      }
    } catch (e) {
      console.warn('API analyze-reviews error, utilizing offline model analysis.', e);
    } finally {
      setAnalyzing(false);
      setStep(4); // Advance to "Review insights screen"
    }
  };

  // Filter logic matching "Vincent's Numbered Flowchart: Step 5-6"
  const filteredReviews = place.reviews.filter((rev) => {
    if (filterDate === 'recent' && !rev.isRecent) return false;
    if (filterDate === 'older' && rev.isRecent) return false;
    if (filterSentiment === 'positive' && rev.sentiment !== 'positive') return false;
    if (filterSentiment === 'negative' && rev.sentiment !== 'negative') return false;
    return true;
  });

  // Collect proper alternatives matching Step 8
  const availableAlternatives = mockPlaces.filter((p) => 
    place.alternatives?.includes(p.id) || (p.category === place.category && p.id !== place.id)
  ).sort((a, b) => b.rating - a.rating); // Sorted by recent consensus/rating (Step 9)

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1C1C1C]/45 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200 rounded-[2.5rem] max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Step Indicator Header (Numbered Flowchart Tracker) */}
        <div className="bg-[#F7F3E9] px-6 py-4 border-b border-[#C5A059]/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono font-bold px-3 py-1 rounded-full bg-[#1C1C1C] text-white">
              Flowchart Explorer
            </span>
            <div className="text-xs text-stone-600 font-mono font-medium">
              Current: <span className="text-brand font-bold">Step {step}: {
                step === 3 ? 'Open Full Reviews' :
                step === 4 ? 'Review AI Insights Trends' :
                step === 5 ? 'Apply Filters & Review List' :
                step === 7 ? 'Choose Decision: Keep, Remove, or Replace' :
                'Substitute with Alternatives'
              }</span>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-brand cursor-pointer transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Place Card Meta Splash */}
        <div className="bg-stone-50/70 p-5 sm:p-6 border-b border-stone-250 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <img src={place.imageUrl} alt={place.name} className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-stone-200 shadow-sm" />
          <div className="space-y-1.5">
            <div className="text-stone-500 text-[10px] font-bold font-mono tracking-wider uppercase">{place.category} Group Recommendation</div>
            <h3 className="text-xl font-bold text-stone-900 font-serif italic text-brand">{place.name}</h3>
            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-505 font-medium">
              <span className="text-amber-500 font-bold">★ {place.rating} ({place.ratingCount} reviews)</span>
              <span className="text-stone-300">•</span>
              <span className="text-brand font-bold">{place.mobilityFriendly ? '♿ Accessible Level Preferred' : '⚠️ Moderate Steps'}</span>
              <span className="text-stone-300">•</span>
              <span className="text-stone-700 font-mono font-bold">${place.costEstimate} Est.</span>
            </div>
          </div>
        </div>

        {/* Content body based on current Step */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-stone-850 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-brand" />
                  <span className="font-bold text-stone-800">Historical Feedbacks List ({place.reviews.length} total)</span>
                </div>
                <button
                  onClick={handleFetchAiInsights}
                  disabled={analyzing}
                  className="px-3.5 py-1.5 bg-brand hover:opacity-90 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                >
                  <Sparkles className="h-3.5 w-3.5 shrink-0" />
                  {analyzing ? 'Analyzing Shifts...' : 'Extract Recent vs Older Trends'}
                </button>
              </div>

              {/* Show direct reviews */}
              <div className="grid grid-cols-1 gap-3">
                {place.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-stone-50/50 rounded-2xl border border-stone-200 flex gap-3 shadow-xs">
                    <span className="w-8 h-8 rounded-full bg-[#F7F3E9] text-brand border border-[#C5A059]/25 flex items-center justify-center font-bold text-xs shrink-0 mt-1 uppercase">
                      {rev.author.slice(0, 2)}
                    </span>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-800 text-xs font-bold">{rev.author}</span>
                        <div className="flex items-center gap-2 text-[10px] font-mono">
                          <span className={`font-bold ${rev.isRecent ? 'text-green-700' : 'text-stone-400'}`}>
                            {rev.isRecent ? 'Recent (2026)' : 'Older (2025)'}
                          </span>
                          <span className="text-amber-500 font-bold">★ {rev.rating}</span>
                        </div>
                      </div>
                      <p className="text-stone-605 text-xs leading-relaxed italic text-stone-600">"{rev.text}"</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setStep(4)}
                  className="px-4 py-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-750 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span>Skip to AI Trend Insights</span>
                  <ArrowRight className="h-3.5 w-3.5 text-stone-500" />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="text-sm font-semibold text-stone-850 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-brand animate-pulse" />
                  <span className="font-serif italic font-bold text-brand">AI Review Trend Insight Summary</span>
                </div>
                <button
                  onClick={() => setStep(5)}
                  className="px-3.5 py-1.5 bg-[#1C1C1C] hover:opacity-90 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-opacity"
                >
                  Configure Filters & Sorts
                </button>
              </div>

              {trendAnalysis && (
                <div className="space-y-4">
                  {/* Rating comparison widgets */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-stone-50/80 rounded-2xl border border-stone-200 space-y-1 shadow-sm">
                      <div className="text-[10px] uppercase font-bold text-green-750 font-mono tracking-wider">
                        Recent Trajectory Avg (2026)
                      </div>
                      <div className="text-3xl font-bold font-mono text-stone-900 font-serif italic text-brand flex items-baseline gap-2">
                        {trendAnalysis.recentRatingAvg} <span className="text-xs text-stone-400 font-normal font-sans">/ 5.0</span>
                      </div>
                      <div className="text-xs text-stone-500 font-medium font-medium">Calculated over {trendAnalysis.recentReviewsCount} reviews</div>
                    </div>

                    <div className="p-4 bg-stone-50/80 rounded-2xl border border-stone-200 space-y-1 shadow-sm">
                      <div className="text-[10px] uppercase font-bold text-brand font-mono tracking-wider">
                        Older Historical Avg (2025)
                      </div>
                      <div className="text-3xl font-bold font-mono text-stone-900 font-serif italic text-brand flex items-baseline gap-2">
                        {trendAnalysis.olderRatingAvg} <span className="text-xs text-stone-400 font-normal font-sans">/ 5.0</span>
                      </div>
                      <div className="text-xs text-stone-500 font-medium">Calculated over {trendAnalysis.olderReviewsCount} reviews</div>
                    </div>
                  </div>

                  {/* Positive vs Negative Keywords */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-2xl space-y-2 shadow-xs">
                      <div className="text-xs font-bold text-green-700 flex items-center gap-1.5 font-mono uppercase">
                        <CheckCircle className="h-4 w-4" />
                        Repeated Good Patterns
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {trendAnalysis.positiveKeywords.map((word, i) => (
                          <span key={i} className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-green-100 text-green-800">
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2 shadow-xs">
                      <div className="text-xs font-bold text-rose-700 flex items-center gap-1.5 font-mono uppercase">
                        <AlertTriangle className="h-4 w-4 text-rose-600" />
                        Old Bottlenecks & Warnings
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {trendAnalysis.negativeKeywords.map((word, i) => (
                          <span key={i} className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Consensus box */}
                  <div className="p-5 bg-[#F7F3E9] rounded-2xl border border-[#C5A059]/35 shadow-xs">
                    <div className="flex items-center gap-2 text-brand text-xs font-bold font-mono uppercase mb-2">
                      <Sparkles className="h-4 w-4 animate-pulse text-brand" />
                      Platform Consensus Trend
                    </div>
                    <p className="text-stone-850 text-xs leading-relaxed font-serif italic">
                      "{trendAnalysis.recentConsensus}"
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={() => setStep(3)}
                  className="px-3.5 py-1.5 text-stone-500 hover:text-stone-850 text-xs font-bold"
                >
                  Back to Raw Reviews
                </button>
                <button
                  onClick={() => setStep(5)}
                  className="px-4 py-2 bg-brand hover:opacity-90 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Filter Reviews</span>
                  <Filter className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                  <Filter className="h-4 w-4 text-brand" />
                  <span className="font-bold">Configure Interactive Filters</span>
                </div>
              </div>

              {/* Filters Panel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block font-mono">Review Recency</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['all', 'recent', 'older'].map((d) => (
                      <button
                        key={d}
                        onClick={() => setFilterDate(d as any)}
                        className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                          filterDate === d 
                            ? 'bg-[#1C1C1C] text-white shadow-xs' 
                            : 'bg-white border border-stone-200 text-stone-605 hover:bg-stone-100 hover:text-stone-900'
                        }`}
                      >
                        {d === 'all' ? 'All Dates' : d === 'recent' ? 'Recent (2026)' : 'Older (2025)'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block font-mono">Sentiment Filters</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['all', 'positive', 'negative'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setFilterSentiment(s as any)}
                        className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                          filterSentiment === s 
                            ? 'bg-[#1C1C1C] text-white shadow-xs' 
                            : 'bg-white border border-stone-200 text-stone-605 hover:bg-stone-100 hover:text-stone-900'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Filtered List Grid (Flowchart Step 6) */}
              <div className="space-y-3">
                <div className="text-[10px] font-bold text-stone-450 tracking-wider font-mono">
                  MATCHING FILTERED REVIEWS ({filteredReviews.length})
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {filteredReviews.length === 0 ? (
                    <div className="py-8 text-center text-xs text-stone-505 bg-stone-50 rounded-2xl border border-stone-200">
                      No reviews match current configured recency or sentiment filters.
                    </div>
                  ) : (
                    filteredReviews.map((rev) => (
                      <div key={rev.id} className="p-3.5 bg-stone-50/50 rounded-2xl border border-stone-200 flex gap-2 justify-between items-start shadow-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-stone-800 font-bold">{rev.author}</span>
                            <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full ${rev.sentiment === 'positive' ? 'text-green-700 bg-green-50 border border-green-200' : 'text-rose-700 bg-rose-50 border border-rose-200'}`}>
                              {rev.sentiment}
                            </span>
                          </div>
                          <p className="text-stone-605 text-xs italic text-stone-600">"{rev.text}"</p>
                        </div>
                        <div className="text-right font-mono text-[10px] text-stone-400 shrink-0">
                          {rev.isRecent ? 'Recent (2026)' : 'Historical (2025)'}
                          <div className="text-amber-500 text-[11px] mt-1 font-bold">★ {rev.rating}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-stone-200">
                <button
                  onClick={() => setStep(4)}
                  className="text-stone-505 hover:text-stone-850 text-xs font-bold"
                >
                  Back to Trend Summary
                </button>
                <button
                  onClick={() => setStep(7)}
                  className="px-5 py-2.5 bg-[#1C1C1C] hover:opacity-95 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Submit Group Decision</span>
                  <ArrowRight className="h-4 w-4 text-white/80" />
                </button>
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-5" id="group-decision-step">
              <div className="text-center py-2">
                <BadgeInfo className="h-10 w-10 text-brand mx-auto mb-3" />
                <h4 className="text-base font-bold text-stone-900 font-serif italic text-brand">Evaluate: Keep, Remove, or Replace?</h4>
                <p className="text-xs text-stone-505 mt-1 max-w-md mx-auto font-medium">
                  Coordinate the choice of placing this recommendation permanently in the itinerary list, removing it to draft pool, or replacing it with premium alternatives.
                </p>
              </div>

              {/* Options Panels */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="decision-buttons-grid">
                <button
                  onClick={() => {
                    onDecision('keep');
                    onClose();
                  }}
                  className="p-5 bg-stone-50/50 hover:bg-green-50 border border-stone-200 hover:border-green-300 rounded-3xl text-left transition-all cursor-pointer space-y-2 group shadow-sm hover:shadow-md"
                >
                  <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-700 border border-green-200/40 flex items-center justify-center font-bold text-sm">
                    10
                  </div>
                  <div className="font-bold text-xs text-green-700 group-hover:text-green-800 uppercase tracking-widest font-mono">Keep Place</div>
                  <p className="text-[11px] text-stone-500 font-normal leading-normal">
                    Approve and pin on active itinerary day. Fully confirm and authorize booking split allocations.
                  </p>
                </button>

                <button
                  onClick={() => {
                    onDecision('flag');
                    onClose();
                  }}
                  className="p-5 bg-stone-50/50 hover:bg-rose-50 border border-stone-200 hover:border-rose-300 rounded-3xl text-left transition-all cursor-pointer space-y-2 group shadow-sm hover:shadow-md"
                >
                  <div className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-700 border border-rose-200/40 flex items-center justify-center font-bold text-sm">
                    11
                  </div>
                  <div className="font-bold text-xs text-rose-700 group-hover:text-rose-800 font-mono uppercase tracking-widest">Flag for Later</div>
                  <p className="text-[11px] text-stone-500 font-normal leading-normal">
                    Temporarily hold in the scratchpad area. This will empty its current bookings space but save it for fallback reference.
                  </p>
                </button>

                <button
                  onClick={() => setStep(8)}
                  className="p-5 bg-[#F7F3E9]/60 hover:bg-[#F7F3E9] border border-[#C5A059]/35 hover:border-brand/65 rounded-3xl text-left transition-all cursor-pointer space-y-2 group shadow-sm hover:shadow-md"
                >
                  <div className="w-8 h-8 rounded-full bg-brand/10 text-brand border border-[#C5A059]/20 flex items-center justify-center font-bold text-sm">
                    8
                  </div>
                  <div className="font-bold text-xs text-brand group-hover:text-brand-900 font-mono uppercase tracking-widest">Replace Entry</div>
                  <p className="text-[11px] text-stone-500 font-normal leading-normal">
                    Examine other locations of similar class sorted by recent consensus. Swap with perfect ease.
                  </p>
                </button>
              </div>

              <div className="pt-4 flex justify-start">
                <button
                  onClick={() => setStep(5)}
                  className="text-stone-500 hover:text-stone-850 text-xs font-bold cursor-pointer"
                >
                  Back to Filters
                </button>
              </div>
            </div>
          )}

          {step === 8 && (
            <div className="space-y-4" id="alternatives-list-step">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="text-xs font-bold text-stone-450 font-mono tracking-wide">
                  Step 9: Alternatives Sorted by Recent Consensus Group Rating
                </div>
                <button
                  onClick={() => setStep(7)}
                  className="text-brand hover:opacity-90 text-xs font-bold cursor-pointer font-serif italic"
                >
                  Back to Options
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {availableAlternatives.length === 0 ? (
                  <div className="py-8 text-center text-xs text-stone-505 bg-stone-50 rounded-2xl border border-stone-200">
                    No custom alternative accommodations mapped to this selection.
                  </div>
                ) : (
                  availableAlternatives.map((alt) => (
                    <div key={alt.id} className="p-4 bg-stone-50/50 rounded-2xl border border-stone-200 hover:bg-stone-50 transition-all flex flex-col sm:flex-row gap-4 items-start justify-between shadow-xs">
                      <div className="flex gap-3 items-start">
                        <img src={alt.imageUrl} alt={alt.name} className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-200" />
                        <div className="space-y-1">
                          <h5 className="font-bold text-stone-900 font-serif italic text-brand text-sm">{alt.name}</h5>
                          <p className="text-[11px] text-stone-605 leading-relaxed font-medium max-w-sm">{alt.description}</p>
                          <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono mt-1.5">
                            <span className="text-amber-500 font-bold">★ {alt.rating} ({alt.ratingCount} votes)</span>
                            <span className="text-stone-300">•</span>
                            <span className="text-stone-800 font-bold">${alt.costEstimate} per night</span>
                            {alt.mobilityFriendly && (
                              <>
                                <span className="text-stone-300">•</span>
                                <span className="text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold">♿ Senior-Preferred</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onDecision('replace', alt.id);
                          onClose();
                        }}
                        className="w-full sm:w-auto px-4 py-2 bg-[#1C1C1C] hover:opacity-90 text-white text-xs font-bold rounded-xl cursor-pointer transition-all shrink-0 shadow-xs"
                      >
                        Substitute Entry
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
