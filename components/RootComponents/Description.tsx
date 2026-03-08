"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  Globe,
  ArrowRight,
  Zap,        // Tesla Icon
  Brain,      // Neuralink Icon
  Cpu,
  LockKeyhole,
  Rocket      // Growth Icon
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { companyName } from "@/lib/data/info";

// --- Floating Glass Card Component ---
const GlassFeatureCard = ({ icon: Icon, title, description, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, delay, type: "spring", bounce: 0.3 }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="group relative z-20 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md dark:bg-black/20"
  >
    <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-brand-500/20 blur-[50px] transition-all duration-500 group-hover:bg-brand-500/40 group-hover:blur-[70px]" />

    <div className="relative z-10 flex flex-col h-full">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400 ring-1 ring-brand-500/30 group-hover:bg-brand-500 group-hover:text-white transition-colors duration-300">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-2 text-lg font-bold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground grow">
        {description}
      </p>
      <div className="mt-4 flex items-center text-sm font-medium text-brand-500 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
        Trade Now <ArrowRight className="ml-1 h-4 w-4" />
      </div>
    </div>
  </motion.div>
);

export default function Description() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">

      {/* --- DYNAMIC BACKGROUND --- */}
      <div className="absolute inset-0 -z-20 bg-background">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[32px_32px] mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 -z-10 h-[800px] w-[800px] rounded-full bg-[radial-gradient(circle_at_center,var(--brand-500)_0%,transparent_70%)] opacity-30 blur-[120px] mix-blend-screen"
      />
      <motion.div
        animate={{ x: [-50, 50, -50], y: [-20, 20, -20] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-[-20%] -z-10 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_at_center,#3b82f6_0%,transparent_70%)] opacity-20 blur-[100px] mix-blend-screen"
      />

      <div className="container relative mx-auto px-4 md:px-6">

        {/* --- SPLIT LAYOUT --- */}
        <div className="grid items-center gap-16 lg:grid-cols-2 mb-20">

          {/* LEFT: Text Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-sm font-semibold text-brand-500 shadow-[0_0_15px_rgba(var(--brand-500),0.3)]"
            >
              <Rocket className="h-4 w-4 fill-current" />
              <span>Next-Gen Asset Access</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-foreground md:text-6xl lg:text-6xl"
            >
              Own a piece of the <br />
              <span className="relative whitespace-nowrap">
                <span className="absolute -bottom-2 left-0 h-1.5 w-full bg-brand-500/50 blur-sm"></span>
                <span className="relative bg-linear-to-r from-brand-400 via-brand-500 to-indigo-400 bg-clip-text text-transparent">
                  Impossible.
                </span>
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mb-8 max-w-xl text-xl text-muted-foreground"
            >
              Don't just watch the future happen—invest in it. Get early access to <strong>Neuralink</strong> allocations and fractional <strong>Tesla</strong> shares with zero fees.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-4"
            >
              <Button size="lg" className="h-14 rounded-full bg-brand-500 px-8 text-lg font-semibold shadow-lg shadow-brand-500/40 transition-transform hover:scale-105 hover:bg-brand-400">
                <Link href="/markets">View Live Markets</Link>
              </Button>
            </motion.div>
          </div>

          {/* RIGHT: Orbiting Tech Assets Visual */}
          <div className="relative hidden lg:block h-[500px] perspective-[1000px]">

            {/* Orbit Ring 1 (Tesla) */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full border border-brand-500/20 border-dashed"
            >
              {/* Tesla Planet */}
              <motion.div 
                className="absolute -top-5 left-1/2 -translate-x-1/2 h-14 w-14 rounded-full bg-black border border-white/20 shadow-[0_0_30px_rgba(239,68,68,0.4)] flex items-center justify-center z-20"
                style={{ rotate: -360 }} // Counter-rotate to keep icon upright
              >
                <Zap className="h-6 w-6 text-red-500 fill-current" />
              </motion.div>
            </motion.div>

            {/* Orbit Ring 2 (Neuralink) */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-56 w-56 rounded-full border border-indigo-500/20 border-dashed"
            >
              {/* Neuralink Planet */}
              <motion.div 
                className="absolute -bottom-5 left-1/2 -translate-x-1/2 h-14 w-14 rounded-full bg-black border border-white/20 shadow-[0_0_30px_rgba(168,85,247,0.4)] flex items-center justify-center z-20"
                style={{ rotate: 360 }} // Counter-rotate
              >
                <Brain className="h-6 w-6 text-purple-400" />
              </motion.div>
            </motion.div>

            {/* Central Core */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-10">
              <div className="h-24 w-24 bg-brand-500 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(var(--brand-500),0.6)] ring-4 ring-brand-500/20">
                <Globe className="h-10 w-10 text-white animate-pulse" />
              </div>
              <div className="mt-6 text-center">
                 <p className="text-xs font-bold text-brand-400 uppercase tracking-widest">Exzon Core</p>
                 <p className="text-sm font-medium text-muted-foreground">Diversified</p>
              </div>
            </div>

            {/* Floating Asset Tags */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} 
              className="absolute top-[15%] right-[10%] p-3 rounded-xl bg-black/60 backdrop-blur-md border border-red-500/30 flex items-center gap-3 shadow-xl"
            >
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-bold text-white">TSLA +12.4%</span>
            </motion.div>

            <motion.div 
              animate={{ y: [10, -10, 10] }} 
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} 
              className="absolute bottom-[20%] left-[5%] p-3 rounded-xl bg-black/60 backdrop-blur-md border border-purple-500/30 flex items-center gap-3 shadow-xl"
            >
              <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-sm font-bold text-white">NRLK IPO Access</span>
            </motion.div>

          </div>
        </div>

        {/* --- OVERLAPPING FEATURE CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14 relative z-20">
          <GlassFeatureCard
            delay={0.2}
            icon={Zap}
            title="Tesla Fractional Shares"
            description="Own a piece of the EV revolution for as little as $10. Real-time TSLA tracking with automated dividend reinvestment."
          />
          <GlassFeatureCard
            delay={0.4}
            icon={Brain}
            title="Neuralink Pre-IPO"
            description="Get exclusive access to Neuralink allocations before public listing. Invest in the future of brain-computer interfaces today."
          />
          <GlassFeatureCard
            delay={0.6}
            icon={Cpu}
            title="AI & Tech ETF"
            description="One click diversifies your portfolio across xAI, SpaceX, and other high-growth tech ventures automatically."
          />
        </div>

      </div>
    </section>
  );
}