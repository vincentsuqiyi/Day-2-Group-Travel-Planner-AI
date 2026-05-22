/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AreaChart, TrendingUp, DollarSign, Percent, ShieldCheck, Users, Hotel, Award, Sparkles, Building2 } from 'lucide-react';
import { mockAdminState } from '../mockData';
import { AdminDashboardState, DestinationMetric, HotelMetric, VendorPartnerMetric } from '../types';

interface AdminPanelProps {
  adminData?: AdminDashboardState;
}

export default function AdminPanel({ adminData = mockAdminState }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'destinations' | 'hotels' | 'vendors' | 'predictions'>('destinations');

  // Compute summary stats
  const totalBookings = adminData.popularDestinations.reduce((acc, d) => acc + d.bookingsCount, 0);
  const totalRevenue = adminData.popularDestinations.reduce((acc, d) => acc + d.revenueGenerated, 0);
  const totalCommission = adminData.frequentlyBookedHotels.reduce((acc, h) => acc + h.commissionEarned, 0);

  return (
    <div className="space-y-6" id="admin-panel-main">
      {/* Upper Brand / Pitch Block */}
      <div className="bg-gradient-to-br from-[#1C1C1C] to-stone-850 border border-[#C5A059]/20 p-6 rounded-[2rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand font-bold text-xs tracking-widest uppercase mb-1">
            <Award className="h-4 w-4 text-brand animate-pulse" />
            <span>Operations Center & partner telemetry</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-serif italic tracking-tight">Manager & Affiliate Dashboard</h2>
          <p className="text-sm text-stone-300 mt-1 font-medium">
            Optimize group bookings, track platform commission yields, and renegotiate Disney & WelCab partnerships.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-brand/10 border border-[#C5A059]/40 px-4 py-2.5 rounded-xl text-xs font-mono text-brand font-bold">
          <ShieldCheck className="h-4 w-4 text-brand" />
          <span>Active Session: GDPR Scrub Compliant</span>
        </div>
      </div>

      {/* Main KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="admin-kpis">
        <div className="bg-white border border-stone-205 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-brand/10 text-brand rounded-xl">
            <Users className="h-6 w-6" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block font-mono">Total Managed Groups</span>
            <span className="text-2xl font-bold font-mono text-stone-900 block">{totalBookings.toLocaleString()}</span>
            <span className="text-[10px] text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 mt-1 w-fit">
              <TrendingUp className="h-3 w-3" />
              <span>+14.5% MoM spike</span>
            </span>
          </div>
        </div>

        <div className="bg-white border border-stone-205 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-brand/10 text-brand rounded-xl">
            <DollarSign className="h-6 w-6" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block font-mono">Affiliate Gross Revenue</span>
            <span className="text-2xl font-bold font-mono text-stone-900 block">${totalRevenue.toLocaleString()}</span>
            <span className="text-[10px] text-brand font-bold uppercase font-mono mt-1 block">High group multipliers</span>
          </div>
        </div>

        <div className="bg-white border border-stone-205 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-brand/10 text-brand rounded-xl">
            <Percent className="h-6 w-6" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block font-mono">Consolidated Commissions</span>
            <span className="text-2xl font-bold font-mono text-stone-900 block">${totalCommission.toLocaleString()}</span>
            <span className="text-[10px] text-stone-600 font-bold uppercase font-mono mt-1 block">8.2% avg platform take-rate</span>
          </div>
        </div>
      </div>

      {/* Tabs with visual analytics */}
      <div className="bg-white border border-stone-202 rounded-[2rem] overflow-hidden shadow-sm" id="admin-table-container">
        <div className="border-b border-stone-200 bg-[#F7F3E9]/50 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('destinations')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'destinations' 
                  ? 'bg-[#1C1C1C] text-white shadow-xs' 
                  : 'text-stone-605 bg-white border border-stone-200 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              Popular Destinations ({adminData.popularDestinations.length})
            </button>
            <button
              onClick={() => setActiveTab('hotels')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'hotels' 
                  ? 'bg-[#1C1C1C] text-white shadow-xs' 
                  : 'text-stone-605 bg-white border border-stone-200 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              Top Booked Hotels & Commissions
            </button>
            <button
              onClick={() => setActiveTab('vendors')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'vendors' 
                  ? 'bg-[#1C1C1C] text-white shadow-xs' 
                  : 'text-stone-605 bg-white border border-stone-200 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              Vendor Partnerships ({adminData.trendingVendors.length})
            </button>
            <button
              onClick={() => setActiveTab('predictions')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'predictions' 
                  ? 'bg-[#1C1C1C] text-white shadow-xs' 
                  : 'text-stone-605 bg-white border border-stone-200 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              AI Predictive Demand Insights
            </button>
          </div>
        </div>

        {/* Tab contents */}
        <div className="p-6">
          {activeTab === 'destinations' && (
            <div className="space-y-4">
              <div className="text-sm font-semibold text-stone-800 mb-2">Group Demand Mapped by Destination</div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-600">
                  <thead className="bg-[#F7F3E9]/50 text-stone-800 font-mono border-b border-stone-200">
                    <tr>
                      <th className="p-3 font-bold uppercase tracking-wider text-[10px]">Target Destination Plan</th>
                      <th className="p-3 text-right font-bold uppercase tracking-wider text-[10px]">Group Bookings</th>
                      <th className="p-3 text-right font-bold uppercase tracking-wider text-[10px]">Itinerary Saves</th>
                      <th className="p-3 text-right font-bold uppercase tracking-wider text-[10px]">Gross Bookings Value</th>
                      <th className="p-3 text-right font-bold uppercase tracking-wider text-[10px]">Growth Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-150">
                    {adminData.popularDestinations.map((dest, idx) => (
                      <tr key={idx} className="hover:bg-stone-50/50 transition-colors">
                        <td className="p-3 font-bold font-serif italic text-brand text-sm flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-brand"></span>
                          {dest.name}
                        </td>
                        <td className="p-3 text-right font-mono text-stone-800">{dest.bookingsCount} groups</td>
                        <td className="p-3 text-right text-stone-500 font-mono">{dest.itinerarySaves} list drafts</td>
                        <td className="p-3 text-right font-mono text-[#1C1C1C] font-semibold">${dest.revenueGenerated.toLocaleString()}</td>
                        <td className={`p-3 text-right font-mono font-bold ${dest.growthTrend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {dest.growthTrend > 0 ? '+' : ''}{dest.growthTrend}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'hotels' && (
            <div className="space-y-4">
              <div className="text-sm font-semibold text-stone-800 mb-2">Platform Affiliate Commission Breakdown</div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-600">
                  <thead className="bg-[#F7F3E9]/50 text-stone-800 font-mono border-b border-stone-200">
                    <tr>
                      <th className="p-3 font-bold uppercase tracking-wider text-[10px]">Hotel/Resort Partner</th>
                      <th className="p-3 text-right font-bold uppercase tracking-wider text-[10px]">Transactions Count</th>
                      <th className="p-3 text-right font-bold uppercase tracking-wider text-[10px]">Average Rating</th>
                      <th className="p-3 text-right font-bold uppercase tracking-wider text-[10px]">Platform Commission Payout</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-150">
                    {adminData.frequentlyBookedHotels.map((hotel, idx) => (
                      <tr key={idx} className="hover:bg-stone-50/50 transition-colors">
                        <td className="p-3 font-bold font-serif italic text-brand text-sm flex items-center gap-2">
                          <Hotel className="h-4 w-4 text-brand" />
                          {hotel.name}
                        </td>
                        <td className="p-3 text-right font-mono text-stone-800">{hotel.bookedCount} times</td>
                        <td className="p-3 text-right font-mono text-amber-500 font-bold">★ {hotel.avgRating.toFixed(1)}</td>
                        <td className="p-3 text-right font-mono text-[#1C1C1C] font-bold">${hotel.commissionEarned.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'vendors' && (
            <div className="space-y-4">
              <div className="text-sm font-semibold text-stone-800 mb-2">Active Vendor Partnerships & Demand Index</div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-600">
                  <thead className="bg-[#F7F3E9]/50 text-stone-800 font-mono border-b border-stone-200">
                    <tr>
                      <th className="p-3 font-bold uppercase tracking-wider text-[10px]">Vendor Entity Name</th>
                      <th className="p-3 font-bold uppercase tracking-wider text-[10px]">Category Type</th>
                      <th className="p-3 text-right font-bold uppercase tracking-wider text-[10px]">Active Bookings</th>
                      <th className="p-3 font-bold uppercase tracking-wider text-[10px]">Partnership Level</th>
                      <th className="p-3 font-bold uppercase tracking-wider text-[10px]">Predictive Hotness Indicator</th>
                      <th className="p-3 font-bold uppercase tracking-wider text-[10px]">Next Review Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-150">
                    {adminData.trendingVendors.map((vendor, idx) => (
                      <tr key={idx} className="hover:bg-stone-50/50 transition-colors">
                        <td className="p-3 font-semibold text-stone-900">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-brand" />
                            <span className="font-bold font-serif italic text-brand text-sm">{vendor.name}</span>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-stone-600 font-medium">{vendor.type}</td>
                        <td className="p-3 text-right font-mono text-stone-800 font-bold">{vendor.currentBookings}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold font-mono border ${
                            vendor.partnershipLevel === 'Preferred' ? 'bg-[#F7F3E9] border-brand/35 text-brand' :
                            vendor.partnershipLevel === 'Standard' ? 'bg-stone-105 bg-stone-100 border-stone-200 text-stone-600' : 'bg-green-50 border-green-200 text-green-700'
                          }`}>
                            {vendor.partnershipLevel}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-stone-200 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className="bg-brand h-1.5 rounded-full" 
                                style={{ width: `${vendor.predictiveDemandScore}%` }}
                              ></div>
                            </div>
                            <span className="font-mono text-stone-700 font-bold text-[11px]">{vendor.predictiveDemandScore}%</span>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-stone-500 font-medium">{vendor.nextNegotiationDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'predictions' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-brand text-sm font-bold mb-3 font-serif italic">
                <Sparkles className="h-5 w-5 text-brand" />
                <span>AI Predictive Machine Modeling & Partner Strategy Alerts</span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {adminData.predictiveInsights.map((insight, idx) => (
                  <div key={idx} className="bg-stone-50 p-4 rounded-2xl border border-stone-200 hover:border-brand/40 transition-colors flex gap-3 items-start shadow-xs">
                    <span className="w-6 h-6 shrink-0 rounded-full bg-brand/10 text-brand border border-[#C5A059]/25 flex items-center justify-center font-mono font-bold text-xs mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-stone-700 text-xs leading-relaxed font-medium">
                      {insight}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
