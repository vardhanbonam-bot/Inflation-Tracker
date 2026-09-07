import { Expense, PriceObservation, Profile, Goal, AlertItem, AppSettings } from '../types';

export const DEMO_PROFILE: Profile = {
  name: 'Aarav Sharma',
  city: 'Bengaluru',
  studentType: 'Undergraduate',
  currency: '₹',
  income: 22000,
  approxSpend: 18000,
  accommodationType: 'PG / Shared Flat',
  isOnboarded: true
};

export const DEMO_SETTINGS: AppSettings = {
  currency: '₹',
  referenceInflationRate: 5.4, // National reference CPI rate
  assumedFutureRate: 7.0, // Assumed forward annual inflation rate
  isDemoData: true,
  alertsConfig: {
    pressureAlerts: true,
    budgetThresholds: true,
    positiveReinforcements: true
  }
};

export const DEMO_BUDGETS: Record<string, number> = {
  food: 7000,
  accommodation: 7200,
  transport: 2200,
  education: 1600,
  mobile_internet: 900,
  personal_other: 1500
};

// Generates dated expenses for current month totaling exactly 18,000:
// Food: 6,480 (36%)
// Accommodation: 6,840 (38%)
// Transport: 1,800 (10%)
// Education: 1,260 (7%)
// Mobile & Internet: 720 (4%)
// Personal & Other: 900 (5%)
export const DEMO_EXPENSES: Expense[] = [
  // Food (6,480)
  { id: 'exp-1', categoryId: 'food', subcategory: 'Canteen / Campus Mess', item: 'Monthly Mess Card Token', amount: 3600, date: '2026-09-01', note: 'Campus dinner & lunch meal plan' },
  { id: 'exp-2', categoryId: 'food', subcategory: 'Groceries', item: 'Supermarket Groceries & Snacks', amount: 1420, date: '2026-09-03', note: 'Oats, milk, eggs, bread, fruits' },
  { id: 'exp-3', categoryId: 'food', subcategory: 'Eating Out', item: 'Weekend Group Pizza & Drink', amount: 860, date: '2026-09-05', note: 'Project team study session meal' },
  { id: 'exp-4', categoryId: 'food', subcategory: 'Coffee / Quick Snacks', item: 'Library Cafe Coffee & Puff', amount: 600, date: '2026-09-06', note: 'Mid-week evening study snacks' },

  // Accommodation (6,840)
  { id: 'exp-5', categoryId: 'accommodation', subcategory: 'Rent / PG Fee', item: 'Monthly PG Room Share', amount: 6200, date: '2026-09-01', note: 'Double sharing PG with attached bath' },
  { id: 'exp-6', categoryId: 'accommodation', subcategory: 'Electricity & Water', item: 'Sub-meter Electricity Bill', amount: 440, date: '2026-09-02', note: 'Split between 2 roommates' },
  { id: 'exp-7', categoryId: 'accommodation', subcategory: 'House Supplies', item: 'Room Cleaning & Trash Bags', amount: 200, date: '2026-09-04', note: 'Floor cleaner and room supplies' },

  // Transport (1,800)
  { id: 'exp-8', categoryId: 'transport', subcategory: 'Metro / Bus Pass', item: 'Monthly Student Metro SmartCard', amount: 990, date: '2026-09-01', note: 'Unlimited peak college zone pass' },
  { id: 'exp-9', categoryId: 'transport', subcategory: 'Auto / Rideshare', item: 'Auto Rickshaw to Exam Hall', amount: 360, date: '2026-09-04', note: 'Late evening lab return' },
  { id: 'exp-10', categoryId: 'transport', subcategory: 'Fuel / Bike Service', item: 'Scooter Petrol Refill', amount: 450, date: '2026-09-06', note: 'Weekly weekend city errands' },

  // Education (1,260)
  { id: 'exp-11', categoryId: 'education', subcategory: 'Textbooks & Notes', item: 'Data Structures Reference Book', amount: 550, date: '2026-09-02', note: 'Semester recommended reading' },
  { id: 'exp-12', categoryId: 'education', subcategory: 'Stationery & Printing', item: 'Lab Manual Spiral Bindings', amount: 350, date: '2026-09-05', note: '70-page colored project printouts' },
  { id: 'exp-13', categoryId: 'education', subcategory: 'Course Subscriptions', item: 'Student Coding Platform Pass', amount: 360, date: '2026-09-03', note: 'Special student discount annual tier' },

  // Mobile & Internet (720)
  { id: 'exp-14', categoryId: 'mobile_internet', subcategory: 'Phone Recharge', item: '5G Mobile Prepaid Plan 28D', amount: 349, date: '2026-09-01', note: '2GB/day high-speed student pack' },
  { id: 'exp-15', categoryId: 'mobile_internet', subcategory: 'Hostel / Flat WiFi', item: 'High-speed Fiber Room Share', amount: 371, date: '2026-09-02', note: '100 Mbps connection split 3 ways' },

  // Personal & Other (900)
  { id: 'exp-16', categoryId: 'personal_other', subcategory: 'Laundry', item: 'Weekly Hostel Coin Laundry', amount: 350, date: '2026-09-03', note: 'Wash & fold 2 bags' },
  { id: 'exp-17', categoryId: 'personal_other', subcategory: 'Personal Hygiene', item: 'Toiletries & Haircut', amount: 350, date: '2026-09-05', note: 'Salon trim + shampoo & soap' },
  { id: 'exp-18', categoryId: 'personal_other', subcategory: 'Streaming & Subscriptions', item: 'Student Music Subscription', amount: 200, date: '2026-09-01', note: 'Half-price student rate' }
];

// Price Observations with verified percentage changes matching calculation logic
export const DEMO_PRICE_OBSERVATIONS: PriceObservation[] = [
  {
    id: 'p-1',
    categoryId: 'food',
    item: 'Campus Thali / Mess Meal',
    unit: 'per plate',
    previousPrice: 60,
    currentPrice: 72, // +20%
    lastUpdated: '2026-09-01',
    history: [
      { date: '2026-03-01', price: 60 },
      { date: '2026-05-15', price: 64 },
      { date: '2026-07-10', price: 68 },
      { date: '2026-09-01', price: 72 }
    ]
  },
  {
    id: 'p-2',
    categoryId: 'food',
    item: 'Toned Milk (1 Litre)',
    unit: 'per pack',
    previousPrice: 32,
    currentPrice: 36, // +12.5%
    lastUpdated: '2026-09-02',
    history: [
      { date: '2026-02-01', price: 32 },
      { date: '2026-04-10', price: 34 },
      { date: '2026-06-20', price: 34 },
      { date: '2026-09-02', price: 36 }
    ]
  },
  {
    id: 'p-3',
    categoryId: 'food',
    item: 'Campus Filter Coffee',
    unit: 'per cup',
    previousPrice: 15,
    currentPrice: 18, // +20%
    lastUpdated: '2026-09-04',
    history: [
      { date: '2026-01-10', price: 15 },
      { date: '2026-04-01', price: 16 },
      { date: '2026-07-01', price: 16 },
      { date: '2026-09-04', price: 18 }
    ]
  },
  {
    id: 'p-4',
    categoryId: 'accommodation',
    item: 'PG 2-Sharing Bed Space',
    unit: 'per month',
    previousPrice: 6000,
    currentPrice: 6480, // +8.0%
    lastUpdated: '2026-08-28',
    history: [
      { date: '2026-01-01', price: 6000 },
      { date: '2026-05-01', price: 6200 },
      { date: '2026-07-01', price: 6300 },
      { date: '2026-08-28', price: 6480 }
    ]
  },
  {
    id: 'p-5',
    categoryId: 'accommodation',
    item: 'Room Electricity Unit Rate',
    unit: 'per kWh',
    previousPrice: 8.0,
    currentPrice: 9.2, // +15%
    lastUpdated: '2026-08-15',
    history: [
      { date: '2026-01-01', price: 8.0 },
      { date: '2026-04-01', price: 8.5 },
      { date: '2026-06-01', price: 8.8 },
      { date: '2026-08-15', price: 9.2 }
    ]
  },
  {
    id: 'p-6',
    categoryId: 'transport',
    item: 'Student Metro Pass (30 Days)',
    unit: 'monthly pass',
    previousPrice: 900,
    currentPrice: 990, // +10%
    lastUpdated: '2026-09-01',
    history: [
      { date: '2026-01-01', price: 900 },
      { date: '2026-04-01', price: 900 },
      { date: '2026-06-15', price: 950 },
      { date: '2026-09-01', price: 990 }
    ]
  },
  {
    id: 'p-7',
    categoryId: 'transport',
    item: 'Minimum Auto Meter Base Fare',
    unit: 'base 2km',
    previousPrice: 30,
    currentPrice: 36, // +20%
    lastUpdated: '2026-08-20',
    history: [
      { date: '2026-02-01', price: 30 },
      { date: '2026-05-01', price: 32 },
      { date: '2026-07-01', price: 34 },
      { date: '2026-08-20', price: 36 }
    ]
  },
  {
    id: 'p-8',
    categoryId: 'education',
    item: 'Standard Spiral Binding & Print',
    unit: 'per 50 pages',
    previousPrice: 100,
    currentPrice: 125, // +25%
    lastUpdated: '2026-09-03',
    history: [
      { date: '2026-01-15', price: 100 },
      { date: '2026-04-10', price: 110 },
      { date: '2026-07-01', price: 115 },
      { date: '2026-09-03', price: 125 }
    ]
  },
  {
    id: 'p-9',
    categoryId: 'mobile_internet',
    item: '28-Day Unlimited Mobile Recharge',
    unit: 'per recharge',
    previousPrice: 299,
    currentPrice: 349, // +16.7%
    lastUpdated: '2026-08-30',
    history: [
      { date: '2026-01-01', price: 299 },
      { date: '2026-04-01', price: 299 },
      { date: '2026-07-15', price: 319 },
      { date: '2026-08-30', price: 349 }
    ]
  },
  {
    id: 'p-10',
    categoryId: 'personal_other',
    item: 'Standard Coin Laundry Load',
    unit: 'per 5kg load',
    previousPrice: 50,
    currentPrice: 55, // +10%
    lastUpdated: '2026-08-25',
    history: [
      { date: '2026-01-01', price: 50 },
      { date: '2026-04-01', price: 50 },
      { date: '2026-06-01', price: 52 },
      { date: '2026-08-25', price: 55 }
    ]
  }
];

export const DEMO_GOALS: Goal[] = [
  {
    id: 'goal-1',
    title: 'Batch Grocery Cooking Savings',
    targetAmount: 1200,
    currentAmount: 850,
    categoryId: 'food',
    deadline: '2026-09-30',
    description: 'Cook dinner 4 nights a week with roommates instead of individual food deliveries',
    completed: false
  },
  {
    id: 'goal-2',
    title: 'Off-Peak Metro Pass Discipline',
    targetAmount: 600,
    currentAmount: 600,
    categoryId: 'transport',
    deadline: '2026-09-20',
    description: 'Travel using student card concession and skip solo auto-rideshares',
    completed: true
  },
  {
    id: 'goal-3',
    title: 'Emergency Cushion Buffer (1 Month Rent)',
    targetAmount: 6500,
    currentAmount: 4200,
    categoryId: 'accommodation',
    deadline: '2026-10-31',
    description: 'Safe liquid emergency fund deposited in high-yield student savings account',
    completed: false
  }
];

export const DEMO_ALERTS: AlertItem[] = [
  {
    id: 'alt-1',
    type: 'pressure',
    categoryId: 'food',
    title: 'High Inflation Pressure: Food & Canteen',
    message: 'Food represents 36.0% of your spend and experienced a +16.5% price increase, driving +5.9% points of your total personal inflation.',
    timestamp: '2 hours ago',
    read: false,
    metric: '+16.5% price change'
  },
  {
    id: 'alt-2',
    type: 'threshold',
    categoryId: 'food',
    title: 'Food Budget Approaching 92% Used',
    message: 'You have spent ₹6,480 of your ₹7,000 monthly food allowance with 23 days left in the billing period.',
    timestamp: 'Yesterday',
    read: false,
    metric: '92.6% used'
  },
  {
    id: 'alt-3',
    type: 'positive',
    categoryId: 'personal_other',
    title: 'Smart Spending: Personal Expenses Below Benchmark',
    message: 'Your personal discretionary spend is at 5.0% of your basket, safely below the 8.0% student cohort benchmark.',
    timestamp: '3 days ago',
    read: true,
    metric: '-3.0% vs benchmark'
  }
];

export const STUDENT_TIPS = [
  {
    id: 'tip-1',
    categoryId: 'food',
    category: 'Food & Beverages',
    title: 'Bulk-buy Non-Perishables with Flatmates',
    description: 'Pool funds to buy rice, pulses, cooking oil, and oats from wholesale depots instead of daily retail packs.',
    potentialSavings: 'High',
    estimatedMonthlySavings: '₹600 - ₹900',
    difficulty: 'Easy'
  },
  {
    id: 'tip-2',
    categoryId: 'food',
    category: 'Food & Beverages',
    title: 'Sunday Meal-Prep Batch Cooking',
    description: 'Prep 4 meal portions over the weekend. Avoids the 8 PM fatigue food delivery surge on weekdays.',
    potentialSavings: 'High',
    estimatedMonthlySavings: '₹800 - ₹1,400',
    difficulty: 'Medium'
  },
  {
    id: 'tip-3',
    categoryId: 'transport',
    category: 'Transport',
    title: 'Apply for Student Concession Metro / Bus Pass',
    description: 'Universities endorse subsidized public transit passes offering 40%–50% fare discounts compared to daily smartcard fares.',
    potentialSavings: 'High',
    estimatedMonthlySavings: '₹450 - ₹750',
    difficulty: 'Easy'
  },
  {
    id: 'tip-4',
    categoryId: 'education',
    category: 'Education',
    title: 'Campus Library Reserve & Digital Course Packs',
    description: 'Borrow reference copies or digital institutional access instead of purchasing new physical semester editions.',
    potentialSavings: 'Medium',
    estimatedMonthlySavings: '₹350 - ₹600',
    difficulty: 'Easy'
  },
  {
    id: 'tip-5',
    categoryId: 'mobile_internet',
    category: 'Mobile & Internet',
    title: 'Activate Student Discount Verification',
    description: 'Use your .edu or student ID on Spotify, Apple Music, YouTube Premium, and GitHub Student Pack for up to 60% off.',
    potentialSavings: 'Low',
    estimatedMonthlySavings: '₹150 - ₹250',
    difficulty: 'Easy'
  },
  {
    id: 'tip-6',
    categoryId: 'accommodation',
    category: 'Accommodation',
    title: 'Split Shared Fixed Utilities & Purifier Rentals',
    description: 'Negotiate annual lease extension rates with flatmates to avoid mid-semester rental bumps and split WiFi bills equally.',
    potentialSavings: 'High',
    estimatedMonthlySavings: '₹500 - ₹1,000',
    difficulty: 'Medium'
  },
  {
    id: 'tip-7',
    categoryId: 'personal_other',
    category: 'Personal & Other',
    title: 'Off-Peak Hostel Amenity Hours & Batch Laundry',
    description: 'Run laundry in combined full loads during designated off-peak hours rather than multiple half-empty cycles.',
    potentialSavings: 'Low',
    estimatedMonthlySavings: '₹120 - ₹200',
    difficulty: 'Easy'
  }
];


