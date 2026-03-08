"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  AlertTriangle, 
  Download, 
  ArrowLeft,
  Printer,
  TrendingDown,
  ZapOff,
  FileWarning,
  Info
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { companyName } from "@/lib/data/info";

// --- CONTENT DATA ---
const SECTIONS = [
  {
    id: "general",
    title: "1. General Investment Risks",
    content: (
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-4 items-start">
          <AlertTriangle className="h-6 w-6 text-red-500 shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-red-700 dark:text-red-400 text-sm mb-1">Capital at Risk</h4>
            <p className="text-xs md:text-sm text-red-600/80 dark:text-red-400/70 leading-relaxed">
              Trading and investing involves a significant risk of loss. You should only invest money that you can afford to lose. Past performance is not indicative of future results.
            </p>
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          The value of investments can go down as well as up. You may not get back the amount you invested. Market conditions can change rapidly due to economic data, geopolitical events, or changes in market sentiment.
        </p>
      </div>
    )
  },
  {
    id: "crypto",
    title: "2. Crypto Asset Risks",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Cryptocurrencies and digital tokens are highly volatile and unregulated in many jurisdictions.
        </p>
        <ul className="grid gap-3">
          <li className="flex gap-3 text-muted-foreground">
            <TrendingDown className="h-5 w-5 text-amber-500 shrink-0" />
            <span><strong>Volatility:</strong> Prices can fluctuate wildly within minutes. Sudden market movements can lead to liquidation of positions.</span>
          </li>
          <li className="flex gap-3 text-muted-foreground">
            <FileWarning className="h-5 w-5 text-amber-500 shrink-0" />
            <span><strong>Regulation:</strong> Regulatory changes or bans in specific countries may impact your ability to access or trade assets.</span>
          </li>
          <li className="flex gap-3 text-muted-foreground">
            <ZapOff className="h-5 w-5 text-amber-500 shrink-0" />
            <span><strong>Irreversibility:</strong> Blockchain transactions are irreversible. Funds sent to the wrong address cannot be recovered.</span>
          </li>
        </ul>
      </div>
    )
  },
  {
    id: "technology",
    title: "3. Technology & Operational Risks",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          While {companyName} utilizes enterprise-grade security, online trading relies on technology systems that may fail.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
           <div className="p-4 rounded-xl border border-border/50 bg-card">
             <h4 className="font-semibold text-foreground text-sm mb-2">System Latency</h4>
             <p className="text-xs text-muted-foreground">Delays in execution due to internet connectivity or high platform traffic.</p>
           </div>
           <div className="p-4 rounded-xl border border-border/50 bg-card">
             <h4 className="font-semibold text-foreground text-sm mb-2">Cyber Security</h4>
             <p className="text-xs text-muted-foreground">Risk of unauthorized access, phishing attacks, or breach of personal devices.</p>
           </div>
        </div>
      </div>
    )
  },
  {
    id: "liquidity",
    title: "4. Liquidity Risks",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          In certain market conditions, it may be difficult or impossible to liquidate a position. This can occur when there is insufficient demand for the asset you hold, or during periods of extreme market stress (circuit breakers).
        </p>
        <p className="text-muted-foreground leading-relaxed">
          {companyName} does not guarantee that there will always be a buyer for every asset listed on the platform.
        </p>
      </div>
    )
  },
  {
    id: "advice",
    title: "5. No Financial Advice",
    content: (
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-600/90 dark:text-blue-400/90 leading-relaxed">
            <strong>Disclaimer:</strong> {companyName} provides an execution-only service. We do not provide financial, tax, or legal advice. Any information provided on this site is for educational purposes only.
          </p>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          You should consult with a qualified financial advisor before making any investment decisions to ensure they align with your financial goals and risk tolerance.
        </p>
      </div>
    )
  }
];

export default function RiskDisclosure() {
  const [activeSection, setActiveSection] = useState("general");

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
      
      {/* Print Styles */}
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
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 blur-[120px] rounded-full" />
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
                className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-500 no-print"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Important Warning</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold tracking-tight text-foreground print:text-black"
              >
                Risk Disclosure
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground max-w-2xl text-lg print:text-gray-600"
              >
                Please read this document carefully. It outlines the potential risks associated with using {companyName} services and trading financial assets.
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
          
          {/* SIDEBAR */}
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
                By creating an account and using the <strong>{companyName}</strong> platform, you acknowledge that you have read, understood, and accepted the risks detailed below. Investment markets are inherently unpredictable, and you assume full responsibility for your financial decisions.
              </p>
            </div>

            {SECTIONS.map((section, index) => (
              <section
                id={section.id}
                key={section.id}
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
              </section>
            ))}

            {/* Contact Box */}
            <div className="rounded-3xl border border-border bg-card p-8 md:p-10 no-print">
               <h3 className="text-xl font-bold text-foreground mb-4">Unsure about the risks?</h3>
               <p className="text-muted-foreground mb-6">
                 If you do not understand the risks involved, you should seek independent advice from a certified financial professional before investing.
               </p>
               <div className="flex flex-wrap gap-4">
                  <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90">
                    Contact Compliance
                  </Button>
               </div>
            </div>

            {/* Print Footer */}
            <div className="hidden print:block pt-8 border-t border-gray-200 mt-8">
              <p className="text-sm text-gray-500">
                Generated from {companyName} website on {new Date().toLocaleDateString()}.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                compliance@{companyName.toLowerCase().replace(/\s/g, '')}.com
              </p>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}