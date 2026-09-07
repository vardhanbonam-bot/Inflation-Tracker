import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Calendar, Tag, FileText, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AddExpenseModal: React.FC = () => {
  const { isAddExpenseOpen, setIsAddExpenseOpen, categories, addExpense, settings } = useApp();

  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'food');
  const [subcategory, setSubcategory] = useState('');
  const [item, setItem] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  if (!isAddExpenseOpen) return null;

  const currentCategory = categories.find(c => c.id === categoryId) || categories[0];

  const handleQuickAmount = (val: number) => {
    const current = parseFloat(amount) || 0;
    setAmount(String(current + val));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return;

    addExpense({
      amount: numAmount,
      categoryId,
      subcategory: subcategory || currentCategory.subcategories[0] || 'General',
      item: item.trim() || currentCategory.name,
      date: date || new Date().toISOString().split('T')[0],
      note: note.trim()
    });

    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      setIsAddExpenseOpen(false);
      setAmount('');
      setItem('');
      setNote('');
    }, 400);
  };

  const currencySymbol = settings.currency || '₹';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0"
          onClick={() => setIsAddExpenseOpen(false)}
        />

        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
        >
          {/* Mobile Handle */}
          <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-3 sm:hidden" />

          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                Quick Log Expense
              </h3>
              <p className="text-xs text-slate-400">Updates your live personal inflation basket</p>
            </div>
            <button
              onClick={() => setIsAddExpenseOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Amount Input with Currency Symbol */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Amount ({currencySymbol})
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-2xl font-bold text-teal-400">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  step="any"
                  autoFocus
                  required
                  placeholder="0"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-2xl font-bold font-mono-num text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                />
              </div>

              {/* Quick Amount Add Pills */}
              <div className="flex items-center gap-2 mt-2">
                {[50, 100, 200, 500].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleQuickAmount(val)}
                    className="flex-1 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700/60 transition active:scale-95"
                  >
                    +{val}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Selector Chips */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map(cat => {
                  const isSelected = cat.id === categoryId;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setCategoryId(cat.id);
                        setSubcategory(cat.subcategories[0] || '');
                      }}
                      className={`p-2 rounded-xl text-xs font-semibold border flex flex-col items-center gap-1 transition ${
                        isSelected
                          ? 'bg-teal-500/20 border-teal-500 text-white shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-base">
                        {cat.id === 'food' ? '🍔' : cat.id === 'accommodation' ? '🏠' : cat.id === 'transport' ? '🚇' : cat.id === 'education' ? '📚' : cat.id === 'mobile_internet' ? '📱' : '✨'}
                      </span>
                      <span className="truncate max-w-full">{cat.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subcategory selection */}
            {currentCategory.subcategories.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Subcategory
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {currentCategory.subcategories.map(sub => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setSubcategory(sub)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                        subcategory === sub || (!subcategory && currentCategory.subcategories[0] === sub)
                          ? 'bg-teal-500/20 border-teal-500/60 text-teal-300'
                          : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Item Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Item / Description
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Canteen lunch, Metro pass, Notes print"
                  value={item}
                  onChange={e => setItem(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* Optional Note */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Note (Optional)
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <textarea
                  rows={2}
                  placeholder="Price notes, split with roommate, etc."
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={showSuccessToast}
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-teal-500/25 transition active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {showSuccessToast ? (
                <>
                  <Check className="w-5 h-5 text-slate-950 stroke-[3]" />
                  <span>Logged to Personal Basket!</span>
                </>
              ) : (
                <>
                  <span>Save Expense</span>
                  <span className="font-mono-num text-xs bg-slate-950/20 px-2 py-0.5 rounded">
                    {amount ? `${currencySymbol}${amount}` : ''}
                  </span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
