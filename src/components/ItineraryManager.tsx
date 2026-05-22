/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar, UserCheck, Trash2, ArrowRightLeft, ShieldAlert, Sparkles, MessageCircle, Volume2, Plus, Users, CheckSquare } from 'lucide-react';
import { TripPlan, ItineraryDay, ItineraryItem, PlaceRecommendation, FamilyOrGroupMember, GroupPoll } from '../types';
import { mockPlaces } from '../mockData';
import ReviewTrendModal from './ReviewTrendModal';

interface ItineraryManagerProps {
  trip: TripPlan;
  onUpdateTrip: (updatedTrip: TripPlan) => void;
  onAlert: (msg: string) => void;
}

export default function ItineraryManager({ trip, onUpdateTrip, onAlert }: ItineraryManagerProps) {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(1);
  const [editingItemNotes, setEditingItemNotes] = useState<string | null>(null);
  const [tempNotesValue, setTempNotesValue] = useState<string>('');
  const [inspectorPlace, setInspectorPlace] = useState<PlaceRecommendation | null>(null);
  const [inspectorItemId, setInspectorItemId] = useState<string | null>(null);

  const activeDay = trip.itinerary.find(d => d.dayIndex === selectedDayIndex) || trip.itinerary[0];

  // Update itinerary item notes
  const handleSaveNotes = (itemId: string) => {
    const updatedItinerary = trip.itinerary.map(day => {
      return {
        ...day,
        items: day.items.map(item => {
          if (item.id === itemId) {
            return { ...item, notes: tempNotesValue };
          }
          return item;
        })
      };
    });
    onUpdateTrip({ ...trip, itinerary: updatedItinerary });
    setEditingItemNotes(null);
    onAlert('✏️ Notes updated for your group!');
  };

  // Group Consensus polls voting flow
  const handleVoteInPoll = (pollId: string, optionId: string, memberId: string) => {
    const updatedPolls = trip.polls.map(poll => {
      if (poll.id === pollId) {
        return {
          ...poll,
          options: poll.options.map(opt => {
            const hasVoted = opt.votes.includes(memberId);
            // Clear member's vote from all other options in this poll first (single-choice)
            let nextVotes = opt.votes.filter(id => id !== memberId);
            if (opt.id === optionId && !hasVoted) {
              nextVotes.push(memberId);
            }
            return { ...opt, votes: nextVotes };
          })
        };
      }
      return poll;
    });

    onUpdateTrip({ ...trip, polls: updatedPolls });
    onAlert('🗳️ Vote recorded! Real-time consensus updated on group telemetry.');
  };

  // Flowchart Decisions Dispatch (Step 7-11)
  const handleInspectorDecision = (decision: 'keep' | 'flag' | 'replace', replacementId?: string) => {
    if (!inspectorItemId) return;

    if (decision === 'keep') {
      const updatedItinerary = trip.itinerary.map(day => {
        return {
          ...day,
          items: day.items.map(item => {
            if (item.id === inspectorItemId) {
              return { ...item, status: 'Confirmed' as const };
            }
            return item;
          })
        };
      });
      onUpdateTrip({ ...trip, itinerary: updatedItinerary });
      onAlert('❇️ Place verified under Step 10: "Keep place"! Marked as confirmed.');
    }

    if (decision === 'flag') {
      const updatedItinerary = trip.itinerary.map(day => {
        return {
          ...day,
          items: day.items.map(item => {
            if (item.id === inspectorItemId) {
              return { ...item, status: 'Draft' as const, notes: '🚨 Flagged for review later due to accessibility constraints.' };
            }
            return item;
          })
        };
      });
      onUpdateTrip({ ...trip, itinerary: updatedItinerary });
      onAlert('🚩 Marked under Step 11: "Flag for later"! Moved to draft and safety disclaimers flagged.');
    }

    if (decision === 'replace' && replacementId) {
      const replacementPlace = mockPlaces.find(p => p.id === replacementId);
      if (replacementPlace) {
        const updatedItinerary = trip.itinerary.map(day => {
          return {
            ...day,
            items: day.items.map(item => {
              if (item.id === inspectorItemId) {
                return { 
                  ...item, 
                  place: replacementPlace,
                  notes: `Replaced with high-consensus alternative: ${replacementPlace.name}.`
                };
              }
              return item;
            })
          };
        });
        onUpdateTrip({ ...trip, itinerary: updatedItinerary });
        onAlert(`🔄 Swapped place with alternate option: ${replacementPlace.name}!`);
      }
    }

    // Reset modals
    setInspectorPlace(null);
    setInspectorItemId(null);
  };

  // Sub-group quick split custom assignment
  const handleToggleMemberInSubgroup = (itemId: string, memberId: string) => {
    const updatedItinerary = trip.itinerary.map(day => {
      return {
        ...day,
        items: day.items.map(item => {
          if (item.id === itemId) {
            const currentSub = item.assignedSubGroups || [];
            const nextSub = currentSub.includes(memberId)
              ? currentSub.filter(id => id !== memberId)
              : [...currentSub, memberId];
            return { ...item, assignedSubGroups: nextSub };
          }
          return item;
        })
      };
    });
    onUpdateTrip({ ...trip, itinerary: updatedItinerary });
  };

  return (
    <div className="space-y-6" id="itinerary-manager-main-view">
      
      {/* Day Selector Navigation Pills */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div className="flex gap-2">
          {trip.itinerary.map((day) => (
            <button
              key={day.dayIndex}
              onClick={() => setSelectedDayIndex(day.dayIndex)}
              className={`px-4 py-2 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                selectedDayIndex === day.dayIndex
                  ? 'bg-[#1C1C1C] text-white shadow-sm'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              Day {day.dayIndex} ({day.date})
            </button>
          ))}
        </div>
        <div className="text-xs text-stone-500 font-mono font-medium hidden md:block">
          Coordinating {trip.groupMembers.length} plans
        </div>
      </div>

      {/* Safety Alerts Panel */}
      {trip.alerts.length > 0 && (
        <div className="space-y-2" id="safety-warnings-panel">
          {trip.alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border flex gap-3 text-xs leading-relaxed ${
                alert.severity === 'Critical'
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : alert.severity === 'Warning'
                  ? 'bg-amber-50 border-amber-200 text-amber-700 font-medium'
                  : 'bg-stone-50 border-stone-200 text-stone-700'
              }`}
            >
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <div>
                <span className="font-bold uppercase tracking-wider block text-[10px] mb-0.5">
                  {alert.type} Safety Notice
                </span>
                <span>{alert.message}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Itinerary List Grid */}
      <div className="grid grid-cols-1 gap-6" id="daily-itinerary-items-grid">
        {activeDay.items.map((item) => {
          const isEditing = editingItemNotes === item.id;
          const assignedMembers = trip.groupMembers.filter(m => 
            !item.assignedSubGroups || item.assignedSubGroups.length === 0 || item.assignedSubGroups.includes(m.id)
          );

          return (
            <div
              key={item.id}
              className={`bg-white border rounded-[2rem] overflow-hidden transition-all duration-205 shadow-sm ${
                item.status === 'Confirmed' ? 'border-brand/45 shadow shadow-[#C5A059]/5' : 'border-stone-200'
              }`}
              id={`item-card-${item.id}`}
            >
              {/* Card Title Banner */}
              <div className="bg-stone-50 px-6 py-3.5 border-b border-stone-200 flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500">
                  ⚡ {item.timeSlot} Schedule
                </span>
                <span className={`text-[9px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-full ${
                  item.status === 'Confirmed' ? 'bg-[#F7F3E9] text-brand border border-[#C5A059]/20' : 'bg-stone-200 text-stone-600'
                }`}>
                  {item.status}
                </span>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Left block - Place info */}
                <div className="md:col-span-8 space-y-4">
                  <div className="flex gap-4 items-start">
                    <img
                      src={item.place.imageUrl}
                      alt={item.place.name}
                      className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-stone-200 shadow-sm"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-brand uppercase font-mono tracking-wider">
                          {item.place.category}
                        </span>
                        <span className="text-stone-300">•</span>
                        <span className="text-xs text-stone-500 font-medium">{item.place.location}</span>
                      </div>
                      <h4 className="text-lg font-bold text-stone-900 leading-tight font-serif italic text-brand">
                        {item.place.name}
                      </h4>
                      <p className="text-xs text-stone-600 max-w-lg leading-relaxed font-medium">
                        {item.place.description}
                      </p>
                    </div>
                  </div>

                  {/* Accessible/Diet indicators */}
                  <div className="flex flex-wrap gap-2 pt-1 border-t border-stone-100 mt-2">
                    <span className={`text-[10px] font-semibold font-mono px-2.5 py-0.5 rounded-full ${
                      item.place.mobilityFriendly 
                        ? 'bg-green-50 text-green-700 border border-green-200/50' 
                        : 'bg-red-50 text-red-700 border border-red-200/55'
                    }`}>
                      {item.place.mobilityFriendly ? '♿ Wheelchair & Senior Preferred' : '⚠️ Heavy Steps / No Lift'}
                    </span>
                    {item.place.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] font-medium font-mono px-2 py-0.5 rounded bg-stone-50 text-stone-500 border border-stone-200">
                        #{tag}
                      </span>
                    ))}
                    <span className="text-[10px] font-mono font-bold text-stone-500 px-2 py-0.5">
                      Est. Cost: ${item.place.costEstimate} / traveler
                    </span>
                  </div>

                  {/* Notes Panel */}
                  <div className="bg-[#F7F3E9]/60 p-4 rounded-2xl border border-[#C5A059]/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold font-mono tracking-wider text-brand block uppercase">
                        📋 Coordinator Group Notes
                      </span>
                      {!isEditing && (
                        <button
                          onClick={() => {
                            setEditingItemNotes(item.id);
                            setTempNotesValue(item.notes || '');
                          }}
                          className="text-[11px] text-stone-550 hover:text-brand transition-colors font-semibold cursor-pointer"
                        >
                          Edit Notes
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          value={tempNotesValue}
                          onChange={(e) => setTempNotesValue(e.target.value)}
                          className="w-full text-xs p-2.5 bg-white border border-stone-250 rounded-xl text-stone-900 focus:outline-none focus:ring-1 focus:ring-brand"
                          rows={2}
                          placeholder="Type specialized group directions..."
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveNotes(item.id)}
                            className="px-3 py-1 bg-[#1C1C1C] text-white hover:bg-brand font-bold text-[10px] uppercase tracking-wide rounded-md cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingItemNotes(null)}
                            className="px-3 py-1 bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold text-[10px] uppercase tracking-wide rounded-md cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-stone-700 text-xs italic font-medium leading-relaxed">
                        {item.notes ? item.notes : 'No specific travel routes entered yet.'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right block - Group Coordination splits & flowchart action */}
                <div className="md:col-span-4 bg-stone-50/70 p-4 rounded-2xl border border-stone-200 flex flex-col justify-between gap-5">
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold font-mono tracking-wider text-stone-400 block uppercase">
                      👥 Active Sub-group Split
                    </span>

                    {/* Member check pill selectors */}
                    <div className="flex flex-wrap gap-2">
                      {trip.groupMembers.map((member) => {
                        const inGroup = !item.assignedSubGroups || item.assignedSubGroups.length === 0 || item.assignedSubGroups.includes(member.id);
                        return (
                          <button
                            key={member.id}
                            onClick={() => handleToggleMemberInSubgroup(item.id, member.id)}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] transition-all cursor-pointer ${
                              inGroup 
                                ? 'bg-brand/10 border border-brand/35 text-brand font-bold shadow-xs' 
                                : 'bg-white border border-stone-200 text-stone-400 font-normal line-through opacity-60'
                            }`}
                          >
                            <img src={member.avatar} alt={member.name} className="w-3.5 h-3.5 rounded-full object-cover" />
                            <span>{member.name.split(' ')[0]}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="text-[10px] text-stone-500 font-medium leading-normal">
                      {item.assignedSubGroups && item.assignedSubGroups.length > 0 
                        ? 'Split active! Only selected members attend this timeslot.' 
                        : 'Entire main group coordinates this activity.'}
                    </div>
                  </div>

                  {/* Flowchart inspector launcher */}
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setInspectorPlace(item.place);
                        setInspectorItemId(item.id);
                      }}
                      className="w-full py-2.5 px-3 bg-white hover:bg-stone-50 border border-stone-300 hover:border-brand rounded-xl text-stone-700 text-xs font-bold font-mono flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                    >
                      <MessageCircle className="h-4 w-4 text-[#C5A059]" />
                      <span>Inspect Review Trends</span>
                    </button>
                    <div className="text-[9px] text-center text-stone-450 font-medium">
                      Analyze recent consensus trends (Step 3-9 flowchart)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Group Consensus Polls */}
      <div className="bg-white border border-stone-200 rounded-[2rem] overflow-hidden p-6 space-y-4 shadow-sm" id="group-polls-container">
        <div className="flex items-center gap-2 text-brand font-mono text-sm font-bold uppercase border-b border-stone-100 pb-2">
          <CheckSquare className="h-4 w-4" />
          <span>🗳️ Group Consensus Decider Polls</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {trip.polls.map((poll) => {
            return (
              <div key={poll.id} className="bg-stone-50/50 p-4 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-stone-850 text-xs font-bold leading-snug">{poll.question}</h5>
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    poll.status === 'Open' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-stone-200 border-stone-300 text-stone-600'
                  }`}>
                    {poll.status} Poll
                  </span>
                </div>

                <div className="space-y-2">
                  {poll.options.map((opt) => {
                    const totalVotesCount = poll.options.reduce((acc, o) => acc + o.votes.length, 0);
                    const percent = totalVotesCount > 0 ? (opt.votes.length / totalVotesCount) * 100 : 0;

                    return (
                      <div key={opt.id} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-medium text-stone-700">
                          <span className="leading-normal">{opt.name}</span>
                          <span className="font-mono text-brand font-bold">{opt.votes.length} votes ({Math.round(percent)}%)</span>
                        </div>
                        {/* Vote bar indicator */}
                        <div className="relative w-full bg-stone-200/70 rounded-full h-2 overflow-hidden border border-stone-200">
                          <div 
                            className="bg-brand h-2 rounded-full transition-all" 
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                        
                        {/* Interactive cast-vote bar */}
                        {poll.status === 'Open' && (
                          <div className="flex gap-1.5 items-center flex-wrap pt-1">
                            <span className="text-[9px] text-stone-400 mr-1 font-mono uppercase">Vote as:</span>
                            {trip.groupMembers.map((member) => {
                              const hasVotedThisOpt = opt.votes.includes(member.id);
                              return (
                                <button
                                  key={member.id}
                                  onClick={() => handleVoteInPoll(poll.id, opt.id, member.id)}
                                  className={`px-2 py-0.5 text-[9px] font-bold rounded-lg cursor-pointer transition-all ${
                                    hasVotedThisOpt 
                                      ? 'bg-brand text-white shadow-xs' 
                                      : 'bg-white hover:bg-stone-100 border border-stone-200 text-stone-500'
                                  }`}
                                >
                                  {member.name.split(' ')[0]}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review trend modal placeholder */}
      {inspectorPlace && (
        <ReviewTrendModal
          place={inspectorPlace}
          onClose={() => {
            setInspectorPlace(null);
            setInspectorItemId(null);
          }}
          onDecision={handleInspectorDecision}
        />
      )}
    </div>
  );
}
