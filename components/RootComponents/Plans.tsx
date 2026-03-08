"use client";

import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles, Zap } from "lucide-react";

const PlanContent = [
  {
    type: "Starter",
    amount: "1,000",
    description: "Perfect for testing the waters.",
    offers: ["Max Investment: $3,000", "2% Referral Bonus", "10% Total ROI", "3% Daily Accrual"],
    highlight: false,
    color: "bg-blue-500",
  },
  {
    type: "Standard",
    amount: "5,000",
    description: "The sweet spot for growth.",
    offers: ["Max Investment: $15,000", "4% Referral Bonus", "15% Total ROI", "5% Daily Accrual"],
    highlight: true,
    color: "bg-brand-500", // Matches your theme
  },
  {
    type: "Premium",
    amount: "10,000",
    description: "For serious wealth building.",
    offers: ["Max Investment: $30,000", "6% Referral Bonus", "20% Total ROI", "7% Daily Accrual"],
    highlight: false,
    color: "bg-purple-500",
  },
  {
    type: "Elite",
    amount: "50,000",
    description: "Maximum leverage & returns.",
    offers: ["Max Investment: $150,000", "10% Referral Bonus", "30% Total ROI", "10% Daily Accrual"],
    highlight: false,
    color: "bg-emerald-500",
  },
];

export default function Plans() {
  return (
    <section className="relative px-4 md:px-6 lg:px-8 py-24 lg:py-32 overflow-hidden bg-background">
      
      {/* --- BACKGROUND FX --- */}
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-brand-500/10 blur-[100px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADING */}
        <div className="text-center space-y-4 mb-20 max-w-3xl mx-auto">
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-400"
          >
            <Sparkles className="h-3.5 w-3.5 fill-current" />
            <span>Wealth Tiers</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-foreground"
          >
            Invest at your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-indigo-400">
              level of ambition.
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            Scale your portfolio with plans designed for every stage of the investor journey.
          </motion.p>
        </div>

        {/* PLANS GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
          {PlanContent.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative group h-full"
            >
              {/* Highlight Glow Effect (Only for popular plan) */}
              {plan.highlight && (
                <div className="absolute -inset-[2px] rounded-[22px] bg-gradient-to-b from-brand-500 via-indigo-500 to-brand-500 opacity-70 blur-sm group-hover:opacity-100 transition-opacity duration-500" />
              )}

              {/* Card Container */}
              <div className={`
                relative h-full flex flex-col p-6 rounded-[20px] 
                backdrop-blur-xl border transition-all duration-300
                ${plan.highlight 
                  ? "bg-background/90 border-transparent shadow-2xl shadow-brand-500/20" 
                  : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 dark:bg-white/5"
                }
              `}>
                
                {/* Popular Badge */}
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-500 to-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg shadow-brand-500/40">
                    Most Popular
                  </div>
                )}

                {/* Header */}
                <div className="mb-6 space-y-2">
                  <h3 className={`text-lg font-bold ${plan.highlight ? "text-brand-500" : "text-foreground"}`}>
                    {plan.type}
                  </h3>
                  <p className="text-xs text-muted-foreground h-8">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl text-muted-foreground">$</span>
                    <span className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                      {plan.amount}
                    </span>
                  </div>
                  <div className={`h-1 w-full mt-4 rounded-full bg-gradient-to-r ${plan.highlight ? "from-brand-500 to-transparent" : "from-border to-transparent"}`} />
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.offers.map((offer, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <div className={`
                        mt-0.5 h-4 w-4 rounded-full flex items-center justify-center shrink-0 
                        ${plan.highlight ? "bg-brand-500/20 text-brand-500" : "bg-white/10 text-muted-foreground"}
                      `}>
                        <Check className="h-2.5 w-2.5" />
                      </div>
                      <span className={plan.highlight ? "text-foreground" : ""}>{offer}</span>
                    </li>
                  ))}
                </ul>

                {/* Action Button */}
                <Button
                  className={`
                    w-full rounded-xl h-12 font-semibold tracking-wide transition-all duration-300
                    ${plan.highlight
                      ? "bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-1"
                      : "bg-white/5 hover:bg-white/10 text-foreground border border-white/10"
                    }
                  `}
                  asChild
                >
                  <Link href="/signup">
                    {plan.highlight ? "Start Growing" : "Select Plan"}
                  </Link>
                </Button>

              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicator */}
        <div className="mt-16 text-center">
           <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
             <Zap className="h-4 w-4 text-emerald-500 fill-emerald-500" />
             <span>Instant activation upon deposit confirmation.</span>
           </p>
        </div>

      </div>
    </section>
  );
}