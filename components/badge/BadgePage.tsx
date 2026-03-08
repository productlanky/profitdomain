"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  TrendingUp, 
  Users, 
  Trophy, 
  Lock, 
  CheckCircle2, 
  Crown, 
  Zap, 
  Shield, 
  Award, 
  Star,
  ChevronRight,
  ArrowUp
} from "lucide-react";
import { tierList } from "@/lib/data/info";
import {
  databases,
  DB_ID,
  PROFILE_COLLECTION_ID,
  TRANSACTION_COLLECTION,
} from "@/lib/appwrite/client";
import { Query } from "appwrite";
import { getUser } from "@/lib/appwrite/auth";
import { cn } from "@/lib/utils";

type Tier = (typeof tierList)[number];

const tierIcons: Record<string, React.ReactNode> = {
  Bronze: <Shield className="h-6 w-6" />,
  Silver: <Star className="h-6 w-6" />,
  Gold: <Award className="h-6 w-6" />,
  Platinum: <Trophy className="h-6 w-6" />,
  Diamond: <Crown className="h-6 w-6" />,
};

// Adaptive colors for Light/Dark modes
const tierColors: Record<string, string> = {
  Bronze: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-400/10 border-orange-200 dark:border-orange-400/20",
  Silver: "text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-400/10 border-slate-200 dark:border-slate-400/20",
  Gold: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10 border-amber-200 dark:border-amber-400/20",
  Platinum: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-400/10 border-indigo-200 dark:border-indigo-400/20",
  Diamond: "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-400/10 border-cyan-200 dark:border-cyan-400/20",
};

export default function BannerPage() {
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [activeTier, setActiveTier] = useState<Tier>(tierList[0]);
  const [nextTier, setNextTier] = useState<Tier | null>(null);
  const [loading, setLoading] = useState(true);

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUser();
        if (!user?.$id) return;

        const profileRes = await databases.listDocuments(
          DB_ID,
          PROFILE_COLLECTION_ID,
          [Query.equal("userId", user.$id)]
        );

        const profileDoc = profileRes.documents[0];
        if (!profileDoc) return;

        const [depositsRes, referralsRes] = await Promise.all([
          databases.listDocuments(DB_ID, TRANSACTION_COLLECTION, [
            Query.equal("userId", user.$id),
            Query.equal("type", "deposit"),
            Query.equal("status", "approved"),
          ]),
          databases.listDocuments(DB_ID, PROFILE_COLLECTION_ID, [
            Query.equal("referredBy", profileDoc.refereeId),
          ]),
        ]);

        const totalDeposit = depositsRes.documents.reduce(
          (sum, tx) => sum + (Number(tx.amount) || 0), 0
        ) || 0;

        const totalReferralCount = referralsRes.total || 0;

        setTotalDeposits(totalDeposit);
        setTotalReferrals(totalReferralCount);

        // Logic to determine Tier
        const tiersNormalized = tierList.map((t) => ({
          ...t,
          deposit: Number(t.deposit),
          referrals: Number(t.referrals),
        }));

        const qualifiedTiers = tiersNormalized
          .slice()
          .sort((a, b) => a.deposit - b.deposit || a.referrals - b.referrals)
          .filter((tier) => totalDeposit >= tier.deposit && totalReferralCount >= tier.referrals);

        const currentTier = qualifiedTiers.length > 0 ? qualifiedTiers[qualifiedTiers.length - 1] : tiersNormalized[0];
        setActiveTier(currentTier);

        const next = tiersNormalized.find(
          (tier) => (tier.deposit > totalDeposit || tier.referrals > totalReferralCount) && tier.name !== currentTier.name
        ) || null;

        setNextTier(next);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- PROGRESS LOGIC ---
  const progressToNextTier = useMemo(() => {
    if (!nextTier) return 100;

    const currentDepositReq = Number(activeTier.deposit);
    const currentReferralReq = Number(activeTier.referrals);
    const nextDepositReq = Number(nextTier.deposit);
    const nextReferralReq = Number(nextTier.referrals);

    const depositGap = Math.max(nextDepositReq - currentDepositReq, 1);
    const referralGap = Math.max(nextReferralReq - currentReferralReq, 1);

    const depositProgress = Math.min(100, ((totalDeposits - currentDepositReq) / depositGap) * 100);
    const referralProgress = Math.min(100, ((totalReferrals - currentReferralReq) / referralGap) * 100);

    return Math.round(Math.max(0, (depositProgress + referralProgress) / 2));
  }, [nextTier, activeTier, totalDeposits, totalReferrals]);

  const missingDeposit = nextTier ? Math.max(0, Number(nextTier.deposit) - totalDeposits) : 0;
  const missingReferrals = nextTier ? Math.max(0, Number(nextTier.referrals) - totalReferrals) : 0;

  if (loading) return (
    <div className="space-y-8 animate-pulse">
      <div className="h-80 w-full bg-gray-200 dark:bg-white/5 rounded-[2rem]" />
      <div className="h-64 w-full bg-gray-200 dark:bg-white/5 rounded-[2rem]" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. HERO STATUS CARD */}
      <div className="relative overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-xl dark:border-white/10 dark:bg-black/40 dark:backdrop-blur-xl dark:shadow-2xl">
        {/* Background Ambience (Dark Mode Only) */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-500/5 blur-[100px] rounded-full pointer-events-none hidden dark:block" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between p-8">
          
          {/* Rank Info */}
          <div className="flex items-center gap-6">
            <div className={cn(
              "relative flex h-24 w-24 items-center justify-center rounded-3xl border-2 shadow-sm dark:shadow-[0_0_30px_rgba(0,0,0,0.2)]",
              tierColors[activeTier.name]
            )}>
              {tierIcons[activeTier.name]}
              <div className="absolute -bottom-3 px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 text-[10px] font-bold uppercase tracking-wider text-gray-900 dark:text-white shadow-sm">
                Rank {tierList.findIndex(t => t.name === activeTier.name) + 1}
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Current Status</p>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{activeTier.name} Member</h1>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-white/5 border border-emerald-100 dark:border-white/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <Zap className="h-3 w-3 fill-current" />
                {activeTier.boost}% APY Boost Active
              </div>
            </div>
          </div>

          {/* Mini Stats */}
          <div className="flex w-full md:w-auto gap-4">
            <div className="flex-1 md:flex-none p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
              <p className="text-[10px] uppercase text-gray-500 dark:text-gray-400 mb-1">Lifetime Deposits</p>
              <p className="text-xl font-mono font-bold text-gray-900 dark:text-white">${totalDeposits.toLocaleString()}</p>
            </div>
            <div className="flex-1 md:flex-none p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
              <p className="text-[10px] uppercase text-gray-500 dark:text-gray-400 mb-1">Referrals</p>
              <p className="text-xl font-mono font-bold text-gray-900 dark:text-white">{totalReferrals}</p>
            </div>
          </div>
        </div>

        {/* Next Level Progress */}
        {nextTier && (
          <div className="mt-4 border-t border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 p-8">
            <div className="flex justify-between items-end mb-3">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  Next Level: <span className="text-brand-600 dark:text-white font-bold">{nextTier.name}</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex flex-wrap gap-2">
                  {missingDeposit > 0 && <span>Need ${missingDeposit.toLocaleString()} deposits</span>}
                  {missingDeposit > 0 && missingReferrals > 0 && <span>•</span>}
                  {missingReferrals > 0 && <span>Need {missingReferrals} referrals</span>}
                </div>
              </div>
              <span className="text-xl font-bold text-brand-600 dark:text-brand-500">{Math.round(progressToNextTier)}%</span>
            </div>
            <div className="h-3 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-500 dark:to-indigo-500 transition-all duration-1000 ease-out rounded-full"
                style={{ width: `${progressToNextTier}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. TIER GRID */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-brand-600 dark:text-brand-500" />
          Reward Tiers
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {tierList.map((tier, idx) => {
            const isActive = tier.name === activeTier.name;
            const isUnlocked = idx <= tierList.findIndex(t => t.name === activeTier.name);
            const style = tierColors[tier.name];

            return (
              <div
                key={tier.name}
                className={cn(
                  "relative flex flex-col p-5 rounded-3xl border transition-all duration-300",
                  isActive 
                    ? "bg-white dark:bg-white/10 border-brand-500 dark:border-brand-500/50 shadow-lg scale-105 z-10" 
                    : isUnlocked
                      ? "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 opacity-100"
                      : "bg-gray-50 dark:bg-white/[0.02] border-transparent opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
                )}
              >
                {/* Header Icon */}
                <div className="flex justify-between items-start mb-4">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl border", style)}>
                    {tierIcons[tier.name]}
                  </div>
                  {isUnlocked ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <Lock className="h-5 w-5 text-gray-400" />
                  )}
                </div>

                {/* Name & Boost */}
                <div className="mb-4">
                  <h4 className="font-bold text-gray-900 dark:text-white">{tier.name}</h4>
                  <div className="inline-flex items-center gap-1 mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <ArrowUp className="h-3 w-3" />
                    {tier.boost}% Boost
                  </div>
                </div>

                {/* Requirements */}
                <div className="mt-auto space-y-2 pt-4 border-t border-gray-100 dark:border-white/10">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Deposit</span>
                    <span className="font-mono font-medium text-gray-900 dark:text-white">${Number(tier.deposit).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Referrals</span>
                    <span className="font-mono font-medium text-gray-900 dark:text-white">{tier.referrals}</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}