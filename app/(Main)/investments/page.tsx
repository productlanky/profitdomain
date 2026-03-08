"use client";

import CoinFetch from "@/components/Investment/CoinFetch";
import { Activity, Info } from "lucide-react";

export default function InvestmentPage() {
  return (
    <main className="relative min-h-screen w-full bg-background transition-colors duration-300">
      
      {/* --- BACKGROUND FX --- */}
      {/* These ensure the page feels connected to the rest of the 'Deep Indigo' theme */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 space-y-8">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-600 dark:text-brand-400">
              <Activity className="h-3.5 w-3.5" />
              <span>Real-Time Trading</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Market <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-indigo-500">Overview</span>
            </h1>
            
            <p className="text-muted-foreground text-sm md:text-base max-w-xl">
              Track the most traded crypto pairs and spot opportunities before everyone else. Prices sourced directly from Binance & CoinGecko.
            </p>
          </div>

          {/* Right Side Stats/Badge */}
          <div className="flex items-center gap-3">
             <div className="hidden sm:block text-right mr-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Market Status</p>
                <p className="text-sm font-mono font-medium text-emerald-500">Open 24/7</p>
             </div>
             
             <div className="inline-flex items-center gap-2 rounded-xl bg-card border border-border px-4 py-2 text-xs font-medium text-foreground shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                Live Snapshot
             </div>
          </div>
        </div>

        {/* --- MAIN CONTENT WRAPPER --- */}
        <div className="space-y-6">
          
          {/* Helper Bar */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 text-blue-600 dark:text-blue-400 text-xs md:text-sm">
            <Info className="h-4 w-4 shrink-0" />
            <span>
              Click <strong className="font-semibold underline decoration-dotted">Invest</strong> on any asset below to open the dedicated trading terminal for that pair.
            </span>
          </div>

          {/* The CoinFetch Component Container */}
          {/* We wrap it to ensure it sits nicely on the glass background */}
          <div className="relative rounded-2xl bg-card/40 backdrop-blur-md overflow-hidden shadow-sm">
             <div className="p-1">
                <CoinFetch />
             </div>
          </div>

        </div>

      </div>
    </main>
  );
}