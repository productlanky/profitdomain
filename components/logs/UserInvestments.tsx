"use client";

import React, { useEffect, useState } from "react";
import { 
  ArrowRight, 
  Clock,  
  History
} from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import Link from "next/link";
import { getUser } from "@/lib/appwrite/auth";
import {
  databases,
  DB_ID,
  INVESTMENT_COLLECTION,
} from "@/lib/appwrite/client";
import { Query } from "appwrite";
import { plan } from "@/lib/data/info";

type Investment = {
  id: string;
  amount: number;
  status: string;
  start_date: string;
  end_date: string | null;
  crypto: string;
  progress: number;
  projected_return: number;
  investment_plans: {
    name: string;
    interest_rate: number;
    duration_days: number;
  } | null;
};

export default function UserInvestments() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const user = await getUser();
        if (!user?.$id) return;

        const { documents } = await databases.listDocuments(
          DB_ID,
          INVESTMENT_COLLECTION,
          [Query.equal("userId", user.$id), Query.orderDesc("startDate")]
        );

        const today = new Date();

        const formattedInvestments: Investment[] = documents.map((inv: any) => {
          const startDate = new Date(inv.startDate);
          const endDate = inv.endDate ? new Date(inv.endDate) : null;
          const matchedPlan = plan?.find((p) => p.id === inv.planId) || plan?.[0] || null;

          let computedStatus: string = inv.status || "active";
          if (endDate && endDate <= today) {
            computedStatus = "completed";
          }

          let progress = 0;
          if (endDate) {
            const totalDuration = endDate.getTime() - startDate.getTime();
            const elapsed = today.getTime() - startDate.getTime();
            progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
          }
          if (computedStatus === 'completed') progress = 100;

          const interest = matchedPlan ? matchedPlan.interest_rate : 0;
          const amount = Number(inv.amount) || 0;
          const projected = amount + (amount * interest);

          return {
            id: inv.$id,
            amount: amount,
            status: computedStatus,
            start_date: inv.startDate,
            end_date: inv.endDate ?? null,
            crypto: inv.crypto,
            progress,
            projected_return: projected,
            investment_plans: matchedPlan,
          };
        });

        setInvestments(formattedInvestments);
      } catch (err) {
        console.error("Error fetching investments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Investment History
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Manage your active positions and view past performance.
          </p>
        </div>
        <Button size="sm" variant="outline" className="h-9 gap-2 rounded-full text-xs" asChild>
          <Link href="/investments">
            New Position <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </div>

      {/* List Container */}
      <div className="flex flex-col gap-3">
        {loading ? (
          // Skeleton Loader
          [1, 2, 3].map((i) => (
            <div key={i} className="flex h-20 w-full items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 dark:border-white/5 dark:bg-white/5">
              <Skeleton className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-white/10" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3 bg-gray-200 dark:bg-white/10" />
                <Skeleton className="h-3 w-1/4 bg-gray-100 dark:bg-white/5" />
              </div>
            </div>
          ))
        ) : investments.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-12 text-center dark:border-white/10 dark:bg-white/5">
            <History className="h-10 w-10 text-gray-400 mb-3" />
            <p className="text-sm font-medium text-gray-900 dark:text-white">No records found</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Your investment portfolio is currently empty.</p>
          </div>
        ) : (
          // Investments List
          investments.map((inv) => {
            const isActive = inv.status === 'active';
            
            return (
              <div 
                key={inv.id}
                className={`
                  group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 
                  rounded-xl border p-4 transition-all duration-200
                  ${isActive 
                    ? "bg-white border-gray-200 shadow-sm dark:bg-white/5 dark:border-white/10 hover:border-brand-500/30" 
                    : "bg-gray-50 border-transparent opacity-75 grayscale hover:grayscale-0 dark:bg-white/5 dark:border-transparent"
                  }
                `}
              >
                {/* Active Indicator Strip */}
                {isActive && (
                  <div className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full bg-brand-500" />
                )}

                {/* Left: Identity */}
                <div className="flex items-center gap-4 pl-3">
                  <div className={`
                    flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-sm font-bold uppercase
                    ${isActive ? "bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400" : "bg-gray-200 text-gray-500 dark:bg-white/10 dark:text-gray-400"}
                  `}>
                    {inv.crypto.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {inv.investment_plans?.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="uppercase font-mono">{inv.crypto}</span>
                      <span>•</span>
                      <span>{(inv.investment_plans?.interest_rate! * 100).toFixed(0)}% ROI</span>
                    </div>
                  </div>
                </div>

                {/* Middle: Progress (Desktop) */}
                <div className="hidden sm:flex flex-col flex-1 max-w-xs px-4">
                  <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 mb-1.5">
                    <span>Progress</span>
                    <span className={isActive ? "text-brand-600 dark:text-brand-400 font-bold" : ""}>{Math.round(inv.progress)}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${isActive ? 'bg-brand-500' : 'bg-gray-400'}`} 
                      style={{ width: `${inv.progress}%` }} 
                    />
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>Ends {inv.end_date ? new Date(inv.end_date).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>

                {/* Right: Financials */}
                <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 w-full sm:w-auto pl-3 sm:pl-0 border-t sm:border-0 border-gray-100 dark:border-white/5 pt-3 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] uppercase text-gray-500 dark:text-gray-400">Principal</p>
                    <p className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                      ${inv.amount.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-[10px] uppercase text-gray-500 dark:text-gray-400">Status</p>
                    {isActive ? (
                      <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20">
                        Running
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 dark:bg-gray-400/10 dark:text-gray-400 dark:ring-gray-400/20">
                        Finished
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}