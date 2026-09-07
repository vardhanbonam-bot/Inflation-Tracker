import React from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowRight,
  HelpCircle,
  ShieldAlert,
  Wallet,
  Calendar,
  Flame,
  ChevronRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CountUpNumber } from '../components/CountUpNumber';

export const HomeDashboard: React.FC = () => {
  const {
    profile,
    settings,
    personalInflation,
    referenceInflation,
    inflationDelta,
    categoryAnalyses,
    totalMonthlySpend,
    monthlyIncome,
    remainingBudget,
    additionalMonthlyCost,
    topPressureCategory,
    setActiveTab,
    setInflationSubtab,
    setInsightsSubtab,
    openCalculationModal,
    setIsAddExpenseOpen
  } = useApp();

  const currencySymbol = settings.currency || profile.currency || '₹';

  // Sorted pressures
  const topPressures = [...categoryAnalyses]
    .sort((a, b) => b.impactScore - a.impactScore)
    .slice(0, 3);

  // Top spending driver
  const topSpendCategory = [...categoryAnalyses].sort((a, b) => b.totalSpend - a.totalSpend)[0];

  // Concise one-line explanation of why personal inflation differs from national reference
  const differenceExplanation =
    inflationDelta > 0
      ? `Because ${topSpendCategory?.name || 'essential expenses'} account for ${topSpendCategory?.weight || 35}% of your student spend, recent price increases impact your wallet ${Math.abs(inflationDelta)}% harder than the national generic consumer.`
      : inflationDelta < 0
      ? `Your lifestyle is currently ${Math.abs(inflationDelta)}% more insulated from price hikes than the national basket, thanks to lower expenditure in surging sectors.`
      : `Your student spending basket mirrors the current national headline index.`;

  return (
    <div className="space-y-5 pb-24 max-w-2xl mx-auto">
      {/* 1. Greeting & Context Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Hey, {profile.name.split(' ')[0] || 'Student'}! 👋
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {profile.city ? `${profile.city} • ${profile.studentType}` : 'Cost of Living Reality Check'}
          </p>
        </div>

        <button
          onClick={() => setIsAddExpenseOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 rounded-xl text-xs font-bold transition shadow-sm"
        >
          <Zap className="w-3.5 h-3.5 text-teal-400 fill-teal-400" />
          <span>Quick Log</span>
        </button>
      </div>

      {/* 2. 🪞 MY INFLATION HERO CARD */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-3xl p-6 glass-mirror border border-white/15 shadow-2xl bg-gradient-to-br from-slate-900/90 via-teal-950/40 to-indigo-950/50"
      >
        {/* Mirror Reflection Sheen Animation */}
        <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-teal-400/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

        {/* Card Header with Tappable Explainer */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-lg">🪞</span>
            <span className="text-xs font-extrabold uppercase tracking-wider text-teal-300/90">
              Personal Inflation Mirror
            </span>
          </div>

          <button
            onClick={() =>
              openCalculationModal('personal_inflation', {
                analyses: categoryAnalyses,
                personalRate: personalInflation
              })
            }
            className="flex items-center gap-1 text-[11px] text-teal-300/90 hover:text-teal-200 bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 transition"
          >
            <HelpCircle className="w-3 h-3 text-teal-400" />
            <span>How is this calculated?</span>
          </button>
        </div>

        {/* Split Mirror: You vs. Reference Benchmark */}
        <div className="grid grid-cols-2 gap-4 my-2 relative z-10">
          {/* Your Personal Inflation */}
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-teal-500/30 relative overflow-hidden">
            <span className="text-[11px] font-semibold text-teal-300 block mb-1">
              Your Real Rate
            </span>
            <div className="flex items-baseline gap-1">
              <CountUpNumber
                value={personalInflation}
                decimals={1}
                suffix="%"
                className="text-3xl sm:text-4xl font-black text-white tracking-tight"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Weighted by your actual student basket
            </span>
          </div>

          {/* Reference National Headline */}
          <div className="bg-slate-950/40 rounded-2xl p-4 border border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">
              National CPI Benchmark
            </span>
            <div className="flex items-baseline gap-1">
              <CountUpNumber
                value={referenceInflation}
                decimals={1}
                suffix="%"
                className="text-2xl sm:text-3xl font-extrabold text-slate-300 tracking-tight"
              />
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              Generic economy-wide headline index
            </span>
          </div>
        </div>

        {/* Delta Pill & Explanation */}
        <div className="mt-4 pt-3 border-t border-white/10 relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold font-mono-num ${
                inflationDelta > 0
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              {inflationDelta > 0 ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              {inflationDelta > 0 ? `+${inflationDelta} pts` : `${inflationDelta} pts`} vs Benchmark
            </span>
            <span className="text-[11px] text-slate-300 font-medium">
              {inflationDelta > 0 ? 'Above general economy' : 'Below general economy'}
            </span>
          </div>

          <p className="text-xs text-slate-300/95 leading-relaxed bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
            {differenceExplanation}
          </p>
        </div>

        {/* Action CTA to Analysis Screen */}
        <div className="mt-4 flex items-center justify-between pt-1 relative z-10">
          <button
            onClick={() => {
              setActiveTab('inflation');
              setInflationSubtab('analysis');
            }}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-teal-500/20 transition flex items-center justify-center gap-2 group"
          >
            <span>See How Inflation Affects Me</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </div>
      </motion.div>

      {/* 3. ESTIMATED ADDITIONAL MONTHLY COST (COMPUTED, NOT DECORATIVE) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
        className="glass-card rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 border border-teal-500/20"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">Monthly Inflation Surcharge</span>
              <span className="text-[10px] text-slate-400">(from price changes)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Estimated additional burden on your identical monthly basket
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-lg sm:text-xl font-black font-mono-num text-amber-400">
            +
            <CountUpNumber
              value={additionalMonthlyCost}
              decimals={0}
              prefix={currencySymbol}
              suffix="/mo"
            />
          </div>
          <span className="text-[10px] text-slate-500 block font-mono-num">
            ~{currencySymbol}{(additionalMonthlyCost * 12).toLocaleString()}/yr
          </span>
        </div>
      </motion.div>

      {/* 4. MONTHLY BUDGET STRIP */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.12 }}
        className="glass-card rounded-2xl p-4 sm:p-5 space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Wallet className="w-4 h-4 text-teal-400" />
            <span>Monthly Budget Strip</span>
          </div>

          <button
            onClick={() =>
              openCalculationModal('budget_usage', {
                spend: totalMonthlySpend,
                budget: monthlyIncome
              })
            }
            className="text-[11px] text-teal-400 hover:underline flex items-center gap-1"
          >
            <HelpCircle className="w-3 h-3" />
            <span>Formula</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-0.5">Allowance</span>
            <span className="text-xs sm:text-sm font-bold font-mono-num text-slate-200">
              {currencySymbol}
              {monthlyIncome.toLocaleString()}
            </span>
          </div>

          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-0.5">Total Spent</span>
            <span className="text-xs sm:text-sm font-bold font-mono-num text-teal-400">
              {currencySymbol}
              {totalMonthlySpend.toLocaleString()}
            </span>
          </div>

          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-0.5">Remaining</span>
            <span
              className={`text-xs sm:text-sm font-bold font-mono-num ${
                remainingBudget >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {currencySymbol}
              {remainingBudget.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>Overall Budget Consumed</span>
            <span className="font-mono-num font-bold text-white">
              {((totalMonthlySpend / (monthlyIncome || 1)) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(100, (totalMonthlySpend / (monthlyIncome || 1)) * 100)}%`
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                totalMonthlySpend / monthlyIncome > 0.9
                  ? 'bg-rose-500'
                  : totalMonthlySpend / monthlyIncome > 0.75
                  ? 'bg-amber-500'
                  : 'bg-teal-500'
              }`}
            />
          </div>
        </div>
      </motion.div>

      {/* 5. TOP INFLATION PRESSURES RANKED LIST */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.16 }}
        className="glass-card rounded-2xl p-4 sm:p-5 space-y-3"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              Top Inflation Pressures
            </h3>
            <p className="text-[11px] text-slate-400">Ranked by personal budget vulnerability</p>
          </div>

          <button
            onClick={() => {
              setActiveTab('inflation');
              setInflationSubtab('impact');
            }}
            className="text-[11px] font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-0.5"
          >
            <span>All Rankings</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {topPressures.map((item, idx) => (
            <div
              key={item.categoryId}
              onClick={() => {
                setActiveTab('inflation');
                setInflationSubtab('analysis');
              }}
              className="p-3 bg-slate-950/60 hover:bg-slate-800/80 rounded-xl border border-slate-800/90 flex items-center justify-between gap-3 transition cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-bold font-mono-num text-slate-400 flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="text-lg">
                  {item.categoryId === 'food'
                    ? '🍔'
                    : item.categoryId === 'accommodation'
                    ? '🏠'
                    : item.categoryId === 'transport'
                    ? '🚇'
                    : item.categoryId === 'education'
                    ? '📚'
                    : item.categoryId === 'mobile_internet'
                    ? '📱'
                    : '✨'}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-teal-300 transition">
                    {item.name}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Basket Weight: <strong className="text-slate-200">{item.weight}%</strong> • Price Change:{' '}
                    <strong className="text-rose-400 font-mono-num">
                      {item.priceChange >= 0 ? `+${item.priceChange}%` : `${item.priceChange}%`}
                    </strong>
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                    item.impactTier === 'High'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : item.impactTier === 'Medium'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {item.impactTier} Impact
                </span>
                <span className="text-[10px] text-slate-500 block font-mono-num mt-0.5">
                  Score: {item.impactScore}/100
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 6. Action Plan Shortcut */}
      {topPressureCategory && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="p-4 rounded-2xl bg-gradient-to-r from-teal-950/60 to-slate-900 border border-teal-500/30 flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">
                Beat Inflation: {topPressureCategory.name}
              </h4>
              <p className="text-[11px] text-slate-400">
                Actionable student tips can save ~{currencySymbol}800 - {currencySymbol}1,500/mo
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveTab('insights');
              setInsightsSubtab('beat');
            }}
            className="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl transition whitespace-nowrap"
          >
            Beat It
          </button>
        </motion.div>
      )}

      {/* Persistent Small Regulatory Disclaimer */}
      <div className="text-center pt-2">
        <p className="text-[10px] text-slate-400 font-medium">
          Illustrative demo data — not official statistics.
        </p>
      </div>
    </div>
  );
};
