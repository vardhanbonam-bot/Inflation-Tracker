import { Category } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'food',
    name: 'Food & Beverages',
    icon: 'Utensils',
    color: '#f97316', // Orange
    essentialScore: 5, // Daily survival necessity
    subcategories: ['Groceries', 'Canteen / Campus Mess', 'Eating Out', 'Coffee / Quick Snacks', 'Delivery Apps']
  },
  {
    id: 'accommodation',
    name: 'Accommodation',
    icon: 'Home',
    color: '#06b6d4', // Cyan
    essentialScore: 5, // Fixed survival shelter
    subcategories: ['Rent / PG Fee', 'Hostel Fee', 'Electricity & Water', 'House Supplies', 'Maintenance']
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: 'Bus',
    color: '#3b82f6', // Blue
    essentialScore: 4, // Mobility necessity
    subcategories: ['Metro / Bus Pass', 'Auto / Rideshare', 'Fuel / Bike Service', 'Train / Flight Home', 'Bicycle']
  },
  {
    id: 'education',
    name: 'Education',
    icon: 'GraduationCap',
    color: '#8b5cf6', // Purple
    essentialScore: 4, // Academic requirement
    subcategories: ['Textbooks & Notes', 'Exam Fees', 'Lab / Project Material', 'Course Subscriptions', 'Stationery & Printing']
  },
  {
    id: 'mobile_internet',
    name: 'Mobile & Internet',
    icon: 'Wifi',
    color: '#10b981', // Emerald
    essentialScore: 4, // Digital lifeline
    subcategories: ['Phone Recharge', 'Hostel / Flat WiFi', 'Cloud Storage', 'Software Tools', 'Laptop Accessories']
  },
  {
    id: 'personal_other',
    name: 'Personal & Other',
    icon: 'Sparkles',
    color: '#ec4899', // Pink
    essentialScore: 2, // Discretionary / Flexible
    subcategories: ['Personal Hygiene', 'Laundry', 'Clothing & Shoes', 'Streaming & Subscriptions', 'Social & Hangouts', 'Fitness / Gym']
  }
];

export const STUDENT_BENCHMARK_WEIGHTS: Record<string, number> = {
  food: 32.0,
  accommodation: 35.0,
  transport: 11.0,
  education: 9.0,
  mobile_internet: 5.0,
  personal_other: 8.0
};

export const SUPPORTED_CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'INR (₹) - Indian Rupee', defaultMultiplier: 1 },
  { code: 'USD', symbol: '$', label: 'USD ($) - US Dollar', defaultMultiplier: 0.012 },
  { code: 'GBP', symbol: '£', label: 'GBP (£) - British Pound', defaultMultiplier: 0.0095 },
  { code: 'EUR', symbol: '€', label: 'EUR (€) - Euro', defaultMultiplier: 0.011 },
  { code: 'CAD', symbol: 'CA$', label: 'CAD ($) - Canadian Dollar', defaultMultiplier: 0.016 },
  { code: 'AUD', symbol: 'A$', label: 'AUD ($) - Australian Dollar', defaultMultiplier: 0.018 },
  { code: 'SGD', symbol: 'S$', label: 'SGD ($) - Singapore Dollar', defaultMultiplier: 0.016 }
];
