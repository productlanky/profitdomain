"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Activity, 
  Globe, 
  Zap,        // For Tesla
  Brain,      // For Neuralink
  Cpu         // For AI/Tech
} from "lucide-react";
import { Button } from "@/components/ui/button"; 

// --- Animated Stats Card Component (Floating Elements) ---
const FloatingCard = ({ 
  icon: Icon, 
  title, 
  value, 
  trend, 
  delay, 
  className 
}: { 
  icon: any, title: string, value: string, trend?: string, delay: number, className?: string 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, duration: 0.8, type: "spring" }}
    className={`
      absolute p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl
      flex items-center gap-4 select-none pointer-events-none z-20
      dark:bg-black/40 dark:border-white/10
      ${className}
    `}
  >
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/20 text-brand-500 dark:text-brand-400">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-foreground">{value}</span>
        {trend && <span className="text-[10px] font-medium text-emerald-500">{trend}</span>}
      </div>
    </div>
  </motion.div>
);

// --- Stock Item Component ---
const StockItem = ({ name, ticker, price, change, icon: Icon, colorClass, bgClass, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="flex items-center justify-between rounded-xl bg-white/5 p-3 hover:bg-white/10 transition-colors cursor-default border border-transparent hover:border-white/5"
  >
    <div className="flex items-center gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bgClass} ${colorClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-foreground">{name}</h4>
        <span className="text-xs font-medium text-muted-foreground">{ticker}</span>
      </div>
    </div>
    <div className="text-right">
      <div className="text-sm font-bold text-foreground">{price}</div>
      <div className="text-xs font-medium text-emerald-500">{change}</div>
    </div>
  </motion.div>
);

export default function HeroSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-dvh w-full overflow-hidden bg-background flex items-center justify-center pt-20 lg:pt-0"
    >
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <motion.div 
        style={{ y: yBackground, opacity: opacityFade }}
        className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-brand-500/20 blur-[120px] mix-blend-screen"
      />
      <motion.div 
        style={{ y: yBackground }}
        className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[100px] mix-blend-screen"
      />

      {/* --- MAIN CONTENT CONTAINER --- */}
      <div className="container relative z-10 mx-auto grid min-h-[80vh] grid-cols-1 items-center gap-12 lg:grid-cols-2">
        
        {/* LEFT COLUMN: Text Content */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left pt-10 lg:pt-0">
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/5 px-3 py-1 text-xs font-medium text-brand-500"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500"></span>
            </span>
            Now trading: Future Tech & Neural Markets
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-6 text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl xl:text-7xl"
          >
            Invest in the <br/>
            <span className="bg-linear-to-r from-brand-500 to-emerald-400 bg-clip-text text-transparent">
              Speed of Thought.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-8 max-w-lg text-lg text-muted-foreground sm:text-xl"
          >
            Access exclusive high-growth assets like <strong>Tesla</strong>, <strong>Neuralink</strong>, and AI derivatives. 
            Real-time analytics and automated diversification in one powerful interface.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex gap-4 flex-row"
          >
            <Button 
              size="lg" 
              className="h-12 rounded-full bg-brand-500 px-8 text-base font-semibold text-white shadow-lg shadow-brand-500/25 transition-transform hover:scale-105 hover:bg-brand-600"
              asChild
            >
              <Link href="/signup">
                Start Investing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <Button 
              variant="outline"
              size="lg" 
              className="h-12 rounded-full border-border bg-transparent px-8 text-base font-medium text-foreground hover:bg-muted"
              asChild
            >
              <Link href="/markets">
                View Markets
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-10 flex items-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Bank-grade Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-500" />
              <span>Global Access</span>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: 3D Animated Dashboard */}
        <div className="relative flex h-full w-full items-center justify-center lg:justify-end perspective-1000">
          
          {/* Main Glass Card */}
          <motion.div 
            initial={{ opacity: 0, rotateX: 10, rotateY: -10, scale: 0.9 }}
            animate={{ opacity: 1, rotateX: 0, rotateY: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-linear-to-br from-white/10 to-white/5 p-6 shadow-2xl backdrop-blur-2xl dark:from-white/5 dark:to-white/0"
          >
            {/* Fake Dashboard UI */}
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Market Watch</h3>
                  <p className="text-xs text-muted-foreground">Real-time volatility</p>
                </div>
                <div className="h-8 w-8 flex items-center justify-center rounded-full bg-brand-500/20 text-brand-500">
                  <Activity className="h-4 w-4" />
                </div>
              </div>
              
              {/* Stock List */}
              <div className="space-y-3">
                <StockItem 
                  name="Tesla" 
                  ticker="TSLA" 
                  price="$248.50" 
                  change="+5.2%" 
                  icon={Zap} 
                  colorClass="text-red-500" 
                  bgClass="bg-red-500/10" 
                  delay={0.5} 
                />
                <StockItem 
                  name="Neuralink" 
                  ticker="NRLK" 
                  price="$42.00" 
                  change="+18.4%" 
                  icon={Brain} 
                  colorClass="text-pink-500" 
                  bgClass="bg-pink-500/10" 
                  delay={0.6} 
                />
                <StockItem 
                  name="xAI Corp" 
                  ticker="XAI" 
                  price="$12.30" 
                  change="+8.1%" 
                  icon={Cpu} 
                  colorClass="text-blue-500" 
                  bgClass="bg-blue-500/10" 
                  delay={0.7} 
                />
              </div>

              {/* Mini Chart Area */}
              <div className="mt-4 pt-4 border-t border-white/5">
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>Portfolio Growth</span>
                  <span className="text-brand-500 font-bold">+24.5%</span>
                </div>
                <div className="h-24 w-full flex items-end justify-between gap-1">
                  {[30, 45, 35, 60, 50, 75, 65, 90].map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: "10%" }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 1, delay: 0.8 + (i * 0.1) }}
                      className="w-full rounded-sm bg-brand-500/30 hover:bg-brand-500/60 transition-colors"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <FloatingCard 
              icon={TrendingUp} 
              title="TSLA Growth" 
              value="+24%" 
              trend="All time high" 
              delay={0.9}
              className="-top-10 -right-4 md:-right-12 border-emerald-500/20"
            />
            
            <FloatingCard 
              icon={Brain} 
              title="Neuralink IPO" 
              value="Pending" 
              delay={1.1}
              className="-bottom-6 -left-4 md:-left-8"
            />
          </motion.div>

          {/* Decorative Glow */}
          <div className="absolute top-1/2 left-1/2 -z-10 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/10 blur-3xl" />
        </div>
      </div>
    </section>
  );
}