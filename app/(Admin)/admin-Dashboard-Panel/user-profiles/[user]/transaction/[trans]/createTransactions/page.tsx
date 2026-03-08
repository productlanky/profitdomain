"use client";

import React, { use, useState } from "react";
import { toast } from "sonner";
import {
  databases,
  DB_ID,
  NOTIFICATION_COLLECTION,
  PROFILE_COLLECTION_ID,
  TRANSACTION_COLLECTION,
} from "@/lib/appwrite/client";
import { ID, Query } from "appwrite";
import { useRouter } from "next/navigation";
import Select from "@/components/withdrawal/Select";
import { Button } from "@/components/ui/button";
import Input from "@/components/withdrawal/InputField";
import { ArrowLeft, CreditCard, CheckCircle2, WalletIcon } from "lucide-react";

const METHODS = [
  { value: "bitcoin", label: "Bitcoin" },
  { value: "bank", label: "Bank Transfer" },
  { value: "paypal", label: "PayPal" },
];

const TYPES = [
  { value: "deposit", label: "Deposit" },
  { value: "withdrawal", label: "Withdrawal" },
];

const STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function CreateTransactionPage({
  params,
}: {
  params: Promise<{ user: string; trans: string }>;
}) {
  const { user, trans } = use(params);
  const router = useRouter();

  const [userId, setUserId] = useState(trans);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleCreate = async () => {
    if (!userId || !amount || !method || !type || !status) {
      toast.error("All fields are required");
      return;
    }

    try {
      setIsSaving(true);

      await databases.createDocument(
        DB_ID,
        TRANSACTION_COLLECTION,
        ID.unique(),
        {
          userId,
          amount: parseFloat(amount),
          method,
          type,
          status,
        }
      );

      // Build notification message
      let message = "";
      if (type === "deposit") {
        if (status === "pending")
          message = `Your deposit of $${amount} is pending.`;
        if (status === "approved")
          message = `Your deposit of $${amount} has been approved.`;
        if (status === "rejected")
          message = `Your deposit of $${amount} was rejected.`;
      } else if (type === "withdrawal") {
        if (status === "pending")
          message = `Your withdrawal of $${amount} is pending.`;
        if (status === "approved")
          message = `Your withdrawal of $${amount} has been approved.`;
        if (status === "rejected")
          message = `Your withdrawal of $${amount} was rejected.`;
      }

      await databases.createDocument(
        DB_ID,
        NOTIFICATION_COLLECTION,
        ID.unique(),
        {
          userId,
          title: `${type.charAt(0).toUpperCase() + type.slice(1)} ${status}`,
          message,
          type,
        }
      );

      // Update user balance only if approved
      if (status === "approved") {
        const profileRes = await databases.listDocuments(
          DB_ID,
          PROFILE_COLLECTION_ID,
          [Query.equal("userId", userId)]
        );

        const userDoc: any = profileRes.documents[0];
        const currentDeposit = Number(userDoc.totalDeposit) || 0;
        const numericAmount = parseFloat(amount);

        const newDeposit =
          type === "deposit"
            ? currentDeposit + numericAmount
            : currentDeposit - numericAmount;

        await databases.updateDocument(DB_ID, PROFILE_COLLECTION_ID, user, {
          totalDeposit: newDeposit,
        });
      }

      toast.success("Transaction created and notification sent");

      setAmount("");
      setMethod("");
      setType("");
      setStatus("");
      router.back();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create transaction");
    } finally {
      setIsSaving(false);
    }
  };

  const isFormFilled = !!amount && !!method && !!type && !!status;

  return (
    <div className="mx-auto mt-10 max-w-xl px-4 pb-12">
      {/* Top bar / back */}
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-4 inline-flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to user overview
      </button>

      <div className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-black/40 sm:p-7">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-200">
              <CreditCard className="h-3.5 w-3.5" />
              Admin · Manual transaction
            </div>
            <h1 className="mt-3 text-xl font-semibold text-gray-900 dark:text-white">
              Create Transaction
            </h1>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Add a deposit or withdrawal for this user. Balance is only updated
              when the status is <span className="font-semibold">Approved</span>.
            </p>
          </div>

          <div className="hidden rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-right text-[11px] text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-400 sm:block">
            <p className="font-medium text-gray-700 dark:text-gray-200">
              User ID
            </p>
            <p className="mt-0.5 truncate font-mono text-[11px] text-gray-600 dark:text-gray-300">
              {trans}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {/* User ID */}
          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              User ID
            </label>
            <Input
              placeholder="Enter User ID"
              value={trans}
              readonly
              defaultValue={trans}
              onChange={(e) => setUserId(e.target.value)}
            />
            <p className="text-[11px] text-gray-400 dark:text-gray-500">
              This is the internal user ID the transaction will be linked to.
            </p>
          </div>

          {/* Amount & Type */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Amount (USD)
              </label>
              <Input
                type="number"
                value={amount}
                placeholder="0.00"
                onChange={(e) => setAmount(e.target.value)}
              />
              <p className="text-[11px] text-gray-400 dark:text-gray-500">
                Enter the exact amount in US dollars.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Transaction Type
              </label>
              <Select
                value={type}
                onValueChange={(value) => setType(value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-black"
                options={TYPES}
              />
              <p className="text-[11px] text-gray-400 dark:text-gray-500">
                Choose whether this is a deposit or withdrawal.
              </p>
            </div>
          </div>

          {/* Method & Status */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Payment Method
              </label>
              <Select
                value={method}
                onValueChange={(value) => setMethod(value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-black"
                options={METHODS}
              />
              <p className="text-[11px] text-gray-400 dark:text-gray-500">
                How the user is sending or receiving funds.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Status
              </label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-black"
                options={STATUSES}
              />
              <p className="text-[11px] text-gray-400 dark:text-gray-500">
                Only <span className="font-semibold">Approved</span> will update
                the user&apos;s balance.
              </p>
            </div>
          </div>

          {/* Summary pill */}
          <div className="mt-2 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-medium text-gray-700 shadow-sm dark:bg-black/60 dark:text-gray-200">
                <Wallet className="h-3.5 w-3.5" />
                User: <span className="font-mono">{userId}</span>
              </div>
              {amount && (
                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                  Amount: ${amount}
                </span>
              )}
              {type && (
                <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-200">
                  Type: {type}
                </span>
              )}
              {status && (
                <span className="inline-flex rounded-full bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-700 dark:bg-slate-500/10 dark:text-slate-200">
                  Status: {status}
                </span>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>
                A notification will be sent to the user automatically.
              </span>
            </div>

            <Button
              onClick={handleCreate}
              className="mt-2 w-full rounded-full sm:mt-0 sm:w-auto"
              disabled={isSaving || !isFormFilled}
            >
              {isSaving ? "Saving..." : "Create Transaction"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Wallet(props: React.SVGProps<SVGSVGElement>) {
  // tiny helper icon (or you can reuse lucide WalletIcon if you prefer)
  return <WalletIcon {...props} />;
}
