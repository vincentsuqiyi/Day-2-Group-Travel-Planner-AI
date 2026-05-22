/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, getTripFromDb, saveTripToDb } from './lib/supabase';
import { 
  Compass, 
  Map, 
  LayoutDashboard, 
  CreditCard, 
  FileText, 
  Calendar, 
  Users, 
  DollarSign, 
  RefreshCw, 
  Sparkles, 
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  Building2,
  Lock,
  LogOut
} from 'lucide-react';
import LoginModule from './components/LoginModule';
import ItineraryManager from './components/ItineraryManager';
import BookingsSplitter from './components/BookingsSplitter';
import PDFExporter from './components/PDFExporter';
import AdminPanel from './components/AdminPanel';
import { mockTrips, mockGroupMembers } from './mockData';
import { TripPlan } from './types';

export default function App() {
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<'Traveler' | 'Admin'>('Traveler');
  const [activeSubTab, setActiveSubTab] = useState<'itinerary' | 'bookings' | 'exporter'>('itinerary');
  const [trip, setTrip] = useState<TripPlan>(mockTrips[0]);

  // Load initial data and subscribe to live changes from Supabase
  useEffect(() => {
    let active = true;

    async function initSupabaseData() {
      if (!isSupabaseConfigured || !supabase) {
        console.log('Supabase offline fallback config active (matching localStorage fallback pattern).');
        return;
      }

      console.log('Fetching initial TripPlan from Supabase "entries" table...');
      const dbTrip = await getTripFromDb('trip_tokyo_disney_2026');
      if (dbTrip && active) {
        setTrip(dbTrip);
        console.log('Successfully synced trip state from Supabase:', dbTrip);
      } else if (active) {
        console.log('No existing entry found for trip_tokyo_disney_2026. Seeding initial mock data...');
        await saveTripToDb('trip_tokyo_disney_2026', mockTrips[0]);
      }
    }

    initSupabaseData();

    // Subscribe to Postgres Changes live
    let channel: any = null;
    if (isSupabaseConfigured && supabase) {
      console.log('Setting up realtime channel on "entries" table...');
      channel = supabase
        .channel('entries-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'entries',
          },
          (payload) => {
            console.log('Live Postgres change received:', payload);
            if (payload.new && (payload.new as any).id === 'trip_tokyo_disney_2026') {
              const newData = (payload.new as any).data;
              if (newData && active) {
                console.log('Updating trip state to match live Postgres payload!');
                setTrip(newData);
                handleTriggerAlert('🔄 Itinerary synced automatically via Supabase realtime channels.');
              }
            }
          }
        )
        .subscribe((status) => {
          console.log(`Realtime channels status: ${status}`);
        });
    }

    return () => {
      active = false;
      if (channel && supabase) {
        supabase.removeChannel(channel);
        console.log('Removed realtime subscription channel cleanly.');
      }
    };
  }, []);

  const handleUpdateTrip = async (updatedTrip: TripPlan) => {
    setTrip(updatedTrip);
    await saveTripToDb(updatedTrip.id, updatedTrip);
  };
  
  // Custom travel planner parameters for the sidebar generator
  const [targetDestination, setTargetDestination] = useState('Japan (Tokyo & Disneyland)');
  const [startDate, setStartDate] = useState('2026-06-15');
  const [endDate, setEndDate] = useState('2026-06-22');
  const [groupBudget, setGroupBudget] = useState(8000);
  const [recompiling, setRecompiling] = useState(false);
  const [apiKeyNotice, setApiKeyNotice] = useState<string | null>(null);

  // Status alerts ticker
  const [alertMessage, setAlertMessage] = useState<string | null>('Welcome back, Vincent! Your Tokyo group WelCab vehicle split is pending check.');

  const handleTriggerAlert = (msg: string) => {
    setAlertMessage(msg);
    setTimeout(() => {
      setAlertMessage((prev) => (prev === msg ? null : prev));
    }, 5000);
  };

  const handleLoginSuccess = (email: string) => {
    setCurrentUserEmail(email);
    handleTriggerAlert(`🔓 Multi-factor 2FA Authenticated. Welcome ${email}!`);
  };

  // Trigger server-side Gemini generation for a customized group itinerary
  const handleRecompilePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecompiling(true);
    setApiKeyNotice(null);

    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: targetDestination,
          startDate,
          endDate,
          totalBudget: groupBudget,
          groupMembers: trip.groupMembers
        })
      });

      const data = await response.json();
      if (data.itinerary) {
        // Build updated TripPlan with new itinerary days, using existing bookings/polls as baseline
        const updatedTrip: TripPlan = {
          ...trip,
          destination: targetDestination,
          startDate,
          endDate,
          totalBudget: groupBudget,
          itinerary: data.itinerary,
          alerts: data.warnings ? data.warnings.map((msg: string, idx: number) => ({
            id: `gen_warn_${idx}`,
            type: 'Warning',
            message: msg,
            severity: 'Warning'
          })) : []
        };
        handleUpdateTrip(updatedTrip);
        if (data.apiKeyNotice) {
          setApiKeyNotice(data.apiKeyNotice);
        }
        handleTriggerAlert(`🎨 AI travel itinerary compiled successfully for ${targetDestination}!`);
      }
    } catch (err) {
      console.error(err);
      handleTriggerAlert('⚠️ Communication error generating-itinerary, using simulated fallback schema!');
    } finally {
      setRecompiling(false);
    }
  };

  const handleLogout = () => {
    setCurrentUserEmail(null);
    setCurrentRole('Traveler');
    setApiKeyNotice(null);
  };

  // If traveler is not logged in through our secure 2FA, map them to the credential view
  if (!currentUserEmail) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-center items-center p-4 selection:bg-brand selection:text-white font-sans text-[#1C1C1C]">
        <div className="absolute top-8 left-8 flex items-center gap-2" id="brand-indicator">
          <span className="font-serif italic text-2xl tracking-tighter font-bold text-brand">NomadAI</span>
        </div>
        <LoginModule onLoginSuccess={handleLoginSuccess} currentUserEmail={currentUserEmail || undefined} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1C1C1C] font-sans selection:bg-brand selection:text-white" id="applet-viewport">
      
      {/* Upper Universal Layout Rail */}
      <header className="border-b border-stone-200 bg-white sticky top-0 z-40 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-stone-100 rounded-xl text-brand flex items-center justify-center">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-dark flex items-center gap-2">
              <span className="font-serif italic text-2xl tracking-tighter font-bold text-brand">NomadAI</span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-stone-100 text-stone-600 px-2.5 py-0.5 rounded border border-stone-250">
                Full-Stack v3.5
              </span>
            </h1>
            <p className="text-[11px] text-stone-500 mt-0.5 font-medium">
              Smart scheduling coordinates splits, votes, safety alerts & bookings commissions
            </p>
          </div>
        </div>

        {/* Global Control Toggles & Disclaimers */}
        <div className="flex items-center flex-wrap gap-3">
          <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              onClick={() => setCurrentRole('Traveler')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                currentRole === 'Traveler' 
                  ? 'bg-brand text-white font-semibold' 
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              Customer Portal
            </button>
            <button
              onClick={() => setCurrentRole('Admin')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                currentRole === 'Admin' 
                  ? 'bg-brand text-white font-semibold' 
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              Manager Panel
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-600 hover:text-stone-900 rounded-xl transition-colors cursor-pointer"
            title="Log Out Secure Session"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Real-time Status Alert Banner */}
      {alertMessage && (
        <div className="bg-[#F7F3E9] border-b border-[#C5A059]/20 px-6 py-2.5 text-center flex items-center justify-center gap-2 text-xs text-brand font-medium">
          <ShieldCheck className="h-4 w-4 shrink-0 animate-pulse text-brand" />
          <span>{alertMessage}</span>
        </div>
      )}

      {/* Main Layout Grid */}
      <main className="max-w-[1700px] mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side Column - AI Itinerary Compiler & Parameters (Locked for Admin roles) */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-stone-200 p-5 rounded-[2rem] shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-brand text-xs font-bold font-mono tracking-wider uppercase pb-2 border-b border-stone-150">
              <Sparkles className="h-4.5 w-4.5" />
              <span>AI Itinerary compiler</span>
            </div>

            <form onSubmit={handleRecompilePlan} className="space-y-4" id="itinerary-parameters-form">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.15em] font-bold text-stone-400 font-sans mb-1.5">
                  Destination Country
                </label>
                <input
                  type="text"
                  value={targetDestination}
                  onChange={(e) => setTargetDestination(e.target.value)}
                  className="block w-full px-3 py-2 bg-stone-55 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-xs focus:ring-1 focus:ring-brand focus:border-brand focus:outline-none"
                  placeholder="e.g. Japan, France, USA"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] font-bold text-stone-400 font-sans mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="block w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-[11px] focus:ring-1 focus:ring-brand focus:border-brand focus:outline-none font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] font-bold text-stone-400 font-sans mb-1.5">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="block w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-[11px] focus:ring-1 focus:ring-brand focus:border-brand focus:outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[10px] uppercase tracking-[0.15em] font-bold text-stone-400 font-sans">
                    Total Group Budget
                  </label>
                  <span className="text-xs font-mono font-bold text-brand">${groupBudget}</span>
                </div>
                <input
                  type="range"
                  min={3000}
                  max={20000}
                  step={500}
                  value={groupBudget}
                  onChange={(e) => setGroupBudget(Number(e.target.value))}
                  className="w-full accent-brand cursor-ew-resize"
                />
                <div className="flex justify-between text-[9px] text-brand/80 font-mono mt-1">
                  <span>Min: $3,000</span>
                  <span>Max: $20,000</span>
                </div>
              </div>

              {apiKeyNotice && (
                <div className="p-3 bg-[#F7F3E9] border border-[#C5A059]/20 rounded-xl text-stone-700 text-[11px] leading-normal font-sans">
                  💡 {apiKeyNotice}
                </div>
              )}

              <button
                type="submit"
                disabled={recompiling}
                className="w-full py-3 bg-[#1C1C1C] text-white hover:bg-brand text-[10px] tracking-[0.2em] font-bold uppercase rounded-full transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {recompiling ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Analyzing constraints...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    <span>Recompile Itinerary</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Group traveler list info card */}
          <div className="bg-white border border-stone-200 p-5 rounded-[2rem] shadow-sm space-y-3">
            <div className="text-[10px] font-bold font-sans text-stone-450 uppercase tracking-[0.15em] pb-1 border-b border-stone-150 flex items-center justify-between">
              <span>Traveling family group</span>
              <span className="text-[10px] text-brand font-bold">{mockGroupMembers.length} Members</span>
            </div>

            <div className="space-y-3">
              {mockGroupMembers.map((member) => (
                <div key={member.id} className="flex items-start gap-2.5 text-xs text-stone-850">
                  <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full border border-stone-200 shrink-0 object-cover mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-900 block">{member.name}</span>
                    <p className="text-[10px] text-stone-500">
                      Role: <span className="text-stone-700 font-medium">{member.role}</span> • Max Limit: ${member.budgetLimit}
                    </p>
                    <p className="text-[10px] text-brand font-mono mt-0.5 font-medium">
                      Mobility: {member.mobilityNeeds}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Workspace - Changes depending on tab/role choice */}
        <section className="lg:col-span-9 space-y-6">
          {currentRole === 'Traveler' ? (
            <div className="space-y-6">
              
              {/* Category Sub-Tabs (Traveler Only) */}
              <div className="bg-stone-100 p-1.5 rounded-[1.5rem] border border-stone-250 flex justify-between items-center text-stone-900 shadow-sm">
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setActiveSubTab('itinerary')}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeSubTab === 'itinerary' 
                        ? 'bg-white text-brand shadow font-bold border border-stone-200/50' 
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    <Calendar className="h-4 w-4" />
                    Itinerary Timeline
                  </button>
                  <button
                    onClick={() => setActiveSubTab('bookings')}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeSubTab === 'bookings' 
                        ? 'bg-white text-brand shadow font-bold border border-stone-200/50' 
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    <CreditCard className="h-4 w-4" />
                    Expense split & Bookings
                  </button>
                  <button
                    onClick={() => setActiveSubTab('exporter')}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeSubTab === 'exporter' 
                        ? 'bg-white text-brand shadow font-bold border border-stone-200/50' 
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    Export portfolio (PDF)
                  </button>
                </div>

                <div className="text-[11px] font-mono font-medium text-stone-500 mr-2 uppercase tracking-wider hidden sm:block">
                  Destination: {trip.destination}
                </div>
              </div>

              {/* Display targeted workspace */}
              {activeSubTab === 'itinerary' && (
                <ItineraryManager 
                  trip={trip} 
                  onUpdateTrip={handleUpdateTrip} 
                  onAlert={handleTriggerAlert} 
                />
              )}

              {activeSubTab === 'bookings' && (
                <BookingsSplitter 
                  trip={trip} 
                  onUpdateTrip={handleUpdateTrip} 
                  onAlert={handleTriggerAlert} 
                />
              )}

              {activeSubTab === 'exporter' && (
                <PDFExporter trip={trip} />
              )}

            </div>
          ) : (
            <AdminPanel />
          )}
        </section>

      </main>

      {/* Bottom Bar: Status */}
      <footer className="mt-12 h-16 border-t border-stone-200 bg-stone-50 px-8 flex flex-col sm:flex-row items-center justify-between text-[10px] font-bold uppercase tracking-widest text-stone-500 gap-2 text-center">
        <div className="flex gap-6">
          <span className="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span> All Bookings Protected</span>
          <span className="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-brand rounded-full"></span> Mobility Vehicle Confirmed</span>
        </div>
        <div className="opacity-70">
          NomadAI Precision Travel — 2FA Verified Connection
        </div>
      </footer>

    </div>
  );
}
