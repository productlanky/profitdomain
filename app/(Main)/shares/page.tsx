"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  Rocket,
  Zap,
  BrainCircuit,
  Info,
  CheckCircle2,
  RefreshCw,
  Wallet,
  ArrowRightLeft
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchStockPrice, fetchTeslaPrice } from "@/lib/handlers/handler";
import { getUser } from "@/lib/appwrite/auth";
import {
  databases,
  DB_ID,
  PROFILE_COLLECTION_ID,
  STOCKLOG_COLLECTION_ID,
} from "@/lib/appwrite/client";
import { ID, Query } from "appwrite";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { Pickaxe } from "lucide-react";


type Company = "tesla" | "spaceX" | "neuralink" | "boring";


const COMPANIES = [
  { id: "tesla", name: "Tesla", ticker: "TSLA", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
  { id: "spaceX", name: "SpaceX", ticker: "SPX", icon: Rocket, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "neuralink", name: "Neuralink", ticker: "NRLK", icon: BrainCircuit, color: "text-purple-500", bg: "bg-purple-500/10" },
  {
    id: "boring",
    name: "The Boring Co.",
    ticker: "TBC",
    icon: Pickaxe, 
    color: "text-zinc-500",
    bg: "bg-zinc-500/10"
  },
];

export default function BuySharesPage() {
  const [company, setCompany] = useState<Company>("tesla");
  const [sharePrice, setSharePrice] = useState(0);
  const [quantity, setQuantity] = useState<number | "">("");
  const [amount, setAmount] = useState<number | "">("");
  const [balance, setBalance] = useState<number>(0);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"shares" | "amount">("shares");
  const [isLoading, setIsLoading] = useState(false);
  const [documentId, setDocumentId] = useState("");

  // --- CONFETTI ---
  const shootConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  // --- DATA LOADING ---
  const fetchBalance = async () => {
    try {
      const user = await getUser();
      const res = await databases.listDocuments(DB_ID, PROFILE_COLLECTION_ID, [Query.equal("userId", user.$id)]);
      if (res.total === 0) return;
      setBalance(res.documents[0].totalDeposit || 0);
      setDocumentId(res.documents[0].$id);
    } catch (err) {
      console.error("Balance Error:", err);
    }
  };

  const loadPrice = async () => {
    setSharePrice(0);
    resetValues();
    try {
      const price = company === "tesla" ? parseFloat(await fetchTeslaPrice()) : await fetchStockPrice(company);
      setSharePrice(price);
    } catch (err) {
      console.error("Price Error:", err);
    }
  };

  useEffect(() => { fetchBalance(); }, []);
  useEffect(() => { loadPrice(); }, [company]);

  // --- HELPERS ---
  const resetValues = () => {
    setQuantity("");
    setAmount("");
    setError("");
  };

  const handleSharesChange = (val: string) => {
    const shares = parseFloat(val);
    if (!isNaN(shares) && shares >= 0 && sharePrice > 0) {
      const total = shares * sharePrice;
      setQuantity(shares);
      setAmount(Number(total.toFixed(2)));
      if (total > balance) setError("Insufficient funds");
      else setError("");
    } else if (val === "") resetValues();
  };

  const handleAmountChange = (val: string) => {
    const dollars = parseFloat(val);
    if (!isNaN(dollars) && dollars >= 0 && sharePrice > 0) {
      const shares = dollars / sharePrice;
      setAmount(dollars);
      setQuantity(Number(shares.toFixed(4)));
      if (dollars > balance) setError("Insufficient funds");
      else setError("");
    } else if (val === "") resetValues();
  };

  const handleBuy = async () => {
    const qty = Number(quantity);
    const amt = Number(amount);
    if (!qty || !amt) return setError("Enter valid amount");
    if (amt > balance) return setError("Insufficient funds");

    try {
      setIsLoading(true);
      const user = await getUser();

      await databases.createDocument(DB_ID, STOCKLOG_COLLECTION_ID, ID.unique(), {
        userId: user.$id,
        shares: qty,
        amount: amt,
        pricePerShare: sharePrice,
        shareType: company,
      });

      const newBalance = balance - amt;
      await databases.updateDocument(DB_ID, PROFILE_COLLECTION_ID, documentId, { totalDeposit: newBalance });

      shootConfetti();
      setBalance(newBalance);
      toast.success(`Purchased ${qty} shares of ${company.toUpperCase()}`);
      resetValues();
    } catch (err) {
      toast.error("Transaction failed");
    } finally {
      setIsLoading(false);
    }
  };

  const currentCompany = COMPANIES.find(c => c.id === company)!;
  const numericAmount = Number(amount) || 0;

  return (
    <div className="flex justify-center py-8 animate-in fade-in duration-500">
      <div className="w-full max-w-6xl">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400 mb-2">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Equity Market</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Buy <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600 dark:from-brand-400 dark:to-purple-400">Shares</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-lg">
              Acquire fractional ownership in high-growth tech companies.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-3 rounded-2xl shadow-sm">
            <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Buying Power</p>
              <p className="text-lg font-mono font-bold text-gray-900 dark:text-white">
                ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8">

          {/* LEFT: CONTROLS */}
          <div className="space-y-8">

            {/* 1. Asset Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Select Asset</label>
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                {COMPANIES.map((c) => {
                  const isActive = company === c.id;
                  const Icon = c.icon;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setCompany(c.id as Company)}
                      className={`
                        relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-200
                        ${isActive
                          ? "bg-white dark:bg-white/10 border-brand-500 shadow-[0_0_0_2px_rgba(var(--brand-500),1)] scale-[1.02]"
                          : "bg-gray-50 dark:bg-white/5 border-transparent hover:bg-white dark:hover:bg-white/10 hover:border-gray-200 dark:hover:border-white/10"
                        }
                      `}
                    >
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${c.bg} ${c.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white text-sm">{c.name}</span>
                      <span className="text-[10px] font-mono text-gray-400">{c.ticker}</span>
                      {isActive && (
                        <div className="absolute top-2 right-2 text-brand-500">
                          <CheckCircle2 className="h-4 w-4 fill-current text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Order Inputs */}
            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[1.5rem] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${currentCompany.bg} ${currentCompany.color}`}>
                    <currentCompany.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      {currentCompany.name} <span className="text-xs font-normal text-gray-400">/ USD</span>
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      {sharePrice ? `$${sharePrice.toFixed(2)}` : <RefreshCw className="h-3 w-3 animate-spin" />} per share
                    </p>
                  </div>
                </div>

                {/* Mode Toggle */}
                <div className="flex bg-gray-100 dark:bg-white/10 p-1 rounded-xl">
                  <button
                    onClick={() => setMode("shares")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === "shares" ? "bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                  >
                    Shares
                  </button>
                  <button
                    onClick={() => setMode("amount")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === "amount" ? "bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                  >
                    USD
                  </button>
                </div>
              </div>

              <div className="relative">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1 mb-1.5 block">
                  {mode === "shares" ? "Quantity to Buy" : "Amount to Invest"}
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    value={mode === "shares" ? quantity : amount}
                    onChange={(e) => mode === "shares" ? handleSharesChange(e.target.value) : handleAmountChange(e.target.value)}
                    className="h-14 text-lg font-mono pl-4 pr-16 bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 focus:ring-brand-500 focus:border-brand-500 rounded-xl"
                    placeholder="0.00"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400 pointer-events-none">
                    {mode === "shares" ? currentCompany.ticker : "USD"}
                  </div>
                </div>

                {/* Conversion Display */}
                <div className="flex items-center justify-between mt-3 px-1">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <ArrowRightLeft className="h-3 w-3" />
                    {mode === "shares"
                      ? `≈ $${numericAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD`
                      : `≈ ${quantity || 0} Shares`
                    }
                  </div>
                  {mode === "amount" && (
                    <div className="flex gap-2">
                      {[0.25, 0.5, 1].map(p => (
                        <button
                          key={p}
                          onClick={() => {
                            const val = balance * p;
                            handleAmountChange(val.toString());
                          }}
                          className="text-[10px] font-bold bg-gray-100 dark:bg-white/10 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                        >
                          {p * 100}%
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium flex items-center justify-center animate-in fade-in slide-in-from-top-1">
                  {error}
                </div>
              )}

              {/* Action Button */}
              <Button
                onClick={handleBuy}
                disabled={isLoading || !amount || !!error}
                className="w-full mt-6 h-12 rounded-xl text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/20 transition-all active:scale-[0.98]"
              >
                {isLoading ? "Executing Order..." : "Confirm Purchase"}
              </Button>
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY (Ticket Style) */}
          <div className="relative">
            <div className="sticky top-24 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[1.5rem] p-6 shadow-xl overflow-hidden">

              {/* Ticket Decoration */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-500 via-purple-500 to-blue-500" />

              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                Order Summary
                <Info className="h-4 w-4 text-gray-400" />
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Market Price</span>
                  <span className="font-mono text-gray-900 dark:text-white font-medium">${sharePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Order Quantity</span>
                  <span className="font-mono text-gray-900 dark:text-white font-medium">{quantity || 0} {currentCompany.ticker}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Fees (0%)</span>
                  <span className="font-mono text-emerald-500 font-medium">Free</span>
                </div>

                <div className="my-4 border-t border-dashed border-gray-300 dark:border-white/20" />

                <div className="flex justify-between items-end">
                  <span className="text-gray-900 dark:text-white font-bold">Total Cost</span>
                  <span className="text-2xl font-mono font-bold text-brand-600 dark:text-brand-400">
                    ${numericAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-3 rounded-xl bg-gray-50 dark:bg-black/20 text-xs text-gray-500 dark:text-gray-400 leading-relaxed text-center">
                Prices are indicative. Actual execution price may vary slightly due to market volatility.
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}