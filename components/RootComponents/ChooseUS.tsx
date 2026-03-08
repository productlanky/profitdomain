"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit,
  Layers,
  ShieldCheck,
  Landmark,
  ArrowRight
} from "lucide-react"; // Assuming you might want images, though icons are used here

const features = [
  {
    id: 0,
    title: "Elite Intelligence",
    description: "Our proprietary algorithms aggregate on-chain data, sentiment analysis, and macro-economic indicators to spot opportunities before the market moves.",
    icon: BrainCircuit,
    color: "from-blue-500 to-cyan-400"
  },
  {
    id: 1,
    title: "Unique Asset Classes",
    description: "Access a curated selection of tokenized real-world assets (RWAs), pre-market allocations, and high-yield DeFi instruments usually reserved for institutions.",
    icon: Layers,
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 2,
    title: "Military-Grade Security",
    description: "Your capital is safeguarded by MPC (Multi-Party Computation) cryptography, time-locked withdrawals, and 24/7 active threat monitoring.",
    icon: ShieldCheck,
    color: "from-emerald-500 to-green-400"
  },
  {
    id: 3,
    title: "Institutional Backing",
    description: "We are supported by tier-1 venture firms with over $400B in assets under management, ensuring deep liquidity and long-term solvency.",
    icon: Landmark,
    color: "from-orange-500 to-amber-400"
  },
];

export default function ChooseUs() {
  const [activeId, setActiveId] = useState(0);

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-background">

      {/* BACKGROUND ELEMENTS */}
      <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] bg-brand-500/10 blur-[120px] rounded-full mix-blend-screen" />
      <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] bg-blue-600/10 blur-[100px] rounded-full mix-blend-screen" />

      <div className="container mx-auto px-4 md:px-6">

        {/* HEADER */}
        <div className="mb-16 md:mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground max-w-2xl"
          >
            Why we lead the <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-500 to-indigo-400">
              new economy.
            </span>
          </motion.h2>
        </div>

        {/* --- INTERACTIVE SPLIT LAYOUT --- */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT COLUMN: NAVIGATION LIST */}
          <div className="space-y-4">
            {features.map((feature) => (
              <div
                key={feature.id}
                onMouseEnter={() => setActiveId(feature.id)}
                className={`
                  group relative cursor-pointer rounded-2xl border px-6 py-6 transition-all duration-500
                  ${activeId === feature.id
                    ? "bg-brand-500/5 border-brand-500/30"
                    : "bg-transparent border-transparent hover:bg-white/5"
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Number Indicator */}
                    <span className={`
                      text-sm font-mono transition-colors duration-300
                      ${activeId === feature.id ? "text-brand-500 font-bold" : "text-muted-foreground/50"}
                    `}>
                      0{feature.id + 1}
                    </span>

                    <h3 className={`
                      text-xl font-bold transition-colors duration-300
                      ${activeId === feature.id ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}
                    `}>
                      {feature.title}
                    </h3>
                  </div>

                  {/* Arrow Indicator */}
                  <ArrowRight className={`
                    h-5 w-5 transition-all duration-300 
                    ${activeId === feature.id ? "opacity-100 translate-x-0 text-brand-500" : "opacity-0 -translate-x-4 text-muted-foreground"}
                  `} />
                </div>

                {/* Mobile-Only Description (Visible on small screens, hidden on LG) */}
                <div className={`lg:hidden overflow-hidden transition-all duration-300 ${activeId === feature.id ? "max-h-40 mt-4 opacity-100" : "max-h-0 opacity-0"}`}>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT COLUMN: HOLOGRAPHIC DISPLAY (Sticky on Desktop) */}
          <div className="relative h-[400px] md:h-[500px] w-full hidden lg:block perspective-1000">
            <AnimatePresence mode="wait">
              {features.map((feature) => (
                feature.id === activeId && (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, x: 20, rotateY: -10 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    exit={{ opacity: 0, x: -20, rotateY: 10 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute inset-0"
                  >
                    {/* THE GLASS CARD */}
                    <div className="
                      relative h-full w-full overflow-hidden rounded-[2.5rem] 
                      border border-white/10 bg-linear-to-br from-white/10 to-white/5 
                      backdrop-blur-2xl shadow-2xl dark:bg-black/40
                    ">

                      {/* Dynamic linear Blob Background */}
                      <div className={`absolute top-0 right-0 h-[400px] w-[400px] bg-linear-to-br ${feature.color} opacity-20 blur-[100px] rounded-full`} />

                      <div className="relative z-10 h-full flex flex-col justify-between p-10 md:p-12">

                        {/* Top: Icon */}
                        <div>
                          <div className={`
                            inline-flex h-20 w-20 items-center justify-center rounded-3xl 
                            bg-linear-to-br ${feature.color} shadow-lg shadow-black/20 text-white mb-8
                          `}>
                            <feature.icon className="h-10 w-10" />
                          </div>

                          <h4 className="text-3xl font-bold text-foreground mb-4">
                            {feature.title}
                          </h4>
                          <p className="text-lg text-muted-foreground leading-relaxed">
                            {feature.description}
                          </p>
                        </div>

                        {/* Bottom: Decoration */}
                        <div className="flex items-center gap-3">
                          <div className="h-px flex-1 bg-border" />
                          <div className="flex gap-1">
                            {[1, 2, 3].map(i => (
                              <div key={i} className="h-1.5 w-1.5 rounded-full bg-foreground/20" />
                            ))}
                          </div>
                          <div className="text-xs font-mono text-muted-foreground">
                            SYS.ID_0{feature.id + 1}
                          </div>
                        </div>

                      </div>

                      {/* Noise Texture Overlay */}
                      <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none" />

                      {/* Shine Effect */}
                      <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none" />
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>

            {/* Background Decor showing depth */}
            <div className="absolute top-10 -right-10 -z-10 h-full w-full rounded-[2.5rem] border border-white/5 bg-white/5 backdrop-blur-sm scale-95" />
          </div>

        </div>
      </div>
    </section>
  );
}