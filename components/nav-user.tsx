"use client";

import {
  User,
  LogOut,
  IdCard,
  ChevronsUpDown,
  Trophy,
  Sparkles,
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { logOut } from "@/lib/appwrite/auth";

interface NavUserProps {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

export function NavUser({ user }: NavUserProps) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const [logoutOpen, setLogoutOpen] = useState(false);

  async function signOut(): Promise<void> {
    try {
      await logOut();
      toast.success("Signed out successfully");
      router.push("/signin");
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign out");
    }
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground transition-all duration-200"
              >
                <Avatar className="h-8 w-8 rounded-lg border border-border">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-semibold">
                    {user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>

                <ChevronsUpDown className="ml-auto size-4 opacity-50" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl border border-border bg-popover text-popover-foreground shadow-xl"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={8}
            >
              {/* TOP PROFILE SNAPSHOT */}
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-3 px-2 py-2.5 text-left text-sm">
                  <Avatar className="h-9 w-9 rounded-lg border border-border">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg font-semibold">
                      {user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              {/* MAIN ACTIONS */}
              <DropdownMenuGroup>
                <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                  <Link href="/profile">
                    <User className="h-4 w-4 text-muted-foreground" />
                    My Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                  <Link href="/profile">
                    <IdCard className="h-4 w-4 text-muted-foreground" />
                    KYC Verification
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                  <Link href="/rank">
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                    Ranks & Rewards
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                  <Link href="/referral">
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                    Referrals
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              {/* LOG OUT */}
              <DropdownMenuItem
                className="gap-2 cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950/50 dark:focus:text-red-400"
                onClick={() => setLogoutOpen(true)}
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* CONFIRM LOGOUT MODAL */}
      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent className="max-w-sm rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out?</AlertDialogTitle>
            <AlertDialogDescription>
              You&apos;ll be logged out of your investment account on this
              device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 rounded-full text-white"
              onClick={signOut}
            >
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}