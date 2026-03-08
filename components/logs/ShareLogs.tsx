"use client";

import { useEffect, useMemo, useState } from "react";
import { 
  Rocket, 
  Zap, 
  BrainCircuit, 
  History, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  PieChart,
  DollarSign,
  Pickaxe
} from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { getUser } from "@/lib/appwrite/auth";
import {
  databases,
  DB_ID,
  STOCKLOG_COLLECTION_ID,
} from "@/lib/appwrite/client";
import { Query } from "appwrite";

type StockLog = {
  id: string;
  shares: number;
  sharesType: string;
  amount: number;
  pricePerShare: number;
  status: string;
  date: string;
};

// Helper to determine icon and color based on stock name
const getStockMeta = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes("tesla")) return { icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" };
  if (t.includes("spacex")) return { icon: Rocket, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" };
  if (t.includes("neuralink")) return { icon: BrainCircuit, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" };
    if (t.includes("boring")) return { icon: Pickaxe, color: "text-zinc-500", bg: "bg-zinc-500/10", border: "border-zinc-500/20" };
  return { icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
};

export default function ShareLogs() {
  const [logs, setLogs] = useState<StockLog[]>([]);
  const [loading, setLoading] = useState(true);

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const user = await getUser();
        if (!user?.$id) return;

        const response = await databases.listDocuments(
          DB_ID,
          STOCKLOG_COLLECTION_ID,
          [Query.equal("userId", user.$id), Query.orderDesc("$createdAt")]
        );

        const mappedLogs: StockLog[] = (response.documents || []).map(
          (log: any) => ({
            id: log.$id,
            sharesType: log.shareType,
            shares: Number(log.shares) || 0,
            amount: Number(log.amount) || 0,
            pricePerShare: Number(log.pricePerShare) || 0,
            status: log.status || "successful",
            date: log.$createdAt || "",
          })
        );

        setLogs(mappedLogs);
      } catch (err) {
        console.error("Error fetching logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // --- STATS CALCULATION ---
  const { totalAmount, totalShares } = useMemo(() => {
    const successful = logs.filter((l) => l.status === "successful");
    return successful.reduce(
      (acc, log) => {
        acc.totalAmount += log.amount;
        acc.totalShares += log.shares;
        return acc;
      },
      { totalAmount: 0, totalShares: 0 }
    );
  }, [logs]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. HEADER & METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Equity Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <DollarSign className="h-4 w-4" />
            </div>
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Total Invested
            </span>
          </div>
          <div className="pl-1">
            {loading ? (
              <Skeleton className="h-8 w-32 bg-gray-200 dark:bg-white/10" />
            ) : (
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            )}
          </div>
        </div>

        {/* Total Shares Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
              <PieChart className="h-4 w-4" />
            </div>
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Total Shares Owned
            </span>
          </div>
          <div className="pl-1">
            {loading ? (
              <Skeleton className="h-8 w-24 bg-gray-200 dark:bg-white/10" />
            ) : (
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {totalShares.toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2. TRANSACTION LIST */}
      <div>
        <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <History className="h-5 w-5 text-gray-400" />
          Purchase History
        </h3>

        <div className="flex flex-col gap-3">
          {loading ? (
            // Skeletons
            [1, 2, 3].map((i) => (
              <div key={i} className="flex h-20 w-full items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 dark:border-white/5 dark:bg-white/5">
                <Skeleton className="h-12 w-12 rounded-xl bg-gray-200 dark:bg-white/10" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3 bg-gray-200 dark:bg-white/10" />
                  <Skeleton className="h-3 w-1/4 bg-gray-100 dark:bg-white/5" />
                </div>
              </div>
            ))
          ) : logs.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50/50 py-16 text-center dark:border-white/10 dark:bg-white/5">
              <div className="mb-3 rounded-full bg-gray-100 p-3 dark:bg-white/10">
                <Rocket className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">No shares purchased yet</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto mt-1">
                Your stock acquisition history will appear here once you make your first investment.
              </p>
            </div>
          ) : (
            // Log Rows
            logs.map((log) => {
              const meta = getStockMeta(log.sharesType);
              const Icon = meta.icon;
              const isSuccess = log.status === "successful";

              return (
                <div 
                  key={log.id}
                  className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:border-gray-200 hover:shadow-md dark:border-white/5 dark:bg-white/5 dark:hover:border-white/10"
                >
                  {/* Left: Asset Info */}
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${meta.bg} ${meta.color} ${meta.border}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm capitalize">
                        {log.sharesType}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        {new Date(log.date).toLocaleDateString(undefined, { 
                          year: 'numeric', month: 'short', day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Middle: Stats */}
                  <div className="flex items-center justify-between sm:justify-center gap-8 pl-[4rem] sm:pl-0">
                    <div className="flex flex-col sm:items-center">
                      <span className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">
                        Qty
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {log.shares} <span className="text-xs text-gray-500 font-normal">Shares</span>
                      </span>
                    </div>
                    
                    <div className="flex flex-col sm:items-center">
                      <span className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">
                        Price
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white font-mono">
                        ${log.pricePerShare}
                      </span>
                    </div>
                  </div>

                  {/* Right: Total & Status */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t border-gray-100 pt-3 sm:border-0 sm:pt-0 dark:border-white/5">
                    <div className="text-left sm:text-right">
                      <span className="block sm:hidden text-[10px] uppercase tracking-wider text-gray-400 mb-1">Total</span>
                      <p className="text-base font-bold text-gray-900 dark:text-white font-mono">
                        ${log.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    
                    <div>
                      {isSuccess ? (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400" title="Successful">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400" title={log.status}>
                          <AlertCircle className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}