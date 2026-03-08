"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
// import dynamic from "next/dynamic";
import {
    ArrowUpRight,
    ArrowDownLeft,
    Wallet,
    TrendingUp,
    Users,
    ChevronRight,
    PieChart,
    ShieldCheck,
    Zap,
    Globe,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/appwrite/auth";
import {
    databases,
    DB_ID,
    INVESTMENT_COLLECTION,
    PROFILE_COLLECTION_ID,
    TRANSACTION_COLLECTION,
    STOCKLOG_COLLECTION_ID
} from "@/lib/appwrite/client";
import { Query } from "appwrite";
import { tierList } from "@/lib/data/info";
import { fetchTeslaPrice, fetchStockPrice } from "@/lib/handlers/handler";
import { useTheme } from "@/context/ThemeContext";
import CopyLinkInput from "@/components/ui/CopyLinkInput";
import TradingViewTicker from "../tradingview/TradingViewTicker";

// Dynamic Imports
// const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [metrics, setMetrics] = useState({
        balance: 0,
        profit: 0,
        deposits: 0,
        stockValue: 0,
        referrals: 0,
        activeInvestments: 0
    });
    const [tierName, setTierName] = useState("Member");
    const [referralLink, setReferralLink] = useState("");

    useEffect(() => {
        const init = async () => {
            try {
                const user = await getUser();
                if (!user) return;

                // 1. Profile
                const profileRes = await databases.listDocuments(
                    DB_ID, PROFILE_COLLECTION_ID, [Query.equal("userId", user.$id)]
                );
                const profile = profileRes.documents[0];
                setUserProfile(profile);

                // Set referral link
                const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yourapp.com";
                setReferralLink(`${baseUrl}/signup?ref=${profile?.refereeId}`);

                // 2. Financials
                const [depositsRes, investmentsRes, referralsRes, stockLogsRes] = await Promise.all([
                    databases.listDocuments(DB_ID, TRANSACTION_COLLECTION, [
                        Query.equal("userId", user.$id),
                        Query.equal("type", "deposit"),
                        Query.equal("status", "approved"),
                    ]),
                    databases.listDocuments(DB_ID, INVESTMENT_COLLECTION, [
                        Query.equal("userId", user.$id),
                        Query.equal("status", "active"),
                    ]),
                    databases.listDocuments(DB_ID, PROFILE_COLLECTION_ID, [
                        Query.equal("referredBy", profile?.refereeId || ""),
                    ]),
                    databases.listDocuments(DB_ID, STOCKLOG_COLLECTION_ID, [
                        Query.equal("userId", user.$id),
                    ])
                ]);

                // Calculate Totals
                const totalDeposit = depositsRes.documents.reduce((acc, tx) => acc + (Number(tx.amount) || 0), 0);
                const profit = Number(profile?.profit) || 0;

                // Live Stock Value
                let teslaPrice = 0;
                let spxPrice = 0;
                let nrlkPrice = 0;

                try {
                    teslaPrice = parseFloat(await fetchTeslaPrice()) || 0;
                    spxPrice = await fetchStockPrice("spacex");
                    nrlkPrice = await fetchStockPrice("neuralink");
                } catch (e) {
                    console.error("Stock price fetch error", e);
                }

                let stockVal = 0;
                stockLogsRes.documents.forEach((log: any) => {
                    const type = log.shareType?.toLowerCase();
                    const price = type?.includes('tesla') ? teslaPrice :
                        type?.includes('spacex') ? spxPrice :
                            type?.includes('neuralink') ? nrlkPrice :
                                type?.includes('boring') ? nrlkPrice : 0;
                    stockVal += (Number(log.shares) || 0) * price;
                });
                const currentDeposit = profile.totalDeposit || 0;
                const totalBalance = currentDeposit + profit + stockVal;

                setMetrics({
                    balance: totalBalance,
                    profit,
                    deposits: totalDeposit,
                    stockValue: stockVal,
                    referrals: referralsRes.total,
                    activeInvestments: investmentsRes.total
                });

                // Tier Logic
                const currentTier = tierList
                    .slice()
                    .sort((a, b) => a.deposit - b.deposit)
                    .filter(t => totalDeposit >= Number(t.deposit) && referralsRes.total >= Number(t.referrals))
                    .pop();

                setTierName(currentTier ? currentTier.name : "Member");

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    if (loading) return <DashboardSkeleton />;

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-500">

            {/* 1. TICKER TAPE */}
            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-sm">
                <TradingViewTicker />
            </div>

            {/* 2. WELCOME & ALERTS */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Welcome back, {userProfile?.firstName || "Trader"}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Here's your portfolio performance today.</p>
                </div>
                {userProfile?.kycStatus !== 'approved' && (
                    <Link href="/profile" className="flex items-center gap-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-4 py-2 rounded-full text-sm font-medium border border-amber-500/20 hover:bg-amber-500/20 transition-colors">
                        <ShieldCheck className="h-4 w-4" />
                        Complete KYC Verification
                    </Link>
                )}
            </div>

            {/* 3. HERO METRICS */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Balance Card */}
                <div className="lg:col-span-2 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8 md:p-10 shadow-2xl">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-500/20 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/4" />

                    <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-400 font-medium mb-1 flex items-center gap-2">
                                    <Wallet className="h-4 w-4" /> Total Equity
                                </p>
                                <h2 className="text-5xl font-bold tracking-tight">
                                    ${metrics.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </h2>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-semibold flex items-center gap-2">
                                <Zap className="h-3 w-3 text-yellow-400 fill-current" />
                                {tierName} Tier
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Profit</p>
                                <p className="text-xl font-mono font-bold text-emerald-400">
                                    +${metrics.profit.toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Deposits</p>
                                <p className="text-xl font-mono font-bold text-white">
                                    ${metrics.deposits.toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Stocks</p>
                                <p className="text-xl font-mono font-bold text-indigo-400">
                                    ${metrics.stockValue.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <ActionTile
                        href="/deposit"
                        icon={ArrowDownLeft}
                        label="Deposit"
                        color="bg-emerald-500 text-white"
                    />
                    <ActionTile
                        href="/withdraw"
                        icon={ArrowUpRight}
                        label="Withdraw"
                        color="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                    />
                    <ActionTile
                        href="/shares"
                        icon={TrendingUp}
                        label="Buy Shares"
                        color="bg-indigo-500 text-white"
                        span
                    />
                    <ActionTile
                        href="/referral"
                        icon={Users}
                        label="Invite"
                        color="bg-purple-500 text-white"
                    />
                    <ActionTile
                        href="/tracking"
                        icon={Globe}
                        label="Track"
                        color="bg-amber-500 text-white"
                    />
                </div>
            </div>

            {/* 4. SECONDARY METRICS */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Referrals */}
                <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-500/20 rounded-2xl text-blue-600 dark:text-blue-400">
                            <Users className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-bold bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-md text-gray-500">Monthly</span>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.referrals}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Active Referrals</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                        <CopyLinkInput link={referralLink} />
                    </div>
                </div>

                {/* Investments */}
                <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-50 dark:bg-purple-500/20 rounded-2xl text-purple-600 dark:text-purple-400">
                            <PieChart className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-bold bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-md text-gray-500">Active</span>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.activeInvestments}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Live Strategies</p>
                    </div>
                    <Link href="/investments" className="mt-4 text-xs font-semibold text-brand-600 dark:text-brand-400 flex items-center hover:underline">
                        View Portfolio <ChevronRight className="h-3 w-3 ml-1" />
                    </Link>
                </div>

                {/* Tier Progress (Simplified) */}
                <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-amber-50 dark:bg-amber-500/20 rounded-2xl text-amber-600 dark:text-amber-400">
                                <Zap className="h-6 w-6" />
                            </div>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{tierName} Status</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Keep growing to unlock lower fees and higher limits.</p>
                        </div>
                        <Button variant="outline" size="sm" className="mt-4 w-full rounded-xl h-9 text-xs" asChild>
                            <Link href="/rank">View Benefits</Link>
                        </Button>
                    </div>
                    {/* Decor */}
                    <div className="absolute -bottom-4 -right-4 text-amber-500/10">
                        <Zap className="h-32 w-32" />
                    </div>
                </div>

            </div>

        </div>
    );
}

// --- COMPONENTS ---

function ActionTile({ href, icon: Icon, label, color, span }: any) {
    return (
        <Link
            href={href}
            className={`
                group relative flex flex-col items-center justify-center p-6 rounded-3xl transition-all duration-300 hover:scale-[1.02] shadow-sm hover:shadow-md
                ${color} ${span ? 'col-span-2' : ''}
            `}
        >
            <Icon className="h-8 w-8 mb-2 opacity-90 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-bold tracking-wide">{label}</span>
        </Link>
    );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-8 p-4">
            <Skeleton className="h-12 w-full rounded-xl" />
            <div className="grid lg:grid-cols-3 gap-6">
                <Skeleton className="lg:col-span-2 h-80 rounded-[2.5rem]" />
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-36 rounded-3xl" />
                    <Skeleton className="h-36 rounded-3xl" />
                    <Skeleton className="col-span-2 h-36 rounded-3xl" />
                </div>
            </div>
        </div>
    );
}