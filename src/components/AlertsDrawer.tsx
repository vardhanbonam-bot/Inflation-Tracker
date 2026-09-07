import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, AlertTriangle, CheckCircle2, TrendingUp, Check, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AlertsDrawer: React.FC = () => {
  const {
    isAlertsOpen,
    setIsAlertsOpen,
    alerts,
    markAlertRead,
    markAllAlertsRead,
    settings,
    updateSettings
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'pressure' | 'threshold' | 'positive'>('all');

  if (!isAlertsOpen) return null;

  const filteredAlerts = alerts.filter(a => {
    if (activeFilter === 'all') return true;
    return a.type === activeFilter;
  });

  const toggleAlertType = (type: 'pressureAlerts' | 'budgetThresholds' | 'positiveReinforcements') => {
    updateSettings({
      alertsConfig: {
        ...settings.alertsConfig,
        [type]: !settings.alertsConfig[type]
      }
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0"
          onClick={() => setIsAlertsOpen(false)}
        />

        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-5 sm:p-6 shadow-2xl z-10 flex flex-col justify-between"
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Inflation & Budget Alerts</h3>
                  <p className="text-xs text-slate-400">Rule-based signals & smart notifications</p>
                </div>
              </div>
              <button
                onClick={() => setIsAlertsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions & Filters */}
            <div className="mt-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {(['all', 'pressure', 'threshold', 'positive'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition ${
                      activeFilter === f
                        ? 'bg-teal-500 text-slate-950 shadow-sm'
                        : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <button
                onClick={markAllAlertsRead}
                className="text-[11px] text-teal-400 hover:underline whitespace-nowrap shrink-0"
              >
                Mark all read
              </button>
            </div>

            {/* Alert Category Preferences */}
            <div className="mt-3 p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between mb-2 text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-teal-400" />
                  Alert Rules Enabled
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                <button
                  onClick={() => toggleAlertType('pressureAlerts')}
                  className={`py-1 px-2 rounded-md font-medium border text-center transition ${
                    settings.alertsConfig.pressureAlerts
                      ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  Pressure: {settings.alertsConfig.pressureAlerts ? 'ON' : 'OFF'}
                </button>
                <button
                  onClick={() => toggleAlertType('budgetThresholds')}
                  className={`py-1 px-2 rounded-md font-medium border text-center transition ${
                    settings.alertsConfig.budgetThresholds
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  85% Cap: {settings.alertsConfig.budgetThresholds ? 'ON' : 'OFF'}
                </button>
                <button
                  onClick={() => toggleAlertType('positiveReinforcements')}
                  className={`py-1 px-2 rounded-md font-medium border text-center transition ${
                    settings.alertsConfig.positiveReinforcements
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  Wins: {settings.alertsConfig.positiveReinforcements ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {/* Alerts List */}
            <div className="mt-4 space-y-2.5 overflow-y-auto max-h-[calc(100vh-320px)] pr-1">
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No alerts match your current filter.
                </div>
              ) : (
                filteredAlerts.map(alert => {
                  const isPressure = alert.type === 'pressure';
                  const isThreshold = alert.type === 'threshold';
                  const isPositive = alert.type === 'positive';

                  return (
                    <div
                      key={alert.id}
                      onClick={() => markAlertRead(alert.id)}
                      className={`p-3.5 rounded-xl border transition cursor-pointer relative ${
                        !alert.read ? 'bg-slate-800/80 border-slate-700 shadow-sm' : 'bg-slate-950/40 border-slate-800/80'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            isPressure
                              ? 'bg-rose-500/20 text-rose-400'
                              : isThreshold
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}
                        >
                          {isPressure && <AlertTriangle className="w-4 h-4" />}
                          {isThreshold && <TrendingUp className="w-4 h-4" />}
                          {isPositive && <CheckCircle2 className="w-4 h-4" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className="text-xs font-bold text-slate-200 truncate">{alert.title}</h4>
                            <span className="text-[10px] text-slate-500 shrink-0">{alert.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed">{alert.message}</p>
                          {alert.metric && (
                            <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-mono-num font-semibold rounded bg-slate-900 border border-slate-800 text-teal-300">
                              {alert.metric}
                            </span>
                          )}
                        </div>

                        {!alert.read && (
                          <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0 mt-1" />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={() => setIsAlertsOpen(false)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition"
            >
              Close Alerts
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
