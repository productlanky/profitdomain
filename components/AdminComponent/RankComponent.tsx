"use client";

import { useState } from "react";
import {
  ShieldAlert,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  UserCog,
} from "lucide-react";
import { databases, DB_ID, PROFILE_COLLECTION_ID } from "@/lib/appwrite/client";
import { cn } from "@/lib/utils";

interface AdminRankManagerProps {
  docId: string; // The Appwrite document ID
  initialTier: number;
  initialStatus: string;
  initialWarning: boolean;
  onUpdate: (updates: {
    tier_level: number;
    account_status: string;
    rank_warning: boolean;
  }) => void;
}

export default function AdminRankManager({
  docId,
  initialTier,
  initialStatus,
  initialWarning,
  onUpdate,
}: AdminRankManagerProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [tierLevel, setTierLevel] = useState<number>(initialTier);
  const [accountStatus, setAccountStatus] = useState<string>(initialStatus);
  const [rankWarning, setRankWarning] = useState<boolean>(initialWarning);

  const tierOptions = [
    { level: 1, name: "Silver" },
    { level: 2, name: "Premium" },
    { level: 3, name: "Diamond" },
    { level: 4, name: "Ruby" },
  ];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "reviewing_upgrade", label: "Reviewing Upgrade" },
    { value: "dormant", label: "Dormant (Restricted)" },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      await databases.updateDocument(
        DB_ID,
        PROFILE_COLLECTION_ID,
        docId, // The Document ID passed from the parent
        {
          tierLevel: Number(tierLevel),
          accountStatus,
          rankWarning,
        },
      );

      setSuccessMsg("User rank and status updated successfully.");

      // Notify parent component to update UI state instantly
      onUpdate({
        tier_level: Number(tierLevel),
        account_status: accountStatus,
        rank_warning: rankWarning,
      });

      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error: any) {
      console.error("Error updating profile rank:", error);
      setErrorMsg(error.message || "Failed to update user profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center gap-3">
        <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
          <UserCog className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">
            Rank & Account Control
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Manage tier level, status, and warnings.
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between p-4 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/50">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 mt-0.5 text-amber-600 dark:text-amber-500" />
            <div>
              <p className="font-semibold text-amber-900 dark:text-amber-100">
                Trigger Rank Warning
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400/80 mt-1">
                Show the "Action Required: Upgrade" banner on the user's
                dashboard.
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={rankWarning}
              onChange={(e) => setRankWarning(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-500"></div>
          </label>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              User Tier Level
            </label>
            <select
              value={tierLevel}
              onChange={(e) => setTierLevel(Number(e.target.value))}
              className="w-full bg-transparent border border-border text-gray-900 dark:text-white text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3 transition-colors"
            >
              {tierOptions.map((tier) => (
                <option
                  key={tier.level}
                  value={tier.level}
                  className="dark:bg-zinc-900"
                >
                  Level {tier.level} - {tier.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Account Status
            </label>
            <select
              value={accountStatus}
              onChange={(e) => setAccountStatus(e.target.value)}
              className="w-full bg-transparent border border-border text-gray-900 dark:text-white text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3 transition-colors"
            >
              {statusOptions.map((status) => (
                <option
                  key={status.value}
                  value={status.value}
                  className="dark:bg-zinc-900"
                >
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {successMsg && (
          <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-lg border border-emerald-200 dark:border-emerald-500/20">
            <CheckCircle2 className="h-4 w-4" /> {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 p-3 rounded-lg border border-red-200 dark:border-red-500/20">
            <AlertCircle className="h-4 w-4" /> {errorMsg}
          </div>
        )}
      </div>

      <div className="px-6 py-4 bg-gray-50/50 dark:bg-white/5 border-t border-border flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm",
            isSaving && "opacity-70 cursor-not-allowed",
          )}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isSaving ? "Saving Changes..." : "Save Configuration"}
        </button>
      </div>
    </div>
  );
}
