import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { OfflineIndicator } from './components/OfflineIndicator';
import { CalculationModal } from './components/CalculationModal';
import { AddExpenseModal } from './components/AddExpenseModal';
import { AlertsDrawer } from './components/AlertsDrawer';
import { SettingsModal } from './components/SettingsModal';
import { OnboardingModal } from './components/OnboardingModal';

// Views
import { HomeDashboard } from './views/HomeDashboard';
import { ExpenseTracker } from './views/ExpenseTracker';
import { InflationHub } from './views/InflationHub';
import { InsightsHub } from './views/InsightsHub';
import { PlanHub } from './views/PlanHub';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500/30 selection:text-teal-200 antialiased">
      <OfflineIndicator />
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 pt-4 pb-20">
        {activeTab === 'home' && <HomeDashboard />}
        {activeTab === 'expenses' && <ExpenseTracker />}
        {activeTab === 'inflation' && <InflationHub />}
        {activeTab === 'insights' && <InsightsHub />}
        {activeTab === 'plan' && <PlanHub />}
      </main>

      <Navigation />

      {/* Global Overlays & Modals */}
      <CalculationModal />
      <AddExpenseModal />
      <AlertsDrawer />
      <SettingsModal />
      <OnboardingModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
