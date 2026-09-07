import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, HelpCircle, Calculator, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CalculationModal: React.FC = () => {
  const { calculationModal, closeCalculationModal } = useApp();
  const { isOpen, data } = calculationModal;

  if (!isOpen || !data) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0"
          onClick={closeCalculationModal}
        />

        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl z-10 max-h-[85vh] overflow-y-auto"
        >
          {/* Top drag pill indicator on mobile */}
          <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-4 sm:hidden" />

          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">{data.title}</h3>
                <p className="text-xs text-teal-400/90 font-medium">Credibility Math Engine</p>
              </div>
            </div>
            <button
              onClick={closeCalculationModal}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close formula breakdown"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Core Concept Banner */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3.5 mb-4 text-xs text-slate-300 leading-relaxed">
            <div className="flex items-center gap-1.5 text-teal-300 font-semibold mb-1">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Core Economic Concept</span>
            </div>
            {data.concept}
          </div>

          {/* Mathematical Formula Box */}
          <div className="mb-4">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 mb-1 block">
              Official Formula
            </span>
            <div className="bg-slate-950 border border-teal-500/30 rounded-xl p-3 font-mono text-xs text-teal-300 overflow-x-auto">
              {data.formula}
            </div>
          </div>

          {/* Step by Step Execution with Real Plugged-in Numbers */}
          <div className="mb-4 space-y-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 mb-1 block">
              Plugged-in Numbers from Your Live Data
            </span>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {data.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex flex-col gap-1 text-xs"
                >
                  <div className="flex items-center justify-between text-slate-300 font-medium">
                    <span className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] text-teal-400 flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      {step.label}
                    </span>
                    <span className="font-mono-num font-bold text-teal-300 text-sm">{step.result}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono pl-5">Formula: {step.formula}</div>
                  <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px] pl-5 bg-slate-900/60 py-1 px-2 rounded-md mt-0.5">
                    <span>Input:</span>
                    <span className="text-slate-200">{step.actualValues}</span>
                    <ArrowRight className="w-3 h-3 text-slate-600 inline" />
                    <span className="text-teal-400 font-bold">{step.result}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Final Takeaway Conclusion */}
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-200 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <p className="leading-relaxed">{data.conclusion}</p>
          </div>

          <button
            onClick={closeCalculationModal}
            className="mt-4 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl transition border border-slate-700"
          >
            Got it, close breakdown
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
