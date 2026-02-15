"use client";

import { motion } from "framer-motion";

import { useState, useEffect } from "react";

export default function ContactPage() {
    const [content, setContent] = useState<any>(null);

    useEffect(() => {
        fetch("/api/content")
            .then((res) => res.json())
            .then((data) => setContent(data));
    }, []);

    if (!content) return (
        <div className="min-h-screen bg-[#894d39] flex items-center justify-center text-white/20 tracking-[0.5em] text-[10px] uppercase font-bold">
            Initialising Experience...
        </div>
    );

    const contactData = content.pages.contact;

    return (
        <main className="min-h-screen pt-40 md:pt-48 pb-24 px-6 md:px-12 bg-[#894d39]">
            <div className="max-w-4xl mx-auto space-y-16 md:space-y-24 text-center">
                {/* Header Section */}
                <section className="space-y-6 md:space-y-8">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-[12rem] font-bold text-white luxury-text tracking-tighter"
                    >
                        {contactData.hero.title}
                    </motion.h1>
                    <p className="text-white/50 text-lg md:text-xl font-light leading-relaxed max-w-xl mx-auto">
                        {contactData.hero.description}
                    </p>
                </section>

                {/* Contact Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-16 py-16 border-y border-white/5">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-4"
                    >
                        <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold">Reservations</span>
                        <div className="space-y-2">
                            <p className="text-2xl text-white font-medium">{contactData.info.reservations.phone}</p>
                            <p className="text-lg text-white/60">{contactData.info.reservations.email}</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-4"
                    >
                        <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold">
                            {contactData.info.location.title}
                        </span>
                        <p className="text-2xl text-white font-medium leading-relaxed whitespace-pre-line">
                            {contactData.info.location.address}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-4"
                    >
                        <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold">Service Hours</span>
                        <div className="space-y-1">
                            <p className="text-2xl text-white font-medium">{contactData.info.hours.time}</p>
                            <p className="text-sm text-white/40 uppercase tracking-widest italic">{contactData.info.hours.days}</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-4"
                    >
                        <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold">Social</span>
                        <div className="flex justify-center space-x-12 text-lg text-white/60">
                            {content.global.social?.map((link: any, i: number) => (
                                <a
                                    key={i}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center gap-2 hover:text-white transition-colors group"
                                >
                                    {link.name.toLowerCase() === 'instagram' && (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40 group-hover:opacity-100 transition-opacity"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                    )}
                                    {link.name.toLowerCase() === 'whatsapp' && (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40 group-hover:opacity-100 transition-opacity"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3z"></path></svg>
                                    )}
                                    <span className="text-sm font-medium">{link.name}</span>
                                </a>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Footer Note */}
                <section className="pt-12">
                    <p className="text-white/20 text-xs tracking-[0.8em] uppercase">{contactData.footerTagline}</p>
                </section>
            </div>
        </main>
    );
}

// Clear Next.js bundler cache for Contact page
