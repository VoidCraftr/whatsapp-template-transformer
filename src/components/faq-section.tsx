'use client';

import * as React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
    {
        question: 'How does WaGenie ensure WhatsApp compliance?',
        answer:
            'WaGenie uses Gemini 2.5 Flash to analyze your templates against Meta’s latest WhatsApp Business Policy guidelines. It detects promotional language, formatting issues, and aggressive sales tactics, rewriting them into compliant utility or transactional formats.',
    },
    {
        question: 'What is the difference between Utility and Marketing templates?',
        answer:
            'Utility templates relate to a specific transaction or user request (e.g., order updates, OTPs). Marketing templates include promotions, offers, or brand awareness. Meta charges significantly more for Marketing conversations, so converting them to Utility can save up to 90% in costs.',
    },
    {
        question: 'Can I use these templates for Facebook or Instagram?',
        answer:
            'These templates are specifically optimized for the WhatsApp Business API. While the principles of clear communication apply everywhere, the strict formatting rules (e.g., no promotional footers in utility messages) are specific to WhatsApp.',
    },
    {
        question: 'Is my data secure?',
        answer:
            'Yes. WaGenie is powered by VoidCraftr and uses secure Firebase infrastructure. Your templates are processed via Google’s enterprise-grade AI cloud and are not shared with third parties.',
    },
    {
        question: 'How do I improved my Template Quality Score?',
        answer:
            'Our Template Scorer analyzes clarity, engagement, and compliance. To improve your score, keep messages concise, use variable parameters {{1}} correctly, avoiding all-caps text, and ensure the category matches the content intent.',
    },
];

export function FaqSection() {
    return (
        <section className="py-24 bg-white dark:bg-neutral-950">
            <div className="container px-4 md:px-6 mx-auto max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-muted-foreground">
                        Everything you need to know about WhatsApp templates and WaGenie.
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left text-lg font-medium">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>

                {/* JSON-LD for SEO */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'FAQPage',
                            mainEntity: faqs.map((faq) => ({
                                '@type': 'Question',
                                name: faq.question,
                                acceptedAnswer: {
                                    '@type': 'Answer',
                                    text: faq.answer,
                                },
                            })),
                        }),
                    }}
                />
            </div>
        </section>
    );
}
