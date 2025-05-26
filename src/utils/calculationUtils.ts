
/**
 * Calculates the number of active users over time
 */
export const calculateActiveUsers = (
  monthlyVisitors: number,
  signupRate: number,
  activationRate: number,
  retentionRate: number,
  months: number
): number[] => {
  const signups = monthlyVisitors * (signupRate / 100);
  const initialActive = signups * (activationRate / 100);
  
  const activeUsers: number[] = [initialActive];
  for (let i = 1; i < months; i++) {
    const retainedUsers = activeUsers[i - 1] * (retentionRate / 100);
    const newUsers = signups * (activationRate / 100);
    activeUsers.push(retainedUsers + newUsers);
  }
  
  return activeUsers;
};

/**
 * Calculates monthly recurring revenue (MRR) over time
 */
export const calculateMRR = (
  activeUsers: number[],
  mrr: number
): number[] => {
  return activeUsers.map(users => users * mrr);
};

/**
 * Calculates customer lifetime value (LTV)
 */
export const calculateLTV = (
  mrr: number,
  churnRate: number
): number => {
  // LTV = MRR / Churn Rate
  return mrr / (churnRate / 100);
};

/**
 * Calculates the LTV:CAC ratio
 */
export const calculateLTVCAC = (
  ltv: number,
  cac: number
): number => {
  return ltv / cac;
};

/**
 * Calculates customer lifetime in months
 */
export const calculateCustomerLifetime = (
  churnRate: number
): number => {
  // Customer Lifetime = 1 / Churn Rate
  return 1 / (churnRate / 100);
};

/**
 * Calculates the churn impact (users lost per month)
 */
export const calculateChurnImpact = (
  activeUsers: number[],
  churnRate: number
): number[] => {
  return activeUsers.map(users => users * (churnRate / 100));
};

/**
 * Formats a number as currency
 */
export const formatCurrency = (
  value: number,
  currencySymbol: string = "$"
): string => {
  return `${currencySymbol}${value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`;
};

/**
 * Formats a number as a percentage
 */
export const formatPercentage = (
  value: number
): string => {
  return `${value.toFixed(1)}%`;
};

/**
 * Formats a number with commas
 */
export const formatNumber = (
  value: number
): string => {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};

/**
 * Formats a decimal number
 */
export const formatDecimal = (
  value: number,
  digits: number = 1
): string => {
  return value.toFixed(digits);
};
