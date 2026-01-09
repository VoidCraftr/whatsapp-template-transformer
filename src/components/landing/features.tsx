'use client';

import { motion } from 'framer-motion';
import { Wand2, ShieldCheck, Lightbulb, Zap, Rocket, History } from 'lucide-react';

const features = [
    {
        icon: Wand2,
        title: 'AI Converter',
        description: 'Instantly transform promotional text into compliant utility templates using Gemini 2.5 Flash.',
        color: 'text-purple-500',
        bg: 'bg-purple-500/10',
    },
    {
        icon: ShieldCheck,
        title: 'Policy Guard',
        description: 'Real-time analysis against Meta\u2019s latest WhatsApp Business policies to prevent rejection.',
        color: 'text-green-500',
        bg: 'bg-green-500/10',
    },
    {
        icon: Lightbulb,
        title: 'Category Advisor',
        description: 'Smart classification suggestions to ensure your templates land in the right inbox bucket.',
        color: 'text-yellow-500',
        bg: 'bg-yellow-500/10',
    },
    {
        icon: Zap,
        title: 'Instant Preview',
        description: 'See exactly how your message looks in WhatsApp before you send it for approval.',
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
    },
    {
        icon: History,
        title: 'Smart History',
        description: 'Automatically save your converted templates and access them anytime from your dashboard.',
        color: 'text-pink-500',
        bg: 'bg-pink-500/10',
    },
    {
        icon: Rocket,
        title: 'Lead Tracking',
        description: 'Integrated authentication and user tracking to monitor team usage and adoption.',
        color: 'text-orange-500',
        bg: 'bg-orange-500/10',
    }
];

export function Features() {
    return (
        <section className="py-24 bg-neutral-50 dark:bg-neutral-900 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-transparent to-white/50 dark:to-black/50 pointer-events-none" />

            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                        Intelligence meets <span className="text-blue-600">Compliance</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Everything you need to master WhatsApp Business templates in one seamless workflow.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5 }}
                            className="group p-8 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                            <div className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
