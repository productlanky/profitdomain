"use client";

import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Box, 
  TrendingUp, 
  MapPin, 
  Bell, 
  Search,
  MoreHorizontal
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// --- Mockup Components ---

const DashboardRow = ({ icon: Icon, title, sub, value, trend, isPositive }: any) => (
  <div className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors cursor-default group">
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground group-hover:text-brand-400 group-hover:border-brand-500/30 transition-colors">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-bold text-foreground">{value}</p>
      {trend && (
        <p className={`text-xs ${isPositive ? 'text-emerald-400' : 'text-orange-400'}`}>
          {trend}
        </p>
      )}
    </div>
  </div>
);

export default function Control() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-background border-b border-border/40">
      
      {/* Background Glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT: CONTENT */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 border border-brand-500/20 px-3 py-1 text-xs font-medium text-brand-400"
            >
              <div className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
              Unified Operating System
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]"
            >
              Complete control over <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-indigo-400">
                pixels & packages.
              </span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground max-w-lg leading-relaxed"
            >
              Stop switching tabs. Monitor your high-growth tech portfolio while tracking global freight shipments in real-time. The first dashboard designed for the hybrid investor-operator.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Button size="lg" className="rounded-full bg-brand-500 hover:bg-brand-600 text-white px-8 h-12 shadow-lg shadow-brand-500/25">
                <Link href="/dashboard">Launch Dashboard</Link> <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="rounded-full border-border bg-transparent hover:bg-muted px-6 h-12">
                <Link href="#features">View Demo</Link>
              </Button>
            </motion.div>

            {/* Micro Stats */}
            <motion.div 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               transition={{ delay: 0.4 }}
               className="grid grid-cols-3 gap-6 pt-6 border-t border-border/50"
            >
              <div>
                <p className="text-2xl font-bold text-foreground">0.2s</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Data Latency</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">100%</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Transparency</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">24/7</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Support</p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: THE "COMMAND CENTER" UI MOCKUP */}
          <div className="relative perspective-[1200px] group">
            
            {/* The Main Interface Card */}
            <motion.div 
              initial={{ rotateY: -10, rotateX: 5, opacity: 0 }}
              whileInView={{ rotateY: -5, rotateX: 2, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10 bg-background/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden transform-gpu transition-transform duration-500 hover:rotate-0 hover:scale-[1.02]"
            >
              {/* Header Bar */}
              <div className="h-14 border-b border-border/50 flex items-center justify-between px-6 bg-muted/20">
                <div className="flex items-center gap-2">
                   <div className="flex gap-1.5">
                     <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                     <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                     <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                   </div>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                   <Search className="h-4 w-4" />
                   <Bell className="h-4 w-4" />
                   <div className="h-6 w-6 rounded-full bg-brand-500/20 border border-brand-500/50" />
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-6 grid gap-6">
                
                {/* Top Row: Total Net Worth */}
                <div className="flex justify-between items-end">
                   <div>
                     <p className="text-sm text-muted-foreground font-medium">Total Net Worth</p>
                     <h3 className="text-3xl font-bold text-foreground">$124,592.00</h3>
                   </div>
                   <div className="flex gap-2">
                      <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-bold flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" /> +8.2%
                      </span>
                      <span className="px-3 py-1 rounded-lg bg-brand-500/10 text-brand-500 text-xs font-bold">
                        1W
                      </span>
                   </div>
                </div>

                {/* Middle: The Split View (Chart + Map) */}
                <div className="grid grid-cols-3 gap-4 h-40">
                  {/* Fake Chart Area */}
                  <div className="col-span-2 rounded-xl bg-gradient-to-b from-brand-500/5 to-transparent border border-white/5 relative overflow-hidden">
                     <div className="absolute inset-0 flex items-end justify-between px-4 pb-0 pt-8 opacity-50">
                        <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                           <path d="M0 30 C 20 30, 30 10, 50 20 S 80 5, 100 15" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-500" />
                           <path d="M0 30 C 20 30, 30 10, 50 20 S 80 5, 100 15 L 100 50 L 0 50 Z" fill="url(#gradient)" className="opacity-20 text-brand-500" />
                           <defs>
                             <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="0%" stopColor="currentColor" />
                               <stop offset="100%" stopColor="transparent" />
                             </linearGradient>
                           </defs>
                        </svg>
                     </div>
                  </div>
                  
                  {/* Fake Map Area */}
                  <div className="col-span-1 rounded-xl bg-slate-900 border border-white/5 relative overflow-hidden group/map">
                     {/* Map Dots */}
                     <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]" />
                     <div className="absolute top-[30%] left-[20%] w-1.5 h-1.5 bg-white/20 rounded-full" />
                     <div className="absolute bottom-[40%] right-[20%] w-1.5 h-1.5 bg-white/20 rounded-full" />
                     
                     {/* Connection Line */}
                     <svg className="absolute inset-0 w-full h-full pointer-events-none">
                       <line x1="20%" y1="30%" x2="50%" y2="50%" stroke="rgba(255,255,255,0.1)" strokeDasharray="2 2" />
                     </svg>

                     <div className="absolute bottom-2 left-2 right-2 px-2 py-1 bg-black/60 backdrop-blur rounded text-[10px] text-white/80 border border-white/10 flex items-center justify-between">
                       <span>Route 4</span>
                       <span className="text-emerald-400">Active</span>
                     </div>
                  </div>
                </div>

                {/* Bottom List: Mixed Assets */}
                <div className="space-y-1">
                  <DashboardRow 
                    icon={TrendingUp} title="Tesla (TSLA)" sub="Equity • 15 Shares" 
                    value="$3,420.50" trend="+1.2%" isPositive={true} 
                  />
                  <DashboardRow 
                    icon={Box} title="Shipment #8832" sub="Lagos → London • In Transit" 
                    value="Est. 2 Days" trend="On Time" isPositive={true} 
                  />
                  <DashboardRow 
                    icon={MapPin} title="Real Estate Fund" sub="Dubai Unit • Tokenized" 
                    value="$12,000" trend="+0.4%" isPositive={true} 
                  />
                </div>
              </div>
            </motion.div>

            {/* Floating Notification Popups (Parallax effects) */}
            <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -right-8 top-20 z-20 bg-background border border-border rounded-xl p-4 shadow-xl flex items-center gap-3 w-64"
            >
               <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                 <Box className="h-5 w-5" />
               </div>
               <div>
                 <p className="text-xs font-bold text-foreground">Shipment Arrived</p>
                 <p className="text-[10px] text-muted-foreground">Order #9921 • London Hub</p>
               </div>
            </motion.div>

            <motion.div 
               animate={{ y: [0, 10, 0] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
               className="absolute -left-8 bottom-32 z-20 bg-background border border-border rounded-xl p-4 shadow-xl flex items-center gap-3 w-56"
            >
               <div className="h-10 w-10 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-500">
                 <TrendingUp className="h-5 w-5" />
               </div>
               <div>
                 <p className="text-xs font-bold text-foreground">Dividend Paid</p>
                 <p className="text-[10px] text-muted-foreground">+$240.00 • Apple Inc.</p>
               </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}