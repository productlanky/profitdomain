"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/AdminComponent/Navbar";
import { getUser } from "@/lib/appwrite/auth";
import {
    databases,
    DB_ID,
    PROFILE_COLLECTION_ID,
} from "@/lib/appwrite/client";
import { Query } from "appwrite";
import Loading from "@/components/ui/Loading";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [checking, setChecking] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);


    useEffect(() => {
        const verifyUser = async () => {
            try {
                // 🔐 1. Get logged-in user
                const user = await getUser();
                if (!user?.$id) {
                    router.push("/signin");
                    return;
                }

                // 📄 2. Load profile from Appwrite
                const res = await databases.listDocuments(DB_ID, PROFILE_COLLECTION_ID, [
                    Query.equal("userId", user.$id),
                ]);

                if (!res.documents.length) {
                    router.push("/signin");
                    return;
                }

                const adminCheck = res.documents[0].labels?.includes("admin");
                setIsAdmin(adminCheck);

                // 🔹 Redirect based on admin role

                if (!adminCheck) {
                    router.push("/404");
                    return;
                }



            } catch (err) {
                console.error("Auth check failed:", err);
                router.push("/signin");
            } finally {
                setChecking(false);
            }
        };

        verifyUser();
    }, []);

    // 🌀 Show loading while verifying user
    if (checking && !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loading />
            </div>
        );
    }

    // 🎉 If user is valid, render admin layout
    return (
        isAdmin &&
        <>
            <Navbar />
            <main className="flex flex-col min-h-screen">{children}</main>
        </>
    );
}
