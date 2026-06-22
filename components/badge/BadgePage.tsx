"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ShieldCheck,
  Star,
  Zap,
  Crown,
  Trophy,
  CheckCircle2,
  HeadphonesIcon,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { databases, DB_ID, PROFILE_COLLECTION_ID } from "@/lib/appwrite/client";
import { Query } from "appwrite";
import { getUser } from "@/lib/appwrite/auth";
import { cn } from "@/lib/utils";

const upgradeOptions = [
  {
    name: "Silver Account",
    tierKey: "Silver",
    price: 19700,
    target: "intermediate traders",
    perks: ["Moderate limits", "Standard withdrawals", "Basic support"],
    icon: <Star className="h-6 w-6" />,
    colorTheme:
      "text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700",
  },
  {
    name: "Premium Account",
    tierKey: "Premium",
    price: 35563,
    target: "advanced traders",
    perks: [
      "Higher limits",
      "Faster execution",
      "Priority withdrawals",
      "Advanced support",
    ],
    icon: <Zap className="h-6 w-6" />,
    colorTheme:
      "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800/50",
  },
  {
    name: "Diamond Account",
    tierKey: "Diamond",
    price: 56000,
    target: "elite traders",
    perks: [
      "Unlimited trading",
      "Fast-track withdrawals",
      "Personal account manager",
    ],
    icon: <Crown className="h-6 w-6" />,
    colorTheme:
      "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800/50",
  },
  {
    name: "Ruby Account",
    tierKey: "Ruby",
    price: 100000,
    target: "VIP traders",
    perks: [
      "Top-tier plan",
      "Maximum benefits",
      "Instant withdrawals",
      "VIP support",
    ],
    icon: <Trophy className="h-6 w-6" />,
    colorTheme:
      "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/50",
  },
];

export default function AccountUpgradePage() {
  const [loading, setLoading] = useState(true);
  const [currentRank, setCurrentRank] = useState<string>("Silver");
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [accountStatus, setAccountStatus] = useState<string>("active");

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUser();
        if (!user?.$id) return;

        const profileRes = await databases.listDocuments(
          DB_ID,
          PROFILE_COLLECTION_ID,
          [Query.equal("userId", user.$id)],
        );

        if (profileRes.documents.length > 0) {
          const profile = profileRes.documents[0];

          // 1. Fetch and map integer tierLevel to string name
          const tierMap: Record<number, string> = {
            1: "Silver",
            2: "Premium",
            3: "Diamond",
            4: "Ruby",
          };
          const userTierLevel = profile.tierLevel ?? 1;
          setCurrentRank(tierMap[userTierLevel] || "Silver");

          // 2. Check if the admin triggered the rank warning notice
          setShowWarning(profile.rankWarning === true);

          // 3. Fetch account status (active, reviewing_upgrade, dormant, suspended)
          setAccountStatus(profile.accountStatus ?? "active");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading)
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-64 w-full bg-gray-200 dark:bg-white/5 rounded-[2rem]" />
        <div className="h-80 w-full bg-gray-200 dark:bg-white/5 rounded-[2rem]" />
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      {/* Dynamic Status Banners based on accountStatus */}
      {accountStatus === "reviewing_upgrade" && (
        <div className="flex items-center gap-3 p-5 rounded-[1.5rem] bg-blue-50 border border-blue-200 text-blue-800 shadow-sm dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-200">
          <Loader2 className="h-6 w-6 animate-spin flex-shrink-0" />
          <p className="text-sm font-medium">
            <strong>Upgrade in Progress:</strong> Your account upgrade is
            currently under review by our support team. We will notify you once
            the process is complete.
          </p>
        </div>
      )}

      {accountStatus === "dormant" && (
        <div className="flex items-center gap-3 p-5 rounded-[1.5rem] bg-red-50 border border-red-200 text-red-800 shadow-sm dark:bg-red-900/20 dark:border-red-800/50 dark:text-red-200">
          <ShieldAlert className="h-6 w-6 flex-shrink-0" />
          <p className="text-sm font-medium">
            <strong>Account Dormant:</strong> Your trading and withdrawal
            features are currently restricted. Please contact support
            immediately to upgrade and restore full access.
          </p>
        </div>
      )}

      {accountStatus === "suspended" && (
        <div className="flex items-center gap-3 p-5 rounded-[1.5rem] bg-red-50 border border-red-200 text-red-800 shadow-sm dark:bg-red-900/20 dark:border-red-800/50 dark:text-red-200">
          <AlertTriangle className="h-6 w-6 flex-shrink-0" />
          <p className="text-sm font-medium">
            <strong>Account Suspended:</strong> Your account has been suspended.
            Please contact our support team for further assistance.
          </p>
        </div>
      )}

      {/* 1. URGENT NOTICE CARD (Only shows if admin sets rankWarning to true) */}
      {showWarning && (
        <div className="relative overflow-hidden rounded-[2rem] border border-amber-200 bg-amber-50 shadow-xl dark:border-amber-900/50 dark:bg-amber-950/20 dark:shadow-2xl p-8 md:p-10 animate-in slide-in-from-top-4">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-shrink-0 p-4 bg-amber-100 dark:bg-amber-900/50 rounded-full border border-amber-200 dark:border-amber-800">
              <AlertTriangle className="h-10 w-10 text-amber-600 dark:text-amber-500" />
            </div>

            <div className="space-y-4 text-amber-900 dark:text-amber-100 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold">
                  Action Required: Account Upgrade
                </h1>
                <div className="px-4 py-1.5 rounded-full bg-amber-200/50 dark:bg-amber-900/50 border border-amber-300 dark:border-amber-700 text-sm font-semibold">
                  Current Rank: {currentRank}
                </div>
              </div>

              <p className="text-base leading-relaxed">
                <strong>Dear Valued client,</strong>
                <br />
                <br />
                Your current account type cannot support your present balance,
                mainly due to the high returns on investment (ROI) and rapid
                profit growth within a short period.
              </p>

              <p className="text-base leading-relaxed">
                Your account was initially created at a basic level, and the
                significant turnover in profit over a short time has triggered a
                review. To prevent your account from becoming dormant—where
                trading will be restricted, referrals may not function properly,
                and withdrawals may be unavailable—you are required to upgrade
                your account.
              </p>

              <div className="mt-6 p-5 bg-white/60 dark:bg-black/20 rounded-xl border border-amber-200/50 dark:border-amber-900/30">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
                  Account Protection Guarantee
                </h3>
                <p className="text-sm mb-2">
                  Your account is protected under the following regulatory
                  bodies:
                </p>
                <ul className="space-y-2 text-sm font-medium">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-600 dark:text-emerald-500" />
                    The Market in Financial Instruments Directive (MiFID)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-600 dark:text-emerald-500" />
                    The regulatory agency with which your broker is registered
                    (Coverage against unfair losses)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. UPGRADE OPTIONS GRID */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Available Upgrade Options
          </h3>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <HeadphonesIcon className="h-4 w-4" />
            Contact Support to process your upgrade
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {upgradeOptions.map((plan) => {
            const isActive = plan.tierKey === currentRank;

            return (
              <div
                key={plan.name}
                className={cn(
                  "relative flex flex-col p-6 rounded-3xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
                  plan.colorTheme,
                  isActive &&
                    "ring-2 ring-emerald-500 dark:ring-emerald-400 shadow-xl scale-[1.02]", // Highlight active rank
                )}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-white dark:bg-black/20 rounded-xl shadow-sm border border-current/10">
                    {plan.icon}
                  </div>
                  {isActive && (
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-500/30">
                      <CheckCircle2 className="h-3 w-3" /> Active
                    </span>
                  )}
                </div>

                {/* Pricing & Name */}
                <div className="mb-6">
                  <h4 className="text-xl font-bold mb-2">{plan.name}</h4>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black">
                      ${plan.price.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm mt-2 opacity-80 uppercase tracking-wider font-semibold text-[10px]">
                    For {plan.target}
                  </p>
                </div>

                {/* Perks List */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.perks.map((perk, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm font-medium opacity-90"
                    >
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                      {perk}
                    </li>
                  ))}
                </ul>

                {/* Informational Footer */}
                <div className="mt-auto pt-4 border-t border-current/10">
                  <p className="text-xs text-center font-medium opacity-80">
                    {isActive
                      ? "This is your current account plan."
                      : accountStatus === "reviewing_upgrade"
                        ? "Upgrade request pending..."
                        : accountStatus === "dormant" ||
                            accountStatus === "suspended"
                          ? "Account restricted. Contact support."
                          : "Fund balance and contact support to activate."}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
