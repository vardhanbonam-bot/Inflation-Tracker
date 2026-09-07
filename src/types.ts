export type StudentType = 'Undergraduate' | 'Postgraduate' | 'PhD / Research' | 'High School Senior' | 'Vocational';

export type AccommodationType = 'Hostel / Dorm' | 'PG / Shared Flat' | 'Rented Apartment' | 'Living with Family';

export interface Profile {
  name: string;
  city: string;
  studentType: StudentType;
  currency: string;
  income: number; // Monthly allowance / stipend / part-time
  approxSpend: number;
  accommodationType: AccommodationType;
  isOnboarded: boolean;
}

export interface Expense {
  id: string;
  amount: number;
  categoryId: string;
  subcategory?: string;
  item?: string;
  note?: string;
  date: string; // YYYY-MM-DD
}

export interface PriceObservation {
  id: string;
  categoryId: string;
  item: string;
  unit: string;
  currentPrice: number;
  previousPrice: number;
  lastUpdated: string;
  history: { date: string; price: number }[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  subcategories: string[];
  isCustom?: boolean;
  essentialScore: number; // 1 to 5 (used in Impact calculation)
  defaultBudget?: number;
}

export interface CategoryAnalysis {
  categoryId: string;
  name: string;
  icon: string;
  color: string;
  totalSpend: number;
  weight: number; // percentage (0 - 100)
  priceChange: number; // percentage (-100 to +100)
  weightedContribution: number; // weight * priceChange / 100
  contributionTier: 'High' | 'Medium' | 'Low';
  impactScore: number; // 0 to 100
  impactTier: 'High' | 'Medium' | 'Low';
  budget: number;
  budgetUsagePercent: number;
  benchmarkWeight: number;
  benchmarkDelta: number;
  benchmarkStatus: 'normal' | 'caution' | 'critical';
  frequency: 'daily' | 'weekly' | 'monthly' | 'occasional';
}

export interface AlertItem {
  id: string;
  type: 'pressure' | 'threshold' | 'positive';
  categoryId?: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  metric?: string;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  categoryId?: string;
  deadline: string;
  description: string;
  completed: boolean;
}

export interface CalculationStep {
  label: string;
  formula: string;
  actualValues: string;
  result: string;
}

export interface CalculationExplanation {
  title: string;
  concept: string;
  formula: string;
  steps: CalculationStep[];
  conclusion: string;
}

export interface AppSettings {
  currency: string;
  referenceInflationRate: number; // e.g. 5.4% general CPI
  assumedFutureRate: number; // e.g. 6.0% for 1-5 year projection
  isDemoData: boolean;
  alertsConfig: {
    pressureAlerts: boolean;
    budgetThresholds: boolean;
    positiveReinforcements: boolean;
  };
}
