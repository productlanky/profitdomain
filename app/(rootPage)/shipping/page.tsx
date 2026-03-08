"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Truck, 
  Package, 
  Map as MapIcon, 
  Globe, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Search,
  Anchor,
  Plane
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { companyName } from "@/lib/data/info";

// --- ANIMATION VARIANTS ---
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function ShippingPage() {
  const router = useRouter();
  const [trackingId, setTrackingId] = useState("");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      // Redirects to the tracking page with the ID as a query param
      router.push(`/tracking?id=${trackingId}`);
    }
  };

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      
      {/* --- BACKGROUND FX --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-500/10 blur-[120px] rounded-full -z-10" />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 px-4 md:px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="space-y-8"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
              <Globe className="h-3.5 w-3.5" />
              <span>Global Supply Chain</span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
              Logistics at the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-brand-500">
                speed of trade.
              </span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              We integrate physical logistics with digital finance. Track high-value assets, manage freight documentation, and settle shipping costs directly from your investment wallet.
            </motion.p>

            {/* TRACKING WIDGET */}
            <motion.div variants={fadeInUp} className="relative max-w-md">
              <form onSubmit={handleTrack} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-brand-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                <div className="relative flex items-center bg-background border border-white/10 rounded-xl p-2 shadow-2xl">
                  <Search className="ml-3 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder="Enter Tracking ID (e.g. SHP-8821)" 
                    className="border-none bg-transparent focus-visible:ring-0 text-base h-12"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                  />
                  <Button type="submit" size="lg" className="rounded-lg bg-foreground text-background hover:bg-foreground/90 font-bold px-6">
                    Track
                  </Button>
                </div>
              </form>
              <p className="mt-3 text-xs text-muted-foreground pl-2">
                Don't have an ID? <Link href="/signin" className="text-brand-500 hover:underline">Log in</Link> to view your active shipments.
              </p>
            </motion.div>
          </motion.div>

          {/* Visual: The Route Map */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative h-[500px] w-full rounded-[2.5rem] border border-white/10 bg-[#050505] overflow-hidden shadow-2xl group"
          >
            {/* Map Background */}
            <div className="absolute inset-0 opacity-30 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center invert dark:invert-0" />
            
            {/* Animated Route Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Route 1: NY to London */}
              <path d="M 280,180 Q 400,100 550,160" fill="none" stroke="url(#gradient1)" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
              {/* Route 2: London to Singapore */}
              <path d="M 550,160 Q 700,250 850,280" fill="none" stroke="url(#gradient1)" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse opacity-50" />
              
              <defs>
                <linearGradient id="gradient1" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Floating Shipment Card */}
            <motion.div 
              initial={{ y: 20 }}
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute top-1/3 left-1/2 -translate-x-1/2 p-5 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-xl w-64"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-white">In Transit</span>
                </div>
                <Plane className="h-4 w-4 text-blue-400" />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-white/50">Destination</p>
                <p className="text-lg font-bold text-white">London, UK</p>
                <p className="text-xs text-emerald-400">Est. Arrival: 2 Days</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-24 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Complete Supply Chain Control</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We treat logistics with the same rigor as financial transactions. Secure, transparent, and immutable.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "Secure Custody",
                desc: "High-value assets are insured and stored in secure bonded warehouses."
              },
              {
                icon: Clock,
                title: "Real-Time Updates",
                desc: "Millisecond-latency tracking updates via our global IoT network."
              },
              {
                icon: MapIcon,
                title: "Smart Routing",
                desc: "AI-driven route optimization to reduce costs and transit times."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-brand-500/30 hover:bg-white/10 transition-all"
              >
                <div className="h-14 w-14 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500 mb-6 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- MODE OF TRANSPORT --- */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left: Interactive List */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">Multi-Modal Logistics</h2>
              <p className="text-muted-foreground">
                Whether it's air freight for speed or ocean freight for volume, {companyName} manages the entire lifecycle.
              </p>
              
              <div className="space-y-4">
                {[
                  { icon: Plane, label: "Air Freight", sub: "1-3 Days • High Priority" },
                  { icon: Anchor, label: "Ocean Freight", sub: "15-30 Days • Bulk Volume" },
                  { icon: Truck, label: "Ground Transport", sub: "Last Mile Delivery" },
                ].map((mode, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <mode.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{mode.label}</h4>
                      <p className="text-xs text-muted-foreground">{mode.sub}</p>
                    </div>
                    <ArrowRight className="ml-auto h-4 w-4 text-white/20" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Integration Card */}
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#0F0F0F] to-black p-8 md:p-12 text-center">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-500/20 via-transparent to-transparent" />
               
               <div className="relative z-10">
                 <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 border border-white/20 mb-6">
                    <Package className="h-8 w-8 text-white" />
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-4">Unified Billing</h3>
                 <p className="text-white/60 mb-8">
                   Stop juggling invoices. Shipping costs are automatically deducted from your investment returns or wallet balance, keeping your cash flow optimized.
                 </p>
                 <Button className="rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold px-8 shadow-lg shadow-brand-500/25">
                   <Link href="/signup">Start Shipping</Link>
                 </Button>
               </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}