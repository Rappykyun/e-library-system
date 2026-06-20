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
                <main className="relative flex flex-1 items-center justify-center px-5 py-16 sm:px-8">
                    <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[#1b1b1816] bg-white/85 p-10 shadow-[0_25px_80px_rgba(23,45,100,0.08)] backdrop-blur-sm dark:border-[#2c2c28] dark:bg-[#0e111a]/90">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#e8f0ff]/60 via-transparent to-[#f8fbff] dark:from-[#10192c]/60 dark:via-transparent dark:to-[#0b0f1a]" />
                        <div className="relative flex flex-col items-center gap-7 text-center">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 rounded-full bg-[#2A5298]/10 px-4 py-1.5 text-sm font-medium text-[#1f355f] dark:bg-[#1f355f]/40 dark:text-[#d6e4ff]">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                Regional Office XII · Digital Library
                            </div>

                            {/* Headline */}
                            <div className="space-y-3">
                                <h1 className="text-4xl font-bold leading-tight text-[#132247] sm:text-5xl lg:text-6xl dark:text-white">
                                    Welcome to{' '}
                                    <span className="text-[#2A5298] dark:text-[#7da5ff]">CHED E-Library</span>
                                </h1>
                                <p className="text-lg text-[#2f3b57] dark:text-[#cfd7f0]">
                                    Browse policies, publications, and academic materials for higher education institutions across SOCCSKSARGEN.
                                </p>
                            </div>

                            {/* CTA */}
                            <Link
                                href={auth.user ? route('dashboard') : route('login')}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#2A5298] px-7 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#234378] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A5298]/60"
                            >
                                {auth.user ? 'Go to Dashboard' : 'Enter the Library'}
                                <span aria-hidden="true">→</span>
                            </Link>

                            {/* Stats */}
                            <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-[#5c6b8a] dark:text-[#7f8eb5]">
                                {[
                                    { value: '5,240+', label: 'Resources' },
                                    { value: '28', label: 'Partner Schools' },
                                    { value: '1,200', label: 'Daily Visits' },
                                ].map((stat, i, arr) => (
                                    <div key={stat.label} className="flex items-center gap-3">
                                        <span>
                                            <span className="font-semibold text-[#132247] dark:text-white">{stat.value}</span>{' '}
                                            {stat.label}
                                        </span>
                                        {i < arr.length - 1 && (
                                            <span className="h-3 w-px bg-[#1b1b1830] dark:bg-[#2c2c28]" aria-hidden="true" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
