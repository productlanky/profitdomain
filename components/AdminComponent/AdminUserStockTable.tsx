"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { databases, DB_ID, STOCKLOG_COLLECTION_ID } from "@/lib/appwrite/client";
import { Query } from "appwrite";
import Loading from "../ui/Loading";
import { RiStockFill } from "react-icons/ri";
import { fetchStockPrice, fetchTeslaPrice } from "@/lib/handlers/handler";

interface Props {
  userId: string;
}

type SupportedCompany = "tesla" | "spaceX" | "neuralink" | "boring";

type Transaction = {
  id: string;
  user_id: string;
  amount: number;
  shares: number;
  pricePerShare: number;
  company: SupportedCompany;
  created_at: string;
};

type Holdings = {
  shares: number;
  costBasis: number;
};

export default function AdminUserStockTable({ userId }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [prices, setPrices] = useState<Record<SupportedCompany, number | null>>({
    tesla: null,
    spaceX: null,
    neuralink: null,
    boring: null,
  });

  useEffect(() => {
    const load = async () => {
      if (!userId) return;
      setLoading(true);

      try {
        // 1) Fetch all stock logs for user
        const res = await databases.listDocuments(
          DB_ID,
          STOCKLOG_COLLECTION_ID,
          [Query.equal("userId", userId), Query.orderDesc("$createdAt")]
        );

        const docs = res.documents || [];

        const mapped: Transaction[] = docs.map((doc: any) => ({
          id: doc.$id,
          user_id: doc.user_id ?? doc.userId,
          amount: Number(doc.amount) || 0,
          shares: Number(doc.shares) || 0,
          pricePerShare: Number(doc.pricePerShare ?? doc.price ?? 0),
          company: (doc.shareType ?? "tesla") as SupportedCompany,
          created_at: doc.created_at ?? doc.$createdAt,
        }));

        setTransactions(mapped);

        // 2) Fetch prices for all three companies
        const [teslaPrice, spaceXPrice, neuralinkPrice, boringPrice] = await Promise.all([
          fetchTeslaPrice().catch((err) => {
            console.error("Tesla price error:", err);
            return null;
          }),
          fetchStockPrice("spaceX").catch((err) => {
            console.error("SpaceX price error:", err);
            return null;
          }),
          fetchStockPrice("neuralink").catch((err) => {
            console.error("Neuralink price error:", err);
            return null;
          }),
          fetchStockPrice("boring").catch((err) => {
            console.error("Boring price error:", err);
            return null;
          })
        ]);

        setPrices({
          tesla: teslaPrice,
          spaceX: spaceXPrice,
          neuralink: neuralinkPrice,
          boring: boringPrice,
        });
      } catch (error) {
        console.error("Failed to fetch stock logs:", error);
        toast.error("Failed to fetch stock logs");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId]);

  const holdingsByCompany = useMemo(() => {
    const base: Record<SupportedCompany, Holdings> = {
      tesla: { shares: 0, costBasis: 0 },
      spaceX: { shares: 0, costBasis: 0 },
      neuralink: { shares: 0, costBasis: 0 },
      boring: { shares: 0, costBasis: 0 },
    };

    return transactions.reduce((acc, tx) => {
      const bucket = acc[tx.company];
      bucket.shares += tx.shares;
      bucket.costBasis += tx.shares * tx.pricePerShare;
      return acc;
    }, base);
  }, [transactions]);

  const totalPortfolioValue = useMemo(() => {
    return (["tesla", "spaceX", "neuralink", "boring"] as SupportedCompany[]).reduce(
      (sum, symbol) => {
        const price = prices[symbol] ?? 0;
        const holding = holdingsByCompany[symbol];
        return sum + holding.shares * price;
      },
      0
    );
  }, [prices, holdingsByCompany]);

  const overallShares = useMemo(() => {
    return (["tesla", "spaceX", "neuralink", "boring"] as SupportedCompany[]).reduce(
      (sum, symbol) => sum + holdingsByCompany[symbol].shares,
      0
    );
  }, [holdingsByCompany]);

  const lastTrade = useMemo(
    () => (transactions[0] ? new Date(transactions[0].created_at) : null),
    [transactions]
  );

  if (loading) return <Loading />;

  if (!transactions.length)
    return (
      <div className="rounded-2xl border border-gray-200 bg-white/80 p-10 text-center text-sm text-gray-600 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-black/40">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 dark:bg-white/10">
          <RiStockFill className="h-6 w-6 text-gray-500 dark:text-gray-200" />
        </div>
        <p className="mt-4 font-medium text-gray-900 dark:text-white">
          No stock activity found for this user.
        </p>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Once this user buys Tesla, SpaceX or Neuralink shares, their trades will
          appear here with full history and valuation.
        </p>
      </div>
    );

  return (
    <div className="space-y-6 p-4 sm:p-5">
      {/* Stats row – light cards like investments / transactions */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Total portfolio value */}
        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-black/30">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Total portfolio value
              </p>
              <p className="mt-2 text-lg font-semibold text-emerald-600 dark:text-emerald-300">
                $
                {totalPortfolioValue.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/20">
              <RiStockFill className="h-5 w-5 text-emerald-500 dark:text-emerald-200" />
            </div>
          </div>
          <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
            Based on live prices for Tesla, SpaceX and Neuralink.
          </p>
        </div>

        {/* Total shares by company */}
        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border_white/10 dark:bg-black/30">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Total shares held
          </p>
          <p className="mt-2 text-lg font-semibold text-indigo-600 dark:text-indigo-300">
            {overallShares.toLocaleString()}
          </p>
          <div className="mt-2 text-[11px] text-gray-600 dark:text-gray-300 space-y-0.5">
            <p>
              TSLA:{" "}
              <span className="font-semibold">
                {holdingsByCompany.tesla.shares.toLocaleString()}
              </span>
            </p>
            <p>
              SpaceX:{" "}
              <span className="font-semibold">
                {holdingsByCompany.spaceX.shares.toLocaleString()}
              </span>
            </p>
            <p>
              Neuralink:{" "}
              <span className="font-semibold">
                {holdingsByCompany.neuralink.shares.toLocaleString()}
              </span>
            </p>
            <p>
              Boring:{" "}
              <span className="font-semibold">
                {holdingsByCompany.boring.shares.toLocaleString()}
              </span>
            </p>
          </div>
        </div>

        {/* Live prices + last trade */}
        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-black/30">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Live share prices
          </p>
          <div className="mt-2 space-y-1 text-sm">
            <p className="text-gray-800 dark:text-gray-100">
              TSLA:{" "}
              <span className="font-semibold text-purple-600 dark:text-purple-300">
                {prices.tesla != null ? `$${prices.tesla}` : "–"}
              </span>
            </p>
            <p className="text-gray-800 dark:text-gray-100">
              SpaceX:{" "}
              <span className="font-semibold text-purple-600 dark:text-purple-300">
                {prices.spaceX != null ? `$${prices.spaceX.toFixed(2)}` : "–"}
              </span>
            </p>
            <p className="text-gray-800 dark:text-gray-100">
              Neuralink:{" "}
              <span className="font-semibold text-purple-600 dark:text-purple-300">
                {prices.neuralink != null
                  ? `$${prices.neuralink.toFixed(2)}`
                  : "–"}
              </span>
            </p>
            <p className="text-gray-800 dark:text-gray-100">
              Boring:{" "}
              <span className="font-semibold text-purple-600 dark:text-purple-300">
                {prices.boring != null ? `$${prices.boring.toFixed(2)}` : "–"}
              </span>
            </p>

          </div>
          <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
            {lastTrade ? (
              <>
                Last trade:{" "}
                <span className="font-semibold">
                  {lastTrade.toLocaleString()}
                </span>
              </>
            ) : (
              "No trades yet on this account."
            )}
          </p>
        </div>
      </div>

      {/* Table card – same feel as transactions/investments table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white/80 shadow-sm backdrop-blur-sm dark:border-white/8 dark:bg-black/40">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-white/10">
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              Equity stock history
            </h2>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {transactions.length} trade
              {transactions.length === 1 ? "" : "s"} recorded across Tesla,
              SpaceX, Neuralink and The Boring Co.
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[900px]">
            <Table>
              <TableHeader className="border-b border-gray-100 bg-gray-50/80 text-xs font-medium uppercase tracking-wide text-gray-500 dark:border-white/8 dark:bg-white/5">
                <TableRow>
                  <TableCell className="px-5 py-3 text-start">
                    Trade ID
                  </TableCell>
                  <TableCell className="px-5 py-3 text-start">
                    Company
                  </TableCell>
                  <TableCell className="px-5 py-3 text-start">
                    Amount
                  </TableCell>
                  <TableCell className="px-5 py-3 text-start">
                    Shares
                  </TableCell>
                  <TableCell className="px-5 py-3 text-start">
                    Price / share
                  </TableCell>
                  <TableCell className="px-5 py-3 text-start">
                    Trade value
                  </TableCell>
                  <TableCell className="px-5 py-3 text-start">
                    Created at
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 text-sm dark:divide-white/6">
                {transactions.map((tx) => {
                  const tradeValue = tx.shares * tx.pricePerShare;
                  const label =
                    tx.company === "tesla"
                      ? "Tesla"
                      : tx.company === "spaceX"
                        ? "SpaceX"
                        : tx.company === "neuralink"
                          ? "Neuralink"
                          : tx.company === "boring"
                            ? "The Boring Co."
                            : tx.company;

                  return (
                    <TableRow
                      key={tx.id}
                      className="bg-white hover:bg-gray-50/80 dark:bg-black/40 dark:hover:bg-white/5"
                    >
                      <TableCell className="px-5 py-4 text-start text-xs text-gray-800 dark:text-gray-100">
                        {tx.id}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start text-xs font-semibold text-gray-900 dark:text-white">
                        {label}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start text-sm text-gray-900 dark:text-white">
                        ${tx.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start text-sm text-gray-800 dark:text-gray-100">
                        {tx.shares.toLocaleString()}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start text-sm text-gray-800 dark:text-gray-100">
                        $
                        {tx.pricePerShare.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start text-sm text-gray-800 dark:text-gray-100">
                        $
                        {tradeValue.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start text-xs text-gray-600 dark:text-gray-300">
                        {new Date(tx.created_at).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Footer note */}
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 text-[11px] text-gray-500 dark:border-white/10 dark:text-gray-400">
          <span>
            All trades are sorted from newest to oldest based on creation time.
          </span>
          <span className="hidden sm:inline">
            Live prices are indicative and may differ slightly from broker
            statements.
          </span>
        </div>
      </div>
    </div>
  );
}
