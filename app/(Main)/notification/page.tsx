"use client";

import { useEffect, useState } from "react";
import {
    Bell,
    Trash2,
    CheckCheck,
    Loader2,
    Mail,
    MailOpen,
    AlertCircle,
    Info,
    Search,
} from "lucide-react";
import { toast } from "sonner";
import { Query } from "appwrite";

import { getUser } from "@/lib/appwrite/auth";
import {
    databases,
    DB_ID,
    NOTIFICATION_COLLECTION,
} from "@/lib/appwrite/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/** Extend types so you can support more categories safely */
type NotificationType =
    | "transaction"
    | "system"
    | "profit"
    | "kyc"
    | "other"
    | "info"
    | "deposit"
    | "withdrawal";

interface NotificationDoc {
    $id: string;
    title: string;
    message: string;
    type?: NotificationType;
    isRead?: boolean;
    createdAt: string;
}

const FILTERS = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread" },
    { id: "info", label: "Info" },
    { id: "deposit", label: "Deposit" },
    { id: "withdrawal", label: "Withdrawal" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

export default function NotificationsPage() {
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState<NotificationDoc[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [filter, setFilter] = useState<FilterId>("all");
    const [search, setSearch] = useState("");
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const user = await getUser();
                if (!user) {
                    toast.error("You must be logged in to view notifications.");
                    return;
                }

                const res = await databases.listDocuments(
                    DB_ID,
                    NOTIFICATION_COLLECTION,
                    [Query.equal("userId", user.$id), Query.orderDesc("$createdAt")]
                );

                const docs: NotificationDoc[] = res.documents.map((doc: any) => ({
                    $id: doc.$id,
                    title: doc.title ?? "Notification",
                    message: doc.message ?? "",
                    type: (doc.type as NotificationType) ?? "other",
                    isRead: doc.isRead ?? false,
                    createdAt: doc.$createdAt,
                }));

                setNotifications(docs);
                if (docs.length) setSelectedId(docs[0].$id);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load notifications.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const selected = notifications.find((n) => n.$id === selectedId) || null;

    const filteredNotifications = notifications.filter((n) => {
        if (filter === "unread" && n.isRead) return false;
        if (filter !== "all" && filter !== "unread") {
            if ((n.type || "other") !== filter) return false;
        }
        if (!search.trim()) return true;

        const q = search.toLowerCase();
        return (
            n.title.toLowerCase().includes(q) ||
            n.message.toLowerCase().includes(q)
        );
    });

    const handleMarkRead = async (id: string) => {
        try {
            setBusy(true);
            await databases.updateDocument(DB_ID, NOTIFICATION_COLLECTION, id, {
                isRead: true,
            });

            setNotifications((prev) =>
                prev.map((n) => (n.$id === id ? { ...n, isRead: true } : n))
            );
        } catch (err) {
            console.error(err);
            toast.error("Failed to mark as read.");
        } finally {
            setBusy(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            setBusy(true);
            await databases.deleteDocument(DB_ID, NOTIFICATION_COLLECTION, id);

            setNotifications((prev) => prev.filter((n) => n.$id !== id));
            setSelectedId((prevSelected) => {
                if (prevSelected !== id) return prevSelected;
                const remaining = notifications.filter((n) => n.$id !== id);
                return remaining[0]?.$id ?? null;
            });

            toast.success("Notification deleted.");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete notification.");
        } finally {
            setBusy(false);
        }
    };

    const renderTypeIcon = (type?: NotificationType) => {
        switch (type) {
            case "deposit":
            case "withdrawal":
            case "transaction":
                return <Mail className="h-4 w-4 text-brand-500" />;
            case "system":
                return <AlertCircle className="h-4 w-4 text-amber-500" />;
            case "profit":
            case "info":
                return <Info className="h-4 w-4 text-emerald-500" />;
            case "kyc":
                return <IdCardIcon />;
            default:
                return <Bell className="h-4 w-4 text-brand-500" />;
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
                    <span>Loading your notifications…</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 rounded-xl border bg-background shadow-sm md:h-[90vh] md:flex-row md:overflow-hidden">
            {/* LEFT PANE (List) */}
            <aside className="w-full border-b bg-muted/40 md:w-[320px] md:border-b-0 md:border-r flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
                    <div>
                        <h2 className="text-sm font-semibold md:text-base">Notifications</h2>
                        <p className="text-[11px] text-muted-foreground md:text-xs">
                            Messages, alerts & updates
                        </p>
                    </div>
                    {notifications.filter((n) => !n.isRead).length > 0 &&
                        (<div className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            <span className="text-[11px] text-muted-foreground">
                                {notifications.filter((n) => !n.isRead).length} unread
                            </span>
                        </div>)
                    }
                </div>

                {/* Search */}
                <div className="px-3 pb-2 pt-3">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search notifications..."
                            className="h-9 pl-9 text-xs"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 px-3 pb-3">
                    {FILTERS.map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id)}
                            className={[
                                "rounded-full px-3 py-1 text-[11px] font-medium transition",
                                filter === f.id
                                    ? "bg-brand-600 text-white shadow-sm"
                                    : "bg-muted text-muted-foreground hover:bg-muted/70",
                            ].join(" ")}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredNotifications.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center gap-2 px-4 py-6 text-center text-xs text-muted-foreground">
                            <Bell className="h-5 w-5 text-muted-foreground" />
                            <p>No notifications found.</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-border">
                            {filteredNotifications.map((n) => {
                                const isSelected = n.$id === selectedId;
                                const isUnread = !n.isRead;

                                return (
                                    <li key={n.$id}>
                                        <button
                                            onClick={() => {
                                                setSelectedId(n.$id)
                                                handleMarkRead(n.$id)
                                            }}
                                            className={[
                                                "flex w-full items-center gap-3 px-3 py-2.5 text-left text-xs transition md:px-4",
                                                isSelected
                                                    ? "bg-brand-50/80 dark:bg-brand-950/20"
                                                    : "hover:bg-muted/60",
                                            ].join(" ")}
                                        >
                                            {/* Icon / unread dot */}
                                            <div className="relative flex h-7 w-7 items-center justify-center rounded-md bg-background">
                                                {renderTypeIcon(n.type)}
                                                {isUnread && (
                                                    <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-brand-500 ring-2 ring-background" />
                                                )}
                                            </div>

                                            {/* One-line content */}
                                            <div className="flex-1 min-w-0 flex items-center gap-2">
                                                <p
                                                    className={`truncate text-[12px] ${isUnread ? "font-semibold" : "font-medium"
                                                        }`}
                                                >
                                                    {n.title}
                                                </p>
                                                <span className="ml-auto whitespace-nowrap text-[10px] text-muted-foreground">
                                                    {new Date(n.createdAt).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                            </div>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </aside>

            {/* RIGHT PANE (Detail) */}
            <section className="flex-1 flex flex-col bg-card">
                {!selected ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-10 text-center">
                        <MailOpen className="h-8 w-8 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">No notification selected</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Choose a notification from the list to read its full details.
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Detail header */}
                        <div className="flex items-start justify-between gap-3 border-b px-4 py-3 md:px-6">
                            <div className="space-y-1">
                                <h3 className="text-sm font-semibold md:text-base">
                                    {selected.title}
                                </h3>
                                <p className="text-[11px] text-muted-foreground">
                                    {new Date(selected.createdAt).toLocaleString()}
                                </p>
                            </div>

                            <div className="flex items-center gap-1.5">
                                {!selected.isRead && (
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        disabled={busy}
                                        onClick={() => handleMarkRead(selected.$id)}
                                        className="h-8 w-8 rounded-full"
                                    >
                                        <CheckCheck className="h-4 w-4" />
                                    </Button>
                                )}
                                <Button
                                    size="icon"
                                    variant="outline"
                                    disabled={busy}
                                    onClick={() => handleDelete(selected.$id)}
                                    className="h-8 w-8 rounded-full border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-red-500/40 dark:hover:bg-red-950/30"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Detail body */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-5">
                            <div className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                                <p className="whitespace-pre-line">{selected.message}</p>
                            </div>
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}

/** Tiny icon for KYC type */
function IdCardIcon() {
    return (
        <div className="flex h-4 w-4 items-center justify-center rounded-[3px] border border-brand-500/40 bg-brand-50 text-[8px] font-semibold text-brand-700 dark:bg-brand-950/40 dark:text-brand-200">
            ID
        </div>
    );
}
