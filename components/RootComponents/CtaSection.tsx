"use client";

import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, LogIn } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden px-4 md:px-6">
      
      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="
            relative overflow-hidden rounded-[2.5rem]
            border border-white/10 dark:border-white/5
            bg-[#0F1115] dark:bg-black
            shadow-2xl shadow-brand-500/10
            px-6 py-16 md:px-12 md:py-20 text-center
          "
        >
          {/* --- BACKGROUND FX --- */}
          
          {/* 1. Gradient Mesh */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 via-transparent to-blue-600/10 opacity-50" />
          
          {/* 2. Noise Texture */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
          
          {/* 3. Glowing Orb */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-500/20 blur-[120px] rounded-full pointer-events-none" />

          {/* 4. Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_100%,transparent_0%)] opacity-30" />

          {/* --- CONTENT --- */}
          <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto">
            
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/80 mb-8 backdrop-blur-md"
            >
              <Sparkles className="h-3.5 w-3.5 text-brand-400" />
              <span>Join 2,000+ Investors</span>
            </motion.div>

            {/* Headline */}
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight"
            >
              Ready to upgrade your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-300">
                operating system?
              </span>
            </motion.h2>

            {/* Subtext */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-white/60 mb-10 max-w-xl leading-relaxed"
            >
              Stop managing your wealth in spreadsheets. Get unified control over your investments and logistics today.
            </motion.p>

            {/* Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link
                href="/signup"
                className="
                  group relative w-full sm:w-auto inline-flex items-center justify-center gap-2
                  rounded-full bg-brand-500 px-8 py-4 text-sm font-bold text-white
                  shadow-lg shadow-brand-500/25 transition-all duration-300
                  hover:bg-brand-400 hover:scale-105 hover:shadow-brand-500/40
                "
              >
                Create Free Account
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/signin"
                className="
                  group w-full sm:w-auto inline-flex items-center justify-center gap-2
                  rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white
                  backdrop-blur-md transition-all duration-300
                  hover:bg-white/10 hover:border-white/20
                "
              >
                <LogIn className="h-4 w-4 text-white/70" />
                Login to Dashboard
              </Link>
            </motion.div>

            {/* Trust Note */}
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-xs text-white/40"
            >
              No credit card required for account creation.
            </motion.p>

          </div>
        </motion.div>
      </div>
    </section>
  );
}