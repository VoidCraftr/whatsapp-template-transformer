'use client';

import Link from 'next/link';
import { Github, Twitter, Linkedin, Instagram } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 py-12">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-4">
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                WaGenie
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground mb-4">
                            Powered by VoidCraftr. <br />
                            Crafting Digital Reality.
                        </p>
                        <div className="flex gap-4">
                            <Link href="https://github.com/satyam-agarwal-ai" target="_blank" className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors">
                                <Github className="w-5 h-5" />
                            </Link>
                            <Link href="https://x.com/Satyam_Agarwal_" target="_blank" className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="https://www.linkedin.com/in/satyam-agarwal-ai/" target="_blank" className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </Link>
                            <Link href="https://instagram.com/satyam.agarwal.ai" target="_blank" className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors">
                                <Instagram className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/converter" className="hover:text-black dark:hover:text-white">Converter</Link></li>
                            <li><Link href="/policy-checker" className="hover:text-black dark:hover:text-white">Policy Checker</Link></li>
                            <li><Link href="/category-advisor" className="hover:text-black dark:hover:text-white">Category Advisor</Link></li>
                            <li><Link href="/examples" className="hover:text-black dark:hover:text-white">Examples</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/contact" className="hover:text-black dark:hover:text-white">Contact</Link></li>
                            <li><Link href="https://voidcraftr.com/about" target="_blank" className="hover:text-black dark:hover:text-white">About VoidCraftr</Link></li>
                            <li><Link href="https://voidcraftr.com/privacy" target="_blank" className="hover:text-black dark:hover:text-white">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">VoidCraftr Ecosystem</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="https://tools.voidcraftr.com" target="_blank" className="hover:text-black dark:hover:text-white">OpenToolBox</Link></li>
                            <li><Link href="https://voidcraftr.com" target="_blank" className="hover:text-black dark:hover:text-white">Void UI</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-neutral-100 dark:border-neutral-800 mt-12 pt-8 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} WaGenie by VoidCraftr. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
