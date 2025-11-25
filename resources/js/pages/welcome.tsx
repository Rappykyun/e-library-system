import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="relative flex min-h-screen flex-col bg-[#FDFDFC] text-[#0e1424] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                <div
                    className="pointer-events-none absolute inset-0 opacity-70 dark:opacity-60"
                    aria-hidden="true"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 20% 20%, rgba(42,82,152,0.09), transparent 35%), radial-gradient(circle at 80% 10%, rgba(36,60,102,0.1), transparent 32%), radial-gradient(circle at 60% 80%, rgba(12,22,46,0.08), transparent 35%)',
                    }}
                />

                {/* Header */}
                <header className="relative w-full border-b border-[#19140018] bg-white/90 backdrop-blur-sm dark:border-[#2c2c28] dark:bg-[#0d0f15]/80">
                    <div className="hidden h-20 items-center bg-gradient-to-r from-[#2A5298] via-[#1f3f7a] to-[#2A5298] lg:flex">
                        <div className="mx-auto flex w-full max-w-6xl items-center px-4">
                            <Link href="/dashboard" className="flex items-center gap-3">
                                <img src="/ched.png" alt="CHED Logo" className="h-12 w-auto drop-shadow-sm" />
                                <div className="flex flex-col leading-tight">
                                    <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[#dbe6ff]">
                                        CHED Regional Office XII
                                    </span>
                                    <span className="text-lg font-semibold text-white">E-Library System</span>
                                </div>
                            </Link>
                            <div className="ml-auto flex items-center gap-3 text-sm text-[#e8edff]">
                                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                                    <span className="h-2 w-2 rounded-full bg-emerald-300" />
                                    Online
                                </span>
                                <span className="hidden border-l border-white/20 pl-3 lg:inline">
                                    Academic resources, policies, and research in one place.
                                </span>
                            </div>
                        </div>
                    </div>
                    <nav className="mx-auto flex w-full max-w-6xl items-center justify-end gap-4 px-4 py-3">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-flex items-center gap-2 rounded-full border border-[#1b1b1830] px-5 py-2 text-sm font-medium text-[#0e1424] transition hover:-translate-y-[1px] hover:shadow-sm dark:border-[#353535] dark:text-[#EDEDEC]"
                            >
                                <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="inline-flex items-center gap-2 rounded-full border border-[#1b1b1830] px-5 py-2 text-sm font-medium text-[#0e1424] transition hover:-translate-y-[1px] hover:shadow-sm dark:border-[#353535] dark:text-[#EDEDEC]"
                            >
                                <span className="h-2 w-2 rounded-full bg-[#2A5298]" aria-hidden="true" />
                                Log in
                            </Link>
                        )}
                    </nav>
                </header>

                {/* Main Content */}
                <main className="relative flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:py-12">
                    <div className="grid w-full max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                        <section className="relative overflow-hidden rounded-2xl border border-[#1b1b1816] bg-white/85 p-8 shadow-[0_25px_80px_rgba(23,45,100,0.08)] backdrop-blur-sm dark:border-[#2c2c28] dark:bg-[#0e111a]/90">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#e8f0ff]/60 via-transparent to-[#f8fbff] dark:from-[#10192c]/60 dark:via-transparent dark:to-[#0b0f1a]" />
                            <div className="relative flex flex-col gap-6">
                                <div className="inline-flex items-center gap-2 rounded-full bg-[#2A5298]/10 px-4 py-2 text-sm font-medium text-[#1f355f] dark:bg-[#1f355f]/40 dark:text-[#d6e4ff]">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                    Regional Office XII • Digital Library
                                </div>
                                <div className="space-y-4">
                                    <h1 className="text-4xl font-bold leading-tight text-[#132247] sm:text-5xl lg:text-6xl dark:text-white">
                                        Welcome to <span className="text-[#2A5298] dark:text-[#7da5ff]">CHED E-Library</span>
                                    </h1>
                                    <p className="max-w-2xl text-lg text-[#2f3b57] dark:text-[#cfd7f0]">
                                        Browse policies, publications, and academic materials curated for higher education institutions
                                        across SOCCSKSARGEN. Secure access, fast search, always available.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    {!auth.user && (
                                        <Link
                                            href={route('login')}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2A5298] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-[2px] hover:bg-[#234378]"
                                        >
                                            Enter the Library
                                            <span aria-hidden="true">→</span>
                                        </Link>
                                    )}
                                    <div className="flex flex-wrap gap-3 text-sm text-[#2f3b57] dark:text-[#c9d2ec]">
                                        <div className="inline-flex items-center gap-2 rounded-lg bg-[#f2f5ff] px-3 py-2 dark:bg-[#141b2b]">
                                            📚 5k+ digital titles
                                        </div>
                                        <div className="inline-flex items-center gap-2 rounded-lg bg-[#f2f5ff] px-3 py-2 dark:bg-[#141b2b]">
                                            🔎 Advanced catalog search
                                        </div>
                                        <div className="inline-flex items-center gap-2 rounded-lg bg-[#f2f5ff] px-3 py-2 dark:bg-[#141b2b]">
                                            🤝 Faculty & student access
                                        </div>
                                    </div>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-3">
                                    {[
                                        { label: 'Resources', value: '5,240+' },
                                        { label: 'Partner Schools', value: '28' },
                                        { label: 'Avg. Daily Visits', value: '1,200' },
                                    ].map((stat) => (
                                        <div
                                            key={stat.label}
                                            className="rounded-xl border border-[#1b1b1816] bg-white/70 px-4 py-3 text-left shadow-sm backdrop-blur-sm dark:border-[#2c2c28] dark:bg-[#0f131d]/80"
                                        >
                                            <div className="text-xs uppercase tracking-[0.16em] text-[#5c6b8a] dark:text-[#7f8eb5]">
                                                {stat.label}
                                            </div>
                                            <div className="text-2xl font-semibold text-[#132247] dark:text-white">{stat.value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <aside className="relative flex flex-col gap-5 rounded-2xl border border-[#1b1b1816] bg-white/90 p-6 shadow-[0_25px_80px_rgba(23,45,100,0.08)] backdrop-blur-sm dark:border-[#2c2c28] dark:bg-[#0e111a]/90">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2A5298]/10 text-xl dark:bg-[#1f355f]/60">
                                    🗂️
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold text-[#132247] dark:text-white">Quick Access</h2>
                                    <p className="text-sm text-[#2f3b57] dark:text-[#cfd7f0]">
                                        Jump into the collections that matter most today.
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { title: 'Policy Memoranda', desc: 'Latest issuances and guidelines for HEIs.' },
                                    { title: 'Research & Journals', desc: 'Peer-reviewed works from partner institutions.' },
                                    { title: 'Digital Bookshelf', desc: 'Core textbooks and reference materials.' },
                                ].map((item) => (
                                    <div
                                        key={item.title}
                                        className="group relative overflow-hidden rounded-xl border border-[#1b1b1816] bg-gradient-to-br from-white to-[#f6f8ff] p-4 transition hover:-translate-y-[2px] hover:shadow-md dark:border-[#2c2c28] dark:from-[#0f131d] dark:to-[#101626]"
                                    >
                                        <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
                                            <div className="h-full w-full bg-gradient-to-r from-[#2A5298]/8 via-transparent to-[#2A5298]/5 dark:from-[#1f355f]/30 dark:via-transparent dark:to-[#1f355f]/20" />
                                        </div>
                                        <div className="relative space-y-1">
                                            <div className="flex items-center justify-between text-sm font-semibold text-[#132247] dark:text-white">
                                                {item.title}
                                                <span className="text-xs text-[#2A5298] dark:text-[#9bb6ff]">View</span>
                                            </div>
                                            <p className="text-sm text-[#2f3b57] dark:text-[#cfd7f0]">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="rounded-xl border border-[#1b1b1816] bg-[#2A5298] p-4 text-white shadow-md dark:border-[#2c2c28]">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-lg">⏰</div>
                                    <div className="space-y-1">
                                        <h3 className="text-base font-semibold">Library Hours</h3>
                                        <p className="text-sm text-white/80">Mon - Fri, 8:00 AM to 6:00 PM</p>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="h-2 w-2 rounded-full bg-emerald-300" />
                                            Online services are available 24/7.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </main>
            </div>
        </>
    );
}
