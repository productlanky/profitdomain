"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Download,
  ArrowLeft,
  Printer,
  Scale
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { companyName } from "@/lib/data/info";

// --- CONTENT DATA ---
const SECTIONS = [
  {
    id: "eligibility",
    title: "1. Eligibility",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          By accessing our platform, you confirm that you meet the following criteria:
        </p>
        <ul className="grid gap-2">
          {[
            "You are at least 18 years of age.",
            "You have the legal capacity to enter into binding contracts.",
            "You are not located in a jurisdiction where using our services is prohibited.",
            "All information provided during registration is accurate and verifiable."
          ].map((item, i) => (
            <li key={i} className="flex gap-3 text-muted-foreground">
              <div className="h-1.5 w-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground mt-2">
          We reserve the right to suspend accounts that fail to meet these criteria or provide false information.
        </p>
      </div>
    )
  },
  {
    id: "account",
    title: "2. Account Registration",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          To use investment features, you must create a secure account and complete mandatory KYC (Know Your Customer) verification. You are responsible for maintaining the confidentiality of your login credentials.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          You agree to notify us immediately of any unauthorized use of your account. We are not liable for losses resulting from stolen credentials or compromised devices.
        </p>
      </div>
    )
  },
  {
    id: "investments",
    title: "3. Investments & Returns",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          {companyName} offers various investment tiers. By funding an account, you acknowledge:
        </p>
        <ul className="grid gap-2">
          {[
            "All investments carry inherent market risks.",
            "Past performance does not guarantee future results.",
            "Returns are calculated based on the specific plan terms selected at the time of deposit.",
            "Early withdrawals may be subject to fees or forfeiture of accrued profits as per plan rules."
          ].map((item, i) => (
            <li key={i} className="flex gap-3 text-muted-foreground">
              <div className="h-1.5 w-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    )
  },
  {
    id: "transactions",
    title: "4. Deposits & Withdrawals",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          <strong>Deposits:</strong> Must be made via supported cryptocurrencies or bank transfers. We are not responsible for funds sent to incorrect wallet addresses.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          <strong>Withdrawals:</strong> Processed according to the timelines stated in your plan. Identity verification may be required before releasing large sums to prevent money laundering (AML).
        </p>
      </div>
    )
  },
  {
    id: "shipment",
    title: "5. Shipment Services",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          For users utilizing our logistics and asset tracking tools:
        </p>
        <ul className="grid gap-2">
          {[
            "Tracking data is provided by third-party logistics partners.",
            "Estimated Time of Arrival (ETA) is an estimate, not a guarantee.",
            "We are not liable for physical damages caused by external carriers during transit."
          ].map((item, i) => (
            <li key={i} className="flex gap-3 text-muted-foreground">
              <div className="h-1.5 w-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    )
  },
  {
    id: "prohibited",
    title: "6. Prohibited Activities",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          You agree NOT to use the platform for:
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
            Money laundering or financing terrorism.
          </div>
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
            Attempting to hack or disrupt platform services.
          </div>
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
            Creating multiple accounts to exploit referral bonuses.
          </div>
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
            Providing false identification documents.
          </div>
        </div>
      </div>
    )
  },
  {
    id: "liability",
    title: "7. Limitation of Liability",
    content: (
      <p className="text-muted-foreground leading-relaxed">
        To the maximum extent permitted by law, {companyName} shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of the service, market volatility, or third-party service failures.
      </p>
    )
  },
  {
    id: "termination",
    title: "8. Termination",
    content: (
      <p className="text-muted-foreground leading-relaxed">
        We reserve the right to suspend or terminate your account immediately, without prior notice, if you breach these Terms. Upon termination, your right to use the Service will immediately cease.
      </p>
    )
  }
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("eligibility");

  // Handle scroll spy
  useEffect(() => {
    const handleScroll = () => {
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
    <main className="min-h-screen bg-background relative print:bg-white print:text-black">

      {/* Global Print Styles */}
      <style jsx global>{`
        @media print {
          @page { margin: 2cm; }
          nav, footer, header, aside, #print, .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      {/* --- BACKGROUND FX --- */}
      <div className="fixed inset-0 z-0 pointer-events-none print:hidden overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20 lg:py-28 print:py-0 print:px-0">

        {/* --- HEADER --- */}
        <div className="mb-16 md:mb-24 print:mb-8">
          <Link
            href="/"
            id="print"
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
                <Scale className="h-3.5 w-3.5" />
                <span>Legal Agreement</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold tracking-tight text-foreground print:text-black"
              >
                Terms & Conditions
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground max-w-2xl text-lg print:text-gray-600"
              >
                Please read these terms carefully before using {companyName}. They govern your access to our investment and logistics services.
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

            {/* Intro Text */}
            <div className="prose prose-slate dark:prose-invert max-w-none print:prose-black">
              <p className="text-lg text-foreground/80 leading-relaxed print:text-black">
                Welcome to <strong>{companyName}</strong> ("we", "our", "us"). By accessing our website, dashboard, or mobile applications, you agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use our services.
              </p>
            </div>

            {/* Dynamic Sections */}
            {SECTIONS.map((section, index) => (
              <motion.section
                id={section.id}
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="scroll-mt-32 print:break-inside-avoid"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-foreground font-bold border border-border print:border-black print:text-black print:bg-transparent">
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
              </motion.section>
            ))}

            {/* Contact Box */}
            <div className="rounded-3xl border border-border bg-card p-8 md:p-10 no-print">
              <h3 className="text-xl font-bold text-foreground mb-4">Have questions about these terms?</h3>
              <p className="text-muted-foreground mb-6">
                If any part of these Terms & Conditions is unclear, please contact our legal team before proceeding with any investment.
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