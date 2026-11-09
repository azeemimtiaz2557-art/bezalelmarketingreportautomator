"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, FileText, LayoutDashboard, Settings, Upload, type LucideIcon } from "lucide-react";
import { BrandLogo } from "./brand-logo";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: LucideIcon };

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/upload", label: "Upload Data", icon: Upload },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 pb-6 pt-6">
        <BrandLogo size={40} />
        <div className="leading-tight">
          <p className="text-sm font-semibold text-primary">Bezalel Media</p>
          <p className="text-xs text-ink-secondary">Report Automator</p>
        </div>
      </div>

      <nav aria-label="Main navigation" className="flex flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium transition-colors duration-200",
                active
                  ? "bg-primary text-white"
                  : "text-ink-secondary hover:bg-background hover:text-ink",
              )}
            >
              <Icon
                aria-hidden="true"
                className={cn(
                  "h-[18px] w-[18px] transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:scale-110",
                  active ? "text-gold-light" : "text-ink-secondary group-hover:text-gold",
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-border px-5 py-5">
        <p className="text-xs font-medium tracking-wide text-gold">Crafted with Purpose.</p>
      </div>
    </div>
  );
}
