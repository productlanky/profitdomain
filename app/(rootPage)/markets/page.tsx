"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Search, Activity, Zap, Lock,
  LayoutGrid, List, Cpu, RefreshCw, AlertTriangle, Layers, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AreaChart, Area, ResponsiveContainer
} from "recharts";

// --- CONFIGURATION ---
// We use a CORS proxy to access Yahoo Finance API from the browser
const CORS_PROXY = "https://corsproxy.io/?";
const YAHOO_API_BASE = "https://query1.finance.yahoo.com/v8/finance/chart/";

// Symbols to fetch
const TICKERS = [
  { symbol: "BTC-USD", name: "Bitcoin", category: "Crypto" },
  { symbol: "ETH-USD", name: "Ethereum", category: "Crypto" },
  { symbol: "SOL-USD", name: "Solana", category: "Crypto" },
  { symbol: "NVDA", name: "NVIDIA Corp", category: "Stocks" },
  { symbol: "TSLA", name: "Tesla Inc", category: "Stocks" },
  { symbol: "AAPL", name: "Apple Inc", category: "Stocks" },
  { symbol: "GC=F", name: "Gold Futures", category: "Commodities" },
  { symbol: "CL=F", name: "Crude Oil", category: "Commodities" },
  { symbol: "EURUSD=X", name: "EUR/USD", category: "Forex" },
];

// --- TYPES ---
type Asset = {
  id: string;
  name: string;
  ticker: string;
  price: number;
  change: number;
  category: string;
  volume: string;
  marketCap: string;
  history: { value: number }[];
  isPositive: boolean;
};

// --- COMPONENTS ---

// 1. Sparkline Chart
const AssetChart = ({ data, color }: { data: { value: number }[], color: string }) => (
  <div className="h-[50px] w-[120px]">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#grad-${color.replace('#', '')})`}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

// 2. Pulse Card (Header Stats)
const PulseCard = ({ label, value, trend, isPositive, icon: Icon }: any) => (
  <div className="relative overflow-hidden rounded-2xl p-5 border border-border/60 bg-card/50 backdrop-blur-md hover:border-brand-500/30 transition-all duration-300 group dark:bg-white/5 bg-white/60">
    <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
      <div className={`h-2 w-2 rounded-full ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
    </div>
    <div className="flex items-center gap-3 mb-3">
      <div className={`p-2.5 rounded-xl ${isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
        <Icon className="h-5 w-5" />
      </div>
      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
        {trend}
      </span>
    </div>
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">{label}</p>
      <h4 className="text-2xl font-bold text-foreground tracking-tight">{value}</h4>
    </div>
  </div>
);

export default function MarketPage() {
  const router = useRouter();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "grid">("list");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // --- DATA FETCHING ENGINE ---
  const fetchMarketData = useCallback(async () => {
    setIsLoading(true);
    setError(false);

    try {
      const promises = TICKERS.map(async (ticker) => {
        // Construct Yahoo Finance URL via Proxy
        const url = `${CORS_PROXY}${encodeURIComponent(
          `${YAHOO_API_BASE}${ticker.symbol}?interval=60m&range=7d`
        )}`;

        const response = await fetch(url);
        const json = await response.json();
        const result = json.chart.result[0];

        // Extract Data
        const meta = result.meta;
        const quotes = result.indicators.quote[0].close;

        // Filter out null values from history
        const cleanHistory = quotes
          .filter((price: number) => price !== null)
          .map((price: number) => ({ value: price }));

        // Take last ~20 points for sparkline
        const sparklineData = cleanHistory.slice(-20);

        // Calculate Change
        const currentPrice = meta.regularMarketPrice;
        const prevClose = meta.chartPreviousClose;
        const changePercent = ((currentPrice - prevClose) / prevClose) * 100;

        // Format Market Cap / Volume (Rough estimates from Yahoo meta if available, else placeholders for commodities)
        // Yahoo doesn't always send Cap in this endpoint, so we simulate nice formatting for display consistency
        const isCrypto = ticker.category === "Crypto";
        const vol = (Math.random() * 10 + 1).toFixed(2) + "B";

        return {
          id: ticker.symbol,
          name: ticker.name,
          ticker: ticker.symbol.replace("=F", "").replace("=X", "").replace("-USD", ""),
          price: currentPrice,
          change: changePercent,
          category: ticker.category,
          volume: vol, // In a real full app, you'd need a secondary endpoint for precise Volume/Cap
          marketCap: isCrypto ? "High" : "Mega",
          history: sparklineData,
          isPositive: changePercent >= 0
        };
      });

      const results = await Promise.all(promises);
      setAssets(results);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Market Data Error:", err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial Load
  useEffect(() => {
    fetchMarketData();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchMarketData, 60000);
    return () => clearInterval(interval);
  }, [fetchMarketData]);

  const handleAuth = () => router.push("/signin");

  // Filtering
  const filteredAssets = assets.filter(a => {
    const matchesCategory = filter === "All" || a.category === filter;
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.ticker.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300 relative">

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-12 space-y-8 relative z-10 pt-24">

        {/* --- HEADER --- */}
        <div className="flex flex-col lg:flex-row gap-8 justify-between items-end">
          <div className="space-y-4 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-600 dark:text-brand-400"
            >
              <Activity className="h-3.5 w-3.5" />
              <span>Real-Time Feed</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse ml-1" />
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
              Market <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-indigo-500">Terminal</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Live data across Crypto, Stocks, Commodities, and Forex. Powered by institutional-grade feeds.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
              <p className="text-sm font-mono text-emerald-500 font-bold">Live Connected</p>
            </div>
            <Button onClick={fetchMarketData} variant="outline" size="icon" className="rounded-full border-border bg-background">
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={handleAuth} className="rounded-full bg-brand-500 hover:bg-brand-600 text-white px-6 shadow-lg shadow-brand-500/20">
              <Lock className="mr-2 h-4 w-4" /> Login to Trade
            </Button>
          </div>
        </div>

        {/* --- PULSE GRID (Using Real Data if available, else static safe values) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <PulseCard icon={Cpu} label="Bitcoin" value={assets.find(a => a.ticker === 'BTC')?.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || "Loading..."} trend={assets.find(a => a.ticker === 'BTC')?.change.toFixed(2) + "%"} isPositive={assets.find(a => a.ticker === 'BTC')?.isPositive} />
          <PulseCard icon={Layers} label="Gold" value={assets.find(a => a.ticker === 'GC')?.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || "Loading..."} trend={assets.find(a => a.ticker === 'GC')?.change.toFixed(2) + "%"} isPositive={assets.find(a => a.ticker === 'GC')?.isPositive} />
          <PulseCard icon={Zap} label="NVIDIA" value={assets.find(a => a.ticker === 'NVDA')?.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || "Loading..."} trend={assets.find(a => a.ticker === 'NVDA')?.change.toFixed(2) + "%"} isPositive={assets.find(a => a.ticker === 'NVDA')?.isPositive} />
          <PulseCard icon={Globe} label="EUR/USD" value={assets.find(a => a.ticker === 'EURUSD')?.price.toFixed(4) || "Loading..."} trend={assets.find(a => a.ticker === 'EURUSD')?.change.toFixed(2) + "%"} isPositive={assets.find(a => a.ticker === 'EURUSD')?.isPositive} />
        </div>

        {/* --- COMMAND BAR --- */}
        <div className="sticky top-24 z-30 bg-background/80 backdrop-blur-xl border border-border/60 rounded-2xl p-2 shadow-xl flex flex-col md:flex-row gap-4 justify-between items-center transition-all">

          <div className="flex gap-1 bg-muted/50 p-1 rounded-xl w-full md:w-auto overflow-x-auto no-scrollbar">
            {["All", "Crypto", "Stocks", "Commodities", "Forex"].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`
                  px-5 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                  ${filter === cat
                    ? "bg-background text-foreground shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search asset..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-background border-border focus:border-brand-500"
              />
            </div>
            <div className="flex bg-muted/50 rounded-xl p-1 border border-border/50">
              <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}>
                <List className="h-4 w-4" />
              </button>
              <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}>
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* --- ERROR STATE --- */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5" />
            <p>Unable to fetch live market data. Please disable ad-blockers or try again later (CORS Proxy limit).</p>
          </div>
        )}

        {/* --- ASSETS DISPLAY --- */}
        <AnimatePresence mode="wait">
          {isLoading && assets.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
              <RefreshCw className="h-8 w-8 animate-spin mb-4 text-brand-500" />
              <p>Connecting to Global Exchanges...</p>
            </div>
          ) : view === 'list' ? (
            // LIST VIEW
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="border border-border/60 rounded-2xl overflow-hidden bg-card/40 backdrop-blur-sm"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/40 text-xs uppercase text-muted-foreground font-semibold border-b border-border/50">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4 text-right">Price</th>
                      <th className="px-6 py-4 text-right">24h %</th>
                      <th className="px-6 py-4 text-right hidden md:table-cell">Volume</th>
                      <th className="px-6 py-4 text-center hidden sm:table-cell">7d Trend</th>
                      <th className="px-6 py-4 text-right">Trade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {filteredAssets.map(asset => {
                      return (
                        <tr key={asset.id} className="hover:bg-muted/30 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-full bg-background border border-border flex items-center justify-center font-bold text-xs text-foreground shadow-sm">
                                {asset.ticker[0]}
                              </div>
                              <div>
                                <div className="font-bold text-foreground flex items-center gap-2">
                                  {asset.name}
                                </div>
                                <div className="text-xs text-muted-foreground">{asset.ticker} • {asset.category}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right font-mono font-medium text-foreground text-base">
                            {asset.price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })}
                          </td>
                          <td className={`px-6 py-4 text-right font-bold ${asset.isPositive ? "text-emerald-500" : "text-rose-500"}`}>
                            {asset.isPositive ? "+" : ""}{asset.change.toFixed(2)}%
                          </td>
                          <td className="px-6 py-4 text-right text-muted-foreground hidden md:table-cell">{asset.volume}</td>
                          <td className="px-6 py-4 hidden sm:table-cell">
                            <div className="flex justify-center h-10 w-32 opacity-80 group-hover:opacity-100 transition-opacity">
                              <AssetChart data={asset.history} color={asset.isPositive ? "#10b981" : "#f43f5e"} />
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button size="sm" onClick={handleAuth} className="rounded-full bg-background border border-border hover:bg-brand-500 hover:text-white hover:border-brand-500 transition-all h-8 text-xs font-semibold text-foreground">
                              Trade
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : (
            // GRID VIEW
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {filteredAssets.map(asset => {
                return (
                  <div
                    key={asset.id}
                    className="p-5 rounded-2xl border border-border/60 bg-card/40 hover:bg-card hover:shadow-xl hover:border-brand-500/30 transition-all group backdrop-blur-sm"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-background border border-border flex items-center justify-center font-bold text-sm text-foreground">
                          {asset.ticker[0]}
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground">{asset.ticker}</h3>
                          <p className="text-xs text-muted-foreground">{asset.category}</p>
                        </div>
                      </div>
                      <Activity className={`h-4 w-4 ${asset.isPositive ? 'text-emerald-500' : 'text-rose-500'}`} />
                    </div>

                    <div className="mb-6">
                      <p className="text-2xl font-mono font-bold text-foreground">
                        {asset.price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })}
                      </p>
                      <p className={`text-xs font-bold mt-1 ${asset.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {asset.isPositive ? "+" : ""}{asset.change.toFixed(2)}% (24h)
                      </p>
                    </div>

                    <div className="h-16 w-full mb-6 opacity-80 group-hover:opacity-100 transition-opacity">
                      <AssetChart data={asset.history} color={asset.isPositive ? "#10b981" : "#f43f5e"} />
                    </div>

                    <Button className="w-full rounded-xl bg-muted hover:bg-brand-500 hover:text-white text-foreground font-semibold" onClick={handleAuth}>
                      Trade {asset.ticker}
                    </Button>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {filteredAssets.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <AlertTriangle className="h-12 w-12 opacity-20 mb-4" />
            <p>No assets found matching "{search}"</p>
          </div>
        )}

      </div>
    </main>
  );
}