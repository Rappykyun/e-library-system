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
            <div className="flex min-h-screen flex-col bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a]">
                {/* Header */}
                <header className="w-full">
                    <div className="hidden h-20 items-center space-x-6 bg-[#2A5298] lg:flex">
                        <div className="mx-auto flex w-full max-w-7xl items-center px-3">
                            <div className="mr-4">
                                <Link href="/dashboard" className="flex items-center">
                                    <img src="/ched.png" alt="CHED Logo" className="h-12 w-auto" />
                                </Link>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-lg font-semibold tracking-wide text-white">
                                    COMMISSION ON HIGHER EDUCATION - REGIONAL OFFICE XII
                                </h1>
                                <h1 className="text-md tracking-wide text-white">E-Library</h1>
                            </div>
                        </div>
                    </div>
                    <nav className="flex items-center justify-end gap-4 bg-white p-4 shadow-sm">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                {/* Main Content */}
                <main className="flex flex-1 items-center justify-center p-6 lg:p-8">
                    <div className="w-full max-w-4xl text-center">
                        <h1 className="mb-4 text-4xl font-bold text-[#2A5298] lg:text-6xl">
                            Welcome to CHED E-Library
                        </h1>
                        <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
                            Access academic resources and digital books for higher education
                        </p>
                        {!auth.user && (
                            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-md bg-[#2A5298] px-8 py-3 text-white transition hover:bg-[#1e3a6f]"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}
