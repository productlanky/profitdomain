"use client";

import { use, useEffect, useState } from "react";
import { useModal } from "@/hooks/useModal";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";
import Link from "next/link";
import {
    databases,
    DB_ID,
    NOTIFICATION_COLLECTION,
    PROFILE_COLLECTION_ID,
    STOCKLOG_COLLECTION_ID,
} from "@/lib/appwrite/client";
import { ID, Query } from "appwrite";
import { fetchStockPrice, fetchTeslaPrice } from "@/lib/handlers/handler";
import Loading from "@/components/ui/Loading";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Select from "@/components/withdrawal/Select";
import { FaArrowLeftLong } from "react-icons/fa6";
import KycDocumentCard from "@/components/AdminComponent/KycDocumentCard";
import UserDangerActions from "@/components/AdminComponent/UserDangerActions";

/* ---------- Types & constants ---------- */

interface Props {
    params: Promise<{ user: string }>;
}

type ProfileField =
    | "first_name"
    | "last_name"
    | "email"
    | "gender"
    | "phone"
    | "country"
    | "state"
    | "city"
    | "zip"
    | "profit"
    | "address"
    | "balance"
    | "dob"
    | "withdrawal_limit"

interface ProfileType {
    id: string; // userId
    first_name: string;
    last_name: string;
    email: string;
    gender: string;
    phone: string;
    country: string;
    state: string;
    city: string;
    zip: string;
    address: string;
    balance: number;
    dob: string;
    created_at: string;
    updated_at: string;
    kyc_status: string;
    profit: number;
    withdrawal_limit: number;
    // extra fields from your schema
    tier_level?: number;
    labels?: string;
    total_deposit?: number;
    referred_by?: string;
    btc_address?: string;
    referee_id?: string;
    status?: string;
}

const profileFields: ProfileField[] = [
    "first_name",
    "last_name",
    "email",
    "gender",
    "phone",
    "country",
    "state",
    "city",
    "zip",
    "profit",
    "address",
    "balance",
    "dob",
    "withdrawal_limit",
];

const kycStatusOptions = [
    { label: "Approved", value: "approved" },
    { label: "Pending", value: "pending" },
    { label: "Rejected", value: "rejected" },
    { label: "In Review", value: "reviewing" },
];

const formatDate = (value?: string) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleDateString();
};

const formatCurrency = (num?: number) =>
    (Number(num) || 0).toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
    });

/* ---------- Component ---------- */

export default function AdminUserProfileCard({ params }: Props) {
    const { user } = use(params);
    const { isOpen, openModal, closeModal } = useModal();

    const [profile, setProfile] = useState<ProfileType | null>(null);
    const [form, setForm] = useState<Partial<ProfileType>>({});
    const [kycStatus, setKycStatus] = useState<string>("");
    const [frontImageUrl, setFrontImageUrl] = useState<string | null>(null);
    const [backImageUrl, setBackImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // all current live prices (tesla, spacex, neuralink, etc.)
    const [currentPrices, setCurrentPrices] = useState<Record<string, number>>({});

    useEffect(() => {
        const init = async () => {
            try {
                // 1️⃣ Tesla from your existing handler
                const teslaRaw = await fetchTeslaPrice();
                const teslaPrice =
                    typeof teslaRaw === "string"
                        ? parseFloat(teslaRaw) || 0
                        : Number(teslaRaw) || 0;

                // 2️⃣ Other shares from our /api/prices route
                const spacexRes = await fetchStockPrice("spacex");
                const spacexPrice =
                    typeof spacexRes === "string"
                        ? parseFloat(spacexRes) || 0
                        : Number(spacexRes) || 0;
                const neuralinkRes = await fetchStockPrice("neuralink");
                const neuralinkPrice =
                    typeof neuralinkRes === "string"
                        ? parseFloat(neuralinkRes) || 0
                        : Number(neuralinkRes) || 0;


                const prices: Record<string, number> = {
                    tesla: teslaPrice,
                    spacex: spacexPrice,
                    neuralink: neuralinkPrice,
                };

                setCurrentPrices(prices);

                if (!currentPrices) {
                    console.log("No prices fetched yet.");
                }

                // 3️⃣ Load user using these prices
                await fetchUser(prices);
            } catch (err) {
                console.error("Error initializing profile/prices:", err);
                toast.error("Failed to load user pricing data.");
                setLoading(false);
            }
        };

        init();
    }, [user]);

    const fetchUser = async (prices: Record<string, number>) => {
        setLoading(true);
        try {
            const res = await databases.listDocuments(DB_ID, PROFILE_COLLECTION_ID, [
                Query.equal("$id", user),
            ]);

            if (!res.documents.length) {
                setProfile(null);
                return;
            }

            const doc: any = res.documents[0];

            // 1️⃣ Fetch stock logs for this user
            const stockRes = await databases.listDocuments(
                DB_ID,
                STOCKLOG_COLLECTION_ID,
                [Query.equal("userId", doc.userId), Query.orderDesc("$createdAt")]
            );

            // 2️⃣ Compute total stock value: shares * currentPrice
            const totalStockValue = stockRes.documents.reduce(
                (sum: number, tx: any) => {
                    const shares = Number(tx.shares) || 0;
                    const stockTypeKey = tx.shareType?.toLowerCase?.() || ""; // "tesla", "spacex", "neuralink"
                    const currentPrice = prices[stockTypeKey] || 0;
                    return sum + shares * currentPrice;
                },
                0
            );

            // 3️⃣ Final balance = deposits + profit + stock value
            const balanceNumber =
                (Number(doc.totalDeposit) || 0) +
                (Number(doc.profit) || 0) +
                totalStockValue;

            setProfile({
                id: doc.userId,
                first_name: doc.firstName,
                last_name: doc.lastName,
                email: doc.email,
                gender: doc.gender,
                phone: doc.phone,
                country: doc.country,
                state: doc.state,
                city: doc.city,
                zip: doc.zip,
                address: doc.address,
                balance: balanceNumber,
                dob: doc.dob,
                created_at: doc.$createdAt,
                updated_at: doc.$updatedAt,
                kyc_status: doc.kycStatus,
                profit: parseFloat(doc.profit) || 0,
                withdrawal_limit: doc.withdrawalLimit || 0,
                // extra fields
                tier_level: doc.tierLevel ?? 1,
                labels: doc.labels ?? "user",
                total_deposit: parseFloat(doc.totalDeposit) || 0,
                referred_by: doc.referredBy ?? "",
                btc_address: doc.btcAddress ?? "",
                referee_id: doc.refereeId ?? "",
                status: doc.status ?? 'active'
            });

            setBackImageUrl(doc.kycBack);
            setFrontImageUrl(doc.kycFront);
            setKycStatus(doc.kycStatus || "");
        } catch (error) {
            console.error("Error fetching user:", error);
        } finally {
            setLoading(false);
        }
    };

    /* ---------- Handlers ---------- */

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        const key = name as keyof ProfileType;
        const newValue =
            type === "number" ? (value === "" ? "" : Number(value)) : value;

        setForm((prev) => ({ ...prev, [key]: newValue }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        const updatedFields: { [K in ProfileField]?: string | number } = {};

        // detect which fields changed
        for (const key of profileFields) {
            const current = profile[key];
            const edited = form[key];

            const changed =
                key === "dob"
                    ? edited !== undefined &&
                    new Date(current as string).toISOString().split("T")[0] !==
                    new Date(edited as string).toISOString().split("T")[0]
                    : current !== edited && edited !== undefined;

            if (changed && edited !== undefined) {
                updatedFields[key] = edited as string | number;
            }
        }

        try {
            const parseNumber = (
                val: number | string | null | undefined
            ): number => {
                if (typeof val === "number") return val;
                if (typeof val === "string") {
                    const parsed = parseFloat(val);
                    return isNaN(parsed) ? 0 : parsed;
                }
                return 0;
            };

            const payload: Record<string, string | number | undefined> = {
                firstName: updatedFields.first_name,
                lastName: updatedFields.last_name,
                email: updatedFields.email,
                gender: updatedFields.gender,
                phone: updatedFields.phone,
                country: updatedFields.country,
                state: updatedFields.state,
                city: updatedFields.city,
                zip: updatedFields.zip,
                address: updatedFields.address,
                dob: updatedFields.dob,
                kycStatus: kycStatus,
                profit: parseNumber(updatedFields.profit) + profile.profit,
                withdrawalLimit: parseNumber(updatedFields.withdrawal_limit),
            };

            Object.keys(payload).forEach(
                (key) => payload[key] === undefined && delete payload[key]
            );

            if (Object.keys(payload).length > 0) {
                await databases.updateDocument(
                    DB_ID,
                    PROFILE_COLLECTION_ID,
                    user,
                    payload
                );
            }

            if (updatedFields.profit) {
                await databases.createDocument(
                    DB_ID,
                    NOTIFICATION_COLLECTION,
                    ID.unique(),
                    {
                        userId: profile.id,
                        title: "Profits",
                        message: `You just earned $${updatedFields.profit} profit.`,
                        type: "profit",
                    }
                );
            }

            toast.success("User updated successfully");
            closeModal();

            // update local profile state
            setProfile((prev) =>
                prev
                    ? {
                        ...prev,
                        ...Object.fromEntries(
                            Object.entries(updatedFields).map(([key, value]) => [
                                key,
                                typeof value === "number" &&
                                    (key === "balance" ||
                                        key === "zip" ||
                                        key === "profit")
                                    ? value
                                    : String(value),
                            ])
                        ),
                        kyc_status: kycStatus,
                    }
                    : prev
            );
        } catch (error) {
            console.error("Update failed:", error);
            toast.error("Failed to update user");
        }
    };

    /* ---------- Render ---------- */

    if (loading) return <Loading />;
    if (!profile)
        return (
            <div className="p-6 text-center text-red-500">User not found.</div>
        );

    const fullName =
        `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() ||
        "Unnamed user";

    const initials = fullName
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const kycBadgeColor =
        kycStatus === "approved"
            ? "bg-emerald-100 text-emerald-700"
            : kycStatus === "rejected"
                ? "bg-red-100 text-red-700"
                : kycStatus === "reviewing"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-gray-100 text-gray-700";

    return (
        <>
            <div className="px-4 md:px-10 py-10">
                <div className="max-w-7xl mx-auto">
                    <div className="space-y-6">
                        {/* Back button */}
                        <div className="py-3 flex items-center justify-between">
                            <Link href="/admin-Dashboard-Panel">
                                <button className="hover:bg-white/0 text-base dark:text-white/70 font-semibold gap-2 hover:dark:text-white/80 text-black/70 hover:text-black/80 flex items-center ggap-2">
                                    <FaArrowLeftLong />
                                    Back
                                </button>
                            </Link>
                        </div>

                        {/* Header / Identity */}
                        <div className="rounded-2xl border border-border bg-card p-6">
                            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-500 text-lg font-semibold text-white shadow-md">
                                        {initials}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white/90">
                                            {fullName}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {profile.email || "No email"}
                                        </p>
                                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-1 font-medium capitalize ${kycBadgeColor}`}
                                            >
                                                <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
                                                KYC {kycStatus || "unknown"}
                                            </span>
                                            {profile.tier_level && (
                                                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                                                    Tier {profile.tier_level}
                                                </span>
                                            )}
                                            {profile.labels && (
                                                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                                    {profile.labels}
                                                </span>
                                            )}
                                            <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-1 font-medium text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                                                ID: {profile.id}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-start gap-2 text-xs text-gray-500 dark:text-gray-400 md:items-end">
                                    <div>Joined: {formatDate(profile.created_at)}</div>
                                    <div>Last updated: {formatDate(profile.updated_at)}</div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={openModal}
                                        className="mt-1 rounded-full h-12 px-4"
                                    >
                                        Edit profile
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Stat cards */}
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-2xl border border-border bg-card p-4">
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                    Total Balance
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                                    {formatCurrency(profile.balance)}
                                </p>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Includes deposits, profit & shares value
                                </p>
                            </div>

                            <div className="rounded-2xl border border-border bg-card p-4">
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                    Total Profit
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-emerald-600 dark:text-emerald-300">
                                    {formatCurrency(profile.profit)}
                                </p>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    All-time realized earnings
                                </p>
                            </div>

                            <div className="rounded-2xl border border-border bg-card p-4">
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                    Total Deposits
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                                    {formatCurrency(profile.total_deposit)}
                                </p>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Sum of all user remaining deposits
                                </p>
                            </div>

                            <div className="rounded-2xl border border-border bg-card p-4">
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                    Withdrawal Limit
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                                    {profile.withdrawal_limit
                                        ? formatCurrency(profile.withdrawal_limit)
                                        : "0"}
                                </p>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Per policy for this account
                                </p>
                            </div>
                        </div>

                        {/* Info sections */}
                        <div className="grid gap-6 lg:grid-cols-3">
                            {/* Personal + contact */}
                            <div className="space-y-6 lg:col-span-2">
                                {/* Personal */}
                                <div className="rounded-2xl border border-border bg-card p-5">
                                    <h4 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">
                                        Personal Information
                                    </h4>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <InfoRow label="Full Name" value={fullName} />
                                        <InfoRow label="Gender" value={profile.gender} />
                                        <InfoRow
                                            label="Date of Birth"
                                            value={formatDate(profile.dob)}
                                        />
                                        <InfoRow
                                            label="Referred By"
                                            value={profile.referred_by || "-"}
                                        />
                                        <InfoRow
                                            label="Referee ID"
                                            value={profile.referee_id || "-"}
                                        />
                                    </div>
                                </div>

                                {/* Contact & address */}
                                <div className="rounded-2xl border border-border bg-card p-5">
                                    <h4 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">
                                        Contact & Address
                                    </h4>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <InfoRow label="Email" value={profile.email} />
                                        <InfoRow label="Phone" value={profile.phone} />
                                        <InfoRow label="Country" value={profile.country} />
                                        <InfoRow label="State" value={profile.state} />
                                        <InfoRow label="City" value={profile.city} />
                                        <InfoRow label="ZIP / Postal Code" value={profile.zip} />
                                    </div>
                                    <div className="mt-4">
                                        <InfoRow label="Street Address" value={profile.address} />
                                    </div>
                                </div>
                            </div>

                            {/* Account & security */}
                            <div className="space-y-6">
                                <UserDangerActions
                                    profileDocId={user}          // profile doc $id
                                    userId={profile.id}          // auth userId / foreign key
                                    initialStatus={profile.status}  // <-- add this (assuming profile.status exists)
                                />
                                <div className="rounded-2xl border border-border bg-card p-5">
                                    <h4 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">
                                        Quick Links
                                    </h4>
                                    <div className="flex flex-col gap-2">
                                        <Button  asChild variant={'outline'}>
                                            <Link
                                                href={`/admin-Dashboard-Panel/user-profiles/${user}/investment/${profile.id}`}
                                                className="flex items-center justify-between! rounded-xl px-3 py-2 h-12 text-xs font-medium"
                                            >
                                                <span>View Investments</span>
                                                <span>→</span>
                                            </Link>
                                        </Button>
                                        <Button asChild variant={'outline'}>
                                            <Link
                                                href={`/admin-Dashboard-Panel/user-profiles/${user}/transaction/${profile.id}`}
                                                className="flex items-center justify-between! rounded-xl px-3 py-2 h-12 text-xs font-medium"
                                            >
                                                <span>View Transactions</span>
                                                <span>→</span>
                                            </Link>
                                        </Button>
                                        <Button asChild variant={'outline'}>
                                            <Link
                                                href={`/admin-Dashboard-Panel/user-profiles/${user}/shares/${profile.id}`}
                                                className="flex items-center justify-between! rounded-xl px-3 py-2 h-12 text-xs font-medium"
                                            >
                                                <span>View Shares</span>
                                                <span>→</span>
                                            </Link>
                                        </Button>
                                        {/* <Button asChild variant={'outline'}>
                                            <Link
                                                href={`/admin-Dashboard-Panel/user-profiles/${user}/shipments/${profile.id}`}
                                                className="flex items-center justify-between! rounded-xl px-3 py-2 h-12 text-xs font-medium"
                                            >
                                                <span>Shipment</span>
                                                <span>→</span>
                                            </Link>
                                        </Button> */}
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-2">
                                <div className="rounded-2xl border border-border bg-card p-5">
                                    <h4 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">
                                        Account
                                    </h4>
                                    <div className="space-y-3">
                                        <InfoRow
                                            label="Tier Level"
                                            value={profile.tier_level ?? 1}
                                        />
                                        <InfoRow label="Label" value={profile.labels || "user"} />
                                        <InfoRow
                                            label="BTC Address"
                                            value={profile.btc_address || "Not set"}
                                            mono
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-1">
                                {/* KYC document preview */}
                                <KycDocumentCard
                                    frontImageUrl={frontImageUrl}
                                    backImageUrl={backImageUrl}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Edit Modal */}
                    <Modal isOpen={isOpen} onClose={closeModal} className="m-4 max-w-[700px]">
                        <div className="modal-body p-8">
                            <div className="px-2 pr-14">
                                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                                    Edit Profile
                                </h4>
                                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                                    Update user details. Only changed fields will be saved.
                                </p>
                            </div>

                            <form onSubmit={handleSave} className="flex flex-col">
                                <div className="custom-scrollbar max-h-[420px] overflow-y-auto px-2">
                                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                        {profileFields.map((field) => (
                                            <div
                                                key={field}
                                                className={
                                                    field === "address"
                                                        ? "lg:col-span-2 space-y-1"
                                                        : "space-y-1"
                                                }
                                            >
                                                <Label>{field.replace("_", " ").toUpperCase()}</Label>
                                                <Input
                                                    className="h-11"
                                                    type={
                                                        field === "balance" || field === "zip"
                                                            ? "number"
                                                            : field === "dob"
                                                                ? "date"
                                                                : "text"
                                                    }
                                                    name={field}
                                                    readOnly={field === "balance"}
                                                    disabled={field === "balance"}
                                                    placeholder={
                                                        field === "balance" &&
                                                            profile.balance !== undefined
                                                            ? profile.balance.toString()
                                                            : field === "profit" &&
                                                                profile.profit !== undefined
                                                                ? profile.profit.toString()
                                                                : ""
                                                    }
                                                    value={form[field] ?? ""}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        ))}

                                        <div className="lg:col-span-2 space-y-1">
                                            <Label>KYC STATUS</Label>
                                            <Select
                                                options={kycStatusOptions}
                                                placeholder="Select status"
                                                className="dark:bg-dark-900"
                                                value={kycStatus}
                                                onValueChange={setKycStatus}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center gap-3 px-2 lg:justify-end">
                                    <Button size="sm" variant="outline" onClick={closeModal}>
                                        Cancel
                                    </Button>
                                    <Button size="sm" type="submit">
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </Modal>
                </div>
            </div>
        </>
    );
}

/** Small presentational row component */
function InfoRow({
    label,
    value,
    mono,
}: {
    label: string;
    value: string | number | null | undefined;
    mono?: boolean;
}) {
    return (
        <div>
            <p className="mb-0.5 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {label}
            </p>
            <p
                className={`text-sm font-medium text-gray-800 dark:text-white/90 ${mono ? "font-mono text-xs" : ""
                    }`}
            >
                {value && value !== "" ? value : "-"}
            </p>
        </div>
    );
}
