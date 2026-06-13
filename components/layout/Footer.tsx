import Link from "next/link";
import Image from "next/image";
import { Heart, Shield, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/50 bg-white/50 backdrop-blur-sm" role="contentinfo">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Image src="/MindWell_logo.png" alt="MindWell" width={40} height={40} className="rounded-xl" />
              <span className="text-xl font-bold gradient-text">MindWell</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your AI-powered companion for emotional wellness. Supporting students with empathetic
              guidance, mood tracking, and personalized wellness resources.
            </p>
            <p className="mt-4 flex items-center gap-1 text-xs text-slate-500">
              <Shield className="h-3 w-3 shrink-0" aria-hidden="true" />
              Your data is encrypted and private
            </p>
            <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
              <Heart className="h-3 w-3 shrink-0 text-red-400" aria-hidden="true" />
              Not a substitute for professional mental health care
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/register" className="hover:text-primary-600 transition-colors">Get Started</Link></li>
              <li><a href="#features" className="hover:text-primary-600 transition-colors">Features</a></li>
              <li><a href="#about" className="hover:text-primary-600 transition-colors">About</a></li>
              <li><a href="#faq" className="hover:text-primary-600 transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#testimonials" className="hover:text-primary-600 transition-colors">Testimonials</a></li>
              <li><Link href="/login" className="hover:text-primary-600 transition-colors">Sign In</Link></li>
              <li><Link href="/register" className="hover:text-primary-600 transition-colors">Create Account</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Help & Support</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <a href="tel:988" className="inline-flex items-center gap-2 hover:text-primary-600 transition-colors font-medium text-primary-600">
                  <Phone className="h-3 w-3" aria-hidden="true" />
                  988 Crisis Lifeline
                </a>
              </li>
              <li><a href="https://www.nami.org" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">NAMI</a></li>
              <li><a href="https://www.crisistextline.org" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">Crisis Text Line</a></li>
              <li><a href="https://www.samhsa.gov" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">SAMHSA</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} MindWell. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="h-3 w-3 text-red-400" aria-hidden="true" /> for student wellness
          </p>
        </div>
      </div>
    </footer>
  );
}
