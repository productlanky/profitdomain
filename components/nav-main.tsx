"use client"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { IconType } from "react-icons/lib"

type NavItem = {
  name: string
  icon: IconType
  path?: string
}

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname()

  const isActive = (path?: string) => path === pathname

  return (
    <SidebarMenu className="px-2">
      {items.map((item) => {
        const active = isActive(item.path)

        return (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              className={`
                h-11 gap-3 group transition-all duration-200
                ${active 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }
              `}
              isActive={active}
            >
              <Link href={item.path!}>
                <item.icon
                  size={20}
                  className={`
                    transition-colors duration-200 
                    ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}
                  `}
                />
                <span className="font-medium">{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}
