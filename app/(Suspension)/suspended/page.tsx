"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/appwrite/auth";
import { databases, DB_ID, PROFILE_COLLECTION_ID } from "@/lib/appwrite/client";
import { Query } from "appwrite";
import { SuspendedUI } from "@/components/suspension/SuspendedUI";
import { Loader2 } from "lucide-react";

export default function SuspendedPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const user = await getUser();
        if (!user?.$id) return router.push("/signin");

        // fetch profile from Appwrite
        const res = await databases.listDocuments(DB_ID, PROFILE_COLLECTION_ID, [
          Query.equal("userId", user.$id),
        ]);

        if (!res.documents.length) return router.push("/signin");

        const profile = res.documents[0];
        // Safely check status, default to active if missing
        const status = (profile.status || "active").toLowerCase();

        if (status !== "suspended") {
          // If user somehow lands here but isn't suspended, kick them back to dashboard
          return router.push("/dashboard");
        }

        setReason(profile.suspensionReason || null);
        setLoading(false);
      } catch (error) {
        console.error(error);
        router.push("/signin");
      }
    };

    checkStatus();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#050505] flex flex-col items-center justify-center text-zinc-500 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-brand-500" />
        <p className="text-sm font-medium animate-pulse">Verifying account status...</p>
      </div>
    );
  }

  return <SuspendedUI reason={reason} />;
}