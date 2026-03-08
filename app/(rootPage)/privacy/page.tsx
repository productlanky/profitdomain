"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Download,
  ArrowLeft, 
  Printer
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { companyName } from "@/lib/data/info";

// --- CONTENT DATA ---
const SECTIONS = [
  {
    id: "collection",
    title: "1. Information We Collect",
    content: (
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-foreground mb-2">1.1 Personal Information</h4>
          <p className="text-muted-foreground leading-relaxed">
            We may collect personal details such as your name, email address, phone number, date of birth, address, and identity verification documents (KYC) required for compliance.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-foreground mb-2">1.2 Financial Information</h4>
          <p className="text-muted-foreground leading-relaxed">
            We collect information related to deposits, withdrawals, wallet addresses, transaction history, and investment portfolio performance.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-foreground mb-2">1.3 Technical Data</h4>
          <p className="text-muted-foreground leading-relaxed">
            This includes your IP address, browser type, device information, usage patterns, visit timestamps, and cookies to ensure platform security.
          </p>
        </div>
      </div>
    )
  },
  {
    id: "usage",
    title: "2. How We Use Your Data",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">We use your information to:</p>
        <ul className="grid gap-2">
          {[
            "Create and maintain your secure account",
            "Process investments, withdrawals, and blockchain transactions",
            "Verify identity (KYC) and prevent fraud (AML)",
            "Track shipments and investment performance in real-time",
            "Send security alerts and account notifications"
          ].map((item, i) => (
            <li key={i} className="flex gap-3 text-muted-foreground">
              <div className="h-6 w-6 rounded-full bg-brand-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <div className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              </div>
              {item}
            </li>
          ))}
        </ul>
        <p className="text-sm font-semibold text-foreground mt-4 border-l-2 border-brand-500 pl-4">
          We do <strong>not</strong> sell your personal data to third-party advertisers.
        </p>
      </div>
    )
  },
  {
    id: "sharing",
    title: "3. Sharing Information",
    content: (
      <p className="text-muted-foreground leading-relaxed">
        Your information may be shared with trusted third parties solely for operational purposes, including KYC verification partners, payment processors, cloud hosting providers, and logistics partners for shipment tracking. We maintain strict data processing agreements with all vendors.
      </p>
    )
  },
  {
    id: "security",
    title: "4. Security Protocols",
    content: (
      <p className="text-muted-foreground leading-relaxed">
        We utilize enterprise-grade security measures including AES-256 encryption, Multi-Factor Authentication (MFA), and cold storage for digital assets. While we implement the highest standards, no internet transmission is 100% secure.
      </p>
    )
  },
  {
    id: "rights",
    title: "5. Your Rights",
    content: (
      <p className="text-muted-foreground leading-relaxed">
        You retain full rights to access, correct, or request deletion of your personal data. You may also opt-out of non-essential marketing communications at any time via your dashboard settings.
      </p>
    )
  }
];

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("collection");

  useEffect(() => {
    const handleScroll = () => {
      // Offset for sticky header
      const scrollPosition = window.scrollY + 200;

      for (const section of SECTIONS) {
        const element = document.getElementById(section.id);
        if (
          element &&
          element.offsetTop <= scrollPosition &&
          (element.offsetTop + element.offsetHeight) > scrollPosition
        ) {
          setActiveSection(section.id);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 120,
        behavior: "smooth"
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    // FIX: Removed 'overflow-hidden' from main to allow sticky positioning
    <main className="min-h-screen bg-background relative print:bg-white print:text-black">

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page { margin: 2cm; }
          nav, footer, header, aside, #print, .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      {/* --- BACKGROUND FX --- 
          FIX: Moved into a fixed container so they don't cause scrollbars, 
          allowing us to remove overflow-hidden from the parent.
      */}
      <div className="fixed inset-0 z-0 pointer-events-none print:hidden overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20 lg:py-28 print:py-0 print:px-0">

        {/* --- HEADER --- */}
        <div className="mb-16 md:mb-24 print:mb-8">
          <Link
            href="/"
            id='print'
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-500 transition-colors mb-8 group no-print"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-500 no-print"
              >
                <Shield className="h-3.5 w-3.5" />
                <span>Legal Center</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold tracking-tight text-foreground print:text-black"
              >
                Privacy Policy
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground max-w-2xl text-lg print:text-gray-600"
              >
                Transparency is at the core of {companyName}. Learn how we protect your identity, data, and assets.
              </motion.p>
            </div>

            <div className="flex gap-3 no-print">
              <Button
                onClick={handlePrint}
                variant="outline"
                className="gap-2 hidden sm:flex border-border hover:bg-muted"
              >
                <Download className="h-4 w-4" /> Download PDF
              </Button>
              <Button
                onClick={handlePrint}
                variant="ghost"
                size="icon"
                className="sm:hidden"
              >
                <Printer className="h-4 w-4" />
              </Button>

              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Last Updated</p>
                <p className="text-sm font-medium text-foreground">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- MAIN LAYOUT --- */}
        <div className="grid lg:grid-cols-[280px_1fr] gap-12 lg:gap-20 relative items-start">

          {/* SIDEBAR - Sticky Fixed */}
          <aside className="hidden lg:block sticky top-28 no-print h-fit">
            <div className="space-y-2 border-l border-border/50 pl-4">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`
                     block w-full text-left text-sm py-2 px-2 rounded-lg transition-all duration-300
                     ${activeSection === section.id
                      ? "font-semibold text-brand-500 bg-brand-500/5 translate-x-1"
                      : "text-muted-foreground hover:text-foreground hover:translate-x-1"
                    }
                   `}
                >
                  {section.title}
                </button>
              ))}
            </div>
          </aside>

          {/* CONTENT AREA */}
          <div className="space-y-16 print:space-y-8">

            <div className="prose prose-slate dark:prose-invert max-w-none print:prose-black">
              <p className="text-lg text-foreground/80 leading-relaxed print:text-black">
                Welcome to <strong>{companyName}</strong>. This Privacy Policy applies to your use of our website, dashboard, and all related services. By accessing our platform, you consent to the data practices described in this statement.
              </p>
            </div>

            {SECTIONS.map((section, index) => (
              <section
                id={section.id}
                key={section.id}
                className="scroll-mt-32 print:break-inside-avoid"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-foreground font-bold border border-border no-print">
                    {index + 1}
                  </div>
                  <h2 className="text-2xl font-bold text-foreground print:text-black">
                    {section.title.replace(/^\d+\.\s/, '')}
                  </h2>
                </div>

                <div className="pl-0 md:pl-14 print:pl-4">
                  {section.content}
                </div>

                <div className="mt-12 h-px w-full bg-border/50 no-print" />
              </section>
            ))}

            {/* Contact Box */}
            <div className="rounded-3xl border border-border bg-card p-8 md:p-10 no-print">
              <h3 className="text-xl font-bold text-foreground mb-4">Have questions about your data?</h3>
              <p className="text-muted-foreground mb-6">
                Our Data Protection Officer is available to address any concerns regarding your privacy or security settings.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild className="rounded-full bg-foreground text-background hover:bg-foreground/90">
                  <Link href="/support">
                    Contact Support
                  </Link>
                </Button>
              </div>
            </div>

            {/* Print Footer */}
            <div className="hidden print:block pt-8 border-t border-gray-200 mt-8">
              <p className="text-sm text-gray-500">
                Generated from {companyName} website on {new Date().toLocaleDateString()}.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                support@{companyName.toLowerCase().replace(/\s/g, '')}.com
              </p>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}