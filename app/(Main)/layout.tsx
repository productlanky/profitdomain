"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";

import { getUser } from "@/lib/appwrite/auth";
import {
    databases,
    DB_ID,
    PROFILE_COLLECTION_ID,
} from "@/lib/appwrite/client";
import { Query } from "appwrite";
import Loading from "@/components/ui/Loading";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [checking, setChecking] = useState(true);

    const segments = pathname?.split("/").filter(Boolean) || [];

    /* --------------------------
       🔒 SUSPENSION CHECK LOGIC
       -------------------------- */
    useEffect(() => {
        const verifyAccess = async () => {
            try {
                const user = await getUser();
                if (!user?.$id) {
                    router.push("/signin");
                    return;
                }

                // Fetch profile
                const res = await databases.listDocuments(DB_ID, PROFILE_COLLECTION_ID, [
                    Query.equal("userId", user.$id),
                ]);

                if (!res.documents.length) {
                    router.push("/signin");
                    return;
                }

                const profile = res.documents[0];
                const status = profile.status?.toLowerCase() || "active";

                if (status === "suspended") {
                    router.push("/suspended");
                    return;
                }
            } catch (err) {
                console.error("Suspension check failed:", err);
                router.push("/signin");
            } finally {
                setChecking(false);
            }
        };

        verifyAccess();
    }, []);

    if (checking) {
        return (
            <Loading />
        );
    }

    /* --------------------------
       🧭 Breadcrumb Generator
       -------------------------- */
    const buildBreadcrumbs = () =>
        segments.map((segment, index) => {
            const href = "/" + segments.slice(0, index + 1).join("/");
            const isLast = index === segments.length - 1;
            const label = segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

            return isLast ? (
                <BreadcrumbItem key={href}>
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                </BreadcrumbItem>
            ) : (
                <BreadcrumbItem key={href}>
                    <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                    <BreadcrumbSeparator />
                </BreadcrumbItem>
            );
        });

    /* --------------------------
       📌 MAIN LAYOUT
       -------------------------- */
    return (
        <SidebarProvider>
            <AppSidebar />

            <SidebarInset>
                {/* HEADER */}
                <header className="flex sticky top-0 h-14 shrink-0 items-center gap-2 px-4 bg-background z-50 border-b">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mx-2 h-5" />

                    <Breadcrumb>
                        <BreadcrumbList>
                            {segments.length === 0 ? (
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                                </BreadcrumbItem>
                            ) : (
                                buildBreadcrumbs()
                            )}
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="ml-auto flex items-center">
                        <ThemeToggleButton />
                    </div>
                </header>

                {/* CONTENT */}
                <div className="flex flex-1 flex-col gap-4 p-4 bg-linear-to-br from-gray-50 to-gray-200 dark:from-black dark:to-gray-900">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
