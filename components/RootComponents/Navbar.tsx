"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu, X, ArrowRight, ChevronRight,
  Home, Info, Briefcase, Zap,
  Hexagon
} from "lucide-react";
import { companyName } from "@/lib/data/info";
import Image from "next/image";

const navLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "About", href: "/about", icon: Info },
  { name: "Services", href: "/services", icon: Briefcase },
  { name: "Plans", href: "/plans", icon: Zap },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  return (
    <>
      {/* MAIN FLOATING ISLAND CONTAINER 
        
        Fix applied:
        - Changed 'rounded-full' to 'rounded-[2rem]' (32px). 
        - Changed 'rounded-3xl' to 'rounded-[1.5rem]' (24px).
        
        Since 32px and 24px are close numbers, the transition is butter smooth.
      */}
      <div
        id="print"
        className={`
          fixed left-1/2 z-50 -translate-x-1/2 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
          border border-border/60 bg-background/80 backdrop-blur-xl shadow-2xl shadow-black/5
          dark:shadow-black/50
          
          ${isOpen
            ? "top-4 w-[calc(100%-1.5rem)] rounded-[1.5rem] ring-1 ring-border" // Open State
            : "top-6 w-[90%] max-w-5xl rounded-[2rem]" // Closed State (2rem is enough to look pill-shaped)
          }
        `}
      >
        {/* TOP BAR */}
        <div className="relative flex items-center justify-between px-2 py-2 md:px-4">

          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group pl-2">
            <Image
              src="/images/icon/logos.png" // Ensure this path is correct
              alt="Logo"
              height={48}
              width={48}
              className="h-12 w-auto"
              priority
            />
            {/* Improved text hiding logic for smoother visual */}
            <div className={`
              flex flex-col transition-all duration-300 origin-left
              ${isOpen ? "opacity-0 scale-90 w-0 overflow-hidden" : "opacity-100 scale-100 w-auto"}
              md:opacity-100 md:scale-100 md:w-auto md:overflow-visible
            `}>
              <span className="text-lg font-bold tracking-tight text-foreground whitespace-nowrap">
                {companyName}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className={`
            hidden md:flex items-center gap-1 rounded-full bg-muted/50 p-1.5 border border-transparent
            transition-all duration-300
            ${isOpen ? "opacity-0 pointer-events-none" : "opacity-100"}
          `}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`
                    px-5 py-2 rounded-full text-sm font-medium transition-all duration-300
                    ${isActive
                      ? "bg-background text-foreground shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }
                  `}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* CTA Button - Hidden on mobile when open to prevent clutter */}
            <Link
              href="/signup"
              className={`
                hidden sm:flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold 
                bg-brand-500 text-white shadow-lg shadow-brand-500/25
                transition-all hover:bg-brand-600 hover:scale-105 active:scale-95
                ${isOpen ? "sm:hidden" : "flex"} 
              `}
            >
              Start <ChevronRight className="h-4 w-4" />
            </Link>

            {/* Mobile Toggle Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`
                flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300
                md:hidden border
                ${isOpen
                  ? "bg-muted border-border text-foreground rotate-90"
                  : "bg-transparent border-transparent text-foreground hover:bg-muted"
                }
              `}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU CONTENT */}
        <div
          className={`
            grid overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
            ${isOpen ? "grid-rows-[1fr] opacity-100 pb-4" : "grid-rows-[0fr] opacity-0 pb-0"}
          `}
        >
          <div className="min-h-0 px-4">

            {/* Divider */}
            <div className="mb-4 h-px w-full bg-border/50" />

            {/* Links Grid */}
            <div className="flex flex-col gap-2">
              {navLinks.map((link, idx) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)} // Close menu when clicking a link
                    className="group relative flex items-center gap-4 rounded-2xl p-3 transition-all active:scale-[0.98] hover:bg-muted/50"
                    style={{
                      transitionDelay: isOpen ? `${idx * 75}ms` : '0ms',
                      opacity: isOpen ? 1 : 0,
                      transform: isOpen ? 'translateY(0)' : 'translateY(10px)'
                    }}
                  >
                    {/* Icon Box */}
                    <div className="
                      flex h-10 w-10 items-center justify-center rounded-xl 
                      bg-muted text-muted-foreground 
                      group-hover:bg-brand-500 group-hover:text-white
                      transition-colors duration-300
                    ">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex flex-1 items-center justify-between">
                      <span className="text-base font-semibold text-foreground">
                        {link.name}
                      </span>
                      <ArrowRight className="h-4 w-4 text-brand-500 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Bottom Actions for Mobile */}
            <div
              className="mt-6 grid grid-cols-2 gap-3"
              style={{
                transitionDelay: isOpen ? '300ms' : '0ms',
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? 'translateY(0)' : 'translateY(10px)',
                transitionProperty: 'all',
                transitionDuration: '500ms'
              }}
            >
              <Link
                href="/signin"
                onClick={() => setIsOpen(false)}
                className="
                  flex items-center justify-center rounded-2xl py-3.5 text-sm font-bold 
                  border border-border bg-background text-foreground 
                  hover:bg-muted active:scale-95 transition-all
                "
              >
                Log In
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsOpen(false)}
                className="
                  flex items-center justify-center rounded-2xl py-3.5 text-sm font-bold 
                  bg-brand-500 text-white shadow-lg shadow-brand-500/25
                  hover:bg-brand-600 active:scale-95 transition-all
                "
              >
                Get Started
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* BACKDROP */}
      <div
        onClick={() => setIsOpen(false)}
        className={`
          fixed inset-0 z-40 bg-background/20 backdrop-blur-sm transition-opacity duration-500
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />
    </>
  );
}