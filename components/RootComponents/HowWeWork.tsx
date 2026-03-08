"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  Handshake, 
  Target, 
  ArrowRight,
  Zap 
} from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Outstanding Team",
    description: "We are 70+ investment professionals, including 24 partners with decade-long tenure, devoted to hands-on value creation.",
    icon: Users,
  },
  {
    id: "02",
    title: "Collaborative Style",
    description: "We partner with leadership rather than dictate. We align incentives to build cultures obsessed with long-term growth.",
    icon: Handshake,
  },
  {
    id: "03",
    title: "Alignment of Interest",
    description: "We put real skin in the game. Transparent communication and shared objectives build our strongest relationships.",
    icon: Target,
  },
];

export default function HowWeWork() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-background">
      
      {/* --- BACKGROUND FX --- */}
      {/* 1. Subtle Circuit Pattern */}
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      {/* 2. Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-brand-500/10 blur-[100px] rounded-full -z-10" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-400 mb-6"
          >
            <Zap className="h-3.5 w-3.5 fill-current" />
            <span>Operational DNA</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6"
          >
            Built for long-term <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-indigo-400">
              partnerships.
            </span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            We don’t just deploy capital. We roll up our sleeves, align incentives, and build with founders across market cycles.
          </motion.p>
        </div>

        {/* --- PROCESS GRID --- */}
        <div className="relative grid md:grid-cols-3 gap-8">
          
          {/* Connector Line (Desktop Only) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent border-t border-dashed border-brand-500/30 -z-10" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.6 }}
                className="group relative"
              >
                <div className="
                  relative h-full flex flex-col p-8 rounded-3xl 
                  border border-border/50 bg-background/50 backdrop-blur-sm
                  transition-all duration-500
                  hover:bg-brand-500/5 hover:border-brand-500/30 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-500/10
                ">
                  
                  {/* Big Background Number */}
                  <div className="absolute top-2 right-6 text-8xl font-black text-foreground/5 select-none transition-colors group-hover:text-brand-500/10">
                    {step.id}
                  </div>

                  {/* Icon */}
                  <div className="mb-6 relative">
                    <div className="
                      h-14 w-14 flex items-center justify-center rounded-2xl 
                      bg-gradient-to-br from-muted to-muted/50 border border-white/10
                      group-hover:from-brand-500 group-hover:to-brand-600 group-hover:text-white
                      transition-all duration-500 shadow-lg group-hover:shadow-brand-500/30
                    ">
                      <Icon className="h-6 w-6 text-foreground group-hover:text-white transition-colors" />
                    </div>
                    {/* Pulsing Ring on Hover */}
                    <div className="absolute -inset-2 rounded-2xl border border-brand-500/0 group-hover:border-brand-500/30 group-hover:scale-110 transition-all duration-500" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-brand-500 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {step.description}
                  </p>

                  {/* Arrow Decoration */}
                  <div className="mt-auto pt-6 flex items-center text-sm font-semibold text-brand-500 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                    <span>How we do it</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>

                  {/* Active Bottom Border */}
                  <div className="absolute bottom-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}