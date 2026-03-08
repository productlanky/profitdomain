"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/appwrite/auth";

export default function AuthRedirect({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const user = await getUser();

        if (user) {
          const isAdmin =
            Array.isArray(user.labels) && user.labels.includes("admin");

          router.replace(isAdmin ? "/admin-Dashboard-Panel" : "/dashboard");
          return;
        }
      } catch (err) {
        // ❌ No session → stay on login page
        console.log("No active session");
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, [router]);

  if (loading) return null; // or a loader

  return <>{children}</>;
}
