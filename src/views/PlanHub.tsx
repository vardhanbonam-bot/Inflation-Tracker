import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Sliders,
  Calendar,
  DollarSign,
  CheckSquare,
  Square,
  HelpCircle,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CountUpNumber } from '../components/CountUpNumber';
import { calculateFutureCost, calculatePurchasingPower } from '../utils/calculations';

export const PlanHub: React.FC = () => {
  const {
    planSubtab,
    setPlanSubtab,
    categoryAnalyses,
    personalInflation,
    referenceInflation,
    totalMonthlySpend,
    monthlyIncome,
    actionPlan,
    toggleActionPlanItem,
    openCalculationModal,
    settings
  } = useApp();

  const currencySymbol = settings.currency || '₹';

  // 1. WHAT-IF SIMULATOR STATE
  const [sliderOverrides, setSliderOverrides] = useState<{ [catId: string]: number }>({});

  const resetSliders = () => setSliderOverrides({});

  const handleSliderChange = (catId: string, val: number) => {
    setSliderOverrides(prev => ({ ...prev, [catId]: val }));
  };

  const simulatedInflation = useMemo(() => {
    let sum = 0;
    categoryAnalyses.forEach(c => {
      const priceDelta =
        sliderOverrides[c.categoryId] !== undefined
          ? sliderOverrides[c.categoryId]
          : c.priceChange;
      sum += (c.weight / 100) * priceDelta;
    });
    return +(sum.toFixed(1));
  }, [categoryAnalyses, sliderOverrides]);

  const simulatedMonthlySpend = useMemo(() => {
    const factor = 1 + simulatedInflation / 100;
    const baseWithoutInflation = totalMonthlySpend / (1 + personalInflation / 100);
    return Math.round(baseWithoutInflation * factor);
  }, [totalMonthlySpend, personalInflation, simulatedInflation]);

  const spendDelta = simulatedMonthlySpend - totalMonthlySpend;
  const simulatedRemaining = monthlyIncome - simulatedMonthlySpend;

  // 2. FUTURE COST PLANNER STATE
  const [futureItem, setFutureItem] = useState('Campus PG Rent & Utilities');
  const [futureCurrentCost, setFutureCurrentCost] = useState('8500');
  const [futureHorizon, setFutureHorizon] = useState<number>(12); // months
  const [futureAssumedRate, setFutureAssumedRate] = useState(String(settings.assumedFutureRate || 7.0));

  const futureProjection = useMemo(() => {
    const cost = parseFloat(futureCurrentCost) || 0;
    const rate = parseFloat(futureAssumedRate) || 7.0;
    return calculateFutureCost(cost, rate, futureHorizon);
  }, [futureCurrentCost, futureAssumedRate, futureHorizon]);

  // 3. PURCHASING POWER TRACKER STATE
  const [baseAllowance, setBaseAllowance] = useState(String(monthlyIncome || 20000));
  const [ppHorizon, setPPHorizon] = useState<number>(12);

  const ppPersonal = useMemo(() => {
    const val = parseFloat(baseAllowance) || 10000;
    return calculatePurchasingPower(val, personalInflation, ppHorizon);
  }, [baseAllowance, personalInflation, ppHorizon]);

  const ppBenchmark = useMemo(() => {
    const val = parseFloat(baseAllowance) || 10000;
    return calculatePurchasingPower(val, referenceInflation, ppHorizon);
  }, [baseAllowance, referenceInflation, ppHorizon]);

  const tabs = [
    { id: 'simulator', label: 'What-If Simulator', icon: Sliders },
    { id: 'future', label: 'Future Cost Planner', icon: Calendar },
    { id: 'purchasing_power', label: 'Purchasing Power', icon: DollarSign },
    { id: 'action_plan', label: '30-Day Action Plan', icon: CheckSquare }
  ];

  return (
    <div className="space-y-5 pb-24 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">Financial Foresight & Planning</h2>
          <p className="text-xs text-slate-400">Stress-test future semesters and lock in defense</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = planSubtab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setPlanSubtab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                isActive
                  ? 'bg-teal-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUBTAB 1: WHAT-IF SIMULATOR (§5.11) */}
      {planSubtab === 'simulator' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Simulated Impact Hero Card */}
          <div className="glass-mirror rounded-2xl p-5 border border-teal-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-teal-400">
                Live Scenario Outcome
              </span>
              <button
                onClick={resetSliders}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-teal-300 transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Sliders</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">Projected Rate</span>
                <span className="text-lg sm:text-xl font-black font-mono-num text-teal-300">
                  {simulatedInflation}%
                </span>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">Monthly Delta</span>
                <span
                  className={`text-lg sm:text-xl font-black font-mono-num ${
                    spendDelta > 0 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {spendDelta >= 0 ? `+${currencySymbol}${spendDelta}` : `${currencySymbol}${spendDelta}`}
                </span>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">Projected Surplus</span>
                <span
                  className={`text-lg sm:text-xl font-black font-mono-num ${
                    simulatedRemaining >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {currencySymbol}
                  {simulatedRemaining.toLocaleString()}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-white/5">
              Drag the sliders below to simulate hypothetical campus price changes (e.g. cafeteria food +15%, PG rent +10%). The model recalibrates your personal inflation rate and monthly burn rate instantly.
            </p>
          </div>

          {/* Interactive Sliders */}
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              Adjust Projected Category Price Hikes
            </span>

            <div className="space-y-4">
              {categoryAnalyses.map(cat => {
                const currentVal =
                  sliderOverrides[cat.categoryId] !== undefined
                    ? sliderOverrides[cat.categoryId]
                    : cat.priceChange;

                return (
                  <div key={cat.categoryId} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">
                        {cat.name} ({cat.weight}% weight)
                      </span>
                      <span className="font-mono-num font-bold text-teal-300">
                        {currentVal >= 0 ? `+${currentVal}%` : `${currentVal}%`}
                      </span>
                    </div>

                    <input
                      type="range"
                      min="-15"
                      max="30"
                      step="1"
                      value={currentVal}
                      onChange={e => handleSliderChange(cat.categoryId, parseFloat(e.target.value))}
                      className="w-full accent-teal-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                    />

                    <div className="flex justify-between text-[9px] text-slate-500 font-mono-num">
                      <span>-15% (Deflation)</span>
                      <span>0% (Stable)</span>
                      <span>+30% (Severe Spike)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* SUBTAB 2: FUTURE COST PLANNER (§5.13) */}
      {planSubtab === 'future' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Future Expense Projection Engine
              </h3>
              <button
                onClick={() =>
                  openCalculationModal('future_cost', {
                    currentCost: parseFloat(futureCurrentCost) || 5000,
                    rate: parseFloat(futureAssumedRate) || 7,
                    months: futureHorizon
                  })
                }
                className="text-[11px] text-teal-400 hover:underline flex items-center gap-1"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Formula</span>
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Target Expense / Item</label>
                <input
                  type="text"
                  value={futureItem}
                  onChange={e => setFutureItem(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Current Cost ({currencySymbol})
                  </label>
                  <input
                    type="number"
                    value={futureCurrentCost}
                    onChange={e => setFutureCurrentCost(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono-num"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Assumed Rate (%/yr)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={futureAssumedRate}
                    onChange={e => setFutureAssumedRate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono-num"
                  />
                </div>
              </div>

              {/* Time Horizon Selector */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Time Horizon</label>
                <div className="grid grid-cols-4 gap-2">
                  {[6, 12, 24, 36].map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setFutureHorizon(m)}
                      className={`py-1.5 rounded-xl text-xs font-bold border transition ${
                        futureHorizon === m
                          ? 'bg-teal-500 border-teal-500 text-slate-950'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {m < 12 ? `${m} Mo` : `${m / 12} Yr`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Projection Output Card */}
            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-teal-500/30 space-y-2.5">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-300">Projected Future Cost:</span>
                <span className="text-xl font-black font-mono-num text-teal-300">
                  {currencySymbol}
                  {futureProjection.futureCost.toLocaleString()}
                </span>
              </div>

              <div className="flex items-baseline justify-between text-xs text-slate-400 font-mono-num">
                <span>Total Inflation Increase:</span>
                <span className="text-rose-400 font-bold">
                  +{currencySymbol}
                  {futureProjection.totalIncrease.toLocaleString()}
                </span>
              </div>

              <div className="flex items-baseline justify-between text-xs text-slate-400 font-mono-num">
                <span>Required Monthly Savings Buffer:</span>
                <span className="text-amber-400 font-bold">
                  {currencySymbol}
                  {futureProjection.monthlySavingsTarget.toLocaleString()}/mo
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* SUBTAB 3: PURCHASING POWER TRACKER (§5.14) */}
      {planSubtab === 'purchasing_power' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Fixed Allowance Erosion Model
              </h3>
              <button
                onClick={() =>
                  openCalculationModal('purchasing_power', {
                    amount: parseFloat(baseAllowance) || 20000,
                    rate: personalInflation,
                    months: ppHorizon
                  })
                }
                className="text-[11px] text-teal-400 hover:underline flex items-center gap-1"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Formula</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Fixed Monthly Allowance</label>
                <input
                  type="number"
                  value={baseAllowance}
                  onChange={e => setBaseAllowance(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono-num"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Horizon (Months)</label>
                <select
                  value={ppHorizon}
                  onChange={e => setPPHorizon(parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value={6}>6 Months</option>
                  <option value={12}>12 Months (1 Year)</option>
                  <option value={18}>18 Months</option>
                  <option value={24}>24 Months (2 Years)</option>
                </select>
              </div>
            </div>

            {/* Visual Comparison: Your Rate vs Benchmark Rate */}
            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">
                    Real Value at Your Student Rate ({personalInflation}%)
                  </span>
                  <span className="font-bold font-mono-num text-rose-400">
                    {currencySymbol}
                    {ppPersonal.futureRealValue.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full"
                    style={{
                      width: `${((ppPersonal.futureRealValue / (parseFloat(baseAllowance) || 1)) * 100).toFixed(1)}%`
                    }}
                  />
                </div>
                <span className="text-[10px] text-slate-500">
                  Purchasing power erosion: -{ppPersonal.erosionPercentage}%
                </span>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-400">
                    Real Value at National CPI ({referenceInflation}%)
                  </span>
                  <span className="font-bold font-mono-num text-slate-300">
                    {currencySymbol}
                    {ppBenchmark.futureRealValue.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-500 rounded-full"
                    style={{
                      width: `${((ppBenchmark.futureRealValue / (parseFloat(baseAllowance) || 1)) * 100).toFixed(1)}%`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Prominent Text takeaway */}
            <div className="p-3 bg-teal-950/30 border border-teal-500/20 rounded-xl text-xs text-teal-200 leading-relaxed font-mono-num">
              <strong>Takeaway:</strong> What {currencySymbol}
              {parseFloat(baseAllowance).toLocaleString()} buys today will require{' '}
              <strong>
                {currencySymbol}
                {ppPersonal.futureEquivalentNominal.toLocaleString()}
              </strong>{' '}
              in {ppHorizon} months to maintain the exact same student standard of living.
            </div>
          </div>
        </motion.div>
      )}

      {/* SUBTAB 4: 30-DAY ACTION PLAN (§5.15) */}
      {planSubtab === 'action_plan' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="glass-card rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Targeted 30-Day Deflation Sprints
              </h3>
              <span className="text-[11px] text-teal-400 font-mono-num font-bold">
                {actionPlan.filter(a => a.completed).length} / {actionPlan.length} Completed
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              These 3 high-leverage tactics are selected to address your highest personal pressure categories. Check them off as you execute them this month!
            </p>

            <div className="space-y-2.5 pt-2">
              {actionPlan.map(item => (
                <div
                  key={item.id}
                  onClick={() => toggleActionPlanItem(item.id)}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 transition cursor-pointer ${
                    item.completed
                      ? 'bg-slate-950/40 border-slate-800 opacity-60'
                      : 'bg-slate-900 border-slate-700/80 hover:border-teal-500'
                  }`}
                >
                  <button className="mt-0.5 text-teal-400 shrink-0">
                    {item.completed ? (
                      <CheckSquare className="w-5 h-5 text-teal-400" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-500" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4
                        className={`text-xs font-bold ${
                          item.completed ? 'line-through text-slate-400' : 'text-white'
                        }`}
                      >
                        {item.title}
                      </h4>
                      <span className="text-[10px] font-bold text-emerald-400 font-mono-num shrink-0">
                        {item.savingsEstimate}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{item.description}</p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-800 text-slate-300">
                      Target: {item.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
