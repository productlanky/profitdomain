"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { 
  Globe, 
  UserCheck, 
  CreditCard, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const steps = [
  {
    id: "01",
    title: "Access the Platform",
    description: "Visit our secure portal. No software to download—just log in from any device, anywhere in the world.",
    icon: Globe,
  },
  {
    id: "02",
    title: "Verify Identity (KYC)",
    description: "Complete our automated identity check. It takes less than 2 minutes and keeps the ecosystem secure for everyone.",
    icon: UserCheck,
  },
  {
    id: "03",
    title: "Fund & Activate",
    description: "Select your tier, deposit funds via crypto or fiat, and watch your dashboard update in real-time.",
    icon: CreditCard,
  },
];

export default function HowItWorksSection() {
  return (
    <section className="relative px-4 md:px-8 py-24 lg:py-32 overflow-hidden bg-background border-t border-border/40">
      
      {/* --- BACKGROUND FX --- */}
      <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] bg-brand-500/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 -z-10 h-[400px] w-[400px] bg-indigo-500/5 blur-[100px] rounded-full" />

      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* LEFT: TIMELINE STEPS */}
          <div className="relative">
            
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-400 mb-6">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Onboarding Flow</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
                Start investing in <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-indigo-400">
                  three simple steps.
                </span>
              </h2>
              <p className="text-muted-foreground text-lg">
                We've removed the friction. Go from visitor to active investor in under 10 minutes.
              </p>
            </motion.div>

            {/* Steps Container */}
            <div className="space-y-8 relative">
              
              {/* Vertical Connecting Line (The "Track") */}
              <div className="absolute left-[27px] top-4 bottom-12 w-[2px] bg-gradient-to-b from-brand-500 via-brand-500/20 to-transparent hidden sm:block" />

              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="relative flex gap-6 group"
                  >
                    {/* Icon/Number Column */}
                    <div className="relative shrink-0">
                      <div className="h-14 w-14 rounded-2xl bg-background border border-border flex items-center justify-center relative z-10 group-hover:border-brand-500/50 group-hover:bg-brand-500/5 transition-all duration-300 shadow-lg shadow-black/5">
                        <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg border border-background">
                          {step.id}
                        </span>
                        <Icon className="h-6 w-6 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                      </div>
                    </div>

                    {/* Text Column */}
                    <div className="pt-2 pb-8 border-b border-border/40 w-full group-last:border-0">
                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-brand-500 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm max-w-md">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-8 pl-0 sm:pl-20"
            >
              <Button size="lg" className="rounded-full bg-foreground text-background hover:bg-foreground/90 font-semibold px-8 h-12">
                <Link href="/signup">Join Platform Now</Link> <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>

          </div>

          {/* RIGHT: VISUAL MOCKUP */}
          <div className="relative">
             {/* Main Image Card */}
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, rotate: 1 }}
               whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.7 }}
               className="relative z-10 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-background/50"
             >
                <Image
                  src="/images/body/signup-plan.jpg"
                  alt="Onboarding"
                  width={800}
                  height={800}
                  className="w-full h-auto object-cover opacity-90"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

                {/* Floating "Success" Card */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="absolute bottom-8 left-8 right-8 p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">Account Verified</h4>
                      <p className="text-sm text-white/70">You are ready to invest.</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                     <div className="h-1.5 flex-1 rounded-full bg-emerald-500/50" />
                     <div className="h-1.5 flex-1 rounded-full bg-emerald-500/50" />
                     <div className="h-1.5 flex-1 rounded-full bg-emerald-500" />
                  </div>
                </motion.div>
             </motion.div>

             {/* Decorative Elements */}
             <div className="absolute -top-10 -right-10 h-64 w-64 bg-brand-500/20 blur-[80px] rounded-full -z-10" />
             <div className="absolute top-1/2 -left-12 h-24 w-24 bg-indigo-500/30 blur-[40px] rounded-full -z-10" />
          </div>

        </div>
      </div>
    </section>
  );
}