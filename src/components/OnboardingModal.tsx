import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Shield, Check, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StudentType, AccommodationType } from '../types';
import { InflationMirrorLogo } from './InflationMirrorLogo';

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, updateProfile, loadDemoData, categories, settings } = useApp();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('Aarav');
  const [city, setCity] = useState('Bengaluru');
  const [studentType, setStudentType] = useState<StudentType>('Undergraduate');
  const [accommodationType, setAccommodationType] = useState<AccommodationType>('PG / Shared Flat');
  const [income, setIncome] = useState('22000');
  const [approxSpend, setApproxSpend] = useState('18000');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'food',
    'accommodation',
    'transport',
    'education',
    'mobile_internet'
  ]);

  if (!isOnboardingOpen) return null;

  const toggleCategory = (catId: string) => {
    setSelectedCategories(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  const handleComplete = (withDemo: boolean = false) => {
    if (withDemo) {
      loadDemoData();
    } else {
      updateProfile({
        name: name.trim() || 'Student',
        city: city.trim() || 'Campus',
        studentType,
        accommodationType,
        income: parseFloat(income) || 20000,
        approxSpend: parseFloat(approxSpend) || 16000,
        isOnboarded: true
      });
    }
    setIsOnboardingOpen(false);
  };

  const currencySymbol = settings.currency || '₹';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-slate-900 border border-teal-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
      >
        {/* Glow ambient decoration */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />

        {/* Header Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <InflationMirrorLogo size="sm" interactive={false} />
            <div>
              <h2 className="text-sm font-extrabold text-white">Inflation Mirror</h2>
              <p className="text-[10px] text-teal-400 font-semibold tracking-wide uppercase">
                Student Setup ({step}/2)
              </p>
            </div>
          </div>
          <button
            onClick={() => handleComplete(true)}
            className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 underline"
          >
            Load Demo Data
          </button>
        </div>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="text-center pt-1 pb-2">
              <div className="flex justify-center mb-3">
                <InflationMirrorLogo size="lg" />
              </div>
              <h3 className="text-lg font-bold text-white">Welcome! Let’s personalize your mirror.</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Official inflation rates don’t reflect what students actually buy. We calculate your true personalized inflation rate.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name or Nickname</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Aarav, Sam, Alex"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">College City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="e.g. Bengaluru, Delhi"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Student Level</label>
                  <select
                    value={studentType}
                    onChange={e => setStudentType(e.target.value as StudentType)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Undergraduate">Undergrad</option>
                    <option value="Postgraduate">Postgrad</option>
                    <option value="PhD / Research">PhD / Research</option>
                    <option value="High School Senior">High School</option>
                    <option value="Vocational">Vocational</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Accommodation Type</label>
                <select
                  value={accommodationType}
                  onChange={e => setAccommodationType(e.target.value as AccommodationType)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="Hostel / Dorm">Hostel / Dormitory</option>
                  <option value="PG / Shared Flat">PG / Shared Flat</option>
                  <option value="Rented Apartment">Rented Apartment</option>
                  <option value="Living with Family">Living with Family</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full mt-2 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-teal-500/25 transition flex items-center justify-center gap-2"
            >
              <span>Next: Spending Estimates</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div>
              <h3 className="text-lg font-bold text-white">Monthly Money & Major Categories</h3>
              <p className="text-xs text-slate-400 mt-1">
                Approximate figures are fine — we will calibrate live as you log expenses.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Monthly Allowance ({currencySymbol})
                </label>
                <input
                  type="number"
                  value={income}
                  onChange={e => setIncome(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono-num focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Approx. Monthly Spend ({currencySymbol})
                </label>
                <input
                  type="number"
                  value={approxSpend}
                  onChange={e => setApproxSpend(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono-num focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Select Your Major Cost Drivers
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map(cat => {
                  const isSelected = selectedCategories.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition ${
                        isSelected
                          ? 'bg-teal-500/20 border-teal-500/80 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-teal-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Privacy & Illustrative Notice */}
            <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl flex items-start gap-2 text-[11px] text-slate-400 leading-relaxed">
              <Shield className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
              <span>Zero sensitive tracking or personal data upload. All calculations run client-side.</span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => handleComplete(false)}
                className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-teal-500/30 transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Build My Inflation Mirror</span>
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
