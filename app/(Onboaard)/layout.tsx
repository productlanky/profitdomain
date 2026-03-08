// app/(auth)/layout.tsx
import { redirect } from "next/navigation";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import { getUser } from "@/lib/appwrite/auth";
import AuthRedirect from "@/components/AuthComponents/AuthRedirect";
import { Hexagon, Quote } from "lucide-react";
import { companyName } from "@/lib/data/info";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const user = await getUser();
    if (user) {
      redirect("/dashboard");
    }
  } catch (err) {
    console.log("No session found:", err);
  }

  return (
    <ThemeProvider>
      <AuthRedirect>
        {/* MASTER CONTAINER: Fixed height, no scroll on body */}
        <div className="flex h-screen w-full overflow-hidden bg-background">

          {/* --- LEFT COLUMN: FIXED VISUAL --- */}
          {/* This side never scrolls. It stays anchored. */}
          <div className="relative hidden w-1/2 flex-col bg-zinc-900 text-white lg:flex">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src="/images/body/login.jpeg" // Ensure this path is correct
                alt="Workspace"
                fill
                className="object-cover opacity-40 grayscale"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
            </div>

            {/* Logo Area */}
            <div className="relative z-20 flex items-center p-10">
              <Link href="/" className="flex items-center gap-2 group">

                <Image
                  src="/images/icon/logos.png" // Ensure this path is correct
                  alt="Logo"
                  height={48}
                  width={48}
                  className="h-12 w-auto"
                  priority
                />
                <span className="text-2xl font-bold tracking-tight text-white dark:text-white">
                  {companyName}
                </span>
              </Link>
            </div>

            {/* Bottom Content / Testimonial */}
            <div className="relative z-20 mt-auto p-12">
              <blockquote className="space-y-6 max-w-lg">
                <div className="p-3 bg-white/5 w-fit rounded-xl backdrop-blur-md border border-white/10">
                  <Quote className="h-5 w-5 text-white/80" />
                </div>
                <p className="text-2xl font-medium leading-relaxed tracking-tight text-white">
                  "This platform completely transformed how we manage our assets. The analytics are precise, and the execution is flawless."
                </p>
                <footer className="flex items-center gap-4 pt-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 border-2 border-black" />
                  <div>
                    <div className="text-base font-semibold">Sofia Davis</div>
                    <div className="text-sm text-white/60">Portfolio Manager, Horizon Capital</div>
                  </div>
                </footer>
              </blockquote>
            </div>
          </div>

          {/* --- RIGHT COLUMN: SCROLLABLE FORM --- */}
          {/* This side handles scrolling independently */}
          <div className="flex w-full flex-col lg:w-1/2 bg-background relative">

            {/* Mobile Header (Logo) - Visible only on small screens */}
            <div className="lg:hidden flex items-center justify-between p-6 border-b border-border/40">
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
              <ThemeTogglerTwo />
            </div>

            {/* Desktop Theme Toggler (Absolute Top Right) */}
            <div className="hidden lg:block absolute top-6 right-8 z-50">
              <ThemeTogglerTwo />
            </div>

            {/* Scrollable Content Area */}
            {/* 'flex-1' takes up remaining space, 'overflow-y-auto' enables scroll */}
            <div className="flex-1 overflow-y-auto">
              <div className="flex min-h-full flex-col justify-center px-8 py-12 sm:px-12 lg:px-20">

                {/* The Form Content */}
                <div className="mx-auto w-full max-w-md space-y-8">
                  {children}

                  <p className="text-center text-xs text-muted-foreground">
                    By clicking continue, you agree to our{" "}
                    <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>

              </div>
            </div>

          </div>

        </div>
      </AuthRedirect>
    </ThemeProvider>
  );
}