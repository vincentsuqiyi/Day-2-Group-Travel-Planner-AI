/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { Download, CheckCircle, ShieldAlert, Award, Footprints } from 'lucide-react';
import { TripPlan } from '../types';

interface PDFExporterProps {
  trip: TripPlan;
}

export default function PDFExporter({ trip }: PDFExporterProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    // Elegant system print trigger
    window.print();
  };

  return (
    <div className="space-y-6" id="pdf-exporter-view">
      
      {/* Exporter prompt header */}
      <div className="bg-[#F7F3E9]/80 border border-[#C5A059]/20 p-6 rounded-[2em] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-stone-900 font-serif italic text-brand">Simulate & Save Itinerary Portfolio</h3>
          <p className="text-xs text-stone-600 font-medium">
            Render a beautiful, high-resolution traveler dossier to keep offline, complete with safety disclaimers and accommodation paths.
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="px-5 py-2.5 bg-brand hover:opacity-90 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
        >
          <Download className="h-4 w-4" />
          <span>Save/Print physical PDF Brochure</span>
        </button>
      </div>

      {/* Styled Printable Paper Container */}
      <div className="bg-white text-stone-900 rounded-[2rem] shadow-md overflow-hidden max-w-4xl mx-auto border border-stone-205">
        
        {/* Style block specifically for styling print layout on standard paper ratios */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-travel-dossier, #printable-travel-dossier * {
              visibility: visible;
            }
            #printable-travel-dossier {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              color: #1c1c1c !important;
              background: #fff !important;
              padding: 24px !important;
            }
            .no-print {
              display: none !important;
            }
          }
        `}} />

        {/* Core Dossier */}
        <div ref={printRef} id="printable-travel-dossier" className="p-8 sm:p-12 space-y-8 bg-white selection:bg-stone-100">
          
          {/* Header Layout */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-stone-200 pb-6">
            <div className="space-y-1.5">
              <div className="text-[10px] uppercase font-bold text-brand font-mono tracking-widest">
                Coordinated Group Itinerary Map
              </div>
              <h2 className="text-3xl font-bold text-stone-900 tracking-tight font-serif italic text-brand">
                {trip.destination}
              </h2>
              <p className="text-xs text-stone-500 font-mono font-medium">
                Duration: {trip.startDate} to {trip.endDate} • {trip.itinerary.length} Days Planner
              </p>
            </div>
            
            <div className="text-right sm:text-right text-left space-y-1.5">
              <div className="text-xs font-bold text-[#1C1C1C] uppercase tracking-widest font-mono">
                AI TRAVEL PLANNERS LLC
              </div>
              <p className="text-[10px] text-stone-400 font-medium">Affiliate Certificate #823-91A</p>
              <div className="inline-flex items-center gap-1 bg-[#F7F3E9] text-brand border border-[#C5A059]/30 px-3 py-1 rounded-full text-[10px] font-bold font-mono">
                <CheckCircle className="h-3 w-3 shrink-0" />
                <span>All Group Bookings Secured</span>
              </div>
            </div>
          </div>

          {/* Traveler Profiles Segment */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono border-b border-stone-100 pb-1">
              Traveler Group Profiles & Preferences
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {trip.groupMembers.map((member) => (
                <div key={member.id} className="p-3.5 bg-stone-50/60 rounded-xl border border-stone-200 space-y-1">
                  <div className="font-bold text-xs text-stone-900">{member.name}</div>
                  <div className="text-[10px] text-stone-500 capitalize font-medium">{member.role}</div>
                  <div className="text-[10px] text-brand font-bold font-mono">
                    Mobility: {member.mobilityNeeds}
                  </div>
                  {member.dietaryPreferences[0] !== 'None' && (
                    <div className="text-[9px] text-red-700 font-bold font-mono">
                      Diet: {member.dietaryPreferences.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Active Bookings Reciept */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono border-b border-stone-100 pb-1">
              Secured Accommodations & Transit
            </h4>
            <div className="border border-stone-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-[11px] text-stone-600">
                <thead className="bg-[#F7F3E9]/50 text-stone-800 font-mono border-b border-stone-200">
                  <tr>
                    <th className="p-3 font-bold uppercase tracking-wider text-[10px]">Service Segment / Operator</th>
                    <th className="p-3 font-bold uppercase tracking-wider text-[10px]">Category</th>
                    <th className="p-3 font-bold uppercase tracking-wider text-[10px]">Passenger Assistance Config</th>
                    <th className="p-3 text-right font-bold uppercase tracking-wider text-[10px]">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-150">
                  {trip.bookings.map((booking) => (
                    <tr key={booking.id} className="text-stone-800 hover:bg-stone-50/30">
                      <td className="p-3 font-bold font-serif italic text-stone-900">{booking.provider}</td>
                      <td className="p-3 font-mono font-medium">{booking.type}</td>
                      <td className="p-3 text-xs text-stone-500 font-medium">
                        {booking.accessibilityFeatures ? booking.accessibilityFeatures : 'Full senior transit ready'}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-stone-900">${booking.totalCost}</td>
                    </tr>
                  ))}
                  <tr className="bg-stone-50/50 text-stone-900 font-bold">
                    <td colSpan={3} className="p-4 text-right font-mono uppercase text-[10px] tracking-wide">Total Booking Amount Value</td>
                    <td className="p-4 text-right font-mono text-brand text-xs font-bold">${trip.bookings.reduce((acc, b) => acc + b.totalCost, 0)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed Schedules Loop */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono border-b border-stone-100 pb-1">
              Confirmed Daily Schedules
            </h4>
            
            <div className="space-y-6">
              {trip.itinerary.map((day) => (
                <div key={day.dayIndex} className="space-y-2">
                  <div className="text-[11px] font-mono font-bold text-brand bg-[#F7F3E9] px-3 py-1.5 rounded-lg border border-[#C5A059]/10">
                    DAY {day.dayIndex} — {day.date}
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {day.items.map((item) => (
                      <div key={item.id} className="p-4 bg-stone-50/30 hover:bg-stone-50 rounded-2xl border border-stone-200 space-y-2 flex flex-col sm:flex-row gap-4 justify-between items-start transition-colors">
                        <div className="space-y-1 max-w-xl">
                          <div className="flex items-center gap-1.5 text-[9px] font-bold font-mono tracking-wider text-brand">
                            <span>🕒 {item.timeSlot}</span>
                            <span className="text-stone-300">•</span>
                            <span className="uppercase text-stone-500">{item.place.category}</span>
                          </div>
                          <h5 className="font-serif italic text-stone-900 font-bold text-sm text-brand">{item.place.name}</h5>
                          <p className="text-[11px] text-stone-605 leading-relaxed font-medium italic">
                            "{item.place.description}"
                          </p>
                          {item.notes && (
                            <p className="text-[10px] text-stone-500 font-mono font-medium">
                              Group Note: {item.notes}
                            </p>
                          )}
                        </div>
                        <div className="text-[10px] text-right font-mono shrink-0">
                          <span className="text-stone-900 font-bold">${item.place.costEstimate} / person</span>
                          <div className="text-[9px] font-bold text-green-700 mt-1 uppercase">
                            {item.place.mobilityFriendly ? '♿ Wheelchair Step-free' : '⚠️ Checking path lift'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Official Disclaimers Segment */}
          <div className="pt-6 border-t border-stone-200 space-y-3 shrink-0">
            <h5 className="text-[10px] font-bold font-mono tracking-widest text-[#1C1C1C] uppercase flex items-center gap-1.5 leading-normal">
              <ShieldAlert className="h-4 w-4 text-brand" />
              Official Safety & External Factors Disclaimer
            </h5>
            <p className="text-[9px] text-stone-450 leading-relaxed font-medium">
              1. **Weather Shifts & Helicopter Flights**: High maritime or coastal winds nearby coastal theme parks (e.g. Disneyland Park) can immediately reschedule vehicle departures, high-speed rail limits, or cable ferries. Weather alerts are continuously polled.<br />
              2. **Travel Risks & Accessibility Limits**: The designated WelCab Sprinters utilize certified 4-point hydraulic lifts. While wheelchair access parameters are guaranteed for marked places, travelers are advised to verify sidewalk turns in older heritage wards.<br />
              3. **Affiliate Pricing Guarantee**: Outlined prices display total direct rates. Recommendations are mapped to deliver highest value index for group budgets. No markups apply; system is funded entirely by operator commission allowances.
            </p>
          </div>

        </div>

        {/* Exporter UI Footer */}
        <div className="bg-stone-50 border-t border-stone-200 px-8 py-4 text-center text-xs text-stone-500 no-print font-medium">
          💡 Clicking "Print physical PDF Brochure" opens standard system dialog. Select <span className="font-semibold text-stone-800">"Save as PDF"</span> option to download.
        </div>

      </div>

    </div>
  );
}
