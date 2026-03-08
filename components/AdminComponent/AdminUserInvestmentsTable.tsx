"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { databases, DB_ID, INVESTMENT_COLLECTION } from "@/lib/appwrite/client";
import { Query } from "appwrite";
import { plan } from "@/lib/data/info";
import Loading from "../ui/Loading";
import Badge from "../ui/badge/Badge";

interface Props {
  userId: string;
}

type InvestmentStatus = "active" | "completed" | "pending" | string;

interface Investment {
  id: string;
  amount: number;
  planId: number | string;
  startDate: string;
  endDate: string | null;
  crypto: string;
  status: InvestmentStatus;
  profit: number | null;
  planName: string;
}

type StatusFilter = "all" | "active" | "completed" | "other";

export default function AdminUserInvestmentsTable({ userId }: Props) {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    const fetchInvestments = async () => {
      if (!userId) return;

      setLoading(true);
      try {
        const res = await databases.listDocuments(
          DB_ID,
          INVESTMENT_COLLECTION,
          [Query.equal("userId", userId)]
        );

        const docs = res.documents ?? [];

        const plansMap = new Map(plan.map((p) => [p.id, p.name]));

        const today = new Date();

        const formatted: Investment[] = docs.map((inv: any) => {
          const rawEnd =
            inv.endsDate ?? inv.endDate ?? inv.end_date ?? null;
          const endDate = rawEnd ? new Date(rawEnd) : null;

          let computedStatus: InvestmentStatus = inv.status || "pending";

          if (endDate && endDate <= today) {
            computedStatus = "completed";
          } else if (!endDate || endDate > today) {
            if (!["cancelled", "rejected"].includes(String(inv.status))) {
              computedStatus = "active";
            }
          }

          return {
            id: inv.$id,
            amount: Number(inv.amount) || 0,
            planId: inv.planId,
            startDate: inv.startDate,
            endDate: rawEnd ?? null,
            crypto: inv.crypto,
            status: computedStatus,
            profit: inv.profit != null ? Number(inv.profit) : null,
            planName: plansMap.get(inv.planId) ?? "N/A",
          };
        });

        setInvestments(formatted);
      } catch (err) {
        console.error("Error fetching investments:", err);
        toast.error("Failed to fetch investments");
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, [userId]);

  const filteredInvestments = useMemo(() => {
    return investments.filter((inv) => {
      if (statusFilter === "all") return true;
      if (statusFilter === "other") {
        return inv.status !== "active" && inv.status !== "completed";
      }
      return inv.status === statusFilter;
    });
  }, [investments, statusFilter]);

  const stats = useMemo(() => {
    const totalAmount = investments.reduce((sum, i) => sum + i.amount, 0);
    const activeAmount = investments
      .filter((i) => i.status === "active")
      .reduce((sum, i) => sum + i.amount, 0);
    const completedAmount = investments
      .filter((i) => i.status === "completed")
      .reduce((sum, i) => sum + i.amount, 0);

    return {
      totalAmount,
      activeAmount,
      completedAmount,
      count: investments.length,
    };
  }, [investments]);

  if (loading) return <Loading />;

  return (
    <div className="p-4 sm:p-5">
      {/* Summary / filters */}
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-4">
          <StatCard
            label="Total Invested"
            value={stats.totalAmount}
            tone="primary"
          />
          <StatCard
            label="Active Capital"
            value={stats.activeAmount}
            tone="success"
          />
          <StatCard
            label="Completed Volume"
            value={stats.completedAmount}
            tone="muted"
          />
        </div>

        {/* Status filter pills – styled like your white pills row */}
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            { key: "all", label: "All" },
            { key: "active", label: "Active" },
            { key: "completed", label: "Completed" },
            { key: "other", label: "Other" },
          ].map((f) => {
            const isActive = statusFilter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setStatusFilter(f.key as StatusFilter)}
                className={`inline-flex items-center rounded-full border px-3 py-1.5 font-medium transition ${
                  isActive
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-gray-200 bg-white text-gray-700 hover:text-primary hover:border-primary/40"
                }`}
              >
                {f.label}
                {f.key === "all" && stats.count > 0 && (
                  <span className={`ml-2 inline-flex h-5 min-w-[1.5rem] items-center justify-center rounded-full px-1 text-[10px] font-semibold ${
                    isActive
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {stats.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table wrapper – same card feel as Users table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white/80 shadow-sm backdrop-blur-sm dark:border-white/8 dark:bg-black/40">
        <div className="max-w-full overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader className="border-b border-gray-100 bg-gray-50/80 text-xs font-medium uppercase tracking-wide text-gray-500 dark:border-white/8 dark:bg-white/5">
              <TableRow>
                <TableCell className="px-5 py-3 text-left">Plan</TableCell>
                <TableCell className="px-5 py-3 text-left">Crypto</TableCell>
                <TableCell className="px-5 py-3 text-left">Amount</TableCell>
                <TableCell className="px-5 py-3 text-left">Profit</TableCell>
                <TableCell className="px-5 py-3 text-left">Status</TableCell>
                <TableCell className="px-5 py-3 text-left">Started</TableCell>
                <TableCell className="px-5 py-3 text-left">Ends</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 text-sm dark:divide-white/6">
              {filteredInvestments.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No investments match the current filter.
                  </TableCell>
                </TableRow>
              )}

              {filteredInvestments.map((inv) => (
                <TableRow
                  key={inv.id}
                  className="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/5"
                >
                  <TableCell className="px-5 py-3 text-gray-900 dark:text-white">
                    <div className="flex flex-col">
                      <span className="font-medium capitalize">
                        {inv.planName}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Plan ID: {inv.planId}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="px-5 py-3 text-gray-700 dark:text-gray-300 uppercase">
                    {inv.crypto}
                  </TableCell>

                  <TableCell className="px-5 py-3 text-gray-900 dark:text-white">
                    ${inv.amount.toFixed(2)}
                  </TableCell>

                  <TableCell className="px-5 py-3">
                    {inv.profit != null ? (
                      <span
                        className={
                          inv.profit >= 0
                            ? "text-emerald-600 dark:text-emerald-300"
                            : "text-red-500 dark:text-red-400"
                        }
                      >
                        {inv.profit >= 0 ? "+" : "-"}$
                        {Math.abs(inv.profit).toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">
                        —
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="px-5 py-3">
                    <StatusBadge status={inv.status} />
                  </TableCell>

                  <TableCell className="px-5 py-3 text-gray-600 dark:text-gray-300">
                    {new Date(inv.startDate).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="px-5 py-3 text-gray-600 dark:text-gray-300">
                    {inv.endDate
                      ? new Date(inv.endDate).toLocaleDateString()
                      : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

/* === Presentational helpers === */

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "primary" | "success" | "muted";
}) {
  const colorClasses =
    tone === "success"
      ? "text-emerald-600"
      : tone === "primary"
      ? "text-primary"
      : "text-gray-700";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-black/30">
      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className={`mt-1 text-lg font-semibold ${colorClasses}`}>
        ${value.toFixed(2)}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: InvestmentStatus }) {
  const normalized = status.toLowerCase();

  let color: "primary" | "success" | "warning";

  if (normalized === "active") {
    color = "success"; // green
  } else if (normalized === "completed") {
    color = "primary"; // your brand / primary
  } else {
    color = "warning"; // pending / other
  }

  return (
    <Badge size="sm" color={color}>
      {status}
    </Badge>
  );
}
