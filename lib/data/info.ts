export const companyName = "Profit Domain";

export const tierList: {
  name: "Silver" | "Premium" | "Diamond" | "Ruby";
  deposit: number;
  referrals: number;
  boost: number;
  color: string;
}[] = [
  {
    name: "Silver",
    deposit: 19700,
    referrals: 0,
    boost: 2,
    color: "border-slate-400",
  },
  {
    name: "Premium",
    deposit: 35563,
    referrals: 0,
    boost: 4,
    color: "border-indigo-500",
  },
  {
    name: "Diamond",
    deposit: 56000,
    referrals: 0,
    boost: 6,
    color: "border-cyan-500",
  },
  {
    name: "Ruby",
    deposit: 100000,
    referrals: 0,
    boost: 10,
    color: "border-rose-500",
  },
];

export const plan = [
  {
    id: "1",
    name: "Starter",
    slug: "starter",
    description: "Beginner-friendly plan for new investors",
    min_amount: 1000,
    max_amount: 3000,
    referral_bonus: 0.02, // 2%
    interest_rate: 0.1, // 10% ROI
    daily_roi: 0.03, // 3% per day
    duration_days: 30,
  },
  {
    id: "2",
    name: "Standard",
    slug: "standard",
    description: "Balanced plan with increased rewards",
    min_amount: 5000,
    max_amount: 15000,
    referral_bonus: 0.04, // 4%
    interest_rate: 0.15, // 15% ROI
    daily_roi: 0.05, // 5% per day
    duration_days: 45,
  },
  {
    id: "3",
    name: "Premium",
    slug: "premium",
    description: "Advanced plan for experienced investors",
    min_amount: 10000,
    max_amount: 30000,
    referral_bonus: 0.06, // 6%
    interest_rate: 0.2, // 20% ROI
    daily_roi: 0.07, // 7% per day
    duration_days: 60,
  },
  {
    id: "4",
    name: "Elite",
    slug: "elite",
    description: "Top-tier plan with maximum benefits",
    min_amount: 50000,
    max_amount: 150000,
    referral_bonus: 0.1, // 10%
    interest_rate: 0.3, // 30% ROI
    daily_roi: 0.1, // 10% per day
    duration_days: 90,
  },
];
