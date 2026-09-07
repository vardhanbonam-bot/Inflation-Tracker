import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  PieChart,
  Tag,
  Scale,
  Activity,
  HelpCircle,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CountUpNumber } from '../components/CountUpNumber';

export const InflationHub: React.FC = () => {
  const {
    inflationSubtab,
    setInflationSubtab,
    categoryAnalyses,
    personalInflation,
    referenceInflation,
    priceObs,
    addPriceObservation,
    updatePriceObservation,
    categories,
    openCalculationModal,
    settings
  } = useApp();

  const [selectedObsId, setSelectedObsId] = useState<string>(priceObs[0]?.id || '');
  const [newObsCategory, setNewObsCategory] = useState(categories[0]?.id || 'food');
  const [newObsItem, setNewObsItem] = useState('');
  const [newObsUnit, setNewObsUnit] = useState('per item');
  const [newObsPrevPrice, setNewObsPrevPrice] = useState('');
  const [newObsCurrPrice, setNewObsCurrPrice] = useState('');
  const [showAddObsModal, setShowAddObsModal] = useState(false);

  const currencySymbol = settings.currency || '₹';

  // Subtabs within Inflation Hub
  const tabs = [
    { id: 'analysis', label: 'Analysis', icon: TrendingUp },
    { id: 'basket', label: 'Basket Weights', icon: PieChart },
    { id: 'prices', label: 'Price Tracker', icon: Tag },
    { id: 'benchmark', label: 'Benchmark', icon: Scale },
    { id: 'impact', label: 'Impact Scores', icon: Activity }
  ];

  // Top driver
  const topContributionDriver = [...categoryAnalyses].sort(
    (a, b) => b.weightedContribution - a.weightedContribution
  )[0];

  const handleAddPriceObservation = (e: React.FormEvent) => {
    e.preventDefault();
    const prev = parseFloat(newObsPrevPrice);
    const curr = parseFloat(newObsCurrPrice);
    if (!newObsItem || isNaN(prev) || isNaN(curr)) return;

    addPriceObservation({
      categoryId: newObsCategory,
      item: newObsItem.trim(),
      unit: newObsUnit.trim() || 'per unit',
      previousPrice: prev,
      currentPrice: curr,
      lastUpdated: new Date().toISOString().split('T')[0]
    });

    setNewObsItem('');
    setNewObsPrevPrice('');
    setNewObsCurrPrice('');
    setShowAddObsModal(false);
  };

  const activeObs = priceObs.find(o => o.id === selectedObsId) || priceObs[0];

  return (
    <div className="space-y-5 pb-24 max-w-2xl mx-auto">
      {/* Title & Hub Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">Inflation Mirror Engine</h2>
          <p className="text-xs text-slate-400">
            Computed live from your personal expenses and price observations
          </p>
        </div>

        <button
          onClick={() =>
            openCalculationModal('personal_inflation', {
              analyses: categoryAnalyses,
              personalRate: personalInflation
            })
          }
          className="text-xs font-semibold text-teal-300 hover:text-teal-200 flex items-center gap-1 bg-teal-500/15 border border-teal-500/30 px-2.5 py-1.5 rounded-xl transition"
        >
          <HelpCircle className="w-3.5 h-3.5 text-teal-400" />
          <span>Formula</span>
        </button>
      </div>

      {/* Subtab Navigation Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = inflationSubtab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setInflationSubtab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                isActive
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUBTAB 1: MY INFLATION ANALYSIS (§5.6) */}
      {inflationSubtab === 'analysis' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Top Driver Focus Card */}
          {topContributionDriver && (
            <div className="glass-mirror rounded-2xl p-4 sm:p-5 border border-teal-500/30 bg-gradient-to-r from-teal-950/40 to-slate-900 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-400">
                  Primary Inflation Driver
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
                  {topContributionDriver.contributionTier} Contribution
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span>
                    {topContributionDriver.categoryId === 'food'
                      ? '🍔'
                      : topContributionDriver.categoryId === 'accommodation'
                      ? '🏠'
                      : '🚇'}
                  </span>
                  {topContributionDriver.name}
                </h3>
                <span className="text-xl font-mono-num font-black text-rose-400">
                  +{topContributionDriver.weightedContribution}% pts
                </span>
              </div>

              {/* Explaining WHY: Weight × Price Change, not price change alone! */}
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-white/5">
                <strong className="text-teal-300">{topContributionDriver.name}</strong> is your top driver because it
                combines a massive basket weight of{' '}
                <strong className="text-white font-mono-num">{topContributionDriver.weight}%</strong> with a price surge of{' '}
                <strong className="text-rose-400 font-mono-num">
                  +{topContributionDriver.priceChange}%
                </strong>
                . A price change alone doesn’t matter if weight is small, but here weight × price change generates the largest
                drain on your student budget.
              </p>
            </div>
          )}

          {/* Breakdown Table/Cards */}
          <div className="glass-card rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Category Contribution Breakdown
              </h3>
              <span className="text-[11px] text-slate-400 font-mono-num">
                Sum = {personalInflation}%
              </span>
            </div>

            <div className="space-y-2">
              {categoryAnalyses.map(cat => (
                <div
                  key={cat.categoryId}
                  className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base">
                      {cat.categoryId === 'food'
                        ? '🍔'
                        : cat.categoryId === 'accommodation'
                        ? '🏠'
                        : cat.categoryId === 'transport'
                        ? '🚇'
                        : cat.categoryId === 'education'
                        ? '📚'
                        : cat.categoryId === 'mobile_internet'
                        ? '📱'
                        : '✨'}
                    </span>
                    <div>
                      <h4 className="font-bold text-white truncate">{cat.name}</h4>
                      <span className="text-[11px] text-slate-400">
                        Weight: <strong className="text-slate-200 font-mono-num">{cat.weight}%</strong> • Price Shift:{' '}
                        <strong className="text-rose-400 font-mono-num">
                          {cat.priceChange >= 0 ? `+${cat.priceChange}%` : `${cat.priceChange}%`}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-black font-mono-num text-teal-300 block">
                      +{cat.weightedContribution}%
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        cat.contributionTier === 'High'
                          ? 'text-rose-400 bg-rose-500/10'
                          : cat.contributionTier === 'Medium'
                          ? 'text-amber-400 bg-amber-500/10'
                          : 'text-slate-400 bg-slate-800'
                      }`}
                    >
                      {cat.contributionTier}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* SUBTAB 2: STUDENT INFLATION BASKET (§5.4) */}
      {inflationSubtab === 'basket' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="glass-card rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Personal Basket Weights
                </h3>
                <p className="text-[11px] text-slate-400">Computed strictly from your logged expenses</p>
              </div>

              <button
                onClick={() =>
                  openCalculationModal('basket_weights', {
                    categoryName: 'Food & Beverages',
                    spend: categoryAnalyses[0]?.totalSpend,
                    weight: categoryAnalyses[0]?.weight
                  })
                }
                className="text-[11px] font-semibold text-teal-400 hover:underline flex items-center gap-1"
              >
                <HelpCircle className="w-3 h-3" />
                <span>How are my weights calculated?</span>
              </button>
            </div>

            {/* Visual Weighted Spectrum Bar */}
            <div className="w-full h-4 rounded-xl bg-slate-800 flex overflow-hidden p-0.5">
              {categoryAnalyses.map(cat => (
                <div
                  key={cat.categoryId}
                  style={{ width: `${Math.max(2, cat.weight)}%`, backgroundColor: cat.color }}
                  className="h-full first:rounded-l-lg last:rounded-r-lg hover:opacity-80 transition cursor-pointer"
                  title={`${cat.name}: ${cat.weight}%`}
                />
              ))}
            </div>

            {/* Weights Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {categoryAnalyses.map(cat => (
                <div
                  key={cat.categoryId}
                  className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                      {cat.name}
                    </span>
                    <span className="font-mono-num font-bold text-teal-300">{cat.weight}%</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono-num">
                    <span>
                      Spend: {currencySymbol}
                      {cat.totalSpend.toLocaleString()}
                    </span>
                    <span>
                      Formula: {cat.totalSpend} ÷ Total
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* SUBTAB 3: PRICE TRACKER (§5.5) */}
      {inflationSubtab === 'prices' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg">
              Illustrative demo data until you supply your own
            </span>

            <button
              onClick={() => setShowAddObsModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Track Item Price</span>
            </button>
          </div>

          {/* Interactive Observation Line Chart */}
          {activeObs && (
            <div className="glass-card rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white">{activeObs.item}</h3>
                  <span className="text-[11px] text-slate-400">
                    Unit: {activeObs.unit} • Last Checked: {activeObs.lastUpdated}
                  </span>
                </div>

                <div className="text-right">
                  <div className="flex items-baseline gap-1 text-sm font-bold font-mono-num text-white">
                    <span className="text-slate-400 text-xs line-through">
                      {currencySymbol}
                      {activeObs.previousPrice}
                    </span>
                    <span className="text-teal-300 font-black">
                      {currencySymbol}
                      {activeObs.currentPrice}
                    </span>
                  </div>
                  <span className="text-xs font-bold font-mono-num text-rose-400">
                    +
                    {(
                      ((activeObs.currentPrice - activeObs.previousPrice) /
                        (activeObs.previousPrice || 1)) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              </div>

              {/* Crisp Custom SVG Line Chart */}
              <div className="h-44 w-full bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120">
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="400" y2="20" stroke="#1e293b" strokeDasharray="4 4" />
                  <line x1="0" y1="60" x2="400" y2="60" stroke="#1e293b" strokeDasharray="4 4" />
                  <line x1="0" y1="100" x2="400" y2="100" stroke="#1e293b" strokeDasharray="4 4" />

                  {/* Gradient Area */}
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Polygon & Polyline */}
                  {(() => {
                    const pts = activeObs.history || [];
                    if (pts.length < 2) return null;
                    const minP = Math.min(...pts.map(p => p.price)) * 0.9;
                    const maxP = Math.max(...pts.map(p => p.price)) * 1.1;
                    const range = maxP - minP || 1;

                    const coords = pts.map((p, idx) => {
                      const x = 30 + (idx / (pts.length - 1)) * 340;
                      const y = 100 - ((p.price - minP) / range) * 80;
                      return { x, y, price: p.price, date: p.date };
                    });

                    const polylinePoints = coords.map(c => `${c.x},${c.y}`).join(' ');
                    const polygonPoints = `30,110 ${polylinePoints} 370,110`;

                    return (
                      <>
                        <polygon points={polygonPoints} fill="url(#chartGrad)" />
                        <polyline
                          points={polylinePoints}
                          fill="none"
                          stroke="#2dd4bf"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {coords.map((c, i) => (
                          <g key={i}>
                            <circle cx={c.x} cy={c.y} r="5" fill="#0f172a" stroke="#2dd4bf" strokeWidth="2.5" />
                            <text
                              x={c.x}
                              y={c.y - 10}
                              fill="#cbd5e1"
                              fontSize="10"
                              textAnchor="middle"
                              className="font-mono"
                            >
                              {currencySymbol}{c.price}
                            </text>
                            <text
                              x={c.x}
                              y={118}
                              fill="#64748b"
                              fontSize="8"
                              textAnchor="middle"
                              className="font-mono"
                            >
                              {c.date.slice(5)}
                            </text>
                          </g>
                        ))}
                      </>
                    );
                  })()}
                </svg>
              </div>
            </div>
          )}

          {/* List of Tracked Observation Items */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Observed Basket Items ({priceObs.length})
            </span>
            {priceObs.map(obs => {
              const change = +(
                ((obs.currentPrice - obs.previousPrice) / (obs.previousPrice || 1)) *
                100
              ).toFixed(1);
              const isSelected = obs.id === activeObs?.id;

              return (
                <div
                  key={obs.id}
                  onClick={() => setSelectedObsId(obs.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-teal-500/80 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold text-white">{obs.item}</h4>
                    <span className="text-[10px] text-slate-400">{obs.unit}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold font-mono-num text-white block">
                      {currencySymbol}
                      {obs.currentPrice}
                    </span>
                    <span
                      className={`text-[11px] font-mono-num font-bold ${
                        change > 0 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {change >= 0 ? `+${change}%` : `${change}%`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* SUBTAB 4: BENCHMARK (§5.7) */}
      {inflationSubtab === 'benchmark' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-200">Context, not judgment:</strong> Benchmark numbers are
            illustrative student cohort averages. Deviations represent differing living situations (e.g.
            hostel vs rental PG), not overspending.
          </div>

          <div className="space-y-2.5">
            {categoryAnalyses.map(cat => {
              const delta = cat.benchmarkDelta;
              const statusColor =
                cat.benchmarkStatus === 'critical'
                  ? 'text-rose-400 bg-rose-500/15 border-rose-500/30'
                  : cat.benchmarkStatus === 'caution'
                  ? 'text-amber-400 bg-amber-500/15 border-amber-500/30'
                  : 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30';

              const statusIcon =
                cat.benchmarkStatus === 'critical'
                  ? '🔴'
                  : cat.benchmarkStatus === 'caution'
                  ? '🟠'
                  : '🟢';

              return (
                <div
                  key={cat.categoryId}
                  className="glass-card p-3.5 rounded-xl border border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span>{statusIcon}</span>
                      <span>{cat.name}</span>
                    </span>
                    <span className={`text-[10px] font-bold font-mono-num px-2 py-0.5 rounded border ${statusColor}`}>
                      {delta > 0 ? `+${delta}% above peer avg` : `${delta}% vs peer avg`}
                    </span>
                  </div>

                  {/* Comparison Bars */}
                  <div className="space-y-1 text-[11px] font-mono-num text-slate-400">
                    <div className="flex items-center justify-between">
                      <span>You:</span>
                      <span className="text-teal-300 font-bold">{cat.weight}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-400 rounded-full" style={{ width: `${cat.weight}%` }} />
                    </div>

                    <div className="flex items-center justify-between pt-0.5">
                      <span>Student Benchmark:</span>
                      <span className="text-slate-400">{cat.benchmarkWeight}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-600 rounded-full" style={{ width: `${cat.benchmarkWeight}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* SUBTAB 5: INFLATION IMPACT SCORE (§5.9) */}
      {inflationSubtab === 'impact' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="glass-card rounded-2xl p-4 sm:p-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Price Rise vs Personal Impact
              </h3>
              <button
                onClick={() =>
                  openCalculationModal('impact_score', {
                    weight: categoryAnalyses[0]?.weight,
                    priceChange: categoryAnalyses[0]?.priceChange
                  })
                }
                className="text-[11px] text-teal-400 hover:underline flex items-center gap-1"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Formula</span>
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              A 30% surge on a non-essential coffee or occasional movie has <strong className="text-emerald-400">Low</strong> personal impact. A modest 8% rise on mandatory hostel rent has <strong className="text-rose-400">High</strong> impact. Our scoring algorithm factors recurring necessity.
            </p>
          </div>

          <div className="space-y-2">
            {categoryAnalyses
              .sort((a, b) => b.impactScore - a.impactScore)
              .map(cat => (
                <div
                  key={cat.categoryId}
                  className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{cat.name}</span>
                      <span
                        className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          cat.impactTier === 'High'
                            ? 'bg-rose-500/20 text-rose-300'
                            : cat.impactTier === 'Medium'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {cat.impactTier} Impact
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">
                      Weight: {cat.weight}% • Price Shift: {cat.priceChange >= 0 ? `+${cat.priceChange}%` : `${cat.priceChange}%`} • Frequency: {cat.frequency}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black font-mono-num text-white block">
                      {cat.impactScore}
                      <span className="text-[10px] text-slate-500 font-normal">/100</span>
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      )}

      {/* Track Item Price Observation Modal */}
      {showAddObsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white">Track Item Price Observation</h3>

            <form onSubmit={handleAddPriceObservation} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Category</label>
                <select
                  value={newObsCategory}
                  onChange={e => setNewObsCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Item Name</label>
                <input
                  type="text"
                  placeholder="e.g. Canteen Meal, Milk, Metro Pass"
                  value={newObsItem}
                  onChange={e => setNewObsItem(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Unit / Measurement</label>
                <input
                  type="text"
                  placeholder="e.g. per meal, per month, per litre"
                  value={newObsUnit}
                  onChange={e => setNewObsUnit(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Previous Price ({currencySymbol})</label>
                  <input
                    type="number"
                    step="any"
                    value={newObsPrevPrice}
                    onChange={e => setNewObsPrevPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono-num"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Current Price ({currencySymbol})</label>
                  <input
                    type="number"
                    step="any"
                    value={newObsCurrPrice}
                    onChange={e => setNewObsCurrPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono-num"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddObsModal(false)}
                  className="flex-1 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-teal-500 text-slate-950 font-bold rounded-xl"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
