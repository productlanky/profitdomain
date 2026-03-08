"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, 
  ArrowRight, 
  Wallet, 
  Bitcoin, 
  Activity, 
  Lock, 
  Globe 
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// --- Sub-components ---

const CryptoCard = ({ icon: Icon, title, value, change, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="
      flex items-center justify-between p-3 rounded-xl 
      bg-white/60 dark:bg-white/5 
      border border-slate-200 dark:border-white/10 
      backdrop-blur-md shadow-sm
      hover:bg-white/80 dark:hover:bg-white/10 transition-colors
    "
  >
    <div className="flex items-center gap-3">
      <div className="
        h-10 w-10 rounded-full flex items-center justify-center 
        bg-gradient-to-br from-brand-500/10 to-cyan-500/10 
        border border-brand-500/20 text-brand-600 dark:text-white
      ">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
        <p className="text-xs text-slate-500 dark:text-white/50">Asset</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-bold text-slate-900 dark:text-white">{value}</p>
      <p className={`text-xs ${change.startsWith('+') ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
        {change}
      </p>
    </div>
  </motion.div>
);

const FeatureBox = ({ icon: Icon, title, desc, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="
      group p-6 rounded-3xl 
      border border-border/60 dark:border-white/10 
      bg-white/50 dark:bg-white/5 
      backdrop-blur-md shadow-sm dark:shadow-none
      hover:border-brand-500/30 hover:bg-brand-500/5 
      transition-all duration-300
    "
  >
    <div className="
      h-12 w-12 rounded-xl mb-4 flex items-center justify-center
      bg-brand-500/10 text-brand-600 dark:text-brand-500
      group-hover:scale-110 transition-transform 
      group-hover:bg-brand-500 group-hover:text-white
    ">
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
  </motion.div>
);

export default function InvestInCrypto() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-background transition-colors duration-300">
      
      {/* --- BACKGROUND FX --- */}
      {/* Grid Pattern: Adapted for both light and dark */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      {/* Glows */}
      <div className="absolute top-20 left-[-10%] h-[500px] w-[500px] rounded-full bg-brand-500/10 blur-[120px]" />
      <div className="absolute bottom-0 right-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* --- MAIN GRID --- */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          
          {/* LEFT: TEXT CONTENT */}
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="
                inline-flex items-center gap-2 rounded-full 
                border border-cyan-500/30 bg-cyan-500/10 
                px-3 py-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-6
              "
            >
              <Activity className="h-3.5 w-3.5 animate-pulse" />
              <span>Live Market Access</span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
            >
              Diversify into the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-brand-500">
                tokenized economy.
              </span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed"
            >
              Our strategies combine active high-frequency trading with long-term holdings in DeFi protocols and Layer-1 infrastructure. Capture market upside with institutional-grade tools.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Button size="lg" className="rounded-full bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white shadow-lg shadow-brand-500/25 h-12 px-8">
                <Link href="/signup">Start Investing</Link>
              </Button>
              <Button variant="ghost" className="rounded-full text-muted-foreground hover:text-foreground hover:bg-muted gap-2 group">
                <Link href="/markets" className="flex items-center gap-2">
                  View Markets <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* RIGHT: FLOATING INTERFACE MOCKUP */}
          <div className="relative">
            {/* The Main "Phone/Card" Container */}
            <motion.div
              initial={{ opacity: 0, y: 40, rotate: -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="
                relative z-10 w-full max-w-md mx-auto aspect-[4/5] 
                rounded-[2.5rem] overflow-hidden 
                border border-slate-200/60 dark:border-white/10
                bg-white/40 dark:bg-black/40 
                backdrop-blur-2xl shadow-2xl shadow-brand-900/10 dark:shadow-brand-900/50
              "
            >
              {/* Gradient Header */}
              <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-brand-500/10 to-transparent pointer-events-none" />
              
              <div className="p-8 space-y-6 relative">
                {/* Header Stats */}
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-slate-500 dark:text-white/50 text-xs font-medium uppercase tracking-wider">Total Balance</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white">$24,592.40</h3>
                  </div>
                  <div className="
                    px-3 py-1 rounded-full text-xs font-bold
                    bg-emerald-500/10 text-emerald-600 border border-emerald-500/20
                    dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30
                  ">
                    +12.4%
                  </div>
                </div>

                {/* Chart Line (SVG) */}
                <div className="h-32 w-full relative">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                    <path d="M0 35 Q 20 20, 40 25 T 100 5" fill="none" stroke="url(#gradient)" strokeWidth="3" />
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#22d3ee" />
                      </linearGradient>
                    </defs>
                  </svg>
                  {/* Glowing dot at the end */}
                  <div className="absolute top-[12%] right-0 h-4 w-4 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)]" />
                </div>

                {/* Crypto List */}
                <div className="space-y-3">
                  <CryptoCard icon={Bitcoin} title="Bitcoin" value="$64,230" change="+2.4%" delay={0.3} />
                  <CryptoCard icon={Wallet} title="Ethereum" value="$3,450" change="+1.8%" delay={0.4} />
                  <CryptoCard icon={Activity} title="Solana" value="$145" change="-0.5%" delay={0.5} />
                </div>
              </div>
            </motion.div>

            {/* Floating Decorative Elements Behind */}
            <motion.div 
               animate={{ y: [-15, 15, -15] }} 
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-20 -right-12 z-0 h-24 w-24 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 blur-2xl opacity-40 dark:opacity-40" 
            />
             <motion.div 
               animate={{ y: [10, -10, 10] }} 
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -bottom-10 -left-12 z-0 h-32 w-32 rounded-full bg-brand-500 blur-3xl opacity-30 dark:opacity-30" 
            />
          </div>

        </div>

        {/* --- BOTTOM FEATURES --- */}
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureBox 
            delay={0.2}
            icon={TrendingUp} 
            title="Smart Insights" 
            desc="Live balances combine deposits, profit, and share values into one calculated net worth." 
          />
          <FeatureBox 
            delay={0.3}
            icon={Globe} 
            title="Logistics Integration" 
            desc="Track physical shipments alongside your digital portfolio. Create routes and view ETA estimates." 
          />
          <FeatureBox 
            delay={0.4}
            icon={Lock} 
            title="Admin Controls" 
            desc="Manage KYC status, withdrawal limits, and tiered permissions from a single secure panel." 
          />
        </div>

      </div>
    </section>
  );
}