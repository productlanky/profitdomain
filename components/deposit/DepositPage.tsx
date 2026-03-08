"use client";

import { Permission, Role } from "appwrite";
import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Copy,
  Clock,
  Lock,
  ArrowRight,
  CheckCircle2,
  Bitcoin,
  Landmark,
  CreditCard,
  UploadCloud,
  ChevronLeft,
  ShieldCheck,
  Loader2,
  Wallet,
  Receipt
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/appwrite/auth";
import {
  databases,
  DB_ID,
  RECEIPTS_BUCKET,
  storage,
  TRANSACTION_COLLECTION,
} from "@/lib/appwrite/client";
import { ID } from "appwrite";

type StepType = "form" | "method" | "countdown";

const METHODS = [
  { value: "bitcoin", label: "Bitcoin", icon: Bitcoin, desc: "Instant • Low Fees" },
  { value: "bank", label: "Bank Transfer", icon: Landmark, desc: "2-3 Business Days" },
  { value: "paypal", label: "PayPal", icon: CreditCard, desc: "Instant Connection" },
];

const PRESET_AMOUNTS = [100, 500, 1000, 5000];

export default function DepositPage() {
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<StepType>("form");
  const [countdown, setCountdown] = useState(1800); // 30 min
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  const router = useRouter();
  const bitcoinAddress = process.env.NEXT_PUBLIC_BITCOIN_ADDRESS || "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh";

  useEffect(() => {
    if (step === "countdown" && countdown > 0) {
      const interval = setInterval(() => setCountdown((c) => c - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [step, countdown]);

  const handleStartDeposit = () => {
    if (!amount || parseFloat(amount) < 100) {
      toast.error("Minimum deposit is $100");
      return;
    }
    setStep("method");
  };

  const confirmMethod = async () => {
    try {
      if (!paymentMethod) {
        toast.error("Select a payment method.");
        return;
      }

      const user = await getUser();
      if (!user?.$id) return;

      const transaction = await databases.createDocument(
        DB_ID,
        TRANSACTION_COLLECTION,
        ID.unique(),
        {
          userId: user.$id,
          type: "deposit",
          amount: parseFloat(amount),
          status: "pending",
          method: paymentMethod,
        },
        [Permission.read(Role.any()), Permission.write(Role.any())]
      );

      setTransactionId(transaction.$id);
      setStep("countdown");
    } catch (error) {
      console.error(error);
      toast.error("Failed to start deposit.");
    }
  };

  const handleUpload = async (file: File) => {
    try {
      const user = await getUser();
      if (!file || !transactionId || !user?.$id) return;

      setIsUploading(true);

      const uploadedFile = await storage.createFile(
        RECEIPTS_BUCKET,
        `receipt-${transactionId}`,
        file
      );

      const publicUrl = storage.getFileView(RECEIPTS_BUCKET, uploadedFile.$id);

      await databases.updateDocument(
        DB_ID,
        TRANSACTION_COLLECTION,
        transactionId,
        { photoUrl: publicUrl },
        [Permission.read(Role.any()), Permission.write(Role.any())]
      );

      toast.success("Deposit submitted for review!");
      router.push("/transactions");
    } catch (error) {
      console.error("Error uploading receipt:", error);
      toast.error("Error uploading receipt.");
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setReceiptFile(acceptedFiles[0]);
        handleUpload(acceptedFiles[0]);
      }
    },
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const copyBitcoinAddress = () => {
    navigator.clipboard.writeText(bitcoinAddress);
    toast.success("Bitcoin address copied!");
  };

  const prettyTime = `${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, "0")}`;

  return (
    <div className="flex justify-center py-8 min-h-screen animate-in fade-in duration-500">
      <div className="w-full max-w-5xl">

        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add Funds</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Securely deposit capital into your wallet.</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 px-3 py-1.5 rounded-full text-xs font-medium text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            Secure Gateway
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8">

          {/* LEFT: INTERACTIVE PANEL */}
          <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2rem] p-8 shadow-sm relative overflow-hidden">
            <AnimatePresence mode="wait">

              {/* STEP 1: AMOUNT */}
              {step === "form" && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Deposit Amount</label>
                    <div className="group relative mt-10 flex items-center justify-center border-b-2 border-gray-100 py-4 transition-all duration-300 focus-within:border-brand-500 dark:border-white/10">

                      {/* Dollar Sign */}
                      <span className="mr-2 text-4xl font-medium text-gray-300 transition-colors group-focus-within:text-brand-500/50 dark:text-white/20">
                        $
                      </span>

                      {/* Input Field */}
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="
      h-auto w-full max-w-[320px] border-none bg-transparent p-0 
      text-center text-6xl! font-bold tracking-tight text-gray-900 
      placeholder:text-gray-200 focus-visible:ring-0 
      dark:text-white dark:placeholder:text-white/10
      caret-brand-500 shadow-none dark:shadow-none
      [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
    "
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    {PRESET_AMOUNTS.map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setAmount(amt.toString())}
                        className="py-3 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={handleStartDeposit}
                      className="w-full h-14 rounded-xl text-lg font-semibold bg-brand-600 hover:bg-brand-700 text-white"
                    >
                      Choose Payment Method
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: METHOD */}
              {step === "method" && (
                <motion.div
                  key="method"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <button
                    onClick={() => setStep("form")}
                    className="flex items-center text-sm text-gray-500 hover:text-brand-600 transition-colors mb-4"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Back to Amount
                  </button>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Select Payment Method</h3>

                  <div className="space-y-3">
                    {METHODS.map((method) => {
                      const Icon = method.icon;
                      const active = paymentMethod === method.value;
                      return (
                        <div
                          key={method.value}
                          onClick={() => setPaymentMethod(method.value)}
                          className={`
                            group flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all duration-200
                            ${active
                              ? "bg-brand-50 dark:bg-brand-500/20 border-brand-500 shadow-md"
                              : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-brand-300 dark:hover:border-white/20"
                            }
                          `}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`
                              h-12 w-12 rounded-xl flex items-center justify-center
                              ${active ? "bg-brand-500 text-white" : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400"}
                            `}>
                              <Icon className="h-6 w-6" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white">{method.label}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{method.desc}</p>
                            </div>
                          </div>
                          <div className={`
                            w-6 h-6 rounded-full border-2 flex items-center justify-center
                            ${active ? "border-brand-500 bg-brand-500" : "border-gray-300 dark:border-white/20"}
                          `}>
                            {active && <CheckCircle2 className="h-4 w-4 text-white" />}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <Button
                    onClick={confirmMethod}
                    disabled={!paymentMethod}
                    className="w-full h-14 rounded-xl text-lg font-semibold bg-brand-600 hover:bg-brand-700 text-white mt-4"
                  >
                    Confirm & Pay
                  </Button>
                </motion.div>
              )}

              {/* STEP 3: UPLOAD */}
              {step === "countdown" && (
                <motion.div
                  key="countdown"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="text-center pb-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-sm font-bold">
                      <Clock className="h-4 w-4" /> Expires in {prettyTime}
                    </div>
                  </div>

                  {paymentMethod === 'bitcoin' && (
                    <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-5 border border-gray-200 dark:border-white/10 text-center">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Send Payment To</p>
                      <div className="flex items-center justify-center gap-2 bg-white dark:bg-black/40 p-3 rounded-xl border border-gray-200 dark:border-white/10 mb-4">
                        <code className="text-sm font-mono text-brand-600 dark:text-brand-400 break-all">{bitcoinAddress}</code>
                        <button onClick={copyBitcoinAddress} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                          <Copy className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">Only send Bitcoin (BTC) to this address.</p>
                    </div>
                  )}

                  <div
                    {...getRootProps()}
                    className={`
                      relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all
                      ${isDragActive
                        ? "border-brand-500 bg-brand-50/50"
                        : "border-gray-300 dark:border-white/20 hover:border-brand-400 hover:bg-gray-50 dark:hover:bg-white/5"
                      }
                    `}
                  >
                    <input {...getInputProps()} />
                    {isUploading ? (
                      <div className="py-6">
                        <Loader2 className="h-10 w-10 text-brand-500 animate-spin mx-auto mb-3" />
                        <p className="font-semibold text-gray-900 dark:text-white">Verifying Transaction...</p>
                      </div>
                    ) : receiptFile ? (
                      <div className="py-2">
                        <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                          <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <p className="font-bold text-gray-900 dark:text-white">{receiptFile.name}</p>
                        <p className="text-sm text-emerald-600 mt-1">Ready to upload</p>
                      </div>
                    ) : (
                      <div className="py-2">
                        <div className="h-12 w-12 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-500">
                          <UploadCloud className="h-6 w-6" />
                        </div>
                        <p className="font-bold text-gray-900 dark:text-white">Upload Payment Receipt</p>
                        <p className="text-xs text-gray-500 mt-1">Drag and drop or click to browse</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* RIGHT: LIVE RECEIPT */}
          <div className="bg-gray-900 text-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between h-full min-h-[400px]">
            {/* Background Texture */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 blur-[80px] rounded-full pointer-events-none" />

            <div>
              <div className="flex items-center gap-2 text-white/50 mb-8">
                <Receipt className="h-5 w-5" />
                <span className="text-sm font-medium tracking-wider uppercase">Transaction Summary</span>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-sm text-white/60 mb-1">Total Deposit</p>
                  <p className="text-4xl font-mono font-bold tracking-tight">
                    ${amount ? parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2 }) : "0.00"}
                  </p>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/10">
                  <div className="flex justify-between">
                    <span className="text-white/60 text-sm">Status</span>
                    <span className="text-brand-400 font-semibold text-sm">Initiated</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60 text-sm">Method</span>
                    <span className="text-white font-medium text-sm capitalize">
                      {paymentMethod ? METHODS.find(m => m.value === paymentMethod)?.label : "--"}
                    </span>
                  </div>
                  {transactionId && (
                    <div className="flex justify-between">
                      <span className="text-white/60 text-sm">Ref ID</span>
                      <span className="text-white/80 font-mono text-xs">{transactionId.substring(0, 8)}...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 text-xs text-white/40 leading-relaxed">
              <p>Funds will be available in your wallet immediately after confirmation. Please upload a clear screenshot of your transfer for faster processing.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}