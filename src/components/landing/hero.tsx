'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Hero() {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-[90vh] overflow-hidden bg-background">
            {/* Background Gradient Blurs */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 blur-[130px] rounded-full mix-blend-screen" />

            <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center">

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-sm font-medium text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 mb-6"
                >
                    <Sparkles className="mr-2 h-3.5 w-3.5 text-yellow-500" />
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
                        WaGenie
                    </span>
                    <span className="mx-2 text-neutral-400">|</span>
                    <span>Powered by VoidCraftr</span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400 mb-6 max-w-4xl"
                >
                    Craft Digital Reality for <br className="hidden md:block" /> WhatsApp Templates
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mb-8 leading-relaxed"
                >
                    Transform marketing chaos into compliant, high-converting utility templates.
                    Powered by advanced AI to navigate Meta's strict policies with precision.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <Link href="/dashboard">
                        <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200">
                            Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href="/examples">
                        <Button variant="ghost" size="lg" className="rounded-full px-8 h-12 text-base hover:bg-neutral-100 dark:hover:bg-neutral-800">
                            View Examples
                        </Button>
                    </Link>
                </motion.div>
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        </div>
    );
}
