"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Query } from "appwrite";
import { BsPlus } from "react-icons/bs";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  databases,
  DB_ID,
  PROFILE_COLLECTION_ID,
  STOCK_PRICE_COLLECTION_ID,
  STOCK_PRICE_DOC_ID,
} from "@/lib/appwrite/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { Label } from "@/components/ui/label";
import { FaArrowLeftLong } from "react-icons/fa6";

interface UserRow {
  id: string;
  name: string;
  image: string;
  email: string;
  gender: string;
  country: string;
  phone: string;
  balance: number;
  created_at: string;
  status: string;
}

interface StockPriceForm {
  spacex: string;
  neuralink: string;
  boring: string;
}

function renderUserStatusBadge(status?: string) {
  const normalized = (status || "").toLowerCase();

  const styles: Record<
    string,
    {
      border: string;
      bg: string;
      text: string;
      dot: string;
    }
  > = {
    active: {
      border: "border-emerald-500/40",
      bg: "bg-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-300",
      dot: "bg-emerald-500",
    },
    suspended: {
      border: "border-amber-500/40",
      bg: "bg-amber-500/10",
      text: "text-amber-600 dark:text-amber-300",
      dot: "bg-amber-500",
    },
    banned: {
      border: "border-red-500/40",
      bg: "bg-red-500/10",
      text: "text-red-600 dark:text-red-300",
      dot: "bg-red-500",
    },
    pending: {
      border: "border-blue-500/40",
      bg: "bg-blue-500/10",
      text: "text-blue-600 dark:text-blue-300",
      dot: "bg-blue-500",
    },
    deleted: {
      border: "border-gray-500/40",
      bg: "bg-gray-500/10",
      text: "text-gray-600 dark:text-gray-300",
      dot: "bg-gray-500",
    },
  };

  const style = styles[normalized] || styles["pending"];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium
        border ${style.border} ${style.bg} ${style.text}
      `}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {normalized}
    </span>
  );
}


export default function DashboardPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [search, setSearch] = useState("");

  // Stock modal state
  const { isOpen, openModal, closeModal } = useModal();
  const [stockForm, setStockForm] = useState<StockPriceForm>({
    spacex: "",
    neuralink: "",
    boring: "",
  });
  const [stockLoading, setStockLoading] = useState(false);
  const [stockSaving, setStockSaving] = useState(false);

  // Date header
  const now = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayName = days[now.getDay()];
  const day = now.getDate();
  const monthName = months[now.getMonth()];
  const year = now.getFullYear();

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await databases.listDocuments(
          DB_ID,
          PROFILE_COLLECTION_ID,
          [Query.orderDesc("$createdAt"),
          Query.limit(200),
          ]

        );

        const formatted: UserRow[] = res.documents
          // .filter((u) => !u.labels || !u.labels.includes("admin"))
          .map((u: any) => ({
            id: u.$id,
            name: `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || "Unknown",
            image: "/images/user/user-38.jpg", // swap to u.avatar if available
            email: u.email ?? "—",
            gender: u.gender ?? "—",
            country: u.country ?? "—",
            phone: u.phone ?? "—",
            balance: parseFloat(u.totalDeposit) || 0,
            created_at: u.$createdAt,
            status: u.status
          }));

        setUsers(formatted);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchUsers();
  }, []);

  // Fetch stock prices for modal
  useEffect(() => {
    const loadStockPrices = async () => {
      try {
        setStockLoading(true);
        const doc: any = await databases.getDocument(
          DB_ID,
          STOCK_PRICE_COLLECTION_ID,
          STOCK_PRICE_DOC_ID
        );

        setStockForm({
          spacex: doc?.spacex?.toString() ?? "",
          neuralink: doc?.neuralink?.toString() ?? "",
          boring: doc?.boring?.toString() ?? "",
        });
      } catch (error) {
        console.error("Error loading stock prices:", error);
        toast.error("Failed to load stock prices");
      } finally {
        setStockLoading(false);
      }
    };

    // Pre-load once when page mounts
    loadStockPrices();
  }, []);

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return users;

    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.country.toLowerCase().includes(q)
    );
  }, [users, search]);

  const totalBalance = useMemo(
    () => filteredUsers.reduce((sum, u) => sum + u.balance, 0),
    [filteredUsers]
  );

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStockForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveStockPrices = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setStockSaving(true);

      const toNumber = (val: string) => {
        const n = parseFloat(val);
        return Number.isFinite(n) ? n : 0;
      };

      await databases.updateDocument(
        DB_ID,
        STOCK_PRICE_COLLECTION_ID,
        STOCK_PRICE_DOC_ID,
        {
          spacex: toNumber(stockForm.spacex),
          neuralink: toNumber(stockForm.neuralink),
          boring: toNumber(stockForm.boring),
        }
      );

      toast.success("Stock prices updated");
      closeModal();
    } catch (error) {
      console.error("Error updating stock prices:", error);
      toast.error("Failed to update stock prices");
    } finally {
      setStockSaving(false);
    }
  };

  const renderTabContent = () => {
    return (
      <div className="space-y-4 lg:space-y-6 mt-4 md:mt-10 max-w-7xl mx-auto">
        {/* Top bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Users
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage all registered users, balances and account status.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M9.25 3.5a5.75 5.75 0 1 0 3.629 10.19l2.716 2.716a.75.75 0 1 0 1.06-1.06l-2.716-2.717A5.75 5.75 0 0 0 9.25 3.5Zm-4.25 5.75a4.25 4.25 0 1 1 8.5 0 4.25 4.25 0 0 1-8.5 0Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <Input
                placeholder="Search by name, email, country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <div>
                Total users:{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {users.length}
                </span>
              </div>

              <div className="hidden h-4 w-px bg-gray-200 dark:bg-white/10 sm:block" />

              <div className="hidden sm:block">
                Showing{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {filteredUsers.length}
                </span>{" "}
                result{filteredUsers.length !== 1 && "s"}
              </div>

              <div className="hidden h-4 w-px bg-gray-200 dark:bg-white/10 sm:block" />

              <div className="hidden sm:block">
                Balance:{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  ${totalBalance.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Table card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white/80 shadow-sm backdrop-blur-sm dark:border-white/8 dark:bg-black/40">
          <div className="max-w-full overflow-x-auto">
            <Table className="min-w-[880px]">
              <TableHeader className="border-b border-gray-100 bg-gray-50/80 text-xs font-medium uppercase tracking-wide text-gray-500 dark:border-white/8 dark:bg-white/5">
                <TableRow>
                  <TableCell className="px-5 py-3 text-left">User</TableCell>
                  <TableCell className="px-5 py-3 text-left">Gender</TableCell>
                  <TableCell className="px-5 py-3 text-left">Country</TableCell>
                  <TableCell className="px-5 py-3 text-left">Phone</TableCell>
                  <TableCell className="px-5 py-3 text-center">
                    Deposit Balance
                  </TableCell>
                  <TableCell className="px-5 py-3 text-left">Status</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 text-sm dark:divide-white/6">
                {filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/5"
                  >
                    <TableCell className="px-5 py-4">
                      <Link
                        href={`/admin-Dashboard-Panel/user-profiles/${user.id}`}
                        className="flex items-center gap-3"
                      >
                        <div className="relative h-10 w-10 overflow-hidden rounded-full border border-gray-200/70 bg-gray-100 dark:border-white/10 dark:bg-white/5">
                          <Avatar className="h-10 w-10 rounded-full">
                            <AvatarImage src={user.image} alt={user.name} />
                            <AvatarFallback className="rounded-lg">
                              {user.name
                                .split(" ")
                                .map((p) => p[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {user.email}
                          </span>
                        </div>
                      </Link>
                    </TableCell>

                    <TableCell className="px-5 py-4 capitalize text-gray-600 dark:text-gray-300">
                      {user.gender}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-300">
                      {user.country}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-300">
                      {user.phone}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-center">
                      <span className="inline-flex items-center justify-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
                        ${user.balance.toFixed(2)}
                      </span>
                    </TableCell>

                    <TableCell className="px-5 py-4 capitalize">
                      {renderUserStatusBadge(user.status)}
                    </TableCell>

                  </TableRow>
                ))}

                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      No users found for{" "}
                      {search ? (
                        <span className="font-medium text-gray-900 dark:text:white">
                          “{search}”
                        </span>
                      ) : (
                        "the current filters"
                      )}
                      . Try a different search term.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Top hero */}
      <div className="bg-brand-900">
        <div className="mx-auto flex min-h-[30vh] max-w-7xl py-10 items-center px-4  md:px-10">
          <div className="flex flex-1 flex-col items-start justify-center gap-4 text-white md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="py-3 flex items-center justify-between">
                <Link href="/dashboard">
                  <button className="hover:bg-white/0 text-base text-white/70 font-semibold gap-2 hover:text-white flex items-center ggap-2">
                    <FaArrowLeftLong />
                    Preview Dashboard
                  </button>
                </Link>
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                Admin overview
              </p>
              <h2 className="font-inter text-3xl font-bold tracking-wide md:text-4xl lg:text-5xl">
                Overview
              </h2>
              <p className="text-sm text-white/70">
                Today is {dayName} • {day} {monthName}, {year}
              </p>
            </div>

            <Button
              size={"lg"}
              className="mt-4 flex h-12 items-center gap-2 rounded-full bg-white px-6 font-semibold text-[#420101] hover:bg-gray-100 md:mt-0"
              onClick={openModal}
            >
              <BsPlus size={24} className="size-7" />
              Update Stock Prices
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-10">
        {renderTabContent()}
      </div>

      {/* Stock price modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="m-4 max-w-md">
        <div className="modal-body p-6 sm:p-7">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Update Stock Prices
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            Set the current internal prices for each stock. These values will be
            used across the app for share calculations.
          </p>

          <form onSubmit={handleSaveStockPrices} className="space-y-4">

            <div className="space-y-1">
              <Label htmlFor="spacex">SpaceX</Label>
              <Input
                id="spacex"
                name="spacex"
                type="number"
                step="0.01"
                placeholder="e.g. 89.21"
                value={stockForm.spacex}
                onChange={handleStockChange}
                disabled={stockLoading || stockSaving}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="neuralink">Neuralink</Label>
              <Input
                id="neuralink"
                name="neuralink"
                type="number"
                step="0.01"
                placeholder="e.g. 12.55"
                value={stockForm.neuralink}
                onChange={handleStockChange}
                disabled={stockLoading || stockSaving}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="boring">Boring</Label>
              <Input
                id="boring"
                name="boring"
                type="number"
                step="0.01"
                placeholder="e.g. 12.55"
                value={stockForm.boring}
                onChange={handleStockChange}
                disabled={stockLoading || stockSaving}
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={closeModal}
                disabled={stockSaving}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={stockSaving || stockLoading}>
                {stockSaving ? "Saving..." : "Save prices"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
