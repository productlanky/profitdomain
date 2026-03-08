"use client";

import { motion } from "framer-motion";
import { 
  Bitcoin,  
  ShieldCheck, 
  Zap, 
  Layers, 
  Globe, 
  ArrowRight,
  TrendingUp,
  Cpu,
  Lock
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { companyName } from "@/lib/data/info";

// --- MOCK DATA ---
const COINS = [
  { sym: "BTC", name: "Bitcoin", price: "$64,230", change: "+2.4%" },
  { sym: "ETH", name: "Ethereum", price: "$3,450", change: "+1.8%" },
  { sym: "SOL", name: "Solana", price: "$145.20", change: "-0.5%" },
  { sym: "XRP", name: "Ripple", price: "$0.62", change: "+0.4%" },
  { sym: "ADA", name: "Cardano", price: "$0.45", change: "-1.2%" },
  { sym: "DOT", name: "Polkadot", price: "$7.20", change: "+3.1%" },
  { sym: "LINK", name: "Chainlink", price: "$14.50", change: "+4.2%" },
  { sym: "AVAX", name: "Avalanche", price: "$35.80", change: "-0.8%" },
];

const STRATEGIES = [
  {
    icon: TrendingUp,
    title: "Spot Trading",
    desc: "Access 200+ pairs with deep liquidity and institutional-grade execution speed.",
    color: "text-cyan-400"
  },
  {
    icon: Layers,
    title: "Staking & Yield",
    desc: "Earn passive APY on your idle assets. We handle the validator nodes; you keep the rewards.",
    color: "text-brand-500"
  },
  {
    icon: Globe,
    title: "DeFi Access",
    desc: "Direct integration with major decentralized protocols for lending, borrowing, and liquidity provision.",
    color: "text-indigo-400"
  }
];

export default function CryptoPage() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      
      {/* --- BACKGROUND FX --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full" />
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Content */}
          <div className="space-y-8 relative z-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-500"
            >
              <Cpu className="h-3.5 w-3.5" />
              <span>Web3 Integrated</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]"
            >
              The future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-brand-500">
                decentralized value.
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground max-w-xl leading-relaxed"
            >
              Beyond just buying Bitcoin. {companyName} provides a comprehensive suite for navigating the crypto economy, from cold storage custody to high-yield DeFi strategies.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Button size="lg" className="rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold px-8 shadow-lg shadow-brand-500/25">
                <Link href="/signup">Start Trading</Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full border-border hover:bg-muted font-medium px-8">
                <Link href="/markets">View Prices</Link>
              </Button>
            </motion.div>
          </div>

          {/* Visual: Floating Token */}
          <div className="relative h-[500px] flex items-center justify-center perspective-[1000px]">
             {/* Spinning Rings */}
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               className="absolute w-[400px] h-[400px] border border-dashed border-brand-500/30 rounded-full"
             />
             <motion.div 
               animate={{ rotate: -360 }}
               transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
               className="absolute w-[500px] h-[500px] border border-white/5 rounded-full"
             />

             {/* Central Coin */}
             <motion.div 
               initial={{ y: 20 }}
               animate={{ y: -20 }}
               transition={{ repeat: Infinity, repeatType: "reverse", duration: 3, ease: "easeInOut" }}
               className="relative z-10 w-48 h-48 rounded-full bg-gradient-to-br from-brand-600 to-indigo-900 flex items-center justify-center shadow-[0_0_60px_rgba(var(--brand-500),0.5)] border border-white/20"
             >
                <Bitcoin className="h-24 w-24 text-white" />
                {/* Gloss Shine */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
             </motion.div>

             {/* Floating Elements */}
             <motion.div 
               animate={{ y: [-10, 10, -10], x: [5, -5, 5] }}
               transition={{ duration: 5, repeat: Infinity }}
               className="absolute top-[20%] right-[10%] p-3 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-3 shadow-xl"
             >
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                   <p className="text-xs text-white/60">APY Earned</p>
                   <p className="text-sm font-bold text-white">+12.4%</p>
                </div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* --- INFINITE TICKER --- */}
      <div className="w-full bg-muted/30 border-y border-white/5 overflow-hidden py-4">
        <motion.div 
          className="flex gap-12 whitespace-nowrap min-w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        >
          {[...COINS, ...COINS].map((coin, i) => (
            <div key={i} className="flex items-center gap-3">
               <span className="font-bold text-foreground text-sm">{coin.sym}</span>
               <span className="text-muted-foreground text-xs">{coin.name}</span>
               <span className="font-mono text-foreground text-sm">{coin.price}</span>
               <span className={`text-xs font-medium ${coin.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                 {coin.change}
               </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* --- STRATEGIES GRID --- */}
      <section className="py-24 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">More than just HODLing.</h2>
            <p className="text-muted-foreground text-lg">
              Maximize your crypto exposure with our diversified investment products.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {STRATEGIES.map((strat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group relative p-8 rounded-3xl border border-border bg-card/50 hover:bg-card hover:border-brand-500/30 transition-all duration-300"
              >
                <div className={`h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors ${strat.color}`}>
                  <strat.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{strat.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">{strat.desc}</p>
                <div className="flex items-center text-sm font-semibold text-foreground group-hover:text-brand-500 transition-colors">
                  Learn more <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECURITY SECTION --- */}
      <section className="py-24 border-t border-border/50 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Visual */}
            <div className="relative order-2 lg:order-1">
               <div className="relative rounded-[2rem] overflow-hidden border border-white/10 bg-[#050505] shadow-2xl">
                  {/* Abstract Vault Visual */}
                  <div className="h-[400px] w-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-900/40 via-black to-black flex items-center justify-center">
                     <Lock className="h-32 w-32 text-white/10" />
                  </div>
                  
                  {/* Floating Shield */}
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="bg-gradient-to-br from-white/10 to-transparent p-6 rounded-3xl border border-white/20 backdrop-blur-md">
                        <ShieldCheck className="h-16 w-16 text-emerald-500 mx-auto mb-2" />
                        <div className="text-center">
                           <p className="text-white font-bold text-lg">Bank-Grade Custody</p>
                           <p className="text-white/60 text-xs">MPC Cryptography</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Right: Text */}
            <div className="order-1 lg:order-2 space-y-6">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold uppercase tracking-wider">
                 <ShieldCheck className="h-3 w-3" /> Security First
               </div>
               <h2 className="text-4xl font-bold text-foreground">Institutional-Grade Security</h2>
               <p className="text-muted-foreground text-lg leading-relaxed">
                 We don't take chances with your assets. The vast majority of funds are held in offline cold storage, protected by Multi-Party Computation (MPC) technology.
               </p>
               <ul className="space-y-4 pt-4">
                 {[
                   "100% Reserve backing for all user assets",
                   "Real-time fraud monitoring & 2FA enforcement",
                   "Insured custody against third-party hacks"
                 ].map((item, i) => (
                   <li key={i} className="flex items-center gap-3 text-foreground">
                     <div className="h-6 w-6 rounded-full bg-brand-500/20 flex items-center justify-center shrink-0">
                       <Zap className="h-3.5 w-3.5 text-brand-500" />
                     </div>
                     {item}
                   </li>
                 ))}
               </ul>
            </div>

          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-24 px-4 text-center">
         <div className="max-w-3xl mx-auto rounded-3xl p-12 bg-gradient-to-b from-brand-900/10 to-transparent border border-brand-500/20">
            <h2 className="text-3xl font-bold text-foreground mb-4">Start your crypto journey</h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of investors using {companyName} to build their digital asset portfolio securely.
            </p>
            <div className="flex justify-center gap-4">
               <Button size="lg" className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-8">
                 <Link href="/signup">Create Account</Link>
               </Button>
               <Button variant="outline" size="lg" className="rounded-full border-border bg-background hover:bg-muted px-8">
                 <Link href="/markets">Explore Markets</Link>
               </Button>
            </div>
         </div>
      </section>

    </main>
  );
}