"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageCircle,
  Smile,
  BookOpen,
  Sparkles,
  History,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn, getInitials } from "@/utils/helpers";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/mood", label: "Mood Tracker", icon: Smile },
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/wellness", label: "Wellness", icon: Sparkles },
  { href: "/history", label: "History", icon: History },
  { href: "/profile", label: "Profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <>
      <div className="flex items-center justify-between px-2 mb-8 shrink-0">
        <div className="flex items-center gap-2">
          <Image src="/MindWell_logo.png" alt="MindWell" width={40} height={40} className="rounded-xl" />
          <span className="text-lg font-bold gradient-text">MindWell</span>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-6 w-6 text-slate-500" />
        </button>
      </div>

      <nav className="flex-1 min-h-0 space-y-1 overflow-y-auto scrollbar-thin pr-1" aria-label="App navigation">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/25"
                  : "text-slate-600 hover:bg-white/80 hover:text-primary-600"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-slate-200/50 pt-4 shrink-0">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-accent-400 text-xs font-bold text-white">
            {profile?.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
            ) : (
              getInitials(profile?.name)
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">{profile?.name || "User"}</p>
            <p className="truncate text-xs text-slate-500">{profile?.email}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          aria-label="Sign out"
        >
          <LogOut className="h-5 w-5" aria-hidden="true" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-30 lg:hidden">
        <div className="glass mx-4 mt-4 rounded-2xl px-6 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/MindWell_logo.png" alt="MindWell" width={36} height={36} className="rounded-xl" />
            <span className="text-lg font-bold gradient-text">MindWell</span>
          </Link>
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 hover:bg-slate-100"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6 text-slate-700" />
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col h-[100dvh] max-h-[100dvh] bg-white p-4 shadow-2xl transition-transform duration-300 lg:translate-x-0 lg:glass",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        aria-label="Sidebar"
      >
        <NavContent />
      </aside>
    </>
  );
}
