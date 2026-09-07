import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  RotateCcw, 
  Trash2, 
  Database, 
  ShieldAlert, 
  Sparkles, 
  MapPin, 
  User, 
  Compass, 
  HelpCircle,
  Flame,
  CloudCheck,
  CloudUpload,
  LogIn,
  LogOut,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_CURRENCIES } from '../data/categories';
import { StudentType, AccommodationType } from '../types';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    profile,
    updateProfile,
    settings,
    updateSettings,
    loadDemoData,
    resetDemoData,
    clearMyData,
    setIsOnboardingOpen,
    currentUser,
    isFirestoreSynced,
    firestoreSyncError,
    loginWithGoogle,
    logout,
    syncAllToCloud
  } = useApp();

  const [name, setName] = useState(profile.name);
  const [city, setCity] = useState(profile.city);
  const [studentType, setStudentType] = useState<StudentType>(profile.studentType);
  const [accommodationType, setAccommodationType] = useState<AccommodationType>(profile.accommodationType);
  const [income, setIncome] = useState(String(profile.income || ''));
  const [currency, setCurrency] = useState(settings.currency || '₹');
  const [referenceRate, setReferenceRate] = useState(String(settings.referenceInflationRate || 5.4));
  const [futureRate, setFutureRate] = useState(String(settings.assumedFutureRate || 7.0));

  const [confirmClear, setConfirmClear] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [syncingCloud, setSyncingCloud] = useState(false);
  const [cloudToast, setCloudToast] = useState<string | null>(null);

  if (!isSettingsOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim() || 'Student',
      city: city.trim() || 'Campus',
      studentType,
      accommodationType,
      income: parseFloat(income) || 0,
      currency
    });
    updateSettings({
      currency,
      referenceInflationRate: parseFloat(referenceRate) || 5.4,
      assumedFutureRate: parseFloat(futureRate) || 7.0
    });

    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleResetDemo = () => {
    resetDemoData();
    setIsSettingsOpen(false);
  };

  const handleClear = () => {
    clearMyData();
    setIsSettingsOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0"
          onClick={() => setIsSettingsOpen(false)}
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Settings & Profile</h3>
              <p className="text-xs text-slate-400">Personalize student assumptions & demo data</p>
            </div>
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveProfile} className="mt-4 space-y-4">
            {/* Student Profile */}
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-3">
              <span className="text-[11px] font-bold tracking-wider uppercase text-teal-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Student Profile Information
              </span>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Name / Nickname</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">City / Campus</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Student Level</label>
                  <select
                    value={studentType}
                    onChange={e => setStudentType(e.target.value as StudentType)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white"
                  >
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="PhD / Research">PhD / Research</option>
                    <option value="High School Senior">High School Senior</option>
                    <option value="Vocational">Vocational</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Accommodation</label>
                  <select
                    value={accommodationType}
                    onChange={e => setAccommodationType(e.target.value as AccommodationType)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white"
                  >
                    <option value="Hostel / Dorm">Hostel / Dorm</option>
                    <option value="PG / Shared Flat">PG / Shared Flat</option>
                    <option value="Rented Apartment">Rented Apartment</option>
                    <option value="Living with Family">Living with Family</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Monthly Allowance / Income ({currency})</label>
                <input
                  type="number"
                  value={income}
                  onChange={e => setIncome(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono-num"
                />
              </div>
            </div>

            {/* Economic Assumptions & Currency */}
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-3">
              <span className="text-[11px] font-bold tracking-wider uppercase text-teal-400 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                Inflation Reference Benchmarks
              </span>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Currency</label>
                  <select
                    value={currency}
                    onChange={e => setCurrency(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white"
                  >
                    {SUPPORTED_CURRENCIES.map(c => (
                      <option key={c.code} value={c.symbol}>
                        {c.symbol} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Reference CPI (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={referenceRate}
                    onChange={e => setReferenceRate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono-num"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Future Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={futureRate}
                    onChange={e => setFutureRate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono-num"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs rounded-xl transition shadow-md"
            >
              {saveToast ? '✓ Preferences Saved!' : 'Save Profile Changes'}
            </button>
          </form>

          {/* Dataset Management Section */}
          <div className="mt-5 pt-4 border-t border-slate-800 space-y-2.5">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 block">
              Dataset Controls
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleResetDemo}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold rounded-xl border border-slate-700 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Demo Data
              </button>

              {confirmClear ? (
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Confirm Clear?
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-semibold rounded-xl border border-slate-700 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear My Data
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setIsSettingsOpen(false);
                setIsOnboardingOpen(true);
              }}
              className="w-full py-1.5 text-xs text-slate-400 hover:text-teal-300 transition"
            >
              Re-run Onboarding Setup Guide
            </button>
          </div>

          {/* Firebase Cloud Sync Section */}
          <div className="mt-5 pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider uppercase text-amber-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                Firebase Cloud Sync & Database
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono-num font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                {isFirestoreSynced ? 'Live Connected' : 'Connecting'}
              </span>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Firebase Project:</span>
                <span className="font-mono text-slate-200">pro-truck-mnzsc</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Database ID:</span>
                <span className="font-mono text-slate-200 truncate max-w-[200px]" title="ai-studio-inflationmirror-1717d02c-4122-49f2-bbfc-25ad8d4d1752">
                  ai-studio-inflationmirror...
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800/80">
                <span>Account:</span>
                {currentUser?.email ? (
                  <span className="text-teal-300 font-medium truncate max-w-[200px]">
                    {currentUser.email}
                  </span>
                ) : (
                  <span className="text-slate-400">
                    Anonymous ({currentUser?.uid ? `${currentUser.uid.slice(0, 6)}...` : 'Active'})
                  </span>
                )}
              </div>
            </div>

            {/* Auth Actions */}
            <div className="space-y-2">
              {currentUser?.email ? (
                <button
                  type="button"
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  Sign Out of Google ({currentUser.email.split('@')[0]})
                </button>
              ) : (
                <button
                  type="button"
                  onClick={loginWithGoogle}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-indigo-600/20"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign in with Google (Cross-Device Sync)
                </button>
              )}

              <button
                type="button"
                disabled={syncingCloud}
                onClick={async () => {
                  setSyncingCloud(true);
                  try {
                    const res = await syncAllToCloud();
                    if (res.success) {
                      setCloudToast(`✓ Successfully synced ${res.count} items to Firestore!`);
                    } else {
                      setCloudToast('Sync completed');
                    }
                  } catch (e: any) {
                    setCloudToast('Sync error: ' + (e?.message || 'Check connection'));
                  } finally {
                    setSyncingCloud(false);
                    setTimeout(() => setCloudToast(null), 3000);
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold rounded-xl border border-slate-700 transition disabled:opacity-50"
              >
                <CloudUpload className="w-3.5 h-3.5" />
                {syncingCloud ? 'Syncing to Firestore...' : 'Sync All Local Expenses to Cloud'}
              </button>

              {cloudToast && (
                <div className="p-2 bg-teal-500/15 border border-teal-500/30 rounded-lg text-teal-300 text-xs text-center flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  {cloudToast}
                </div>
              )}
            </div>
          </div>

          {/* Future Expansion Roadmap Note (Section 9) */}
          <div className="mt-5 p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              Future Roadmap Expansion (§9)
            </span>
            <p className="leading-relaxed">
              Real-time verified price APIs, government inflation datasets, campus cost-of-living surveys, city-level and university-level aggregate dashboards, AI-driven personal price audits, and institutional student welfare reporting.
            </p>
          </div>

          {/* Non-Negotiable Regulatory Disclaimer (Section 1) */}
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl text-[11px] text-amber-300/90 leading-relaxed flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              <strong>Illustrative demo data — not official statistics.</strong> No claim of live market or government data connection. Calculations are conducted client-side to empower student financial literacy and personal budgeting.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
