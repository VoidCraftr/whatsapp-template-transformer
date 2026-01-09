'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Footer } from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            timestamp: serverTimestamp(),
        };

        try {
            if (db) {
                await addDoc(collection(db, 'inquiries'), data);
                toast({
                    title: 'Message Sent',
                    description: 'We have received your inquiry. We will get back to you shortly.',
                });
                (e.target as HTMLFormElement).reset();
            } else {
                throw new Error('Database not configured');
            }
        } catch (error) {
            console.error("Error submitting form: ", error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to send message. Please try again later.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <header className="p-6">
                <div className="container mx-auto">
                    <Link href="/" className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        WaGenie
                    </Link>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 md:px-6 py-12 flex flex-col items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-2xl w-full"
                >
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Initiate Contact</h1>
                        <p className="text-muted-foreground text-lg">
                            Have a question about our API or Enterprise plans? Reach out to the VoidCraftr team.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-zinc-900/50 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl backdrop-blur-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" required placeholder="John Doe" className="bg-transparent" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" required placeholder="john@example.com" className="bg-transparent" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input id="subject" name="subject" required placeholder="Enterprise Inquiry" className="bg-transparent" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" name="message" required placeholder="Tell us about your project..." className="min-h-[150px] bg-transparent" />
                        </div>

                        <Button type="submit" className="w-full h-12 text-lg rounded-xl" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                            Send Message
                        </Button>
                    </form>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
