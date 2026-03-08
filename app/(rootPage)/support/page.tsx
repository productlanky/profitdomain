"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Mail, 
  Phone, 
  MessageSquare, 
  User, 
  TrendingUp, 
  Truck,  
  CreditCard,
  ChevronDown,
  ArrowRight,
  LifeBuoy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

// --- DATA ---
const CONTACT_METHODS = [
  {
    icon: MessageSquare,
    title: "Live Chat",
    desc: "Chat with our team real-time.",
    action: "Start Chat",
    sub: "Mon-Fri, 9am - 5pm UTC",
    href: "#",
  },
  {
    icon: Mail,
    title: "Email Support",
    desc: "For detailed inquiries & tickets.",
    action: "support@logixinvest.com",
    sub: "Response within 24h",
    href: "mailto:support@logixinvest.com",
  },
  {
    icon: Phone,
    title: "Phone Line",
    desc: "Urgent account assistance.",
    action: "+1 (888) 555-0123",
    sub: "Toll-free (US & CA)",
    href: "tel:+18885550123",
  },
];

const HELP_CATEGORIES = [
  {
    icon: User,
    title: "Account & KYC",
    desc: "Verification status, profile settings, and security.",
  },
  {
    icon: TrendingUp,
    title: "Investments",
    desc: "ROI calculations, plans, and asset logs.",
  },
  {
    icon: Truck,
    title: "Logistics",
    desc: "Tracking shipments, routes, and customs info.",
  },
  {
    icon: CreditCard,
    title: "Payments",
    desc: "Deposits, withdrawals, and wallet management.",
  },
];

const FAQS = [
  {
    q: "How long does KYC verification take?",
    a: "Automated verification usually takes 2-5 minutes. Manual reviews may take up to 24 hours depending on document clarity.",
  },
  {
    q: "Can I withdraw my principal early?",
    a: "Yes, but early withdrawals may incur a 5% fee depending on your selected investment plan's lock-up period.",
  },
  {
    q: "Where can I find my shipment ID?",
    a: "Navigate to the 'Shipments' tab in your dashboard. The Tracking ID (e.g., TRK-992) is listed next to the active order.",
  },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section className="relative min-h-screen bg-background overflow-hidden pt-24 pb-20">
      
      {/* --- BACKGROUND FX --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-500/10 blur-[120px] rounded-full -z-10" />

      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        
        {/* 1. HERO & SEARCH */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-400 mb-6"
          >
            <LifeBuoy className="h-3.5 w-3.5" />
            <span>24/7 Assistance</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6"
          >
            How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-indigo-400">help you?</span>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search for answers (e.g. 'Withdrawal limits')" 
              className="h-14 pl-12 rounded-2xl bg-white/5 border-white/10 backdrop-blur-md focus:border-brand-500 focus:bg-background/80 text-lg shadow-xl"
            />
          </motion.div>
        </div>

        {/* 2. CONTACT CARDS */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {CONTACT_METHODS.map((method, i) => (
            <motion.a
              key={i}
              href={method.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className="group relative p-6 rounded-3xl border border-border bg-card/50 hover:bg-card hover:border-brand-500/30 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="h-12 w-12 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <method.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{method.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{method.desc}</p>
              
              <div className="pt-4 border-t border-border/50">
                <p className="text-sm font-semibold text-brand-500 flex items-center gap-2">
                  {method.action} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </p>
                <p className="text-xs text-muted-foreground mt-1">{method.sub}</p>
              </div>
            </motion.a>
          ))}
        </div>

        {/* 3. HELP CATEGORIES */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-foreground mb-8">Browse by Topic</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HELP_CATEGORIES.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-2xl border border-border bg-white/5 hover:bg-white/10 hover:border-brand-500/30 cursor-pointer transition-all group"
              >
                <cat.icon className="h-8 w-8 text-muted-foreground group-hover:text-brand-500 mb-3 transition-colors" />
                <h4 className="font-semibold text-foreground">{cat.title}</h4>
                <p className="text-sm text-muted-foreground mt-1 leading-snug">{cat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 4. FAQ ACCORDION */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-border bg-card/30 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left font-medium text-foreground hover:bg-white/5 transition-colors"
                >
                  {faq.q}
                  <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 pt-0 text-muted-foreground text-sm leading-relaxed border-t border-border/50">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 5. BOTTOM CTA */}
        <div className="mt-20 p-8 md:p-10 rounded-3xl bg-brand-500/10 border border-brand-500/20 text-center">
           <h3 className="text-xl font-bold text-foreground mb-2">Still need help?</h3>
           <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
             Our dedicated support team is available around the clock to assist you with any issues.
           </p>
           <Button size="lg" className="rounded-full bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/20">
             <Link href="mailto:support@logixinvest.com">Submit a Ticket</Link>
           </Button>
        </div>

      </div>
    </section>
  );
}