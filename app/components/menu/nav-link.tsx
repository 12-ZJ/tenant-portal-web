"use client"

import * as Popover from "@radix-ui/react-popover"
import { ChevronDown } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import clsx from "clsx"
import { usePathname } from "next/navigation"
import { useUserStore } from "@/app/store"

const menuItems = [
  {
    name: "REQUEST ACCESS",
    href: "/request-access",
    sub_menu: [],
  },
  {
    name: "NEWS",
    href: "/news",
    sub_menu: [],
  },
  {
    name: "BACKOFFICE",
    href: "",
    sub_menu: [
      { name: "USER", href: "/user" },
      { name: "AREA", href: "/area" },
      { name: "BUILDING", href: "/building" },
    ],
  }
]

export default function NavLink() {
  const [mounted, setMounted] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <nav className="flex space-x-6 items-center h-full">
      {menuItems.map((e) => {
        const hasSub = e.sub_menu.length > 0
        const isMenuActive = e.href
          ? isActive(e.href)
          : e.sub_menu.some((i) => isActive(i.href))

        if (!hasSub) {
          const href = e.href;
          const className = clsx(
            "px-2 flex items-center space-x-1 gap-2 transition hover:border-b-2 hover:border-gainsboro h-full",
            isMenuActive && "border-b-2 border-gainsboro"
          )

          return (
            <Link key={e.name} href={href} className={className}>
              <span>{e.name}</span>
            </Link>
          )
        }

        return (
          <Popover.Root
            key={e.name}
            open={openMenu === e.name}
            onOpenChange={(open) => setOpenMenu(open ? e.name : null)}
          >
            <Popover.Trigger asChild>
              <button type="button"
                className={clsx(
                  "px-2 flex items-center space-x-1 gap-2 transition hover:border-b-2 hover:border-gainsboro h-full",
                  (openMenu === e.name || isMenuActive) && "border-gainsboro border-b-2"
                )}
              >
                <span>{e.name}</span>
                <ChevronDown
                  size={14}
                  className={clsx(
                    "transition-transform duration-200",
                    openMenu === e.name && "rotate-180"
                  )}
                />
              </button>
            </Popover.Trigger>

            <Popover.Portal>
              <Popover.Content
                className="bg-[#f5f5f5] rounded-b-lg shadow p-2 min-w-40 z-50"
                sideOffset={0}
                align="start"
                onClick={() => setOpenMenu(null)}
              >
                <ul className="max-h-[460px] overflow-auto">
                  {e.sub_menu.map((i) => {
                    const href = i.href;
                    const className = clsx(
                      "block px-4 py-1 text-theme_text hover:text-theme_primary hover:font-medium transition",
                      isActive(i.href) && "font-semibold text-theme_primary font-medium"
                    )
                    return (
                      <li key={i.name}>
                        {(
                          <Link href={href} className={className}>
                            {i.name}
                          </Link>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        )
      })}
    </nav>
  )
}