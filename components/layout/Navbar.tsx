"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

interface NavbarProps {
  variant?: "landing" | "app";
}

export default function Navbar({ variant = "landing" }: NavbarProps) {
  return (
    <header className="fixed top-0 z-50 w-full">
      <nav className="glass mx-4 mt-4 rounded-2xl px-6 py-4 lg:mx-8" aria-label="Main navigation">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="MindWell home">
            <Image src="/MindWell_logo.png" alt="MindWell" width={40} height={40} className="rounded-xl" />
            <span className="text-xl font-bold gradient-text">MindWell</span>
          </Link>
          {variant === "landing" ? <LandingNav /> : <span className="sr-only">App navigation in sidebar</span>}
        </div>
      </nav>
    </header>
  );
}

function LandingNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <div className="hidden items-center gap-8 md:flex">
        {["Features", "About", "Testimonials", "FAQ"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors"
          >
            {item}
          </a>
        ))}
      </div>

      <div className="hidden items-center gap-3 md:flex">
        <Link href="/login" className="btn-secondary px-4 py-2 text-sm">
          Sign In
        </Link>
        <Link href="/register" className="btn-primary px-4 py-2 text-sm">
          Get Started
        </Link>
      </div>

      <button
        onClick={() => setMenuOpen(true)}
        className="rounded-lg p-2 hover:bg-slate-100 md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-0 flex h-full w-72 max-w-[80vw] flex-col rounded-l-2xl p-6 shadow-2xl animate-slide-up" style={{ backgroundColor: "#ffffff", backgroundImage: "none" }}>
            <div className="flex items-center justify-between mb-6">
              <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                <Image src="/MindWell_logo.png" alt="MindWell" width={36} height={36} className="rounded-xl" />
                <span className="text-lg font-bold gradient-text">MindWell</span>
              </Link>
              <button onClick={() => setMenuOpen(false)} className="rounded-lg p-2 hover:bg-slate-100" aria-label="Close menu">
                <X className="h-6 w-6" />
              </button>
            </div>
            {["Features", "About", "Testimonials", "FAQ"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-primary-600 transition-colors"
              >
                {item}
              </a>
            ))}
            <hr className="my-2 border-slate-200" />
            <div className="mt-auto flex flex-col gap-3">
              <Link href="/login" onClick={() => setMenuOpen(false)} className="btn-secondary text-sm py-2">
                Sign In
              </Link>
              <Link href="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-sm py-2">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
