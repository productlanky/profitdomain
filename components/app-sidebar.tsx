"use client"

import * as React from "react"
import { Hexagon } from "lucide-react" // Added Loader2
import { useEffect, useState } from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Icons
import { GrTransaction } from "react-icons/gr";
import { VscReferences } from "react-icons/vsc";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { SiAfterpay, SiBasicattentiontoken, SiWebmoney } from "react-icons/si";
import { IconType } from "react-icons/lib";
import { PiFilmScriptFill, PiRankingFill, PiScrollFill } from "react-icons/pi";
import { IoSettings } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { RiSecurePaymentFill } from "react-icons/ri";

// Auth & Config
import { getUser } from "@/lib/appwrite/auth";
import { companyName } from "@/lib/data/info";
import Image from "next/image"

type NavItem = {
  name: string;
  icon: IconType;
  path: string; // Made required
};

// Updated paths to typically match dashboard structure (e.g. /dashboard/profile)
const navItems: NavItem[] = [
  {
    icon: TbLayoutDashboardFilled,
    name: "Dashboard",
    path: "/dashboard",
  },
  // {
  //   icon: FaLocationDot,
  //   name: "Tracking",
  //   path: "/tracking"
  // },
  {
    icon: SiWebmoney,
    name: "Investments",
    path: "/investments",
  },
  {
    icon: PiFilmScriptFill,
    name: "Investments Logs",
    path: "/logs",
  },
  {
    icon: SiBasicattentiontoken,
    name: "Shares",
    path: "/shares", // Adjusted based on previous context
  },
  {
    icon: PiScrollFill,
    name: "Shares Logs",
    path: "/sharelogs",
  },
  {
    icon: GrTransaction,
    name: "Transactions",
    path: "/transactions",
  },
  {
    icon: SiAfterpay,
    name: "Deposit",
    path: "/deposit",
  },
  {
    icon: RiSecurePaymentFill,
    name: "Withdrawal",
    path: "/withdraw",
  },
  {
    icon: PiRankingFill,
    name: "Ranks",
    path: "/rank", // Adjusted to match BannerPage
  },
  {
    icon: VscReferences,
    name: "Referrals",
    path: "/referral",
  },
  {
    icon: IoSettings,
    name: "Account settings",
    path: "/profile",
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // State for the user
  const [user, setUser] = useState({
    name: "User",
    email: "user@example.com",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const account = await getUser();

        if (account) {
          // Generate a fallback avatar if they don't have a custom photo_url in prefs
          // Assuming 'prefs.avatar' might exist, otherwise generate one
          const avatarUrl = `https://ui-avatars.com/api/?name=${account.name}&background=random&color=fff`;

          setUser({
            name: account.name,
            email: account.email,
            avatar: avatarUrl, // Or account.prefs?.avatar if you save it there
          });
        }
      } catch (error) {
        console.error("Failed to fetch sidebar user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="p-4 flex-row items-center">
        <Image
          src="/images/icon/logos.png" // Ensure this path is correct
          alt="Logo"
          height={48}
          width={48}
          className="h-12 w-auto"
          priority
        />
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-bold text-base">{companyName}</span>
          <span className="truncate text-xs text-muted-foreground">Dashboard</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-3">
        <NavMain items={navItems} />
      </SidebarContent>

      <SidebarFooter className="p-4">
        {loading ? (
          <div className="flex items-center gap-3 p-2">
            <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-white/10 animate-pulse" />
            <div className="flex-1 space-y-1">
              <div className="h-3 w-20 rounded bg-gray-200 dark:bg-white/10 animate-pulse" />
              <div className="h-2 w-28 rounded bg-gray-200 dark:bg-white/10 animate-pulse" />
            </div>
          </div>
        ) : (
          <NavUser user={user} />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}