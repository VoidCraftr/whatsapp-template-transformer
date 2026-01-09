'use client';

import * as React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, BookOpen } from 'lucide-react';

interface GuideSection {
    title: string;
    content: string | string[];
}

interface ToolGuideProps {
    title: string;
    sections: GuideSection[];
    tips: string[];
}

export function ToolGuide({ title, sections, tips }: ToolGuideProps) {
    return (
        <div className="mt-12 mb-8 space-y-8 animate-in fade-in-50 duration-700 slide-in-from-bottom-4">
            {/* Educational Content */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold tracking-tight">How to use {title}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sections.map((section, idx) => (
                        <Card key={idx} className="bg-card/30 backdrop-blur-sm border-muted/50 hover:bg-card/40 transition-colors">
                            <CardHeader>
                                <CardTitle className="text-base">{section.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground leading-relaxed">
                                {Array.isArray(section.content) ? (
                                    <ul className="list-disc pl-4 space-y-1">
                                        {section.content.map((item, i) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>{section.content}</p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Pro Tips */}
            <Card className="border-yellow-500/20 bg-yellow-500/5">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-500" />
                        <CardTitle className="text-base text-yellow-600 dark:text-yellow-400">Pro Tips for Acceptance</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {tips.map((tip, idx) => (
                            <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                                <span className="text-yellow-500 font-bold">•</span>
                                {tip}
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
