/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DollarSign, ShieldCheck, Percent, Ticket, ShoppingBag, Truck, Plane, ClipboardList, Wallet, Sparkles } from 'lucide-react';
import { BookingItem, FamilyOrGroupMember, TripPlan } from '../types';

interface BookingsSplitterProps {
  trip: TripPlan;
  onUpdateTrip: (updatedTrip: TripPlan) => void;
  onAlert: (msg: string) => void;
}

export default function BookingsSplitter({ trip, onUpdateTrip, onAlert }: BookingsSplitterProps) {
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);

  // Compute payment status totals
  let aggregateCost = trip.bookings.reduce((sum, b) => sum + b.totalCost, 0);
  let totalPaidAmount = 0;
  let totalPendingAmount = 0;

  trip.bookings.forEach((booking) => {
    Object.values(booking.paymentSplit).forEach((split) => {
      if (split.paid) {
        totalPaidAmount += split.amount;
      } else {
        totalPendingAmount += split.amount;
      }
    });
  });

  // Handle marking split payment as Paid
  const handleSettleMemberSplit = (bookingId: string, memberId: string) => {
    const updatedBookings = trip.bookings.map((booking) => {
      if (booking.id === bookingId) {
        return {
          ...booking,
          paymentSplit: {
            ...booking.paymentSplit,
            [memberId]: {
              ...booking.paymentSplit[memberId],
              paid: true
            }
          }
        };
      }
      return booking;
    });

    // Check if whole booking is now paid
    const finalBookings = updatedBookings.map((b) => {
      if (b.id === bookingId) {
        const allPaid = Object.values(b.paymentSplit).every((val) => val.paid);
        return { ...b, status: (allPaid ? 'Paid' as const : 'Pending' as const) };
      }
      return b;
    });

    onUpdateTrip({ ...trip, bookings: finalBookings });
    onAlert('💸 Split payment confirmed! Transaction settling with financial gateway.');
  };

  // Add a new booking (e.g. Special access vehicle or Insurance upgrade)
  const handlePurchaseNewOption = (type: 'Special Vehicle' | 'Insurance' | 'Hotel', provider: string, cost: number, commissionPercent: number, features: string) => {
    // Generate split equally among active travelers
    const count = trip.groupMembers.length;
    const splitAmount = Math.round(cost / count);
    const splitMap: { [memberId: string]: { amount: number; paid: boolean } } = {};
    
    trip.groupMembers.forEach((member) => {
      splitMap[member.id] = { amount: splitAmount, paid: false };
    });

    const newBooking: BookingItem = {
      id: `book_gen_${Date.now()}`,
      type,
      provider,
      totalCost: cost,
      status: 'Pending',
      supplierCommissionPercent: commissionPercent,
      accessibilityFeatures: features,
      paymentSplit: splitMap
    };

    onUpdateTrip({ ...trip, bookings: [...trip.bookings, newBooking] });
    onAlert(`🎉 Booked: "${provider}" added! Group members alerted for split payments.`);
  };

  return (
    <div className="space-y-6" id="bookings-splitter-view">
      
      {/* Financial Status Summary Meter */}
      <div className="bg-white border border-stone-200 p-6 rounded-[2rem] grid grid-cols-1 md:grid-cols-4 gap-6 shadow-sm" id="bookings-totals-ribbon">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-stone-500 font-mono tracking-wider block">
            Total Group Booking Value
          </span>
          <div className="text-2xl font-bold font-mono text-stone-900 flex items-baseline">
            ${aggregateCost.toLocaleString()} <span className="text-xs text-stone-400 font-normal ml-1">USD</span>
          </div>
          <div className="text-[10px] text-stone-500 font-medium">Locked at custom group rates</div>
        </div>

        <div className="space-y-1 border-t md:border-t-0 md:border-l border-stone-200 pt-4 md:pt-0 md:pl-6">
          <span className="text-[10px] uppercase font-bold text-green-600 font-mono tracking-wider block">
            Paid / Settled Splits
          </span>
          <div className="text-2xl font-bold font-mono text-green-600">
            ${totalPaidAmount.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-500 font-medium">
            {aggregateCost > 0 ? Math.round((totalPaidAmount / aggregateCost) * 100) : 0}% settled successfully
          </div>
        </div>

        <div className="space-y-1 border-t md:border-t-0 md:border-l border-stone-200 pt-4 md:pt-0 md:pl-6">
          <span className="text-[10px] uppercase font-bold text-amber-600 font-mono tracking-wider block">
            Outstanding Splits
          </span>
          <div className="text-2xl font-bold font-mono text-amber-600">
            ${totalPendingAmount.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-500 font-medium">Pending traveler authorization</div>
        </div>

        <div className="space-y-1 border-t md:border-t-0 md:border-l border-stone-200 pt-4 md:pt-0 md:pl-6 bg-stone-50 p-3 rounded-2xl border">
          <span className="text-[10px] uppercase font-bold text-brand font-mono tracking-wider block">
            Coordinated Commission Yield
          </span>
          <div className="text-xl font-bold font-mono text-brand">
            ${trip.bookings.reduce((sum, b) => sum + Math.round(b.totalCost * (b.supplierCommissionPercent / 100)), 0)}
          </div>
          <p className="text-[9px] text-stone-450 leading-normal font-medium">
            Platform earnings paid by operators. Group faces zero markups!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column - Booking categories list */}
        <div className="lg:col-span-8 space-y-4">
          <div className="text-sm font-semibold text-stone-800">Active Bookings splits ({trip.bookings.length})</div>

          <div className="space-y-3">
            {trip.bookings.map((booking) => {
              const isActive = activeBookingId === booking.id;
              const commissionEarned = Math.round(booking.totalCost * (booking.supplierCommissionPercent / 100));

              return (
                <div
                  key={booking.id}
                  className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                    isActive ? 'bg-[#F7F3E9]/20 border-brand/50 shadow-sm' : 'bg-white border-stone-200 shadow-xs'
                  }`}
                  id={`booking-block-${booking.id}`}
                >
                  {/* Banner trigger */}
                  <div
                    onClick={() => setActiveBookingId(isActive ? null : booking.id)}
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-stone-50/50 transition-all select-none"
                  >
                    <div className="flex gap-4 items-center">
                      <div className="p-2.5 bg-stone-100 rounded-xl text-stone-600">
                        {booking.type === 'Flight' && <Plane className="h-5 w-5" />}
                        {booking.type === 'Hotel' && <Ticket className="h-5 w-5" />}
                        {booking.type === 'Special Vehicle' && <Truck className="h-5 w-5 text-brand" />}
                        {booking.type === 'Insurance' && <ClipboardList className="h-5 w-5" />}
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-[10px] font-bold text-stone-400 font-mono uppercase">
                          {booking.type} Booking
                        </div>
                        <h4 className="text-sm font-bold text-stone-900">{booking.provider}</h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-extrabold font-mono text-stone-900">${booking.totalCost}</div>
                        <span className={`text-[10px] font-mono font-bold ${
                          booking.status === 'Paid' ? 'text-green-600' : 'text-amber-500'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Split Payment table */}
                  {isActive && (
                    <div className="bg-stone-50/60 border-t border-stone-200 p-5 space-y-4">
                      {booking.accessibilityFeatures && (
                        <div className="bg-white p-3.5 rounded-xl border border-stone-250">
                          <span className="text-[10px] font-bold font-mono text-brand block uppercase mb-1">
                            ♿ Priority Assistance Features Locked:
                          </span>
                          <p className="text-xs text-stone-700 leading-relaxed font-medium">
                            {booking.accessibilityFeatures}
                          </p>
                        </div>
                      )}

                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-stone-500 block">Traveller Splits Ledger</span>
                        <div className="grid grid-cols-1 gap-2">
                          {trip.groupMembers.map((member) => {
                            const split = booking.paymentSplit[member.id] || { amount: 0, paid: true };
                            if (split.amount === 0) return null;

                            return (
                              <div key={member.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-stone-200">
                                <div className="flex items-center gap-2.5">
                                  <img src={member.avatar} alt={member.name} className="w-5 h-5 rounded-full object-cover" />
                                  <span className="text-xs text-stone-850 font-bold">{member.name}</span>
                                  <span className="text-[10px] text-stone-500 font-mono">(${split.amount} share)</span>
                                </div>

                                <div className="flex items-center gap-3">
                                  {split.paid ? (
                                    <span className="text-[10px] font-mono text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200 font-bold">
                                      Paid & Settled
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => handleSettleMemberSplit(booking.id, member.id)}
                                      className="px-2.5 py-1 bg-brand hover:opacity-90 text-white font-bold font-mono text-[10px] rounded-lg cursor-pointer transition-colors"
                                    >
                                      Settle Split
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Transparent Platform Affiliate Commission breakdown */}
                      <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono pt-3 border-t border-stone-200">
                        <span>Affiliate Commission Value ({booking.supplierCommissionPercent}%)</span>
                        <span className="text-brand font-bold">${commissionEarned} (Paid by Partner oper.)</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column - VIP Recommendations & Add-ons */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-stone-200 p-5 rounded-[2rem] space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-brand text-xs font-bold font-mono uppercase pb-2 border-b border-stone-150">
              <Sparkles className="h-5 w-5 text-brand" />
              <span>Recommended Upgrades</span>
            </div>
            
            <p className="text-xs text-stone-600 leading-relaxed font-medium">
              Coordinated options tailored for Grandma Sarah (Senior/Wheelchair friendly) and Chloe (Age 8 - Kids focus). Suggesting better experiences matching high value indexes:
            </p>

            {/* Upgrade Recommendation Cards */}
            <div className="space-y-3" id="upgrades-list">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 hover:border-brand/40 transition-all space-y-3 shadow-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-xs font-bold text-stone-900 font-serif italic text-brand">Toyota WelCab Sprinter Pro</h5>
                    <p className="text-[10px] text-emerald-600 uppercase font-mono font-bold mt-0.5">Special Access Vehicle</p>
                  </div>
                  <span className="text-xs font-bold font-mono text-stone-900">$650 <span className="text-[10px] font-normal text-stone-400">/ week</span></span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed font-medium">
                  Hydraulic back ramp lift, robust floor clamps, full panoramas. Perfect choice for Grandma Sarah's Mt. Fuji tour day.
                </p>
                <button
                  onClick={() => handlePurchaseNewOption(
                    'Special Vehicle',
                    'Toyota WelCab Private Tour Sprinter',
                    650,
                    12.0,
                    'Integrated hydraulic lift, double locking brackets, specialized safety harness systems checked for heavy senior wheelchairs.'
                  )}
                  className="w-full py-2 bg-[#1C1C1C] hover:bg-brand text-white font-bold text-[10px] tracking-wider uppercase rounded-full transition-colors cursor-pointer"
                >
                  Book Hydraulic Sprinter
                </button>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 hover:border-brand/40 transition-all space-y-3 shadow-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-xs font-bold text-stone-900 font-serif italic text-brand">Allianz Senior Medical Priority</h5>
                    <p className="text-[10px] text-brand uppercase font-mono font-bold mt-0.5 font-bold">Insurance Coverage</p>
                  </div>
                  <span className="text-xs font-bold font-mono text-stone-900">$350 <span className="text-[10px] font-normal text-stone-400">/ group</span></span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed font-medium">
                  Includes full flight cancellations, priority medical evacuation, and allergen-accident care structures abroad.
                </p>
                <button
                  onClick={() => handlePurchaseNewOption(
                    'Insurance',
                    'Allianz Medical Priority Care',
                    350,
                    15.0,
                    'Allergen accident priority, pre-existing medication delivery, and medical standard air evacuation coverage.'
                  )}
                  className="w-full py-2 bg-[#1C1C1C] hover:bg-brand text-white font-bold text-[10px] tracking-wider uppercase rounded-full transition-colors cursor-pointer"
                >
                  Book Priority Insurance
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
