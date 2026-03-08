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
import Badge from "@/components/ui/badge/Badge";
import {
  databases,
  DB_ID,
  NOTIFICATION_COLLECTION,
  PROFILE_COLLECTION_ID,
  TRANSACTION_COLLECTION,
} from "@/lib/appwrite/client";
import { ID, Query } from "appwrite";
import Loading from "../ui/Loading";
import Link from "next/link";
import Select from "../withdrawal/Select";

interface Props {
  userId: string;
}

type Transaction = {
  id: string;
  user_id: string;
  amount: number;
  type: "deposit" | "withdrawal" | "welcome bonus";
  status: "pending" | "approved" | "rejected";
  created_at: string;
  method: string;
  photo?: string;
};

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const typeFilterOptions = [
  { label: "All types", value: "all" },
  { label: "Deposits", value: "deposit" },
  { label: "Withdrawals", value: "withdrawal" },
  { label: "Welcome bonus", value: "welcome bonus" },
];

const statusFilterToolbarOptions = [
  { label: "All status", value: "all" },
  ...statusOptions,
];

export default function AdminUserTransactionsTable({ userId }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);

        const res = await databases.listDocuments(
          DB_ID,
          TRANSACTION_COLLECTION,
          [Query.equal("userId", userId), Query.orderDesc("$createdAt")]
        );

        setTransactions(
          (res.documents || []).map((doc) => ({
            id: doc.$id,
            user_id: doc.user_id ?? doc.userId,
            amount: doc.amount,
            type: doc.type,
            method: doc.method,
            status: doc.status,
            created_at: doc.created_at ?? doc.$createdAt,
            photo: doc.photoUrl,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        toast.error("Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  const summary = useMemo(() => {
    let totalIn = 0;
    let totalOut = 0;
    let approvedCount = 0;

    transactions.forEach((tx) => {
      if (tx.status === "approved") {
        approvedCount++;
        if (tx.type === "withdrawal") {
          totalOut += tx.amount;
        } else {
          totalIn += tx.amount;
        }
      }
    });

    return {
      netFlow: totalIn - totalOut,
      totalIn,
      totalOut,
      approvedCount,
      totalCount: transactions.length,
    };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (typeFilter !== "all" && tx.type !== typeFilter) return false;
      if (statusFilter !== "all" && tx.status !== statusFilter) return false;
      return true;
    });
  }, [transactions, typeFilter, statusFilter]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const tx = transactions.find((t) => String(t.id) === id);
    if (!tx) return;

    const { amount, type, status: oldStatus } = tx;

    if (oldStatus === newStatus) return;

    try {
      // 1. Update Transaction Status
      await databases.updateDocument(DB_ID, TRANSACTION_COLLECTION, id, {
        status: newStatus,
      });

      // 2. Notification
      const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
      const message = `${capitalizedType} of $${amount.toLocaleString()} was ${newStatus}`;

      await databases.createDocument(
        DB_ID,
        NOTIFICATION_COLLECTION,
        ID.unique(),
        {
          userId,
          title: "Transaction Status Updated",
          message,
          type: "transaction",
          isRead: false,
        }
      );

      // 3. BALANCE LOGIC (The critical part)
      const profileRes = await databases.listDocuments(
        DB_ID,
        PROFILE_COLLECTION_ID,
        [Query.equal("userId", userId)]
      );

      if (profileRes.documents.length > 0) {
        const profileDoc = profileRes.documents[0];
        let currentTotalDeposit = profileDoc?.totalDeposit ?? 0;
        let adjustment = 0;

        const wasApproved = oldStatus === "approved";
        const willBeApproved = newStatus === "approved";

        const isInflow = type === "deposit" || type === "welcome bonus";
        const isOutflow = type === "withdrawal";

        // CASE A: Approving a transaction (Pending/Rejected -> Approved)
        if (!wasApproved && willBeApproved) {
          if (isInflow) {
            adjustment = amount; // Add deposit to balance
          } else if (isOutflow) {
            adjustment = -amount; // SUBTRACT withdrawal from balance
          }
        } 
        
        // CASE B: Reverting a transaction (Approved -> Pending/Rejected)
        else if (wasApproved && !willBeApproved) {
          if (isInflow) {
            adjustment = -amount; // Remove deposit from balance
          } else if (isOutflow) {
            adjustment = amount; // REFUND withdrawal back to balance
          }
        }

        // Only update if balance changes
        if (adjustment !== 0) {
          await databases.updateDocument(
            DB_ID,
            PROFILE_COLLECTION_ID,
            profileDoc.$id,
            {
              totalDeposit: currentTotalDeposit + adjustment,
            }
          );
        }
      }

      // 4. Update UI
      setTransactions((prev) =>
        prev.map((t) =>
          String(t.id) === id
            ? { ...t, status: newStatus as Transaction["status"] }
            : t
        )
      );

      toast.success(`Transaction ${newStatus} successfully`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update transaction status");
    }
  };

  if (loading) return <Loading />;

  if (!transactions.length)
    return (
      <div className="rounded-2xl border border-gray-200 bg-white/80 p-10 text-center text-sm text-gray-600 shadow-sm dark:border-white/10 dark:bg-black/40">
        <p className="font-medium text-gray-900 dark:text-white">
          No transactions for this user yet.
        </p>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          When you create a deposit, withdrawal, or welcome bonus, it will
          appear here with full status control.
        </p>
      </div>
    );

  return (
    <div className="space-y-6 p-4 sm:p-5">
      {/* Stats row */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-black/30">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Net approved flow
          </p>
          <p className="mt-2 text-lg font-semibold text-emerald-600 dark:text-emerald-300">
            {summary.netFlow >= 0 ? "+" : "-"}$
            {Math.abs(summary.netFlow).toLocaleString()}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-black/30">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Approved inflows
          </p>
          <p className="mt-2 text-lg font-semibold text-primary">
            ${summary.totalIn.toLocaleString()}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-black/30">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Approved outflows
          </p>
          <p className="mt-2 text-lg font-semibold text-red-500 dark:text-red-400">
            ${summary.totalOut.toLocaleString()}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-black/30">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Transactions
          </p>
          <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
            {summary.totalCount}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {summary.approvedCount} approved,{" "}
            {summary.totalCount - summary.approvedCount} open
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white/80 shadow-sm backdrop-blur-sm dark:border-white/8 dark:bg-black/40">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 dark:border-white/10">
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              Transaction history
            </h2>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {filteredTransactions.length} item
              {filteredTransactions.length === 1 ? "" : "s"} matching your
              filters.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <Select
              options={typeFilterOptions}
              value={typeFilter}
              onValueChange={(val) => setTypeFilter(val)}
              className="min-w-[150px]"
            />
            <Select
              options={statusFilterToolbarOptions}
              value={statusFilter}
              onValueChange={(val) => setStatusFilter(val)}
              className="min-w-[150px]"
            />
          </div>
        </div>

        {/* Transactions Table */}
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[900px]">
            <Table>
              <TableHeader className="border-b border-gray-100 bg-gray-50/80 text-xs font-medium uppercase tracking-wide text-gray-500 dark:border-white/8 dark:bg-white/5">
                <TableRow>
                  <TableCell className="px-5 py-3 text-start">
                    Type (click to see receipt)
                  </TableCell>
                  <TableCell className="px-5 py-3 text-start">
                    Amount
                  </TableCell>
                  <TableCell className="px-5 py-3 text-start">
                    Method
                  </TableCell>
                  <TableCell className="px-5 py-3 text-start">
                    Status
                  </TableCell>
                  <TableCell className="px-5 py-3 text-start">
                    Created At
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 text-sm dark:divide-white/6">
                {filteredTransactions.map((tx) => (
                  <TableRow
                    key={tx.id}
                    className="bg-white hover:bg-gray-50/80 dark:bg-black/40 dark:hover:bg-white/5"
                  >
                    <TableCell className="px-5 py-4 text-start text-xs uppercase tracking-wide text-gray-900 dark:text-white">
                      {tx.photo ? (
                        <Link
                          className="text-primary underline-offset-2 hover:text-primary/80 hover:underline"
                          target="_blank"
                          href={tx.photo}
                        >
                          {tx.type}
                        </Link>
                      ) : (
                        tx.type
                      )}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-start text-sm text-gray-900 dark:text-white">
                      ${tx.amount.toLocaleString()}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-start text-[11px] uppercase tracking-wide text-gray-600 dark:text-gray-300">
                      {tx.method}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-start">
                      <div className="flex items-center gap-2">
                        <Badge
                          size="sm"
                          color={
                            tx.status === "approved"
                              ? "success"
                              : tx.status === "pending"
                              ? "warning"
                              : "primary"
                          }
                        >
                          {tx.status}
                        </Badge>
                        <Select
                          options={statusOptions}
                          value={tx.status}
                          onValueChange={(val) =>
                            handleStatusChange(tx.id, val)
                          }
                          className="min-w-[120px] text-xs"
                        />
                      </div>
                    </TableCell>

                    <TableCell className="px-5 py-4 text-start text-xs text-gray-600 dark:text-gray-300">
                      {new Date(tx.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 text-[11px] text-gray-500 dark:border-white/10 dark:text-gray-400">
          <span>
            Approving adds to balance (Deposits) or deducts from balance (Withdrawals).
          </span>
          <span className="hidden sm:inline">
            Reverting to Pending/Rejected reverses the balance change.
          </span>
        </div>
      </div>
    </div>
  );
}