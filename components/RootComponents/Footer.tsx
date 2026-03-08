"use client";

import Link from "next/link";
import { companyName } from "@/lib/data/info";
import {
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  ArrowRight,
  Mail,
  Hexagon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Platform",
      links: [
        { name: "Markets", href: "/markets" },
        { name: "Shipment Tracking", href: "/shipping" },
        { name: "Crypto Assets", href: "/crypto" },
        { name: "Investment Plans", href: "/plans" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Press", href: "/press" },
        { name: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Cookie Policy", href: "/cookies" },
        { name: "Risk Disclosure", href: "/risk" },
      ],
    },
  ];

  return (
    <footer className="relative border-t border-border bg-background text-foreground overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-brand-500/5 blur-[120px] -z-10 rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 pt-16 pb-8">

        {/* --- TOP SECTION: BRAND & NEWSLETTER --- */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 mb-16">

          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/images/icon/logos.png" // Ensure this path is correct
                alt="Logo"
                height={48}
                width={48}
                className="h-12 w-auto"
                priority
              />
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {companyName}
              </span>
            </Link>
            <p className="max-w-md text-muted-foreground text-sm leading-relaxed">
              The unified operating system for modern wealth. Manage fractional investments, crypto assets, and physical logistics from a single, secure dashboard.
            </p>

            {/* Socials */}
            <div className="flex gap-4">
              {[Twitter, Linkedin, Facebook, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-10 w-10 rounded-full border border-border bg-background/50 flex items-center justify-center text-muted-foreground hover:text-brand-500 hover:border-brand-500/30 transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="lg:pl-10">
            <div className="rounded-3xl bg-muted/30 border border-border p-6 md:p-8">
              <h3 className="text-lg font-bold text-foreground mb-2">Stay ahead of the market</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Get weekly insights on market trends, new asset listings, and platform updates directly to your inbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter your email"
                    className="pl-10 bg-background border-border/50 h-11 focus:border-brand-500 rounded-xl"
                  />
                </div>
                <Button className="h-11 rounded-xl bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/20">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* --- MIDDLE SECTION: LINKS GRID --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 border-t border-border pt-16">

          {/* Loop through link groups */}
          {footerLinks.map((column) => (
            <div key={column.title} className="space-y-4">
              <h4 className="text-sm font-bold text-foreground tracking-wide uppercase">
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-brand-500 transition-colors flex items-center gap-1 group"
                    >
                      {link.name}
                      <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact / Status Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-foreground tracking-wide uppercase">
              Status
            </h4>
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-500">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                All Systems Operational
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Support Line:</p>
                <p className="text-sm font-medium text-foreground">+1 (888) 123-4567</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Email:</p>
                <p className="text-sm font-medium text-foreground">support@{companyName.toLowerCase()}.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTION: COPYRIGHT --- */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            © {currentYear} {companyName} Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span className="text-xs text-muted-foreground">English (US)</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}