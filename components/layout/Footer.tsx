import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/50 bg-white/50 backdrop-blur-sm" role="contentinfo">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Image src="/MindWell_logo.png" alt="MindWell" width={40} height={40} className="rounded-xl" />
              <span className="text-xl font-bold gradient-text">MindWell</span>
            </div>
            <p className="text-sm text-slate-600 max-w-md leading-relaxed">
              Your AI-powered companion for emotional wellness. Supporting students with empathetic
              guidance, mood tracking, and personalized wellness resources.
            </p>
            <p className="mt-4 flex items-center gap-1 text-xs text-slate-500">
              <Heart className="h-3 w-3 text-red-400" aria-hidden="true" />
              Not a substitute for professional mental health care
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/register" className="hover:text-primary-600 transition-colors">Get Started</Link></li>
              <li><a href="#features" className="hover:text-primary-600 transition-colors">Features</a></li>
              <li><a href="#faq" className="hover:text-primary-600 transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="tel:988" className="hover:text-primary-600 transition-colors">988 Crisis Lifeline</a></li>
              <li><a href="https://www.nami.org" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">NAMI</a></li>
              <li><a href="https://www.crisistextline.org" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">Crisis Text Line</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200/50 pt-6 text-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} MindWell. All rights reserved. Built with care for student wellness.</p>
        </div>
      </div>
    </footer>
  );
}
