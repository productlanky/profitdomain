"use client";

import { motion } from "framer-motion";
import {
  Rocket,
  LineChart,
  Wallet,
  BarChart3,
  Bitcoin,
  Bell,
  Truck,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

const services = [
  {
    icon: Rocket,
    title: "Fractional Tech Shares",
    description:
      "Direct exposure to global innovators like Tesla, SpaceX, and Neuralink. We handle the share logs; you handle the growth.",
  },
  {
    icon: Bitcoin,
    title: "Crypto Portfolios",
    description:
      "A unified engine for spot trading, long-term HODLing, and DeFi yield generation across multiple chains.",
  },
  {
    icon: Truck,
    title: "Logistics Tracking",
    description:
      "Bridge the physical and digital. Link real-world shipments to investment profiles with live map tracking.",
  },
  {
    icon: LineChart,
    title: "Live Analytics",
    description:
      "Real-time PL (Profit/Loss) views combining deposits, share value, and shipment inventory in one dashboard.",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description:
      "Automated push notifications for dividend payouts, shipment arrivals, and KYC status updates.",
  },
  {
    icon: Wallet,
    title: "Secure Custody",
    description:
      "Bank-grade wallet management with multi-signature security, withdrawal limits, and audit trails.",
  },
];

const ServiceCard = ({ icon: Icon, title, description, index }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative h-full"
    >
      <div className="
        relative h-full overflow-hidden rounded-[2rem] 
        border border-white/10 bg-white/5 
        backdrop-blur-md p-8 
        transition-all duration-500
        hover:border-brand-500/30 hover:bg-white/10 hover:-translate-y-1
      ">
        
        {/* Hover Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Icon */}
        <div className="relative mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 shadow-lg shadow-brand-500/20 group-hover:scale-110 transition-transform duration-500">
          <Icon className="h-6 w-6 text-white" />
          {/* Inner Glow */}
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-brand-500 transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {/* Bottom Arrow Action */}
        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
          <span className="text-xs font-mono text-muted-foreground/50 group-hover:text-brand-500/70 transition-colors">
            0{index + 1}
          </span>
          <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function ServicesSection() {
  return (
    <section id="services" className="relative py-24 lg:py-32 overflow-hidden bg-background">
      
      {/* --- BACKGROUND FX --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      {/* Floating Orbs */}
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-brand-500/5 blur-[120px]" />
      <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-400 mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500"></span>
            </span>
            Ecosystem Features
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6"
          >
            A unified engine for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-indigo-400">
              modern wealth.
            </span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            From fractional stocks to blockchain assets and logistics, manage your entire empire from one dashboard.
          </motion.p>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} index={index} />
          ))}
        </div>

        {/* BOTTOM CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Button
            size="lg"
            className="rounded-full h-12 px-8 text-sm font-bold bg-foreground text-background hover:bg-foreground/90 shadow-xl"
            asChild
          >
            <Link href="/signup">Explore Platform Capabilities</Link>
          </Button>
        </motion.div>

      </div>
    </section>
  );
}