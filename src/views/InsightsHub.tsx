import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Lightbulb,
  Sparkles,
  TrendingDown,
  Tag,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Send,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { STUDENT_TIPS } from '../data/demoData';

export const InsightsHub: React.FC = () => {
  const {
    insightsSubtab,
    setInsightsSubtab,
    categoryAnalyses,
    personalInflation,
    topPressureCategory,
    totalMonthlySpend,
    monthlyIncome,
    settings,
    openCalculationModal,
    setActiveTab
  } = useApp();

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [savedTips, setSavedTips] = useState<string[]>(['tip-1', 'tip-3']);
  const [selectedDetailCatId, setSelectedDetailCatId] = useState<string>(
    categoryAnalyses[0]?.categoryId || 'food'
  );

  // Copilot student Q&A assistant state
  const [copilotQuestion, setCopilotQuestion] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    {
      sender: 'bot',
      text: `Hey! I'm your Student Inflation Copilot. Ask me anything about where your money is leaking or how to combat price hikes on campus.`
    }
  ]);

  const currencySymbol = settings.currency || '₹';

  const toggleSaveTip = (id: string) => {
    setSavedTips(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const filteredTips = STUDENT_TIPS.filter(tip => {
    if (selectedCategoryFilter === 'all') return true;
    if (selectedCategoryFilter === 'saved') return savedTips.includes(tip.id);
    return tip.categoryId === selectedCategoryFilter;
  });

  const selectedDetailCat =
    categoryAnalyses.find(c => c.categoryId === selectedDetailCatId) || categoryAnalyses[0];

  const handleAskCopilot = (questionText?: string) => {
    const q = questionText || copilotQuestion;
    if (!q.trim()) return;

    const newMsgs = [...chatMessages, { sender: 'user' as const, text: q }];
    setChatMessages(newMsgs);
    setCopilotQuestion('');

    // Generate responsive, data-grounded student answers
    setTimeout(() => {
      let reply = '';
      const lower = q.toLowerCase();

      if (lower.includes('why') || lower.includes('high') || lower.includes('rate')) {
        reply = `Your personal inflation is ${personalInflation}%. The primary culprit is ${
          topPressureCategory?.name || 'Food'
        }, which takes up ${
          topPressureCategory?.weight || 35
        }% of your wallet while experiencing a +${
          topPressureCategory?.priceChange || 9
        }% price hike. Because you spend so much on it, price shifts hit you hard!`;
      } else if (lower.includes('save') || lower.includes('cut') || lower.includes('1000') || lower.includes('budget')) {
        reply = `To save ~${currencySymbol}1,200 to ${currencySymbol}2,000 this month:\n1. Switch to a student semester metro pass (saves ~${currencySymbol}450/mo).\n2. Coordinate bulk hostel snacks/groceries with roommates (saves ~${currencySymbol}600/mo).\n3. Claim student subscriptions for music/cloud storage (saves ~${currencySymbol}200/mo).`;
      } else if (lower.includes('rent') || lower.includes('pg') || lower.includes('hostel')) {
        reply = `Accommodation represents your largest non-negotiable anchor. If rent rises next term, negotiate a longer lease lock-in with flatmates or split shared utilities (WiFi, water purifiers, cleaning).`;
      } else {
        reply = `Based on your live profile (${settings.currency || '₹'}${totalMonthlySpend} monthly spend across ${categoryAnalyses.length} categories), targeting your highest impact tier (${topPressureCategory?.name}) will yield the greatest dollar-for-dollar protection against inflation.`;
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 450);
  };

  return (
    <div className="space-y-5 pb-24 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">Insights & Deflation Tactics</h2>
          <p className="text-xs text-slate-400">Actionable student strategies to protect your purchasing power</p>
        </div>
      </div>

      {/* Subtab Toggle Buttons */}
      <div className="flex items-center bg-slate-900/90 p-1 rounded-2xl border border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setInsightsSubtab('beat')}
          className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
            insightsSubtab === 'beat'
              ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Beat Inflation (Tips)</span>
        </button>

        <button
          onClick={() => setInsightsSubtab('overview')}
          className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
            insightsSubtab === 'overview'
              ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Category Deep-Dive</span>
        </button>

        <button
          onClick={() => setInsightsSubtab('copilot')}
          className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
            insightsSubtab === 'copilot'
              ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Q&A Copilot</span>
        </button>
      </div>

      {/* TAB 1: BEAT INFLATION (TIPS & HACKS §5.10) */}
      {insightsSubtab === 'beat' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Top Recommendation Banner */}
          <div className="glass-mirror rounded-2xl p-4 sm:p-5 border border-teal-500/30 bg-gradient-to-br from-teal-950/40 to-slate-900 space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Highest ROI Student Opportunity
            </span>
            <h3 className="text-sm sm:text-base font-bold text-white">
              Tackle Your #{1} Pressure: {topPressureCategory?.name || 'Food & Dining'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Because this category commands {topPressureCategory?.weight}% of your monthly money, small behavioral shifts here create massive compound insulation against campus price increases.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategoryFilter === 'all'
                  ? 'bg-teal-500 text-slate-950 font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              All Strategies
            </button>
            <button
              onClick={() => setSelectedCategoryFilter('saved')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1 ${
                selectedCategoryFilter === 'saved'
                  ? 'bg-teal-500 text-slate-950 font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Bookmark className="w-3 h-3" />
              <span>Saved ({savedTips.length})</span>
            </button>
            {categoryAnalyses.map(cat => (
              <button
                key={cat.categoryId}
                onClick={() => setSelectedCategoryFilter(cat.categoryId)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategoryFilter === cat.categoryId
                    ? 'bg-teal-500 text-slate-950 font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Tip Cards */}
          <div className="space-y-3">
            {filteredTips.map(tip => {
              const isSaved = savedTips.includes(tip.id);

              return (
                <div
                  key={tip.id}
                  className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2 relative"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base">
                        {tip.categoryId === 'food'
                          ? '🍔'
                          : tip.categoryId === 'transport'
                          ? '🚇'
                          : tip.categoryId === 'education'
                          ? '📚'
                          : tip.categoryId === 'mobile_internet'
                          ? '📱'
                          : '🏠'}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-white">{tip.title}</h4>
                        <span className="text-[10px] text-slate-400 capitalize">{tip.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          tip.potentialSavings === 'High'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : tip.potentialSavings === 'Medium'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {tip.potentialSavings} Savings
                      </span>

                      <button
                        onClick={() => toggleSaveTip(tip.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-teal-400 transition"
                      >
                        {isSaved ? (
                          <BookmarkCheck className="w-4 h-4 text-teal-400" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{tip.description}</p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-teal-400 font-semibold flex items-center gap-1">
                      <TrendingDown className="w-3.5 h-3.5" />
                      Est. Savings: {tip.estimatedMonthlySavings}
                    </span>
                    <span className="text-slate-400 text-[10px]">{tip.difficulty} Effort</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* TAB 2: CATEGORY DEEP-DIVE (§5.8) */}
      {insightsSubtab === 'overview' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Category Selector Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categoryAnalyses.map(cat => (
              <button
                key={cat.categoryId}
                onClick={() => setSelectedDetailCatId(cat.categoryId)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedDetailCatId === cat.categoryId
                    ? 'bg-teal-500 text-slate-950 font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {selectedDetailCat && (
            <div className="glass-card rounded-2xl p-5 space-y-4 border border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <span>
                      {selectedDetailCat.categoryId === 'food'
                        ? '🍔'
                        : selectedDetailCat.categoryId === 'accommodation'
                        ? '🏠'
                        : '🚇'}
                    </span>
                    {selectedDetailCat.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedDetailCat.frequency} spending habit
                  </p>
                </div>

                <span
                  className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                    selectedDetailCat.impactTier === 'High'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : selectedDetailCat.impactTier === 'Medium'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {selectedDetailCat.impactTier} Impact
                </span>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-0.5">Basket Weight</span>
                  <span className="text-sm font-black text-teal-300 font-mono-num">
                    {selectedDetailCat.weight}%
                  </span>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-0.5">Price Shift</span>
                  <span className="text-sm font-black text-rose-400 font-mono-num">
                    +{selectedDetailCat.priceChange}%
                  </span>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-0.5">Weighted Impact</span>
                  <span className="text-sm font-black text-white font-mono-num">
                    +{selectedDetailCat.weightedContribution}%
                  </span>
                </div>
              </div>

              {/* Student Actionable Guidance for this category */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 space-y-2">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
                  Defensive Action Strategy
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  To protect your allowance against ongoing {selectedDetailCat.name} inflation, focus on price-lock options (like semester subscriptions, shared student plans, or campus student union discounts).
                </p>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* TAB 3: Q&A COPILOT */}
      {insightsSubtab === 'copilot' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Pre-canned prompt suggestions */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Quick Inquiries
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Why is my personal inflation higher than national CPI?',
                'Where can I save ₹1,000 this month?',
                'How will rent hikes affect my savings?'
              ].map(q => (
                <button
                  key={q}
                  onClick={() => handleAskCopilot(q)}
                  className="text-[11px] text-left px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="glass-card rounded-2xl p-4 min-h-[220px] max-h-[360px] overflow-y-auto space-y-3">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-teal-500 text-slate-950 font-medium'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 whitespace-pre-line'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask about your living expenses, price trends..."
              value={copilotQuestion}
              onChange={e => setCopilotQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAskCopilot()}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
            <button
              onClick={() => handleAskCopilot()}
              className="p-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl transition shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
