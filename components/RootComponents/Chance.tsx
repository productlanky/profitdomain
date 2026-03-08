"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { 
  CheckCircle2, 
  TrendingUp, 
  Layers, 
  Globe, 
  ArrowUpRight 
} from "lucide-react";
import { companyName } from "@/lib/data/info";

// --- Sub-components ---

const StatBox = ({ label, value, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="flex flex-col p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
  >
    <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
  </motion.div>
);

const FeatureRow = ({ text, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="flex items-center gap-4 p-3 rounded-xl hover:bg-brand-500/5 hover:border-brand-500/20 border border-transparent transition-all duration-300 group"
  >
    <div className="h-8 w-8 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-500 group-hover:bg-brand-500 group-hover:text-white transition-colors">
      <CheckCircle2 className="h-4 w-4" />
    </div>
    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
      {text}
    </span>
  </motion.div>
);

export default function Chance() {
  const stats = [
    { title: "Active Deals", value: "74+" },
    { title: "Unicorns Backed", value: "6+" },
    { title: "Total Exits", value: "35+" },
  ];

  const benefits = [
    "Investors own the underlying protocol equity",
    "Profit directly from token price appreciation",
    "Earn passive yield from on-chain validation",
    "Smart-contract backed transparency",
  ];

  return (
    <section className="relative px-4 md:px-8 py-24 lg:py-32 overflow-hidden bg-background">
      
      {/* --- BACKGROUND FX --- */}
      {/* 1. Circuit Grid */}
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      {/* 2. Deep Glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border/40 pb-12">
          <div className="space-y-4 max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-400"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Digital Asset Frontiers</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]"
            >
              Own the next wave of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-indigo-400">
                value creation.
              </span>
            </motion.h2>
          </div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-md text-muted-foreground text-lg leading-relaxed"
          >
            Blockchain assets are the wealth of tomorrow. {companyName} lets you own, earn, and compound value directly from the networks powering the new financial era.
          </motion.p>
        </div>

        {/* MAIN CONTENT SPLIT */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* LEFT: VISUAL STACK */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            {/* Main Glass Container */}
            <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-background/50">
              <Image
                src="/images/body/content-left-02.jpg"
                alt="Blockchain investment visual"
                width={900}
                height={650}
                className="w-full h-full object-cover object-center opacity-80 hover:scale-105 transition-transform duration-700"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

              {/* Floating "Live Data" Widget */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                         <Globe className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Network Activity</p>
                        <p className="text-xs text-white/60">Global Node Consensus</p>
                      </div>
                   </div>
                   <div className="text-right">
                     <p className="text-lg font-bold text-emerald-400">+24.8%</p>
                     <p className="text-xs text-white/60">24h Volume</p>
                   </div>
                </div>
                {/* Fake Progress Bar */}
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     whileInView={{ width: "75%" }}
                     transition={{ duration: 1.5, ease: "easeOut" }}
                     className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400" 
                   />
                </div>
              </motion.div>

              {/* Floating Chip Top Right */}
              <div className="absolute top-6 right-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-black/60 backdrop-blur-md px-4 py-2 text-xs font-medium text-white border border-white/10">
                  <div className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
                  Live Protocol Access
                </div>
              </div>
            </div>

            {/* Decorative Glow Behind */}
            <div className="absolute -inset-10 -z-10 bg-brand-500/20 blur-[80px] rounded-full opacity-50" />
          </motion.div>


          {/* RIGHT: DETAILS & STATS */}
          <div className="pt-4">
            
            <motion.div
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="space-y-6 mb-10"
            >
              <h3 className="text-2xl font-bold text-foreground">
                We build sustainable wealth on-chain.
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Our strategies focus on infrastructure, early token sales, and high-conviction protocols. An investment with {companyName} means your capital participates in the upside of the networks themselves.
              </p>
            </motion.div>

            {/* Benefits List */}
            <div className="grid gap-3 mb-10">
              {benefits.map((benefit, i) => (
                <FeatureRow key={i} text={benefit} delay={0.2 + (i * 0.1)} />
              ))}
            </div>

            {/* Highlight Box */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-brand-500 to-indigo-600 text-white shadow-xl shadow-brand-500/20 mb-10"
            >
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-sm">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-lg">Own the rails, not just the returns.</p>
                <p className="text-sm text-white/80">Capture value from every transaction on the network.</p>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, i) => (
                <StatBox key={i} label={stat.title} value={stat.value} delay={0.6 + (i * 0.1)} />
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}