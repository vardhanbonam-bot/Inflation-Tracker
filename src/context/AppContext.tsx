import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Profile,
  Expense,
  PriceObservation,
  Category,
  Goal,
  AlertItem,
  AppSettings,
  CategoryAnalysis,
  CalculationExplanation
} from '../types';
import { INITIAL_CATEGORIES } from '../data/categories';
import {
  DEMO_PROFILE,
  DEMO_EXPENSES,
  DEMO_PRICE_OBSERVATIONS,
  DEMO_BUDGETS,
  DEMO_GOALS,
  DEMO_ALERTS,
  DEMO_SETTINGS
} from '../data/demoData';
import {
  generateCategoryAnalysis,
  calculatePersonalInflation,
  getFormulaExplanation
} from '../utils/calculations';
import { auth, type User } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  loginWithGoogle as fbLoginWithGoogle,
  loginAnonymously as fbLoginAnonymously,
  logoutUser as fbLogoutUser,
  subscribeToExpenses,
  addExpenseToFirestore,
  updateExpenseInFirestore,
  deleteExpenseFromFirestore,
  syncUserProfileToFirestore,
  fetchUserProfileFromFirestore,
  seedInitialFirestoreData
} from '../services/firebaseService';

interface AppContextType {
  profile: Profile;
  expenses: Expense[];
  categories: Category[];
  priceObs: PriceObservation[];
  budgets: Record<string, number>;
  goals: Goal[];
  alerts: AlertItem[];
  settings: AppSettings;
  activeTab: 'home' | 'expenses' | 'inflation' | 'insights' | 'plan';
  setActiveTab: (tab: 'home' | 'expenses' | 'inflation' | 'insights' | 'plan') => void;

  // Firebase Auth & Cloud Sync
  currentUser: User | null;
  isAuthLoading: boolean;
  isFirestoreSynced: boolean;
  firestoreSyncError: string | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  syncAllToCloud: () => Promise<{ success: boolean; count: number }>;

  // Subtabs for deep-linking
  inflationSubtab: string;
  setInflationSubtab: (subtab: string) => void;
  insightsSubtab: string;
  setInsightsSubtab: (subtab: string) => void;
  planSubtab: string;
  setPlanSubtab: (subtab: string) => void;

  // Computed live metrics
  categoryAnalyses: CategoryAnalysis[];
  personalInflation: number;
  referenceInflation: number;
  inflationDelta: number;
  totalMonthlySpend: number;
  monthlyIncome: number;
  remainingBudget: number;
  additionalMonthlyCost: number;
  topPressureCategory: CategoryAnalysis | null;
  unreadAlertsCount: number;

  // Modals & Drawers
  isAddExpenseOpen: boolean;
  setIsAddExpenseOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isAlertsOpen: boolean;
  setIsAlertsOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;

  // Explanation Modal
  calculationModal: {
    isOpen: boolean;
    data: CalculationExplanation | null;
  };
  openCalculationModal: (
    metricKey: 'personal_inflation' | 'basket_weights' | 'price_change' | 'impact_score' | 'future_cost' | 'purchasing_power' | 'budget_usage',
    context?: any
  ) => void;
  closeCalculationModal: () => void;

  // Data operations
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addPriceObservation: (obs: Omit<PriceObservation, 'id' | 'history'>) => void;
  updatePriceObservation: (id: string, currentPrice: number) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateBudget: (categoryId: string, amount: number) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  toggleGoalComplete: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  markAlertRead: (id: string) => void;
  markAllAlertsRead: () => void;
  updateProfile: (profile: Partial<Profile>) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  loadDemoData: () => void;
  resetDemoData: () => void;
  clearMyData: () => void;
}

const STORAGE_KEYS = {
  PROFILE: 'infmirror_profile',
  EXPENSES: 'infmirror_expenses',
  CATEGORIES: 'infmirror_categories',
  PRICES: 'infmirror_prices',
  BUDGETS: 'infmirror_budgets',
  GOALS: 'infmirror_goals',
  ALERTS: 'infmirror_alerts',
  SETTINGS: 'infmirror_settings'
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or Demo Data
  const [profile, setProfile] = useState<Profile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : DEMO_PROFILE;
    } catch {
      return DEMO_PROFILE;
    }
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      return saved ? JSON.parse(saved) : DEMO_EXPENSES;
    } catch {
      return DEMO_EXPENSES;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [priceObs, setPriceObs] = useState<PriceObservation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRICES);
      return saved ? JSON.parse(saved) : DEMO_PRICE_OBSERVATIONS;
    } catch {
      return DEMO_PRICE_OBSERVATIONS;
    }
  });

  const [budgets, setBudgets] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BUDGETS);
      return saved ? JSON.parse(saved) : DEMO_BUDGETS;
    } catch {
      return DEMO_BUDGETS;
    }
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
      return saved ? JSON.parse(saved) : DEMO_GOALS;
    } catch {
      return DEMO_GOALS;
    }
  });

  const [alerts, setAlerts] = useState<AlertItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ALERTS);
      return saved ? JSON.parse(saved) : DEMO_ALERTS;
    } catch {
      return DEMO_ALERTS;
    }
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : DEMO_SETTINGS;
    } catch {
      return DEMO_SETTINGS;
    }
  });

  // Firebase Auth & Cloud Sync state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isFirestoreSynced, setIsFirestoreSynced] = useState<boolean>(false);
  const [firestoreSyncError, setFirestoreSyncError] = useState<string | null>(null);

  // Navigation and UI state
  const [activeTab, setActiveTab] = useState<'home' | 'expenses' | 'inflation' | 'insights' | 'plan'>('home');
  const [inflationSubtab, setInflationSubtab] = useState<string>('analysis');
  const [insightsSubtab, setInsightsSubtab] = useState<string>('overview');
  const [planSubtab, setPlanSubtab] = useState<string>('whatif');

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(!profile.isOnboarded);

  // Calculation explainer modal state
  const [calculationModal, setCalculationModal] = useState<{
    isOpen: boolean;
    data: CalculationExplanation | null;
  }>({
    isOpen: false,
    data: null
  });

  // Firebase Auth Lifecycle
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        setIsAuthLoading(false);
        setIsFirestoreSynced(true);
        setFirestoreSyncError(null);

        // Fetch remote profile if available
        try {
          const remoteProfile = await fetchUserProfileFromFirestore(user.uid);
          if (remoteProfile) {
            setProfile(prev => ({ ...prev, ...remoteProfile }));
          }
        } catch (e) {
          console.warn('Could not fetch remote profile:', e);
        }
      } else {
        // Auto sign in anonymously for seamless cloud sync
        try {
          await fbLoginAnonymously();
        } catch (err: any) {
          console.warn('Anonymous login error:', err);
          setIsAuthLoading(false);
          setFirestoreSyncError(err?.message || 'Using offline mode');
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to real-time expenses in Firestore
  useEffect(() => {
    if (!currentUser?.uid) return;

    const unsubscribe = subscribeToExpenses(
      currentUser.uid,
      (remoteExpenses) => {
        if (remoteExpenses.length > 0) {
          setExpenses(remoteExpenses);
          setIsFirestoreSynced(true);
        } else if (expenses.length > 0) {
          // If remote is empty, seed user's current expenses to Firestore
          seedInitialFirestoreData(currentUser.uid, expenses, profile).catch(console.error);
        }
      },
      (err) => {
        console.warn('Firestore subscription notice:', err);
      }
    );
    return () => unsubscribe();
  }, [currentUser?.uid]);

  // Save to localStorage on state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    } catch (e) {
      console.error(e);
    }
  }, [expenses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error(e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRICES, JSON.stringify(priceObs));
    } catch (e) {
      console.error(e);
    }
  }, [priceObs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
    } catch (e) {
      console.error(e);
    }
  }, [budgets]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    } catch (e) {
      console.error(e);
    }
  }, [goals]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
    } catch (e) {
      console.error(e);
    }
  }, [alerts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  // Derived live computations
  const categoryAnalyses = useMemo(() => {
    return generateCategoryAnalysis(categories, expenses, priceObs, budgets);
  }, [categories, expenses, priceObs, budgets]);

  const personalInflation = useMemo(() => {
    const weights: Record<string, number> = {};
    const priceChanges: Record<string, number> = {};
    categoryAnalyses.forEach(c => {
      weights[c.categoryId] = c.weight;
      priceChanges[c.categoryId] = c.priceChange;
    });
    return calculatePersonalInflation(weights, priceChanges);
  }, [categoryAnalyses]);

  const referenceInflation = settings.referenceInflationRate;
  const inflationDelta = +(personalInflation - referenceInflation).toFixed(2);

  const totalMonthlySpend = useMemo(() => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]);

  const monthlyIncome = profile.income || 20000;
  const remainingBudget = +(monthlyIncome - totalMonthlySpend).toFixed(2);

  // Additional monthly cost from price changes: Σ(Category Spend * (Price Change / 100))
  const additionalMonthlyCost = useMemo(() => {
    let extra = 0;
    for (const ca of categoryAnalyses) {
      if (ca.priceChange > 0) {
        extra += ca.totalSpend * (ca.priceChange / 100);
      }
    }
    return +extra.toFixed(2);
  }, [categoryAnalyses]);

  // Top Inflation Pressure Category (sorted by impact score and contribution)
  const topPressureCategory = useMemo(() => {
    if (categoryAnalyses.length === 0) return null;
    const sorted = [...categoryAnalyses].sort((a, b) => b.impactScore - a.impactScore);
    return sorted[0];
  }, [categoryAnalyses]);

  const unreadAlertsCount = useMemo(() => {
    return alerts.filter(a => !a.read).length;
  }, [alerts]);

  // Actions
  const addExpense = (newExp: Omit<Expense, 'id'>) => {
    const expense: Expense = {
      ...newExp,
      id: `exp-${Date.now()}`
    };
    setExpenses(prev => [expense, ...prev]);

    // Check if demo flag should be false once user logs real data
    if (settings.isDemoData) {
      setSettings(s => ({ ...s, isDemoData: false }));
    }

    if (currentUser?.uid) {
      addExpenseToFirestore(currentUser.uid, expense).catch(err => {
        console.warn('Expense written locally; cloud sync pending:', err);
      });
    }
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses(prev => prev.map(e => (e.id === id ? { ...e, ...updates } : e)));
    if (currentUser?.uid) {
      updateExpenseInFirestore(currentUser.uid, id, updates).catch(console.warn);
    }
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    if (currentUser?.uid) {
      deleteExpenseFromFirestore(currentUser.uid, id).catch(console.warn);
    }
  };

  const addPriceObservation = (obs: Omit<PriceObservation, 'id' | 'history'>) => {
    const newObs: PriceObservation = {
      ...obs,
      id: `price-${Date.now()}`,
      history: [
        { date: obs.lastUpdated, price: obs.previousPrice },
        { date: obs.lastUpdated, price: obs.currentPrice }
      ]
    };
    setPriceObs(prev => [newObs, ...prev]);
  };

  const updatePriceObservation = (id: string, currentPrice: number) => {
    const today = new Date().toISOString().split('T')[0];
    setPriceObs(prev =>
      prev.map(item => {
        if (item.id === id) {
          const oldPrice = item.currentPrice;
          return {
            ...item,
            previousPrice: oldPrice,
            currentPrice,
            lastUpdated: today,
            history: [...item.history, { date: today, price: currentPrice }]
          };
        }
        return item;
      })
    );
  };

  const addCategory = (cat: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...cat,
      id: `cat-${Date.now()}`,
      isCustom: true
    };
    setCategories(prev => [...prev, newCat]);
    setBudgets(b => ({ ...b, [newCat.id]: cat.defaultBudget || 2000 }));
  };

  const updateBudget = (categoryId: string, amount: number) => {
    setBudgets(prev => ({ ...prev, [categoryId]: amount }));
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => (g.id === id ? { ...g, ...updates } : g)));
  };

  const toggleGoalComplete = (id: string) => {
    setGoals(prev =>
      prev.map(g => {
        if (g.id === id) {
          const next = !g.completed;
          return {
            ...g,
            completed: next,
            currentAmount: next ? g.targetAmount : g.currentAmount
          };
        }
        return g;
      })
    );
  };

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
      ...goal,
      id: `goal-${Date.now()}`
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const markAlertRead = (id: string) => {
    setAlerts(prev => prev.map(a => (a.id === id ? { ...a, read: true } : a)));
  };

  const markAllAlertsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  const updateProfile = (updates: Partial<Profile>) => {
    setProfile(prev => {
      const updated = { ...prev, ...updates };
      if (currentUser?.uid) {
        syncUserProfileToFirestore(currentUser.uid, updated).catch(console.warn);
      }
      return updated;
    });
  };

  const loginWithGoogle = async () => {
    try {
      setIsAuthLoading(true);
      const user = await fbLoginWithGoogle();
      if (user) {
        setCurrentUser(user);
        await seedInitialFirestoreData(user.uid, expenses, profile);
        setIsFirestoreSynced(true);
        setFirestoreSyncError(null);
      }
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
      setFirestoreSyncError(err?.message || 'Login failed');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fbLogoutUser();
    } catch (err) {
      console.error(err);
    }
  };

  const syncAllToCloud = async () => {
    if (!currentUser?.uid) {
      return { success: false, count: 0 };
    }
    const res = await seedInitialFirestoreData(currentUser.uid, expenses, profile);
    if (res.success) {
      setIsFirestoreSynced(true);
    }
    return res;
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const loadDemoData = () => {
    setProfile(DEMO_PROFILE);
    setExpenses(DEMO_EXPENSES);
    setCategories(INITIAL_CATEGORIES);
    setPriceObs(DEMO_PRICE_OBSERVATIONS);
    setBudgets(DEMO_BUDGETS);
    setGoals(DEMO_GOALS);
    setAlerts(DEMO_ALERTS);
    setSettings(DEMO_SETTINGS);
  };

  const resetDemoData = () => {
    loadDemoData();
  };

  const clearMyData = () => {
    setProfile({
      name: '',
      city: '',
      studentType: 'Undergraduate',
      currency: settings.currency || '₹',
      income: 0,
      approxSpend: 0,
      accommodationType: 'Hostel / Dorm',
      isOnboarded: false
    });
    setExpenses([]);
    setPriceObs([]);
    setBudgets({
      food: 0,
      accommodation: 0,
      transport: 0,
      education: 0,
      mobile_internet: 0,
      personal_other: 0
    });
    setGoals([]);
    setAlerts([]);
    setSettings(s => ({ ...s, isDemoData: false }));
    setIsOnboardingOpen(true);
  };

  const openCalculationModal = (
    metricKey: 'personal_inflation' | 'basket_weights' | 'price_change' | 'impact_score' | 'future_cost' | 'purchasing_power' | 'budget_usage',
    context: any = {}
  ) => {
    const fullContext = {
      ...context,
      currency: settings.currency || profile.currency || '₹',
      analyses: categoryAnalyses,
      personalRate: personalInflation,
      totalSpend: totalMonthlySpend
    };
    const explanation = getFormulaExplanation(metricKey, fullContext);
    setCalculationModal({
      isOpen: true,
      data: explanation
    });
  };

  const closeCalculationModal = () => {
    setCalculationModal({
      isOpen: false,
      data: null
    });
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        expenses,
        categories,
        priceObs,
        budgets,
        goals,
        alerts,
        settings,
        activeTab,
        setActiveTab,
        inflationSubtab,
        setInflationSubtab,
        insightsSubtab,
        setInsightsSubtab,
        planSubtab,
        setPlanSubtab,
        categoryAnalyses,
        personalInflation,
        referenceInflation,
        inflationDelta,
        totalMonthlySpend,
        monthlyIncome,
        remainingBudget,
        additionalMonthlyCost,
        topPressureCategory,
        unreadAlertsCount,
        isAddExpenseOpen,
        setIsAddExpenseOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        isAlertsOpen,
        setIsAlertsOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        calculationModal,
        openCalculationModal,
        closeCalculationModal,
        addExpense,
        updateExpense,
        deleteExpense,
        addPriceObservation,
        updatePriceObservation,
        addCategory,
        updateBudget,
        updateGoal,
        toggleGoalComplete,
        addGoal,
        markAlertRead,
        markAllAlertsRead,
        updateProfile,
        updateSettings,
        loadDemoData,
        resetDemoData,
        clearMyData,
        currentUser,
        isAuthLoading,
        isFirestoreSynced,
        firestoreSyncError,
        loginWithGoogle,
        logout,
        syncAllToCloud
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
