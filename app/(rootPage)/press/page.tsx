"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Newspaper, 
  Download, 
  ArrowLeft, 
  ArrowUpRight,
  Printer,
  Megaphone,
  Image as ImageIcon,
  Mail,
  Copy
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { companyName } from "@/lib/data/info";

// --- CONTENT DATA ---
const SECTIONS = [
  { id: "news", title: "Latest News" },
  { id: "assets", title: "Brand Assets" },
  { id: "contact", title: "Media Contact" },
];

const PRESS_RELEASES = [
  {
    date: "October 24, 2024",
    category: "Product Launch",
    title: `${companyName} Launches Tokenized Real Estate Fund`,
    excerpt: "Investors can now access fractional ownership of high-value commercial properties in Dubai and London directly through the dashboard.",
    link: "#"
  },
  {
    date: "September 12, 2024",
    category: "Funding",
    title: `${companyName} Secures Series B Funding to Expand Global Logistics Network`,
    excerpt: "The $40M round was led by Tier-1 venture firms to accelerate the integration of physical shipment tracking with digital asset portfolios.",
    link: "#"
  },
  {
    date: "August 05, 2024",
    category: "Partnership",
    title: "Strategic Partnership with Global Freight Giants",
    excerpt: "New API integrations allow users to track shipments across 120+ countries with millisecond latency updates.",
    link: "#"
  }
];

export default function PressPage() {
  const [activeSection, setActiveSection] = useState("news");

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
                <Megaphone className="h-3.5 w-3.5" />
                <span>Newsroom</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold tracking-tight text-foreground print:text-black"
              >
                Media Center
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground max-w-2xl text-lg print:text-gray-600"
              >
                Latest announcements, brand assets, and resources for journalists covering {companyName}.
              </motion.p>
            </div>

            <div className="flex gap-3 no-print">
               <Button 
                onClick={handlePrint} 
                variant="outline" 
                className="gap-2 hidden sm:flex border-border hover:bg-muted"
               >
                 <Download className="h-4 w-4" /> Save Page
               </Button>
               <Button 
                onClick={handlePrint} 
                variant="ghost" 
                size="icon" 
                className="sm:hidden"
               >
                 <Printer className="h-4 w-4" />
               </Button>
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
            
            <div className="mt-8 p-4 rounded-xl bg-card border border-border">
                <p className="text-xs font-semibold text-foreground mb-2">Media Inquiry?</p>
                <p className="text-xs text-muted-foreground mb-3">Our team typically responds within 24 hours.</p>
                <Button size="sm" variant="outline" className="w-full text-xs">
                    Contact PR Team
                </Button>
            </div>
          </aside>

          {/* CONTENT AREA */}
          <div className="space-y-20 print:space-y-8">
            
            {/* 1. LATEST NEWS */}
            <section id="news" className="scroll-mt-32">
                <div className="flex items-center gap-3 mb-8">
                    <Newspaper className="h-6 w-6 text-brand-500" />
                    <h2 className="text-2xl font-bold text-foreground">Latest News</h2>
                </div>

                <div className="grid gap-6">
                    {PRESS_RELEASES.map((item, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group p-6 rounded-2xl border border-border bg-card/50 hover:border-brand-500/30 hover:bg-card transition-all"
                        >
                            <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-3">
                                <span className="text-xs font-semibold text-brand-500 uppercase tracking-wider">{item.category}</span>
                                <span className="text-sm text-muted-foreground">{item.date}</span>
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-brand-500 transition-colors">
                                {item.title}
                            </h3>
                            <p className="text-muted-foreground mb-4 leading-relaxed">
                                {item.excerpt}
                            </p>
                            <a href={item.link} className="inline-flex items-center text-sm font-medium text-foreground hover:text-brand-500 transition-colors">
                                Read Full Release <ArrowUpRight className="ml-1 h-3 w-3" />
                            </a>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 2. BRAND ASSETS (MEDIA KIT) */}
            <section id="assets" className="scroll-mt-32 print:break-inside-avoid">
                <div className="flex items-center gap-3 mb-8">
                    <ImageIcon className="h-6 w-6 text-brand-500" />
                    <h2 className="text-2xl font-bold text-foreground">Brand Assets</h2>
                </div>
                
                <p className="text-muted-foreground mb-8">
                    Download official {companyName} logos and assets. Please do not modify the colors or proportions.
                </p>

                <div className="grid sm:grid-cols-2 gap-6">
                    {/* Dark Mode Logo */}
                    <div className="p-6 rounded-2xl border border-border bg-white/5 flex flex-col items-center text-center">
                        <div className="h-32 w-full bg-black/50 rounded-xl flex items-center justify-center border border-white/10 mb-4">
                            {/* Placeholder for Logo */}
                            <h4 className="text-2xl font-bold text-white tracking-tight uppercase">{companyName}</h4>
                        </div>
                        <h4 className="font-semibold text-foreground mb-1">Logomark (Light)</h4>
                        <p className="text-xs text-muted-foreground mb-4">For use on dark backgrounds.</p>
                        <div className="flex gap-2 w-full">
                            <Button variant="outline" size="sm" className="flex-1 gap-2 border-border hover:bg-muted">
                                <Download className="h-3 w-3" /> PNG
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 gap-2 border-border hover:bg-muted">
                                <Download className="h-3 w-3" /> SVG
                            </Button>
                        </div>
                    </div>

                    {/* Light Mode Logo */}
                    <div className="p-6 rounded-2xl border border-border bg-white/5 flex flex-col items-center text-center">
                        <div className="h-32 w-full bg-white rounded-xl flex items-center justify-center border border-slate-200 mb-4">
                             {/* Placeholder for Logo */}
                             <h4 className="text-2xl font-bold text-black tracking-tight uppercase">{companyName}</h4>
                        </div>
                        <h4 className="font-semibold text-foreground mb-1">Logomark (Dark)</h4>
                        <p className="text-xs text-muted-foreground mb-4">For use on light backgrounds.</p>
                        <div className="flex gap-2 w-full">
                            <Button variant="outline" size="sm" className="flex-1 gap-2 border-border hover:bg-muted">
                                <Download className="h-3 w-3" /> PNG
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 gap-2 border-border hover:bg-muted">
                                <Download className="h-3 w-3" /> SVG
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. CONTACT */}
            <section id="contact" className="scroll-mt-32 print:break-inside-avoid">
                <div className="flex items-center gap-3 mb-8">
                    <Mail className="h-6 w-6 text-brand-500" />
                    <h2 className="text-2xl font-bold text-foreground">Media Contact</h2>
                </div>

                <div className="rounded-3xl border border-border bg-card p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-foreground mb-2">Get in touch</h3>
                        <p className="text-muted-foreground mb-4 max-w-md">
                            For press inquiries, interview requests, or additional asset requirements, please contact our PR team.
                        </p>
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border w-fit">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <code className="text-sm font-mono text-foreground">press@{companyName.toLowerCase().replace(/\s/g, '')}.com</code>
                            <button className="ml-2 hover:text-brand-500 transition-colors" title="Copy">
                                <Copy className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    <Button size="lg" className="rounded-full bg-foreground text-background hover:bg-foreground/90 shrink-0">
                        Download Full Press Kit
                    </Button>
                </div>
            </section>

            {/* Print Footer */}
            <div className="hidden print:block pt-8 border-t border-gray-200 mt-8">
              <p className="text-sm text-gray-500">
                {companyName} Media Center • Generated on {new Date().toLocaleDateString()}.
              </p>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}