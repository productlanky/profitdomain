"use client";

import { useEffect, useState } from "react";
import { 
  ArrowRight, 
  Clock, 
  Wallet, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Play
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { getUser } from "@/lib/appwrite/auth";
import {
  databases,
  DB_ID,
  INVESTMENT_COLLECTION,
  PROFILE_COLLECTION_ID,
} from "@/lib/appwrite/client";
import { ID, Query } from "appwrite";
import { plan } from "@/lib/data/info";
import { cn } from "@/lib/utils";

// --- TYPES ---
type InvestmentPlan = {
  id: string;
  name: string;
  description: string;
  interest_rate: number;
  duration_days: number;
  min_amount: number;
};

interface SlugProp {
  slug: string;
}

export default function InvestmentPlansPage({ slug }: SlugProp) {
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [balanc, setBalanc] = useState<number>(0);
  const [investing, setInvesting] = useState<string | null>(null);
  const [investment, setInvestment] = useState<string | null>(null);

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUser();
        if (!user) return;

        const res = await databases.listDocuments(
          DB_ID,
          PROFILE_COLLECTION_ID,
          [Query.equal("userId", user.$id)]
        );

        if (!res.documents.length) {
          toast.error("Profile not found.");
          setLoading(false);
          return;
        }

        const profile = res.documents[0];
        setProfileId(profile.$id);
        setBalance(profile.totalDeposit || 0);
        setBalanc(profile.balance || 0);
        setUserId(user.$id);
        setPlans(plan);

        // Fetch active investment
        const investmentRes = await databases.listDocuments(
          DB_ID,
          INVESTMENT_COLLECTION,
          [
            Query.equal("userId", user.$id),
            Query.orderDesc("startDate"),
            Query.limit(1),
          ]
        );

        if (investmentRes.documents.length > 0) {
          const lastInvestment = investmentRes.documents[0];
          const now = new Date();
          const endDate = lastInvestment.endDate
            ? new Date(lastInvestment.endDate)
            : null;

          if (endDate && now > endDate) {
            setInvestment("expired");
          } else {
            setInvestment(lastInvestment.planId);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Data sync failed");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- HANDLER ---
  const handleInvest = async (plan: InvestmentPlan) => {
    if (!userId || !profileId) return;

    const minAmount = Number(plan.min_amount);
    const durationDays = Number(plan.duration_days);

    if (balance < minAmount) {
      toast.error("Insufficient balance.");
      return;
    }

    setInvesting(plan.id);

    const startedAt = new Date();
    const endAt = new Date(startedAt);
    endAt.setDate(startedAt.getDate() + durationDays);

    try {
      await databases.createDocument(
        DB_ID,
        INVESTMENT_COLLECTION,
        ID.unique(),
        {
          userId,
          planId: plan.id,
          crypto: slug,
          amount: minAmount,
          status: "active",
          startDate: startedAt.toISOString(),
          endDate: endAt.toISOString(),
        }
      );

      const newTotalDeposit = balance - minAmount;
      const newBalanc = balanc - minAmount;

      await databases.updateDocument(
        DB_ID,
        PROFILE_COLLECTION_ID,
        profileId,
        {
          totalDeposit: newTotalDeposit,
          balance: newBalanc,
        }
      );

      setBalance(newTotalDeposit);
      setBalanc(newBalanc);
      setInvestment(plan.id);

      toast.success(`Plan "${plan.name}" activated.`);
    } catch (error) {
      toast.error("Investment failed.");
    } finally {
      setInvesting(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-20 w-full rounded-xl bg-white/5 animate-pulse" />
        <div className="h-20 w-full rounded-xl bg-white/5 animate-pulse" />
        <div className="h-20 w-full rounded-xl bg-white/5 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* --- COMPACT HEADER --- */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-card/50 p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              {slug} Strategy
            </h2>
            <p className="text-xs text-muted-foreground">Select a tier to compound assets</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-muted-foreground">Available Balance</p>
          <div className="flex items-center justify-end gap-2">
            <Wallet className="h-4 w-4 text-emerald-500" />
            <span className="text-lg font-mono font-bold text-foreground">
              ${balance.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* --- COMPACT LIST VIEW --- */}
      <div className="flex flex-col gap-3">
        {plans.map((plan) => {
          const isActive = investment === plan.id;
          const isProcessing = investing === plan.id;
          const hasBalance = balance >= plan.min_amount;
          const projectedReturn = Math.floor(plan.min_amount * (1 + plan.interest_rate));

          return (
            <div
              key={plan.id}
              className={cn(
                "group relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-xl border p-4 transition-all duration-200",
                isActive 
                  ? "bg-brand-500/5 border-brand-500/50 shadow-[0_0_20px_rgba(var(--brand-500),0.1)]" 
                  : "bg-card border-border hover:bg-muted/50 hover:border-border/80"
              )}
            >
              
              {/* Left: Info */}
              <div className="flex items-center gap-4 min-w-[200px]">
                <div className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                  isActive 
                    ? "border-brand-500 bg-brand-500 text-white" 
                    : "border-border bg-background text-muted-foreground"
                )}>
                  {isActive ? <Play className="h-4 w-4 fill-current" /> : `${(plan.interest_rate * 100).toFixed(0)}%`}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    {plan.name}
                    {isActive && (
                      <span className="inline-flex items-center rounded-md bg-brand-500/10 px-2 py-0.5 text-[10px] font-medium text-brand-500 border border-brand-500/20">
                        Active
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                    {plan.description}
                  </p>
                </div>
              </div>

              {/* Middle: Metrics Row */}
              <div className="flex flex-1 items-center justify-between md:justify-center md:gap-12 w-full md:w-auto border-t border-border pt-3 md:border-0 md:pt-0">
                <div className="flex flex-col md:items-center">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Duration</span>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <Clock className="h-3.5 w-3.5 text-brand-500" />
                    {plan.duration_days} Days
                  </div>
                </div>

                <div className="flex flex-col md:items-center">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Entry</span>
                  <div className="text-sm font-medium text-foreground">
                    ${plan.min_amount.toLocaleString()}
                  </div>
                </div>

                <div className="flex flex-col md:items-center">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Est. Return</span>
                  <div className="text-sm font-bold text-emerald-500">
                    ${projectedReturn.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Right: Action */}
              <div className="w-full md:w-auto flex flex-col items-end gap-2">
                <Button
                  size="sm"
                  onClick={() => handleInvest(plan)}
                  disabled={isProcessing || !hasBalance || isActive}
                  className={cn(
                    "w-full md:w-32 rounded-lg text-xs font-semibold h-9",
                    isActive 
                      ? "bg-brand-500/10 text-brand-500 border border-brand-500/20 hover:bg-brand-500/20" 
                      : !hasBalance 
                        ? "bg-muted text-muted-foreground hover:bg-muted opacity-50"
                        : "bg-foreground text-background hover:bg-foreground/90"
                  )}
                >
                  {isProcessing ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : isActive ? (
                    <span className="flex items-center gap-1">Running <CheckCircle2 className="h-3.5 w-3.5" /></span>
                  ) : !hasBalance ? (
                    "Top Up"
                  ) : (
                    "Invest Now"
                  )}
                </Button>
                
                {/* Micro Error Text */}
                {!hasBalance && !isActive && (
                  <div className="flex items-center gap-1 text-[10px] text-rose-500">
                    <AlertCircle className="h-3 w-3" />
                    <span>Missing ${(plan.min_amount - balance).toLocaleString()}</span>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}