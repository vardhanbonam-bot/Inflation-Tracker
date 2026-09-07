import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Calendar,
  HelpCircle,
  TrendingUp,
  X,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Expense } from '../types';

export const ExpenseTracker: React.FC = () => {
  const {
    expenses,
    categories,
    categoryAnalyses,
    deleteExpense,
    updateExpense,
    setIsAddExpenseOpen,
    openCalculationModal,
    settings
  } = useApp();

  const [timeTab, setTimeTab] = useState<'today' | 'week' | 'month' | 'all'>('month');
  const [selectedCatFilter, setSelectedCatFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Editing state
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editItem, setEditItem] = useState('');
  const [editNote, setEditNote] = useState('');

  const currencySymbol = settings.currency || '₹';

  // Filter expenses by date
  const filteredExpenses = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const now = new Date();

    return expenses.filter(exp => {
      // Category filter
      if (selectedCatFilter !== 'all' && exp.categoryId !== selectedCatFilter) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesItem = exp.item?.toLowerCase().includes(query);
        const matchesSub = exp.subcategory?.toLowerCase().includes(query);
        const matchesNote = exp.note?.toLowerCase().includes(query);
        if (!matchesItem && !matchesSub && !matchesNote) return false;
      }

      // Time tab filter
      if (timeTab === 'all') return true;

      const expDate = new Date(exp.date);
      if (timeTab === 'today') {
        return exp.date === todayStr;
      }

      if (timeTab === 'week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return expDate >= oneWeekAgo;
      }

      if (timeTab === 'month') {
        // Current month & year
        return (
          expDate.getMonth() === now.getMonth() &&
          expDate.getFullYear() === now.getFullYear()
        );
      }

      return true;
    });
  }, [expenses, timeTab, selectedCatFilter, searchQuery]);

  const totalFilteredSpend = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  const handleStartEdit = (exp: Expense) => {
    setEditingExpense(exp);
    setEditAmount(String(exp.amount));
    setEditItem(exp.item || '');
    setEditNote(exp.note || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExpense) return;
    const num = parseFloat(editAmount);
    if (!num || num <= 0) return;

    updateExpense(editingExpense.id, {
      amount: num,
      item: editItem.trim(),
      note: editNote.trim()
    });
    setEditingExpense(null);
  };

  return (
    <div className="space-y-5 pb-24 max-w-2xl mx-auto">
      {/* Header & Quick Log CTA */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">Expense Tracker</h2>
          <p className="text-xs text-slate-400">Log spending to recalibrate your personal basket</p>
        </div>

        <button
          onClick={() => setIsAddExpenseOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Time Tabs */}
      <div className="flex items-center bg-slate-900/90 p-1 rounded-2xl border border-slate-800 text-xs font-semibold">
        {(['today', 'week', 'month', 'all'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setTimeTab(tab)}
            className={`flex-1 py-1.5 rounded-xl capitalize transition ${
              timeTab === tab
                ? 'bg-teal-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab === 'today'
              ? 'Today'
              : tab === 'week'
              ? 'This Week'
              : tab === 'month'
              ? 'This Month'
              : 'All Time'}
          </button>
        ))}
      </div>

      {/* Per-Category Budget Progress Bars Strip */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Category Budget Limits & Progress
          </span>
          <button
            onClick={() =>
              openCalculationModal('budget_usage', {
                spend: categoryAnalyses[0]?.totalSpend || 0,
                budget: categoryAnalyses[0]?.budget || 1000
              })
            }
            className="text-[11px] text-teal-400 hover:underline flex items-center gap-1"
          >
            <HelpCircle className="w-3 h-3" />
            <span>How is budget usage calculated?</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {categoryAnalyses.map(cat => {
            const usage = cat.budgetUsagePercent;
            const isNearOver = usage >= 85;
            const isOver = usage >= 100;

            return (
              <div
                key={cat.categoryId}
                className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <span>
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
                    <span className="truncate">{cat.name}</span>
                  </span>
                  <span
                    className={`font-mono-num font-bold ${
                      isOver ? 'text-rose-400' : isNearOver ? 'text-amber-400' : 'text-teal-400'
                    }`}
                  >
                    {usage}%
                  </span>
                </div>

                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, usage)}%` }}
                    transition={{ duration: 0.5 }}
                    className={`h-full rounded-full ${
                      isOver ? 'bg-rose-500' : isNearOver ? 'bg-amber-500' : 'bg-teal-500'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono-num">
                  <span>
                    Spent: {currencySymbol}
                    {cat.totalSpend.toLocaleString()}
                  </span>
                  <span>
                    Limit: {currencySymbol}
                    {cat.budget.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search items, notes, or tags..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <button
            onClick={() => setSelectedCatFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCatFilter === 'all'
                ? 'bg-teal-500 text-slate-950 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCatFilter(c.id)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCatFilter === c.id
                  ? 'bg-teal-500 text-slate-950 font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {c.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Filtered Total Bar */}
      <div className="flex items-center justify-between text-xs px-1 text-slate-400">
        <span>
          Showing <strong className="text-white">{filteredExpenses.length}</strong> transactions
        </span>
        <span>
          Period Spend:{' '}
          <strong className="text-teal-400 font-mono-num">
            {currencySymbol}
            {totalFilteredSpend.toLocaleString()}
          </strong>
        </span>
      </div>

      {/* Expense List */}
      <div className="space-y-2">
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-2xl p-6 text-slate-400 space-y-2">
            <span className="text-3xl">🧾</span>
            <h4 className="text-sm font-bold text-white">No expenses found</h4>
            <p className="text-xs max-w-xs mx-auto text-slate-500">
              No transactions match this time period or category filter. Tap below to log one.
            </p>
            <button
              onClick={() => setIsAddExpenseOpen(true)}
              className="mt-3 px-4 py-2 bg-teal-500 text-slate-950 text-xs font-bold rounded-xl"
            >
              + Log New Expense
            </button>
          </div>
        ) : (
          filteredExpenses.map(exp => {
            const cat = categories.find(c => c.id === exp.categoryId);

            return (
              <div
                key={exp.id}
                className="glass-card hover:border-slate-700 p-3.5 rounded-2xl flex items-center justify-between gap-3 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-lg shrink-0">
                    {exp.categoryId === 'food'
                      ? '🍔'
                      : exp.categoryId === 'accommodation'
                      ? '🏠'
                      : exp.categoryId === 'transport'
                      ? '🚇'
                      : exp.categoryId === 'education'
                      ? '📚'
                      : exp.categoryId === 'mobile_internet'
                      ? '📱'
                      : '✨'}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{exp.item || cat?.name}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="text-teal-400 font-medium truncate">
                        {exp.subcategory || cat?.name}
                      </span>
                      <span>•</span>
                      <span className="font-mono-num text-slate-500">{exp.date}</span>
                    </div>
                    {exp.note && (
                      <p className="text-[10px] text-slate-500 italic mt-0.5 truncate">{exp.note}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-black font-mono-num text-slate-200">
                    {currencySymbol}
                    {exp.amount.toLocaleString()}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStartEdit(exp)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                      aria-label="Edit Expense"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteExpense(exp.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      aria-label="Delete Expense"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Expense Modal */}
      <AnimatePresence>
        {editingExpense && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Edit Expense</h3>
                <button
                  onClick={() => setEditingExpense(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Amount ({currencySymbol})</label>
                  <input
                    type="number"
                    step="any"
                    value={editAmount}
                    onChange={e => setEditAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono-num"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Item Description</label>
                  <input
                    type="text"
                    value={editItem}
                    onChange={e => setEditItem(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Note</label>
                  <input
                    type="text"
                    value={editNote}
                    onChange={e => setEditNote(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingExpense(null)}
                    className="flex-1 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-teal-500 text-slate-950 text-xs font-bold rounded-xl"
                  >
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
