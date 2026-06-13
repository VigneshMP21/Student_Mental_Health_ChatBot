import Link from "next/link";
import Image from "next/image";
import {
  MessageCircle,
  Smile,
  BookOpen,
  Sparkles,
  Shield,
  BarChart3,
  ArrowRight,
  Heart,
  Star,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ScrollReveal";

const features = [
  {
    icon: MessageCircle,
    title: "AI Wellness Chat",
    description: "Empathetic AI conversations powered by Google Gemini, tailored for student life.",
  },
  {
    icon: Smile,
    title: "Mood Tracking",
    description: "Log your daily moods and discover patterns with weekly and monthly insights.",
  },
  {
    icon: BookOpen,
    title: "Personal Journal",
    description: "Private journaling space to reflect, process emotions, and track your growth.",
  },
  {
    icon: Sparkles,
    title: "Wellness Tips",
    description: "Personalized suggestions for stress relief, study tips, sleep, and mindfulness.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your data is encrypted and protected. We never share your personal information.",
  },
  {
    icon: BarChart3,
    title: "Progress Dashboard",
    description: "Visualize your wellness journey with streaks, mood scores, and activity tracking.",
  },
];

const testimonials = [
  {
    name: "Sarah M.",
    role: "College Sophomore",
    text: "MindWell helped me manage exam stress. The AI feels genuinely supportive without being preachy.",
    avatar: "SM",
  },
  {
    name: "James K.",
    role: "Graduate Student",
    text: "The mood tracker helped me notice patterns I never saw before. Combined with journaling, it's been transformative.",
    avatar: "JK",
  },
  {
    name: "Priya R.",
    role: "High School Senior",
    text: "I use the breathing exercises before tests. Simple, effective, and always available when I need them.",
    avatar: "PR",
  },
];

const faqs = [
  {
    q: "Is MindWell a replacement for therapy?",
    a: "No. MindWell is a supportive wellness tool, not a substitute for professional mental health care. For serious concerns, please consult a qualified professional or call the 988 Suicide & Crisis Lifeline.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Your conversations, mood logs, and journal entries are stored securely with encryption. Only you can access your data through your authenticated account.",
  },
  {
    q: "How does the AI work?",
    a: "MindWell uses Google Gemini AI to provide empathetic, context-aware responses. The AI is prompted to be supportive while avoiding medical diagnoses or prescribing treatments.",
  },
  {
    q: "Is MindWell free to use?",
    a: "MindWell offers core features for free. Create an account to access chat, mood tracking, journaling, and wellness suggestions.",
  },
];

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32" aria-labelledby="hero-heading">
          <div className="absolute inset-0 -z-10">
            <div className="floating-blob absolute top-20 left-1/4 h-72 w-72 rounded-full bg-primary-200/30 blur-3xl" />
            <div className="floating-blob absolute bottom-20 right-1/4 h-96 w-96 rounded-full bg-accent-400/20 blur-3xl" />
            <div className="floating-blob absolute top-1/3 right-1/3 h-48 w-48 rounded-full bg-primary-300/20 blur-2xl" />
            <div className="floating-blob absolute bottom-1/4 left-1/3 h-56 w-56 rounded-full bg-accent-300/15 blur-2xl" />
          </div>

          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <ScrollReveal>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium text-primary-700">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  AI-Powered Student Wellness
                </div>
                <h1 id="hero-heading" className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                  Your Mental Health{" "}
                  <span className="gradient-text">Companion</span>
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-slate-600 max-w-lg">
                  Navigate student life with confidence. Get empathetic AI support, track your mood,
                  journal your thoughts, and access personalized wellness guidance — all in one place.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/register" className="btn-primary glow-pulse">
                    Start Your Journey
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <a href="#features" className="btn-secondary">
                    Learn More
                  </a>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <div className="relative animate-float">
                  <div className="glass rounded-3xl p-6 sm:p-8 shadow-2xl">
                    <div className="flex items-center gap-3 mb-5">
                      <Image src="/MindWell_logo.png" alt="MindWell" width={48} height={48} className="rounded-2xl" />
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">MindWell AI</p>
                        <p className="flex items-center gap-1.5 text-xs text-green-600">
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                          </span>
                          Online &bull; Ready to help
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-primary-50 p-4 text-sm text-slate-700">
                        I&apos;ve been feeling overwhelmed with finals coming up...
                      </div>
                      <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white border border-slate-100 p-4 text-sm text-slate-700 shadow-sm">
                        I hear you — finals can feel like a lot. Let&apos;s break this down together.
                        What&apos;s weighing on you most right now?
                      </div>
                      <div className="flex gap-1.5 pl-2">
                        <div className="h-2 w-2 rounded-full bg-primary-400 typing-dot" />
                        <div className="h-2 w-2 rounded-full bg-primary-400 typing-dot" />
                        <div className="h-2 w-2 rounded-full bg-primary-400 typing-dot" />
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 lg:py-28" aria-labelledby="features-heading">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 id="features-heading" className="section-title">
                  Everything You Need for{" "}
                  <span className="gradient-text">Emotional Wellness</span>
                </h2>
                <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                  Comprehensive tools designed specifically for the unique challenges of student life.
                </p>
              </div>
            </ScrollReveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <ScrollReveal key={feature.title} delay={i * 100}>
                  <div className="card group hover:-translate-y-1">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 text-primary-600 group-hover:from-primary-500 group-hover:to-accent-500 group-hover:text-white ring-1 ring-primary-200/50 group-hover:ring-transparent transition-all duration-300">
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* About / Stats */}
        <section id="about" className="py-20 lg:py-28 bg-white/40" aria-labelledby="about-heading">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <ScrollReveal>
                <h2 id="about-heading" className="section-title mb-6">
                  Built for <span className="gradient-text">Students, By Understanding</span>
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Student life brings unique pressures — academic deadlines, social challenges,
                  financial stress, and the transition to independence. MindWell was created to
                  provide accessible emotional support when you need it most.
                </p>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Our AI assistant is trained to be empathetic and supportive while always
                  encouraging professional help for serious concerns. We believe every student
                  deserves a safe space to process their emotions.
                </p>
                <Link href="/register" className="btn-primary">
                  Join MindWell Today
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </ScrollReveal>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { stat: "10K+", label: "Students Supported" },
                  { stat: "50K+", label: "Conversations" },
                  { stat: "4.8/5", label: "User Rating" },
                  { stat: "24/7", label: "Always Available" },
                ].map((item, i) => (
                  <ScrollReveal key={item.label} delay={i * 100}>
                    <div className="card text-center hover:-translate-y-1 animate-float-delayed" style={{ animationDelay: `${i * 0.5}s` }}>
                      <p className="text-3xl font-bold gradient-text">{item.stat}</p>
                      <p className="mt-1 text-sm text-slate-600">{item.label}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 lg:py-28 relative" aria-labelledby="testimonials-heading">
          <div className="absolute inset-0 -z-10 bg-dot-pattern" />
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 id="testimonials-heading" className="section-title">
                  Loved by <span className="gradient-text">Students</span>
                </h2>
              </div>
            </ScrollReveal>
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((t, i) => (
                <ScrollReveal key={t.name} delay={i * 150}>
                  <blockquote className="card h-full flex flex-col">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, s) => (
                        <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                      ))}
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">&ldquo;{t.text}&rdquo;</p>
                    <footer className="flex items-center gap-3 pt-4 border-t border-slate-100">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-accent-400 text-xs font-bold text-white ring-2 ring-white shadow-md">
                        {t.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                        <p className="text-xs text-slate-500">{t.role}</p>
                      </div>
                    </footer>
                  </blockquote>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20 lg:py-28 bg-white/40" aria-labelledby="faq-heading">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 id="faq-heading" className="section-title">
                  Frequently Asked <span className="gradient-text">Questions</span>
                </h2>
              </div>
            </ScrollReveal>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <ScrollReveal key={faq.q} delay={i * 100}>
                  <details className="card group" style={{ transition: "all 0.3s ease" }}>
                    <summary className="cursor-pointer text-sm font-semibold text-slate-900 list-none flex items-center justify-between gap-4">
                      <span>{faq.q}</span>
                      <span className="text-primary-500 group-open:rotate-45 transition-transform duration-300 text-xl shrink-0">+</span>
                    </summary>
                    <p className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-600 leading-relaxed">
                      {faq.a}
                    </p>
                  </details>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-28" aria-labelledby="cta-heading">
          <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
            <ScrollReveal>
              <div className="glass rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary-200/30 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-accent-300/20 blur-3xl" />
                <h2 id="cta-heading" className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 relative">
                  Ready to Prioritize Your <span className="gradient-text">Wellness</span>?
                </h2>
                <p className="text-slate-600 mb-8 max-w-lg mx-auto relative">
                  Join thousands of students taking control of their mental health journey.
                </p>
                <Link href="/register" className="btn-primary text-base px-8 py-4 glow-pulse relative">
                  <Heart className="h-5 w-5" aria-hidden="true" />
                  Create Free Account
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
