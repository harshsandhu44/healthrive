// Plan Configuration
export const PAID_PLANS = ['individual_practitioner'] as const;

export type PaidPlan = (typeof PAID_PLANS)[number];

// Plan Display Names for UI
export const PLAN_DISPLAY_NAMES: Record<string, string> = {
  individual_practitioner: 'Individual Practitioner',
} as const;

// Plan Validation Helper
export function isPaidPlan(plan: string | undefined): plan is PaidPlan {
  console.info('🔍 isPaidPlan check:', {
    plan,
    planType: typeof plan,
    PAID_PLANS,
    includes: plan ? PAID_PLANS.includes(plan as PaidPlan) : false,
  });

  if (!plan) return false;
  return PAID_PLANS.includes(plan as PaidPlan);
}

// Get Display Name Helper
export function getPlanDisplayName(
  plan: string | null | undefined
): string | null {
  if (!plan) return null;
  return PLAN_DISPLAY_NAMES[plan] || plan;
}
