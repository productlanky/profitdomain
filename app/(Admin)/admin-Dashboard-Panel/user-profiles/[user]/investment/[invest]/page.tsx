import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import AdminUserInvestmentsTable from "@/components/AdminComponent/AdminUserInvestmentsTable";
import { use } from "react";

interface PageProps {
  params: Promise<{ user: string; invest: string }>;
}

export default function AdminUserInvestmentPage({ params }: PageProps) {
  const { user, invest } = use(params);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top hero */}
      <header className="bg-black px-4 md:px-10 py-6 shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: breadcrumb + title */}
          <div>
            <nav className="mb-1 flex items-center gap-1 text-xs font-medium text-white/70">
              <Link
                href="/admin-Dashboard-Panel"
                className="hover:text-white/90 transition-colors"
              >
                Dashboard
              </Link>
              <span>/</span>
              <Link
                href={`/admin-Dashboard-Panel/user-profiles/${user}`}
                className="hover:text-white/90 transition-colors"
              >
                Profile
              </Link>
              <span>/</span>
              <span className="text-white">Investments</span>
            </nav>

            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              User Investments
            </h1>
            <p className="mt-1 text-sm text-white/70">
              View and monitor all investment positions for this user.
            </p>
          </div>

          {/* Right: back button */}
          <div className="flex items-center justify-start sm:justify-end">
            <Link
              href={`/admin-Dashboard-Panel/user-profiles/${user}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium text-white/80 shadow-sm transition hover:bg-white/10 hover:text-white"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Back to profile
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="px-4 pb-10 pt-6 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          {/* Summary / description card */}
          <section className="rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-black/40 sm:p-5">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Investment Overview
                </h2>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  This table shows all historical and active investments linked
                  to this account, including status, plan type and dates.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-700 dark:text-emerald-300">
                  <span className="mr-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-primary">
                  <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                  Completed
                </span>
                <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1 text-amber-700 dark:text-amber-300">
                  <span className="mr-2 h-1.5 w-1.5 rounded-full bg-amber-500" />
                  Pending / Other
                </span>
              </div>
            </div>
          </section>

          {/* Table section */}
          <section className="rounded-2xl border border-gray-200/80 bg-white/80 p-0 shadow-sm backdrop-blur-sm dark:border-white/8 dark:bg-black/40 sm:p-1">
            <AdminUserInvestmentsTable userId={invest} />
          </section>
        </div>
      </main>
    </div>
  );
}
