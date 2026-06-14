import Link from 'next/link';
import Image from 'next/image';
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Heart,
  LineChart,
  Lock,
  MessageCircle,
  Moon,
  Shield,
  Smile,
  Sparkles,
  Star,
  Target,
  Waves,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollReveal from '@/components/ScrollReveal';

const heroMetrics = [
  { value: '24/7', label: 'gentle support' },
  { value: '4 tools', label: 'chat, mood, journal, plans' },
  { value: 'Private', label: 'encrypted student space' },
];

const flowSteps = [
  {
    icon: MessageCircle,
    eyebrow: 'Check in',
    title: 'Start with what feels heavy',
    description:
      'A calm AI conversation helps you name stressors, sort priorities, and decide on one next step.',
    accent: 'from-blue-500 to-cyan-400',
  },
  {
    icon: BarChart3,
    eyebrow: 'Notice',
    title: 'Mood patterns become visible',
    description:
      'Daily logs turn into weekly context, showing how sleep, deadlines, and routines shape your energy.',
    accent: 'from-indigo-500 to-violet-500',
  },
  {
    icon: BookOpen,
    eyebrow: 'Reflect',
    title: 'Journal privately after the moment',
    description:
      'Guided prompts give thoughts a place to land without judgment or pressure to be perfect.',
    accent: 'from-violet-500 to-fuchsia-500',
  },
  {
    icon: CalendarCheck,
    eyebrow: 'Plan',
    title: 'Turn insight into a tiny ritual',
    description:
      'MindWell suggests realistic study breaks, breathing exercises, and evening reset plans for student life.',
    accent: 'from-emerald-500 to-teal-400',
  },
];

const features = [
  {
    icon: Brain,
    title: 'Context-aware AI chat',
    description:
      'Supportive conversations that understand student routines, deadlines, friendships, and exam pressure.',
    signal: 'Grounding prompts',
    accent: 'from-blue-500/15 via-cyan-400/10 to-white',
    iconStyle: 'bg-blue-600 text-white shadow-blue-500/25',
    layout: 'lg:col-span-2',
  },
  {
    icon: Smile,
    title: 'Mood tracking with meaning',
    description:
      'Log how you feel in seconds, then review trends that connect emotions with habits and workload.',
    signal: 'Weekly insight',
    accent: 'from-violet-500/15 via-indigo-400/10 to-white',
    iconStyle: 'bg-violet-600 text-white shadow-violet-500/25',
    layout: '',
  },
  {
    icon: BookOpen,
    title: 'Private journal space',
    description:
      'Reflect with gentle prompts, organize thoughts, and create a record of what helps over time.',
    signal: 'Encrypted entries',
    accent: 'from-fuchsia-500/15 via-purple-400/10 to-white',
    iconStyle: 'bg-fuchsia-600 text-white shadow-fuchsia-500/25',
    layout: '',
  },
  {
    icon: Waves,
    title: 'Wellness resets',
    description:
      'Short breathing, mindfulness, sleep, and study-break suggestions built for busy academic days.',
    signal: '2-minute tools',
    accent: 'from-emerald-500/15 via-teal-300/10 to-white',
    iconStyle: 'bg-emerald-600 text-white shadow-emerald-500/25',
    layout: 'lg:col-span-2',
  },
  {
    icon: Lock,
    title: 'Privacy-first foundation',
    description:
      'Your chats, moods, and journal entries remain protected inside your authenticated account.',
    signal: 'Secure by design',
    accent: 'from-slate-600/15 via-blue-300/10 to-white',
    iconStyle: 'bg-slate-900 text-white shadow-slate-500/25',
    layout: '',
  },
  {
    icon: LineChart,
    title: 'Progress dashboard',
    description:
      'View streaks, mood scores, activity, and reflections together so progress feels easier to understand.',
    signal: 'Clear visuals',
    accent: 'from-amber-400/20 via-orange-300/10 to-white',
    iconStyle: 'bg-amber-500 text-white shadow-amber-500/25',
    layout: '',
  },
];

const aboutStats = [
  { stat: '10K+', label: 'students supported', detail: 'across study seasons' },
  { stat: '50K+', label: 'wellness moments', detail: 'chat, mood, journal' },
  { stat: '4.8/5', label: 'student rating', detail: 'for approachable support' },
  { stat: '24/7', label: 'always available', detail: 'between classes too' },
];

const testimonials = [
  {
    name: 'Sarah M.',
    role: 'College Sophomore',
    text: 'MindWell helped me manage exam stress. The AI feels genuinely supportive without being preachy.',
    avatar: 'SM',
    mood: 'Finals week felt lighter',
    accent: 'from-blue-500 to-cyan-400',
  },
  {
    name: 'James K.',
    role: 'Graduate Student',
    text: 'The mood tracker helped me notice patterns I never saw before. Combined with journaling, it helped me build better routines.',
    avatar: 'JK',
    mood: 'Found my late-night pattern',
    accent: 'from-violet-500 to-fuchsia-500',
  },
  {
    name: 'Priya R.',
    role: 'High School Senior',
    text: 'I use the breathing exercises before tests. Simple, effective, and always available when I need a quick reset.',
    avatar: 'PR',
    mood: 'Calmer before big tests',
    accent: 'from-emerald-500 to-teal-400',
  },
];

const faqs = [
  {
    q: 'Is MindWell a replacement for therapy?',
    a: 'No. MindWell is a supportive wellness tool, not a substitute for professional mental health care. For serious concerns, please consult a qualified professional or call the 988 Suicide & Crisis Lifeline.',
  },
  {
    q: 'Is my data private?',
    a: 'Yes. Your conversations, mood logs, and journal entries are stored securely with encryption. Only you can access your data through your authenticated account.',
  },
  {
    q: 'How does the AI work?',
    a: 'MindWell uses Google Gemini AI to provide empathetic, context-aware responses. The AI is prompted to be supportive while avoiding medical diagnoses or prescribing treatments.',
  },
  {
    q: 'Is MindWell free to use?',
    a: 'MindWell offers core features for free. Create an account to access chat, mood tracking, journaling, and wellness suggestions.',
  },
];

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className='overflow-hidden'>
        <section
          className='relative isolate min-h-[860px] pt-32 pb-20 sm:min-h-[900px] lg:min-h-[920px] lg:pt-40 lg:pb-28'
          aria-labelledby='hero-heading'
        >
          <div className='mindwell-ambient absolute inset-0 -z-20' />
          <div className='mindwell-grid absolute inset-0 -z-10 opacity-70' />
          <div className='absolute left-1/2 top-24 -z-10 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-cyan-300/20 blur-3xl' />
          <div className='floating-blob absolute -left-24 top-44 -z-10 h-80 w-80 rounded-full bg-primary-300/25 blur-3xl' />
          <div className='floating-blob absolute -right-24 bottom-32 -z-10 h-96 w-96 rounded-full bg-accent-400/20 blur-3xl' />

          <div className='mx-auto max-w-7xl px-6 lg:px-8'>
            <div className='grid items-center gap-14 lg:grid-cols-[0.94fr_1.06fr]'>
              <ScrollReveal>
                <div className='max-w-3xl'>
                  <div className='mb-7 inline-flex items-center gap-2 rounded-full border border-primary-200/70 bg-white/75 px-4 py-2 text-sm font-semibold text-primary-800 shadow-lg shadow-primary-200/20 backdrop-blur-xl'>
                    <span className='flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-white'>
                      <Sparkles className='h-3.5 w-3.5' aria-hidden='true' />
                    </span>
                    Student wellness, organized in one calm command center
                  </div>

                  <h1
                    id='hero-heading'
                    className='text-5xl font-black tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-7xl xl:text-8xl'
                  >
                    AI-supported wellness that keeps pace with student life.
                  </h1>
                  <p className='mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl sm:leading-9'>
                    MindWell brings empathetic chat, mood tracking, private journaling, and practical
                    reset plans into a single supportive space for academic pressure and everyday emotions.
                  </p>

                  <div className='mt-9 flex flex-col gap-4 sm:flex-row'>
                    <Link href='/register' className='btn-primary glow-pulse px-7 py-4 text-base'>
                      Start a free check-in
                      <ArrowRight className='h-5 w-5' aria-hidden='true' />
                    </Link>
                    <a href='#features' className='btn-secondary px-7 py-4 text-base'>
                      Explore the toolkit
                      <ChevronRight className='h-5 w-5' aria-hidden='true' />
                    </a>
                  </div>

                  <div className='mt-10 grid max-w-2xl gap-3 sm:grid-cols-3'>
                    {heroMetrics.map((metric) => (
                      <div
                        key={metric.label}
                        className='rounded-2xl border border-white/70 bg-white/65 p-4 shadow-lg shadow-primary-100/30 backdrop-blur-xl'
                      >
                        <p className='text-2xl font-black tracking-tight text-slate-950'>{metric.value}</p>
                        <p className='mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500'>
                          {metric.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className='mt-6 max-w-xl text-sm leading-6 text-slate-500'>
                    Built for everyday reflection and routine building. For urgent or serious concerns,
                    contact a qualified professional or emergency support.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={160}>
                <div className='relative mx-auto max-w-[640px] lg:mr-0'>
                  <div className='orbit-shell absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full' aria-hidden='true'>
                    <span className='orbit-node orbit-node-one' />
                    <span className='orbit-node orbit-node-two' />
                    <span className='orbit-node orbit-node-three' />
                  </div>

                  <div className='command-shine glass relative overflow-hidden rounded-[2rem] border-white/60 p-3 shadow-2xl shadow-primary-500/20 sm:p-4'>
                    <div className='relative overflow-hidden rounded-[1.65rem] bg-slate-950 p-4 text-white shadow-2xl sm:p-5'>
                      <div className='soft-scan absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent' />
                      <div className='relative flex items-center justify-between gap-4'>
                        <div className='flex items-center gap-3'>
                          <Image
                            src='/MindWell_logo.png'
                            alt='MindWell app logo'
                            width={48}
                            height={48}
                            className='rounded-2xl ring-1 ring-white/20'
                            priority
                          />
                          <div>
                            <p className='text-sm font-bold tracking-wide text-white'>MindWell Console</p>
                            <p className='mt-1 flex items-center gap-2 text-xs text-cyan-100/80'>
                              <span className='relative flex h-2 w-2'>
                                <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75' />
                                <span className='relative inline-flex h-2 w-2 rounded-full bg-emerald-300' />
                              </span>
                              Ready for a gentle check-in
                            </p>
                          </div>
                        </div>
                        <div className='hidden rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-cyan-50 sm:block'>
                          Finals mode
                        </div>
                      </div>

                      <div className='relative mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]'>
                        <div className='rounded-3xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur'>
                          <div className='mb-4 flex items-center justify-between'>
                            <p className='text-sm font-semibold text-white'>AI check-in</p>
                            <MessageCircle className='h-4 w-4 text-cyan-200' aria-hidden='true' />
                          </div>
                          <div className='space-y-3'>
                            <div className='ml-auto max-w-[82%] rounded-2xl rounded-br-md bg-cyan-300/15 px-4 py-3 text-sm leading-6 text-cyan-50 ring-1 ring-cyan-200/20'>
                              I feel scattered and keep avoiding my study plan.
                            </div>
                            <div className='max-w-[88%] rounded-2xl rounded-bl-md bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-lg'>
                              That makes sense. Let us choose one subject, one 25-minute block, and a
                              reset before you begin.
                            </div>
                            <div className='flex items-center gap-1.5 pl-2'>
                              <span className='typing-dot h-2 w-2 rounded-full bg-cyan-200' />
                              <span className='typing-dot h-2 w-2 rounded-full bg-cyan-200' />
                              <span className='typing-dot h-2 w-2 rounded-full bg-cyan-200' />
                            </div>
                          </div>
                        </div>

                        <div className='grid gap-4'>
                          <div className='rounded-3xl border border-white/10 bg-white/[0.07] p-4'>
                            <div className='mb-4 flex items-center justify-between'>
                              <p className='text-sm font-semibold text-white'>Mood signal</p>
                              <Activity className='h-4 w-4 text-emerald-200' aria-hidden='true' />
                            </div>
                            <div className='flex h-24 items-end gap-2' aria-hidden='true'>
                              {[42, 58, 46, 72, 64, 80, 68].map((height, i) => (
                                <span
                                  key={height + i}
                                  className='data-rise flex-1 rounded-t-full bg-gradient-to-t from-cyan-400 to-emerald-200 shadow-lg shadow-cyan-500/20'
                                  style={{ height: `${height}%`, animationDelay: `${i * 0.12}s` }}
                                />
                              ))}
                            </div>
                          </div>

                          <div className='rounded-3xl border border-emerald-200/20 bg-emerald-300/10 p-4'>
                            <div className='flex items-start gap-3'>
                              <div className='breathing-orb flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-300/20 text-emerald-100 ring-1 ring-emerald-200/30'>
                                <Waves className='h-5 w-5' aria-hidden='true' />
                              </div>
                              <div>
                                <p className='text-sm font-semibold text-white'>2-minute reset queued</p>
                                <p className='mt-1 text-xs leading-5 text-emerald-50/75'>
                                  Box breathing before the next study block.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='absolute -left-3 bottom-8 hidden w-48 rounded-3xl border border-white/70 bg-white/85 p-4 shadow-2xl shadow-blue-500/15 backdrop-blur-xl sm:block lg:-left-10'>
                    <div className='mb-3 flex items-center gap-2 text-sm font-bold text-slate-900'>
                      <CheckCircle2 className='h-5 w-5 text-emerald-500' aria-hidden='true' />
                      Plan saved
                    </div>
                    <p className='text-xs leading-5 text-slate-600'>Hydrate, review notes, and close the loop with a journal prompt.</p>
                  </div>

                  <div className='absolute -right-3 top-10 hidden w-44 rounded-3xl border border-white/70 bg-white/85 p-4 shadow-2xl shadow-violet-500/15 backdrop-blur-xl sm:block lg:-right-8'>
                    <div className='mb-3 flex items-center gap-2 text-sm font-bold text-slate-900'>
                      <Moon className='h-5 w-5 text-violet-500' aria-hidden='true' />
                      Sleep nudge
                    </div>
                    <p className='text-xs leading-5 text-slate-600'>Tonight: reduce screen time 20 minutes before bed.</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section className='relative py-20 lg:py-28' aria-labelledby='flow-heading'>
          <div className='absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent' />
          <div className='mx-auto max-w-7xl px-6 lg:px-8'>
            <div className='grid gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:items-start'>
              <ScrollReveal>
                <div className='lg:sticky lg:top-32'>
                  <p className='section-kicker'>How it helps</p>
                  <h2 id='flow-heading' className='section-title mt-4 max-w-xl'>
                    A gentle loop from overwhelmed to oriented.
                  </h2>
                  <p className='mt-5 max-w-xl text-base leading-8 text-slate-600'>
                    MindWell is designed around small, practical moments. Students can talk through a
                    concern, understand patterns, reflect privately, and leave with a realistic reset plan.
                  </p>

                  <div className='mt-8 rounded-[2rem] border border-white/70 bg-white/75 p-5 shadow-xl shadow-primary-100/40 backdrop-blur-xl'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-sm font-bold text-slate-950'>Tonight&apos;s calm plan</p>
                        <p className='mt-1 text-xs text-slate-500'>Generated from chat + mood check-in</p>
                      </div>
                      <div className='rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200'>
                        Balanced
                      </div>
                    </div>
                    <div className='mt-5 space-y-3'>
                      {['25-minute study sprint', '3-minute breathing reset', 'Journal one thought to release'].map((item) => (
                        <div key={item} className='flex items-center gap-3 rounded-2xl bg-slate-50/80 p-3'>
                          <span className='flex h-8 w-8 items-center justify-center rounded-xl bg-primary-600 text-white'>
                            <CheckCircle2 className='h-4 w-4' aria-hidden='true' />
                          </span>
                          <span className='text-sm font-semibold text-slate-700'>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <div className='relative'>
                <div className='flow-rail absolute left-5 top-6 hidden h-[calc(100%-3rem)] w-px bg-gradient-to-b from-primary-300 via-violet-300 to-emerald-300 md:block' />
                <div className='space-y-5'>
                  {flowSteps.map((step, i) => {
                    const Icon = step.icon;

                    return (
                      <ScrollReveal key={step.title} delay={i * 110}>
                        <article className='group relative rounded-[2rem] border border-white/70 bg-white/70 p-5 shadow-xl shadow-primary-100/30 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/90 hover:shadow-2xl'>
                          <div className='flex gap-5'>
                            <div className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${step.accent} text-white shadow-lg`}>
                              <Icon className='h-6 w-6' aria-hidden='true' />
                            </div>
                            <div>
                              <p className='text-xs font-black uppercase tracking-[0.26em] text-primary-600'>{step.eyebrow}</p>
                              <h3 className='mt-2 text-xl font-black tracking-tight text-slate-950'>{step.title}</h3>
                              <p className='mt-2 text-sm leading-7 text-slate-600'>{step.description}</p>
                            </div>
                          </div>
                        </article>
                      </ScrollReveal>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id='features' className='relative py-20 lg:py-28' aria-labelledby='features-heading'>
          <div className='absolute inset-0 -z-10 bg-dot-pattern opacity-70' />
          <div className='mx-auto max-w-7xl px-6 lg:px-8'>
            <ScrollReveal>
              <div className='mx-auto mb-16 max-w-3xl text-center'>
                <p className='section-kicker justify-center'>MindWell toolkit</p>
                <h2 id='features-heading' className='section-title mt-4'>
                  More than a chatbot. A complete emotional wellness workspace.
                </h2>
                <p className='mt-5 text-lg leading-8 text-slate-600'>
                  Each tool is intentionally lightweight on its own, and more useful when connected together.
                </p>
              </div>
            </ScrollReveal>

            <div className='grid gap-5 md:grid-cols-2 lg:grid-cols-3'>
              {features.map((feature, i) => {
                const Icon = feature.icon;

                return (
                  <ScrollReveal key={feature.title} delay={i * 80}>
                    <article
                      className={`group relative h-full min-h-[270px] overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br ${feature.accent} p-6 shadow-xl shadow-primary-100/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${feature.layout}`}
                    >
                      <div className='absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/50 blur-2xl transition-transform duration-500 group-hover:scale-125' />
                      <div className='relative flex h-full flex-col'>
                        <div className='flex items-start justify-between gap-4'>
                          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg ${feature.iconStyle}`}>
                            <Icon className='h-7 w-7' aria-hidden='true' />
                          </div>
                          <span className='rounded-full border border-white/80 bg-white/75 px-3 py-1 text-xs font-bold text-slate-600 backdrop-blur'>
                            {feature.signal}
                          </span>
                        </div>
                        <div className='mt-auto pt-12'>
                          <h3 className='text-2xl font-black tracking-tight text-slate-950'>{feature.title}</h3>
                          <p className='mt-3 text-sm leading-7 text-slate-600'>{feature.description}</p>
                        </div>
                      </div>
                    </article>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        <section id='about' className='relative py-20 lg:py-28' aria-labelledby='about-heading'>
          <div className='absolute inset-x-0 top-1/3 -z-10 h-80 bg-gradient-to-r from-primary-100/50 via-purple-100/40 to-cyan-100/50 blur-3xl' />
          <div className='mx-auto max-w-7xl px-6 lg:px-8'>
            <div className='grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]'>
              <ScrollReveal>
                <div>
                  <p className='section-kicker'>About MindWell</p>
                  <h2 id='about-heading' className='section-title mt-4 max-w-2xl'>
                    Designed for the messy, real rhythm of student weeks.
                  </h2>
                  <p className='mt-6 text-base leading-8 text-slate-600'>
                    Academic life can shift from social energy to deadline pressure in a single day.
                    MindWell creates a steady space for students to process emotions, observe patterns,
                    and build tiny routines that are easier to repeat.
                  </p>
                  <p className='mt-4 text-base leading-8 text-slate-600'>
                    The assistant is supportive and practical, while keeping clear boundaries around
                    professional care for serious concerns.
                  </p>

                  <div className='mt-8 grid gap-4 sm:grid-cols-2'>
                    {aboutStats.map((item, i) => (
                      <ScrollReveal key={item.label} delay={i * 90}>
                        <div className='group rounded-[1.5rem] border border-white/70 bg-white/75 p-5 shadow-lg shadow-primary-100/30 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white'>
                          <p className='gradient-text text-3xl font-black tracking-tight'>{item.stat}</p>
                          <p className='mt-2 text-sm font-bold text-slate-900'>{item.label}</p>
                          <p className='mt-1 text-xs font-medium text-slate-500'>{item.detail}</p>
                        </div>
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={150}>
                <div className='relative rounded-[2rem] border border-white/70 bg-white/75 p-5 shadow-2xl shadow-violet-500/10 backdrop-blur-xl'>
                  <div className='absolute -right-8 -top-8 h-32 w-32 rounded-full bg-violet-300/30 blur-2xl' />
                  <div className='relative overflow-hidden rounded-[1.6rem] bg-slate-950 p-5 text-white'>
                    <div className='mb-6 flex items-center justify-between'>
                      <div>
                        <p className='text-sm font-bold'>Campus rhythm map</p>
                        <p className='mt-1 text-xs text-slate-300'>Patterns without pressure</p>
                      </div>
                      <Target className='h-5 w-5 text-cyan-200' aria-hidden='true' />
                    </div>

                    <div className='space-y-4'>
                      {[
                        { day: 'Mon', label: 'Lecture load', width: 'w-8/12', color: 'from-blue-400 to-cyan-300' },
                        { day: 'Tue', label: 'Social battery', width: 'w-5/12', color: 'from-violet-400 to-fuchsia-300' },
                        { day: 'Wed', label: 'Deep work', width: 'w-10/12', color: 'from-emerald-400 to-teal-300' },
                        { day: 'Thu', label: 'Sleep quality', width: 'w-6/12', color: 'from-amber-300 to-orange-300' },
                      ].map((row) => (
                        <div key={row.day} className='rounded-2xl border border-white/10 bg-white/[0.06] p-4'>
                          <div className='mb-3 flex items-center justify-between text-xs'>
                            <span className='font-bold text-white'>{row.day}</span>
                            <span className='text-slate-300'>{row.label}</span>
                          </div>
                          <div className='h-2 overflow-hidden rounded-full bg-white/10'>
                            <div className={`h-full rounded-full bg-gradient-to-r ${row.color} ${row.width}`} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className='mt-5 rounded-3xl border border-cyan-200/20 bg-cyan-300/10 p-4'>
                      <div className='flex items-start gap-3'>
                        <Shield className='mt-0.5 h-5 w-5 shrink-0 text-cyan-200' aria-hidden='true' />
                        <p className='text-sm leading-6 text-cyan-50/85'>
                          MindWell highlights patterns and options, not diagnoses or clinical promises.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section id='testimonials' className='relative py-20 lg:py-28' aria-labelledby='testimonials-heading'>
          <div className='absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(125,211,252,0.22),transparent_34%),radial-gradient(circle_at_80%_30%,rgba(167,139,250,0.2),transparent_32%)]' />
          <div className='mx-auto max-w-7xl px-6 lg:px-8'>
            <ScrollReveal>
              <div className='mx-auto mb-16 max-w-3xl text-center'>
                <p className='section-kicker justify-center'>Student voices</p>
                <h2 id='testimonials-heading' className='section-title mt-4'>
                  Support that feels approachable between classes, labs, and late nights.
                </h2>
              </div>
            </ScrollReveal>

            <div className='grid gap-6 md:grid-cols-3 md:items-start'>
              {testimonials.map((testimonial, i) => (
                <ScrollReveal key={testimonial.name} delay={i * 140}>
                  <blockquote
                    className={`testimonial-sheen relative flex min-h-[330px] flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-xl shadow-primary-100/30 backdrop-blur-xl ${
                      i === 1 ? 'md:mt-10' : ''
                    }`}
                  >
                    <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${testimonial.accent}`} />
                    <div className='mb-5 flex items-center justify-between'>
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${testimonial.accent} text-sm font-black text-white shadow-lg`}>
                        {testimonial.avatar}
                      </div>
                      <div className='flex gap-1' aria-label='Five star rating'>
                        {[0, 1, 2, 3, 4].map((star) => (
                          <Star key={star} className='h-4 w-4 fill-amber-400 text-amber-400' aria-hidden='true' />
                        ))}
                      </div>
                    </div>
                    <p className='text-lg font-bold leading-8 text-slate-900'>&ldquo;{testimonial.text}&rdquo;</p>
                    <footer className='mt-auto pt-8'>
                      <div className='mb-4 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600'>
                        {testimonial.mood}
                      </div>
                      <p className='text-sm font-black text-slate-950'>{testimonial.name}</p>
                      <p className='mt-1 text-xs font-medium text-slate-500'>{testimonial.role}</p>
                    </footer>
                  </blockquote>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section id='faq' className='relative py-20 lg:py-28' aria-labelledby='faq-heading'>
          <div className='mx-auto max-w-7xl px-6 lg:px-8'>
            <div className='grid gap-12 lg:grid-cols-[0.82fr_1.18fr]'>
              <ScrollReveal>
                <div>
                  <p className='section-kicker'>Good to know</p>
                  <h2 id='faq-heading' className='section-title mt-4'>
                    Clear boundaries, safer expectations, and privacy-first answers.
                  </h2>
                  <div className='mt-8 rounded-[2rem] border border-primary-100 bg-primary-50/70 p-6 shadow-xl shadow-primary-100/40'>
                    <div className='mb-3 flex items-center gap-3 text-primary-800'>
                      <Heart className='h-5 w-5' aria-hidden='true' />
                      <p className='text-sm font-black'>Supportive, not clinical</p>
                    </div>
                    <p className='text-sm leading-7 text-primary-900/75'>
                      MindWell is built for everyday wellness support. It encourages professional help
                      when concerns are serious or urgent.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <div className='space-y-4'>
                {faqs.map((faq, i) => (
                  <ScrollReveal key={faq.q} delay={i * 90}>
                    <details className='card group overflow-hidden rounded-[1.5rem] border-white/70 bg-white/80 p-0'>
                      <summary className='flex cursor-pointer list-none items-center justify-between gap-5 px-5 py-5 text-left text-base font-black text-slate-950 transition-colors hover:text-primary-700 sm:px-6'>
                        <span>{faq.q}</span>
                        <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600 transition-transform duration-300 group-open:rotate-45'>
                          +
                        </span>
                      </summary>
                      <p className='border-t border-slate-100 px-5 pb-5 pt-4 text-sm leading-7 text-slate-600 sm:px-6'>
                        {faq.a}
                      </p>
                    </details>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className='relative py-20 lg:py-28' aria-labelledby='cta-heading'>
          <div className='mx-auto max-w-6xl px-6 lg:px-8'>
            <ScrollReveal>
              <div className='relative overflow-hidden rounded-[2.4rem] bg-slate-950 px-6 py-12 text-center text-white shadow-2xl shadow-primary-500/20 sm:px-12 lg:px-20 lg:py-16'>
                <div className='absolute left-0 top-0 h-64 w-64 rounded-full bg-primary-500/25 blur-3xl' />
                <div className='absolute bottom-0 right-0 h-72 w-72 rounded-full bg-accent-500/25 blur-3xl' />
                <div className='mindwell-grid absolute inset-0 opacity-20' />
                <div className='relative mx-auto max-w-3xl'>
                  <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-cyan-100 ring-1 ring-white/20'>
                    <Sparkles className='h-8 w-8' aria-hidden='true' />
                  </div>
                  <h2 id='cta-heading' className='text-4xl font-black tracking-[-0.04em] sm:text-5xl'>
                    Give your mind a calmer place to check in.
                  </h2>
                  <p className='mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg'>
                    Create a free account to start a supportive chat, track your mood, and build a small
                    wellness rhythm around your academic life.
                  </p>
                  <div className='mt-9 flex flex-col justify-center gap-4 sm:flex-row'>
                    <Link href='/register' className='btn-primary px-8 py-4 text-base'>
                      <Heart className='h-5 w-5' aria-hidden='true' />
                      Create free account
                      <ArrowRight className='h-5 w-5' aria-hidden='true' />
                    </Link>
                    <Link href='/login' className='inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'>
                      Sign in
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
