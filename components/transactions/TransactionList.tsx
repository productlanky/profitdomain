"use client";

import React, { useEffect, useState } from "react";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  History,
  Wallet
} from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { getUser } from "@/lib/appwrite/auth";
import { databases, DB_ID, TRANSACTION_COLLECTION } from "@/lib/appwrite/client";
import { Query } from "appwrite";

type Transaction = {
  id: string;
  type: string;
  amount: number;
  status: string;
  method: string;
  created_at: string;
};

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const user = await getUser();
        if (!user?.$id) return;

        const response = await databases.listDocuments(DB_ID, TRANSACTION_COLLECTION, [
          Query.equal("userId", user.$id),
          Query.orderDesc("$createdAt"),
        ]);

        const mappedTransactions = (response.documents || []).map((doc) => ({
          id: doc.$id,
          type: typeof doc.type === "string" ? doc.type : "unknown",
          amount: typeof doc.amount === "number" ? doc.amount : parseFloat(doc.amount) || 0,
          status: typeof doc.status === "string" ? doc.status : "pending",
          method: typeof doc.method === "string" ? doc.method : "N/A",
          created_at: doc.$createdAt || "",
        }));

        setTransactions(mappedTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // --- FIXED LOGIC HERE ---
  const getTxStyle = (type: string) => {
    const t = type.toLowerCase();
    
    // Check if the transaction adds money to the account
    const isPositive = 
      t.includes("deposit") || 
      t.includes("credit") || 
      t.includes("received") || 
      t.includes("bonus") ||   // Added bonus
      t.includes("profit") ||  // Added profit
      t.includes("earning");   // Added earning
    
    if (isPositive) {
      return {
        icon: ArrowDownLeft, // Arrow pointing in
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-100 dark:bg-emerald-500/20",
        sign: "+"
      };
    }
    
    // Default to withdrawal/negative
    return {
      icon: ArrowUpRight, // Arrow pointing out
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-100 dark:bg-rose-500/20",
      sign: "-"
    };
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === "approved" || s === "success" || s === "completed") {
      return (
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20">
          <CheckCircle2 className="h-3 w-3" /> {status}
        </div>
      );
    }
    if (s === "pending" || s === "processing") {
      return (
        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20">
          <Clock className="h-3 w-3" /> {status}
        </div>
      );
    }
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20">
        <XCircle className="h-3 w-3" /> {status}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <History className="h-5 w-5 text-gray-400" />
            Transaction History
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Recent activity on your account.
          </p>
        </div>
      </div>

      {/* Main List */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full bg-gray-200 dark:bg-white/10" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/4 bg-gray-200 dark:bg-white/10" />
                    <Skeleton className="h-3 w-1/3 bg-gray-100 dark:bg-white/5" />
                  </div>
                  <Skeleton className="h-6 w-20 bg-gray-200 dark:bg-white/10" />
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-14 w-14 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-3">
                <Wallet className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">No transactions yet</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mt-1">
                Your deposits, bonuses, and withdrawals will appear here.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 dark:bg-white/5 text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-white/5">
                <tr>
                  <th className="px-6 py-4">Transaction</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {transactions.map((tx) => {
                  const style = getTxStyle(tx.type);
                  const Icon = style.icon;

                  return (
                    <tr key={tx.id} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      
                      {/* Type */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${style.bg} ${style.color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white capitalize">
                              {tx.type.replace("_", " ")}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                              ID: {tx.id.substring(0, 8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Method */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium px-2 py-1 rounded-md bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 uppercase">
                            {tx.method}
                          </span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 text-right">
                        <span className={`font-mono font-bold ${style.color}`}>
                          {style.sign}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(tx.status)}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-right text-gray-500 dark:text-gray-400 text-xs">
                        <div className="flex flex-col items-end">
                          <span>{new Date(tx.created_at).toLocaleDateString()}</span>
                          <span className="text-[10px] opacity-70">{new Date(tx.created_at).toLocaleTimeString()}</span>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}