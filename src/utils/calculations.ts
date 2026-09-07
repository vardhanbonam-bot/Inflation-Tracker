import { Expense, PriceObservation, Category, CategoryAnalysis, CalculationExplanation } from '../types';
import { STUDENT_BENCHMARK_WEIGHTS } from '../data/categories';

/**
 * Calculates spending for each category from the logged expenses.
 */
export function calculateCategorySpend(expenses: Expense[], categories: Category[]): Record<string, number> {
  const spends: Record<string, number> = {};
  categories.forEach(c => (spends[c.id] = 0));

  for (const exp of expenses) {
    if (spends[exp.categoryId] !== undefined) {
      spends[exp.categoryId] += exp.amount;
    } else {
      spends[exp.categoryId] = exp.amount;
    }
  }
  return spends;
}

/**
 * Category Weight = Category Spending / Total Spending * 100
 */
export function calculateBasketWeights(spends: Record<string, number>, totalSpend: number): Record<string, number> {
  const weights: Record<string, number> = {};
  if (totalSpend <= 0) {
    // Equal distribution default if no spending yet
    const count = Object.keys(spends).length || 1;
    for (const key of Object.keys(spends)) {
      weights[key] = +(100 / count).toFixed(2);
    }
    return weights;
  }

  for (const [catId, amount] of Object.entries(spends)) {
    weights[catId] = +((amount / totalSpend) * 100).toFixed(2);
  }
  return weights;
}

/**
 * Category Price Change = (Current Price − Previous Price) / Previous Price × 100
 * Aggregates all price observations logged for that category.
 */
export function calculateCategoryPriceChange(catId: string, priceObs: PriceObservation[]): number {
  const catObs = priceObs.filter(o => o.categoryId === catId);
  if (catObs.length === 0) return 0;

  let totalChange = 0;
  for (const obs of catObs) {
    if (obs.previousPrice > 0) {
      const change = ((obs.currentPrice - obs.previousPrice) / obs.previousPrice) * 100;
      totalChange += change;
    }
  }
  return +(totalChange / catObs.length).toFixed(2);
}

/**
 * Personal Inflation = Σ(Category Weight × Category Price Change)
 */
export function calculatePersonalInflation(
  weights: Record<string, number>,
  priceChanges: Record<string, number>
): number {
  let personalInflation = 0;
  for (const [catId, weight] of Object.entries(weights)) {
    const change = priceChanges[catId] || 0;
    personalInflation += (weight / 100) * change;
  }
  return +personalInflation.toFixed(2);
}

/**
 * Impact Score = f(Category Weight, Essential Score, Price Change)
 * Strongly weights recurring/necessary spend rather than occasional non-essentials.
 */
export function calculateImpactScore(
  weight: number,
  essentialScore: number,
  priceChange: number
): { score: number; tier: 'High' | 'Medium' | 'Low' } {
  // Weight contribution: 0-45 pts
  const weightComponent = Math.min(45, (weight / 40) * 45);

  // Price change contribution: 0-35 pts
  const changeComponent = Math.min(35, Math.max(0, (priceChange / 25) * 35));

  // Essential necessity contribution: 0-20 pts (essentialScore is 1-5)
  const necessityComponent = (essentialScore / 5) * 20;

  const rawScore = Math.round(weightComponent + changeComponent + necessityComponent);
  const score = Math.min(100, Math.max(0, rawScore));

  let tier: 'High' | 'Medium' | 'Low' = 'Low';
  if (score >= 60) tier = 'High';
  else if (score >= 35) tier = 'Medium';

  return { score, tier };
}

/**
 * Future Cost = Current Cost × (1 + Rate/100)^Years
 */
export function calculateFutureCost(currentCost: number, ratePercent: number, years: number): number {
  const factor = Math.pow(1 + ratePercent / 100, years);
  return +(currentCost * factor).toFixed(2);
}

/**
 * Purchasing Power = Current Amount / (1 + Rate/100)^Years
 */
export function calculatePurchasingPower(currentAmount: number, ratePercent: number, years: number): number {
  const factor = Math.pow(1 + ratePercent / 100, years);
  return +(currentAmount / factor).toFixed(2);
}

/**
 * Budget Usage = Amount Spent / Budget × 100
 */
export function calculateBudgetUsage(spent: number, budget: number): number {
  if (budget <= 0) return 0;
  return +((spent / budget) * 100).toFixed(1);
}

/**
 * Generates comprehensive analysis per category
 */
export function generateCategoryAnalysis(
  categories: Category[],
  expenses: Expense[],
  priceObs: PriceObservation[],
  budgets: Record<string, number>
): CategoryAnalysis[] {
  const spends = calculateCategorySpend(expenses, categories);
  const totalSpend = Object.values(spends).reduce((acc, curr) => acc + curr, 0);
  const weights = calculateBasketWeights(spends, totalSpend);

  return categories.map(cat => {
    const spend = spends[cat.id] || 0;
    const weight = weights[cat.id] || 0;
    const priceChange = calculateCategoryPriceChange(cat.id, priceObs);
    const weightedContribution = +((weight * priceChange) / 100).toFixed(2);

    let contributionTier: 'High' | 'Medium' | 'Low' = 'Low';
    if (weightedContribution >= 3.0) contributionTier = 'High';
    else if (weightedContribution >= 1.0) contributionTier = 'Medium';

    const { score: impactScore, tier: impactTier } = calculateImpactScore(weight, cat.essentialScore, priceChange);

    const budget = budgets[cat.id] || cat.defaultBudget || 0;
    const budgetUsagePercent = calculateBudgetUsage(spend, budget);

    const benchmarkWeight = STUDENT_BENCHMARK_WEIGHTS[cat.id] || 15;
    const benchmarkDelta = +(weight - benchmarkWeight).toFixed(1);

    let benchmarkStatus: 'normal' | 'caution' | 'critical' = 'normal';
    if (benchmarkDelta > 10) benchmarkStatus = 'critical';
    else if (benchmarkDelta > 4) benchmarkStatus = 'caution';

    let frequency: 'daily' | 'weekly' | 'monthly' | 'occasional' = 'monthly';
    if (cat.id === 'food') frequency = 'daily';
    else if (cat.id === 'transport') frequency = 'weekly';
    else if (cat.id === 'personal_other') frequency = 'weekly';

    return {
      categoryId: cat.id,
      name: cat.name,
      icon: cat.icon,
      color: cat.color,
      totalSpend: spend,
      weight,
      priceChange,
      weightedContribution,
      contributionTier,
      impactScore,
      impactTier,
      budget,
      budgetUsagePercent,
      benchmarkWeight,
      benchmarkDelta,
      benchmarkStatus,
      frequency
    };
  });
}

/**
 * Dynamic "How is this calculated?" explanation generator with actual values plugged in!
 */
export function getFormulaExplanation(
  metricKey: 'personal_inflation' | 'basket_weights' | 'price_change' | 'impact_score' | 'future_cost' | 'purchasing_power' | 'budget_usage',
  context: {
    categoryName?: string;
    spend?: number;
    totalSpend?: number;
    weight?: number;
    priceChange?: number;
    prevPrice?: number;
    currPrice?: number;
    rate?: number;
    years?: number;
    amount?: number;
    budget?: number;
    analyses?: CategoryAnalysis[];
    personalRate?: number;
    currency?: string;
  }
): CalculationExplanation {
  const sym = context.currency || '₹';

  switch (metricKey) {
    case 'personal_inflation': {
      const analyses = context.analyses || [];
      const steps = analyses.map(a => ({
        label: `${a.name} Contribution`,
        formula: 'Weight × Category Price Change',
        actualValues: `${a.weight}% × ${a.priceChange >= 0 ? '+' : ''}${a.priceChange}%`,
        result: `${a.weightedContribution >= 0 ? '+' : ''}${a.weightedContribution}%`
      }));

      const sumExpression = analyses.map(a => `${a.weightedContribution}%`).join(' + ');

      return {
        title: 'How is Personal Inflation Calculated?',
        concept:
          'Official inflation measures a generic national consumer basket. Your personal inflation weights each price change exclusively by YOUR actual spending proportion.',
        formula: 'Personal Inflation = Σ (Category Weight × Category Price Change)',
        steps: [
          ...steps,
          {
            label: 'Sum of Weighted Contributions',
            formula: 'Σ (Contributions)',
            actualValues: sumExpression || '0%',
            result: `${context.personalRate || 0}%`
          }
        ],
        conclusion: `Your personal inflation rate is ${context.personalRate || 0}%. This means your personal cost of living has shifted by this percentage based on where your money actually goes.`
      };
    }

    case 'basket_weights': {
      const spend = context.spend || 0;
      const total = context.totalSpend || 1;
      const weight = context.weight || +((spend / total) * 100).toFixed(1);

      return {
        title: `How are Basket Weights Calculated?`,
        concept:
          'Basket weight represents the exact share of your total budget consumed by this category. Unlike static indexes, this updates in real time whenever you log expenses.',
        formula: 'Category Weight (%) = (Category Spend ÷ Total Spend) × 100',
        steps: [
          {
            label: 'Category Spend',
            formula: 'Sum of logged expenses in category',
            actualValues: `${sym}${spend.toLocaleString()}`,
            result: `${sym}${spend.toLocaleString()}`
          },
          {
            label: 'Total Spend',
            formula: 'Sum of all category expenses',
            actualValues: `${sym}${total.toLocaleString()}`,
            result: `${sym}${total.toLocaleString()}`
          },
          {
            label: 'Weight Ratio',
            formula: '(${Category Spend} ÷ ${Total Spend}) × 100',
            actualValues: `(${sym}${spend.toLocaleString()} ÷ ${sym}${total.toLocaleString()}) × 100`,
            result: `${weight}%`
          }
        ],
        conclusion: `${context.categoryName || 'This category'} takes up ${weight}% of your overall monthly spending.`
      };
    }

    case 'price_change': {
      const prev = context.prevPrice || 100;
      const curr = context.currPrice || 110;
      const diff = +(curr - prev).toFixed(2);
      const pct = +((diff / prev) * 100).toFixed(2);

      return {
        title: `How is Category Price Change Calculated?`,
        concept:
          'Price change measures the relative percentage change between the baseline price and the current observed price across recorded items.',
        formula: 'Price Change (%) = ((Current Price − Previous Price) ÷ Previous Price) × 100',
        steps: [
          {
            label: 'Price Difference',
            formula: 'Current Price − Previous Price',
            actualValues: `${sym}${curr} − ${sym}${prev}`,
            result: `${diff >= 0 ? '+' : ''}${sym}${diff}`
          },
          {
            label: 'Percentage Ratio',
            formula: '(Price Difference ÷ Previous Price) × 100',
            actualValues: `(${sym}${diff} ÷ ${sym}${prev}) × 100`,
            result: `${pct >= 0 ? '+' : ''}${pct}%`
          }
        ],
        conclusion: `Prices for ${context.categoryName || 'this item'} have changed by ${pct >= 0 ? '+' : ''}${pct}%.`
      };
    }

    case 'impact_score': {
      const weight = context.weight || 30;
      const change = context.priceChange || 10;
      const { score, tier } = calculateImpactScore(weight, 5, change);

      return {
        title: 'How is Inflation Impact Score Calculated?',
        concept:
          'A price spike on a rarely bought item matters far less than an increase in non-negotiable living essentials like hostel fees or campus food. The Impact Score combines your spend weight, essential score, and price change.',
        formula: 'Impact Score = Weight Factor (45%) + Price Change Factor (35%) + Essential Priority (20%)',
        steps: [
          {
            label: 'Spend Weight Factor',
            formula: 'Min(45, (Category Weight ÷ 40) × 45)',
            actualValues: `Min(45, (${weight}% ÷ 40) × 45)`,
            result: `${Math.min(45, Math.round((weight / 40) * 45))} pts`
          },
          {
            label: 'Price Change Factor',
            formula: 'Min(35, Max(0, (Price Change ÷ 25) × 35))',
            actualValues: `Min(35, Max(0, (${change}% ÷ 25) × 35))`,
            result: `${Math.min(35, Math.max(0, Math.round((change / 25) * 35)))} pts`
          },
          {
            label: 'Essential Priority Factor',
            formula: '(Essential Priority ÷ 5) × 20',
            actualValues: `(5 ÷ 5) × 20`,
            result: `20 pts`
          }
        ],
        conclusion: `Final Score: ${score}/100 (${tier} Impact Tier). This categorizes how urgently this inflation pressure threatens your student budget.`
      };
    }

    case 'future_cost': {
      const cost = context.amount || 10000;
      const rate = context.rate || 7;
      const years = context.years || 2;
      const future = calculateFutureCost(cost, rate, years);

      return {
        title: 'How is Future Cost Projected?',
        concept:
          'Calculates how compounding inflation increases the nominal cost required to maintain your exact same student lifestyle over time.',
        formula: 'Future Cost = Current Cost × (1 + Annual Inflation Rate)^Years',
        steps: [
          {
            label: 'Compounding Factor',
            formula: '(1 + Rate ÷ 100)^Years',
            actualValues: `(1 + ${rate} ÷ 100)^${years}`,
            result: `${Math.pow(1 + rate / 100, years).toFixed(4)}x`
          },
          {
            label: 'Projected Amount',
            formula: 'Current Cost × Compounding Factor',
            actualValues: `${sym}${cost.toLocaleString()} × ${Math.pow(1 + rate / 100, years).toFixed(4)}`,
            result: `${sym}${future.toLocaleString()}`
          }
        ],
        conclusion: `In ${years} year${years > 1 ? 's' : ''} at ${rate}% annual inflation, expenses costing ${sym}${cost.toLocaleString()} today will require approximately ${sym}${future.toLocaleString()}.`
      };
    }

    case 'purchasing_power': {
      const amt = context.amount || 10000;
      const rate = context.rate || 7;
      const years = context.years || 2;
      const power = calculatePurchasingPower(amt, rate, years);
      const loss = +(amt - power).toFixed(2);

      return {
        title: 'How is Purchasing Power Decay Calculated?',
        concept:
          'When prices rise, fixed savings or allowances buy fewer physical goods over time. Purchasing power shows what future money is truly worth in today’s purchasing terms.',
        formula: 'Real Purchasing Power = Current Amount ÷ (1 + Annual Inflation Rate)^Years',
        steps: [
          {
            label: 'Discount Factor',
            formula: '(1 + Rate ÷ 100)^Years',
            actualValues: `(1 + ${rate} ÷ 100)^${years}`,
            result: `${Math.pow(1 + rate / 100, years).toFixed(4)}`
          },
          {
            label: 'Decayed Real Value',
            formula: 'Amount ÷ Discount Factor',
            actualValues: `${sym}${amt.toLocaleString()} ÷ ${Math.pow(1 + rate / 100, years).toFixed(4)}`,
            result: `${sym}${power.toLocaleString()}`
          },
          {
            label: 'Purchasing Loss',
            formula: 'Initial Amount − Real Value',
            actualValues: `${sym}${amt.toLocaleString()} − ${sym}${power.toLocaleString()}`,
            result: `−${sym}${loss.toLocaleString()}`
          }
        ],
        conclusion: `In ${years} year${years > 1 ? 's' : ''}, ${sym}${amt.toLocaleString()} sitting without returns will only have the purchasing power of ${sym}${power.toLocaleString()} today.`
      };
    }

    case 'budget_usage': {
      const spent = context.spend || 0;
      const budget = context.budget || 1000;
      const usage = calculateBudgetUsage(spent, budget);

      return {
        title: 'How is Budget Usage Calculated?',
        concept:
          'Monitors what portion of your monthly allocated ceiling has been consumed so far.',
        formula: 'Budget Usage (%) = (Amount Spent ÷ Allocated Budget) × 100',
        steps: [
          {
            label: 'Amount Spent',
            formula: 'Logged expenses in period',
            actualValues: `${sym}${spent.toLocaleString()}`,
            result: `${sym}${spent.toLocaleString()}`
          },
          {
            label: 'Allocated Budget',
            formula: 'Monthly target limit',
            actualValues: `${sym}${budget.toLocaleString()}`,
            result: `${sym}${budget.toLocaleString()}`
          },
          {
            label: 'Usage Percentage',
            formula: '(${Spent} ÷ ${Budget}) × 100',
            actualValues: `(${sym}${spent.toLocaleString()} ÷ ${sym}${budget.toLocaleString()}) × 100`,
            result: `${usage}%`
          }
        ],
        conclusion: `You have consumed ${usage}% of your allocated limit for this category.`
      };
    }
  }
}
