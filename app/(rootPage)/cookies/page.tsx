"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Cookie, 
  Settings, 
  ShieldCheck, 
  Download, 
  ArrowLeft,
  Printer,
  ToggleLeft,
  Info
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { companyName } from "@/lib/data/info";

// --- CONTENT DATA ---
const SECTIONS = [
  {
    id: "what-are-cookies",
    title: "1. What Are Cookies?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          <strong>Session Cookies:</strong> These are temporary cookies that expire when you close your browser.
          <br />
          <strong>Persistent Cookies:</strong> These remain on your device until they expire or you delete them.
        </p>
      </div>
    )
  },
  {
    id: "how-we-use",
    title: "2. How We Use Cookies",
    content: (
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          We use cookies to distinguish you from other users of our platform. This helps us provide you with a seamless experience when you browse our dashboard and allows us to improve our site securely.
        </p>
        
        {/* Cookie Types Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="p-4 rounded-xl bg-card border border-border/50">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <h4 className="font-bold text-foreground text-sm">Strictly Necessary</h4>
            </div>
            <p className="text-xs text-muted-foreground">
              Essential for the website to function (e.g., secure log-in, session management). These cannot be switched off.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border/50">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="h-5 w-5 text-blue-500" />
              <h4 className="font-bold text-foreground text-sm">Functionality</h4>
            </div>
            <p className="text-xs text-muted-foreground">
              Remember your choices (like language or region) to provide enhanced, personalized features.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border/50">
            <div className="flex items-center gap-3 mb-2">
              <Info className="h-5 w-5 text-amber-500" />
              <h4 className="font-bold text-foreground text-sm">Performance</h4>
            </div>
            <p className="text-xs text-muted-foreground">
              Allow us to count visits and traffic sources so we can measure and improve the performance of our site.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border/50">
            <div className="flex items-center gap-3 mb-2">
              <ToggleLeft className="h-5 w-5 text-brand-500" />
              <h4 className="font-bold text-foreground text-sm">Marketing</h4>
            </div>
            <p className="text-xs text-muted-foreground">
              Used to track visitors across websites to display ads that are relevant and engaging for the individual user.
            </p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "third-party",
    title: "3. Third-Party Cookies",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          In some special cases, we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site.
        </p>
        <ul className="grid gap-2">
          {[
            "Google Analytics: To understand how you use the site.",
            "Intercom/Zendesk: To provide live chat functionality.",
            "Stripe/Payment Providers: To process secure transactions.",
            "Cloudflare: To ensure site security and speed."
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
    id: "managing",
    title: "4. Managing Cookies",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          We recommend that you do not disable cookies if you are using our investment dashboard, as it may prevent you from logging in securely.
        </p>
      </div>
    )
  }
];

export default function CookiePolicy() {
  const [activeSection, setActiveSection] = useState("what-are-cookies");

  // Scroll Spy Logic
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
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-500/5 blur-[120px] rounded-full" />
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
                <Cookie className="h-3.5 w-3.5" />
                <span>Data Usage</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold tracking-tight text-foreground print:text-black"
              >
                Cookie Policy
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground max-w-2xl text-lg print:text-gray-600"
              >
                Information about how we use cookies to improve your experience on {companyName}.
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
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Effective Date</p>
                  <p className="text-sm font-medium text-foreground">{new Date().toLocaleDateString()}</p>
               </div>
            </div>
          </div>
        </div>

        {/* --- MAIN LAYOUT --- */}
        <div className="grid lg:grid-cols-[280px_1fr] gap-12 lg:gap-20 relative items-start">
          
          {/* SIDEBAR - Sticky */}
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
                By continuing to browse or use our site, you agree to our use of cookies as described in this policy. You can change your settings at any time, but this may impact your access to certain features of our platform.
              </p>
            </div>

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

            {/* Preferences Box */}
            <div className="rounded-3xl border border-border bg-card p-8 md:p-10 no-print">
               <h3 className="text-xl font-bold text-foreground mb-4">Manage your preferences</h3>
               <p className="text-muted-foreground mb-6">
                 You can change your cookie settings at any time. Please note that blocking some types of cookies may impact your experience of the site and the services we are able to offer.
               </p>
               <div className="flex flex-wrap gap-4">
                  <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90">
                    Cookie Settings
                  </Button>
                  <Button variant="ghost" className="rounded-full">
                    View Privacy Policy
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