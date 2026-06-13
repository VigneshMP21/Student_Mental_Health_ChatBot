import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  variant?: "landing" | "app";
}

export default function Navbar({ variant = "landing" }: NavbarProps) {
  return (
    <header className="fixed top-0 z-50 w-full">
      <nav
        className="glass mx-4 mt-4 rounded-2xl px-6 py-4 lg:mx-8"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="MindWell home">
            <Image src="/MindWell_logo.png" alt="MindWell" width={40} height={40} className="rounded-xl" />
            <span className="text-xl font-bold gradient-text">MindWell</span>
          </Link>

          {variant === "landing" ? (
            <LandingNav />
          ) : (
            <span className="sr-only">App navigation in sidebar</span>
          )}
        </div>
      </nav>
    </header>
  );
}

function LandingNav() {
  return (
    <>
      <div className="hidden items-center gap-8 md:flex">
        <a href="#features" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">
          Features
        </a>
        <a href="#about" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">
          About
        </a>
        <a href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">
          Testimonials
        </a>
        <a href="#faq" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">
          FAQ
        </a>
      </div>

      <div className="hidden items-center gap-3 md:flex">
        <Link href="/login" className="btn-secondary px-4 py-2 text-sm">
          Sign In
        </Link>
        <Link href="/register" className="btn-primary px-4 py-2 text-sm">
          Get Started
        </Link>
      </div>

      <MobileMenu />
    </>
  );
}

function MobileMenu() {
  return (
    <details className="relative md:hidden group">
      <summary className="list-none cursor-pointer rounded-lg p-2 hover:bg-slate-100" aria-label="Toggle menu">
        <Menu className="h-6 w-6 group-open:hidden" />
        <X className="h-6 w-6 hidden group-open:block" />
      </summary>
      <div className="absolute right-0 top-full mt-2 w-56 glass rounded-xl p-4 shadow-xl">
        <div className="flex flex-col gap-3">
          <a href="#features" className="text-sm font-medium text-slate-600 hover:text-primary-600">Features</a>
          <a href="#about" className="text-sm font-medium text-slate-600 hover:text-primary-600">About</a>
          <a href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-primary-600">Testimonials</a>
          <a href="#faq" className="text-sm font-medium text-slate-600 hover:text-primary-600">FAQ</a>
          <hr className="border-slate-200" />
          <Link href="/login" className="btn-secondary text-sm py-2">Sign In</Link>
          <Link href="/register" className="btn-primary text-sm py-2">Get Started</Link>
        </div>
      </div>
    </details>
  );
}
