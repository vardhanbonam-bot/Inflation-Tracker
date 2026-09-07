import React from 'react';
import { Home, Receipt, TrendingUp, Lightbulb, Compass, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, setIsAddExpenseOpen } = useApp();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'add_placeholder', label: '', icon: null }, // spacer for floating plus
    { id: 'inflation', label: 'Inflation', icon: TrendingUp },
    { id: 'insights', label: 'Insights', icon: Lightbulb }
  ];

  return (
    <>
      {/* Floating Center Action Button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setIsAddExpenseOpen(true)}
          className="group relative flex items-center justify-center w-13 h-13 rounded-full bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-500 text-slate-950 shadow-xl shadow-teal-500/30 hover:scale-105 active:scale-95 transition duration-200 border-2 border-slate-950"
          aria-label="Add Expense"
        >
          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition" />
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Bottom Bar Shell */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80 px-2 py-1.5 pb-safe">
        <div className="max-w-md mx-auto grid grid-cols-5 items-center">
          {/* Home */}
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition ${
              activeTab === 'home' ? 'text-teal-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-semibold">Home</span>
          </button>

          {/* Expenses */}
          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition ${
              activeTab === 'expenses' ? 'text-teal-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Receipt className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-semibold">Expenses</span>
          </button>

          {/* Center spacer label for Add Expense */}
          <div className="flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] font-bold text-teal-400 mt-5 select-none">Log</span>
          </div>

          {/* Inflation */}
          <button
            onClick={() => setActiveTab('inflation')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition ${
              activeTab === 'inflation' ? 'text-teal-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-semibold">Inflation</span>
          </button>

          {/* Insights / Plan Toggle Hub */}
          <button
            onClick={() => setActiveTab('insights')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition ${
              activeTab === 'insights' || activeTab === 'plan'
                ? 'text-teal-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-semibold">
              {activeTab === 'plan' ? 'Plan' : 'Insights'}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
