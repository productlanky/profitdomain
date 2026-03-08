"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { validate as validateBitcoin } from "bitcoin-address-validation"; 
import { useRouter } from "next/navigation";
import { 
  ArrowRight, 
  Wallet, 
  Landmark, 
  Bitcoin, 
  CreditCard, 
  Lock, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2,
  ChevronLeft,
  Loader2,
  Receipt
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/appwrite/auth";
import {
  databases,
  DB_ID,
  NOTIFICATION_COLLECTION,
  PROFILE_COLLECTION_ID,
  TRANSACTION_COLLECTION,
  STOCKLOG_COLLECTION_ID, 
} from "@/lib/appwrite/client";
import { ID, Permission, Query, Role } from "appwrite";

// --- TYPES ---
type Tier = {
  level: string;
  min_referrals: number;
  deposit_required: number;
};

type Profile = {
  id: string;
  profileId: string;
  balance?: number;
  withdrawal_password?: string;
  tiers?: Tier[];
  kycStatus?: string;
  totalDeposit: number;
  profit: number;
  withdrawalLimit?: number;
};

type StockLog = {
  id: string;
  amount: number;
  status: string;
};

type WithdrawFormFields = {
  amount: string;
  method: "BTC" | "BANK" | "PAYPAL";
  address?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  paypalEmail?: string;
  password: string;
};

const METHODS = [
  { value: "BTC", label: "Bitcoin", icon: Bitcoin, desc: "Instant • Network Fee" },
  { value: "BANK", label: "Bank Transfer", icon: Landmark, desc: "2-5 Business Days" },
  { value: "PAYPAL", label: "PayPal", icon: CreditCard, desc: "Instant • 2% Fee" },
];

export default function WithdrawPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState<1 | 2>(1); // 1 = Amount/Method, 2 = Details/Confirm

  const router = useRouter();
  
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue,
    control,
    formState: { errors, isSubmitting } 
  } = useForm<WithdrawFormFields>({
    defaultValues: { method: "BTC", amount: "" }
  });

  const watchAmount = watch("amount");
  const watchMethod = watch("method");

  // --- DATA LOADING ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUser();
        if (!user) return;

        // 1. Profile
        const profileRes = await databases.listDocuments(
          DB_ID, 
          PROFILE_COLLECTION_ID, 
          [Query.equal("userId", user.$id)]
        );
        
        if (!profileRes.documents.length) return toast.error("Profile not found");
        const p = profileRes.documents[0];

        // 2. Stock Logs (to calc equity)
        const logsRes = await databases.listDocuments(
          DB_ID, 
          STOCKLOG_COLLECTION_ID, 
          [Query.equal("userId", user.$id)]
        );

        const stockValue = logsRes.documents.reduce((sum, log) => {
          return (log.status === "successful" || log.status === "success") 
            ? sum + (log.amount || 0) : sum;
        }, 0);

        // 3. Calc Balance
        const total = (p.totalDeposit || 0) + stockValue + (p.profit || 0);

        setProfile({
          id: user.$id,
          profileId: p.$id,
          withdrawal_password: p.withdrawalPassword,
          kycStatus: p.kycStatus,
          totalDeposit: p.totalDeposit,
          profit: p.profit,
          withdrawalLimit: p.withdrawalLimit
        });
        setAvailableBalance(total);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- SUBMIT HANDLER ---
  const onSubmit = async (data: WithdrawFormFields) => {
    if (!profile) return;

    // VALIDATION
    if (profile.kycStatus !== "approved") return toast.error("KYC verification required");
    if (!profile.withdrawal_password) return toast.error("Set withdrawal password in profile");
    if (data.password !== profile.withdrawal_password) return toast.error("Incorrect password");
    
    const amt = parseFloat(data.amount);
    if (amt > availableBalance) return toast.error("Insufficient balance");
    if (profile.withdrawalLimit && amt > profile.withdrawalLimit) return toast.error(`Limit exceeded ($${profile.withdrawalLimit})`);

    if (data.method === "BTC" && data.address && !validateBitcoin(data.address)) {
      return toast.error("Invalid Bitcoin address");
    }

    try {
      // 1. Transaction
      await databases.createDocument(
        DB_ID, 
        TRANSACTION_COLLECTION, 
        ID.unique(), 
        {
          userId: profile.id,
          type: "withdrawal",
          method: data.method,
          amount: amt,
          status: "pending",
          // Store details in a structured way or add fields to your collection if needed
          details: JSON.stringify({
            address: data.address,
            bank: data.bankName,
            account: data.accountNumber,
            paypal: data.paypalEmail
          })
        },
        [Permission.read(Role.any()), Permission.write(Role.any())]
      );

      // 2. Notification
      await databases.createDocument(
        DB_ID, 
        NOTIFICATION_COLLECTION, 
        ID.unique(), 
        {
          userId: profile.id,
          title: "Withdrawal Pending",
          message: `Your request for $${amt} via ${data.method} has been received.`,
          type: "withdrawal",
        },
        [Permission.read(Role.any()), Permission.write(Role.any())]
      );

      // 3. Deduct from Profile (Profit first logic, or generic balance)
      // Note: Adjust this logic based on your specific balance deduction rules
      await databases.updateDocument(
        DB_ID, 
        PROFILE_COLLECTION_ID, 
        profile.profileId, 
        { profit: Math.max(0, (profile.profit || 0) - amt) } 
      );

      toast.success("Withdrawal request submitted successfully");
      router.push("/transactions");
    } catch (err) {
      console.error(err);
      toast.error("Failed to process withdrawal");
    }
  };

  const nextStep = () => {
    const amt = parseFloat(watchAmount);
    if (!amt || amt <= 0) return toast.error("Enter a valid amount");
    if (amt > availableBalance) return toast.error("Insufficient funds");
    setStep(2);
  };

  return (
    <div className="flex justify-center py-8 min-h-screen animate-in fade-in duration-500">
      <div className="w-full max-w-6xl">
        
        {/* HEADER */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Withdraw Funds</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Transfer earnings to your external account.</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 px-3 py-1.5 rounded-full text-xs font-medium text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            Secure Channel
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8">
          
          {/* LEFT: FORM AREA */}
          <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2rem] p-8 shadow-sm relative overflow-hidden min-h-[500px]">
            
            {/* ALERT BANNER */}
            {profile && (profile.kycStatus !== 'approved' || !profile.withdrawal_password) && (
              <div className="absolute top-0 left-0 right-0 bg-amber-500/10 border-b border-amber-500/20 px-6 py-3 flex items-center gap-3 text-sm text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>
                  {profile.kycStatus !== 'approved' ? "KYC verification required." : "Withdrawal password not set."} 
                  Please update your profile.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="pt-6">
              <AnimatePresence mode="wait">
                
                {/* STEP 1: AMOUNT & METHOD */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    {/* Amount Input */}
                    <div>
                      <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Amount to withdraw</label>
                      <div className="group relative mt-4 flex items-center justify-center border-b-2 border-gray-100 py-4 transition-all duration-300 focus-within:border-brand-500 dark:border-white/10">
                        <span className="mr-2 text-4xl font-medium text-gray-300 transition-colors group-focus-within:text-brand-500/50 dark:text-white/20">$</span>
                        <Input
                          {...register("amount", { required: true, min: 10 })}
                          type="number"
                          placeholder="0.00"
                          autoFocus
                          className="
                            h-auto w-full max-w-[320px] border-none bg-transparent! p-0 
                            text-center text-6xl! font-bold tracking-tight text-gray-900 
                            placeholder:text-gray-200 focus-visible:ring-0 
                            dark:text-white dark:placeholder:text-white/10
                            caret-brand-500 shadow-none
                            [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
                          "
                        />
                      </div>
                      <div className="mt-4 flex justify-center gap-2">
                        {[25, 50, 100].map(pct => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => setValue("amount", (availableBalance * (pct/100)).toFixed(2))}
                            className="px-3 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-brand-500 hover:text-white transition-colors"
                          >
                            {pct}%
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Method Grid */}
                    <div>
                      <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider mb-4 block">Select Destination</label>
                      <div className="grid gap-3">
                        {METHODS.map((m) => {
                          const Icon = m.icon;
                          const isSelected = watchMethod === m.value;
                          return (
                            <div
                              key={m.value}
                              onClick={() => setValue("method", m.value as any)}
                              className={`
                                cursor-pointer flex items-center justify-between p-4 rounded-xl border transition-all
                                ${isSelected 
                                  ? "bg-brand-50 dark:bg-brand-500/10 border-brand-500 ring-1 ring-brand-500" 
                                  : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-brand-300"
                                }
                              `}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${isSelected ? 'bg-brand-500 text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-500'}`}>
                                  <Icon className="h-5 w-5" />
                                </div>
                                <div>
                                  <p className="font-bold text-sm text-gray-900 dark:text-white">{m.label}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{m.desc}</p>
                                </div>
                              </div>
                              {isSelected && <CheckCircle2 className="h-5 w-5 text-brand-500" />}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <Button 
                      type="button" 
                      onClick={nextStep}
                      className="w-full h-12 rounded-xl text-base font-semibold bg-brand-600 hover:bg-brand-700 text-white"
                    >
                      Next Step <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                )}

                {/* STEP 2: DETAILS & CONFIRM */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <button 
                      type="button" 
                      onClick={() => setStep(1)}
                      className="flex items-center text-sm text-gray-500 hover:text-brand-600 transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" /> Change Amount
                    </button>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Account Details</h3>

                    {/* DYNAMIC FIELDS BASED ON METHOD */}
                    <div className="space-y-4">
                      
                      {watchMethod === 'BTC' && (
                        <div>
                          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Bitcoin Wallet Address</label>
                          <Input 
                            {...register("address", { required: true })} 
                            placeholder="bc1..." 
                            className="mt-2 h-12 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10" 
                          />
                        </div>
                      )}

                      {watchMethod === 'BANK' && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Bank Name</label>
                              <Input {...register("bankName", { required: true })} className="mt-2 h-12 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10" />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Account Number</label>
                              <Input {...register("accountNumber", { required: true })} className="mt-2 h-12 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10" />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Account Name</label>
                            <Input {...register("accountName", { required: true })} className="mt-2 h-12 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10" />
                          </div>
                        </>
                      )}

                      {watchMethod === 'PAYPAL' && (
                        <div>
                          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">PayPal Email</label>
                          <Input 
                            {...register("paypalEmail", { required: true })} 
                            type="email" 
                            placeholder="user@example.com" 
                            className="mt-2 h-12 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10" 
                          />
                        </div>
                      )}

                      <div className="pt-4 border-t border-gray-100 dark:border-white/10">
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex justify-between">
                          Withdrawal Password
                          <span className="text-xs font-normal text-gray-400">Required</span>
                        </label>
                        <div className="relative mt-2">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input 
                            type="password" 
                            {...register("password", { required: true })}
                            className="h-12 pl-10 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10"
                            placeholder="Enter secure PIN"
                          />
                        </div>
                      </div>

                    </div>

                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full h-14 rounded-xl text-lg font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/20 mt-4"
                    >
                      {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Confirm Withdrawal"}
                    </Button>
                  </motion.div>
                )}

              </AnimatePresence>
            </form>
          </div>

          {/* RIGHT: SUMMARY PANEL */}
          <div className="bg-gray-900 rounded-[2rem] p-8 text-white relative overflow-hidden flex flex-col h-full shadow-2xl">
            {/* Background Texture */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-2 text-white/50 mb-8">
                <Receipt className="h-5 w-5" />
                <span className="text-sm font-medium tracking-wider uppercase">Payout Summary</span>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-sm text-white/60">Total Withdrawal</span>
                  <span className="text-3xl font-mono font-bold tracking-tight">
                    ${watchAmount ? parseFloat(watchAmount).toLocaleString(undefined, {minimumFractionDigits: 2}) : "0.00"}
                  </span>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/10">
                  <div className="flex justify-between">
                    <span className="text-white/60 text-sm">Fees</span>
                    <span className="text-emerald-400 font-medium text-sm">$0.00 (Covered)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60 text-sm">Method</span>
                    <span className="text-white font-medium text-sm">
                      {METHODS.find(m => m.value === watchMethod)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60 text-sm">Estimated Arrival</span>
                    <span className="text-white font-medium text-sm">
                      {METHODS.find(m => m.value === watchMethod)?.desc.split("•")[0]}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-auto pt-8">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white/70 uppercase">Available Balance</span>
                  <Wallet className="h-4 w-4 text-white/40" />
                </div>
                <p className="text-xl font-bold font-mono">
                  ${availableBalance.toLocaleString(undefined, {minimumFractionDigits: 2})}
                </p>
                {watchAmount && parseFloat(watchAmount) > availableBalance && (
                  <p className="text-xs text-red-400 mt-1 font-medium flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Insufficient Funds
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}