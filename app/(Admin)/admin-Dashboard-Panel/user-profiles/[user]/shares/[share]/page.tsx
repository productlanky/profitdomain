"use client";

import AdminUserStockTable from "@/components/AdminComponent/AdminUserStockTable";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { use } from "react";

interface PageProps {
  params: Promise<{ user: string; share: string }>;
}

export default function AdminUserStocksPage({ params }: PageProps) {
  const { user, share } = use(params);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top hero (same vibe as Transactions / Investments) */}
      <header className="bg-black px-4 md:px-10 py-6 shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: back, breadcrumb, title */}
          <div>


            <nav className="mb-1 mt-2 flex items-center gap-1 text-xs font-medium text-white/70">
              <Link
                href="/admin-Dashboard-Panel"
                className="hover:text-white/90 transition-colors"
              >
                Dashboard
              </Link>
              <span>/</span>
              <Link
                href={`/admin-Dashboard-Panel/user-profiles/${user}`}
                className="hover:text-white/90 transition-colors"
              >
                Profile
              </Link>
              <span>/</span>
              <span className="text-white">Stocks</span>
            </nav>

            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              User Stocks
            </h1>
            <p className="mt-1 text-sm text-white/70">
              Track this user&apos;s Tesla, SpaceX and Neuralink positions,
              exposure and historical purchases.
            </p>
          </div>

          {/* Right: primary action */}
          <div className="flex flex-col items-stretch gap-2 sm:items-end">
            <Link
              href={`/admin-Dashboard-Panel/user-profiles/${user}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium text-white/80 shadow-sm transition hover:bg-white/10 hover:text-white"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Back to profile
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="px-4 pb-10 pt-6 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          {/* Overview card (mirrors Transactions / Investments overview) */}
          <section className="rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-black/40 sm:p-5">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Stocks Overview
                </h2>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  All equity purchases for Tesla, SpaceX and Neuralink are
                  aggregated below, including live valuation and historical
                  trades.
                </p>
              </div>

              <div className="flex flex-col gap-2 text-xs sm:items-end">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-700 dark:text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Live price feeds connected
                </span>
                <div className="flex flex-wrap gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 dark:bg-white/5">
                    • All values shown in USD
                  </span>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 dark:bg-white/5">
                    • Shares aggregated from every stock log for this user
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Table section (same card style as other detail pages) */}
          <section className="rounded-2xl border border-gray-200/80 bg-white/80 p-0 shadow-sm backdrop-blur-sm dark:border-white/8 dark:bg-black/40 sm:p-1">
            <AdminUserStockTable userId={share} />
          </section>
        </div>
      </main>
    </div>
  );
}
