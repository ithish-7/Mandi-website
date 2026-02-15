"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import MenuBook from "@/components/MenuBook";

export default function MenuPage() {
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

    const menuData = content.pages.menu;

    return (
        <main className="min-h-screen pt-40 md:pt-48 pb-24 px-6 md:px-12 bg-[#894d39] overflow-hidden">
            <div className="max-w-7xl mx-auto space-y-16 md:space-y-24">
                {/* Header */}
                <section className="text-center space-y-4 md:space-y-6">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-6xl md:text-9xl lg:text-[12rem] font-bold text-white luxury-text tracking-tighter"
                    >
                        {menuData.hero.title}
                    </motion.h1>
                    <p className="text-white/40 text-[10px] md:text-xs tracking-[0.4em] md:tracking-[0.5em] uppercase">
                        {menuData.hero.subtitle}
                    </p>
                </section>

                {/* The E-Book Experience or PDF Viewer */}
                <section className="pb-12">
                    {menuData.pdfUrl ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full relative group"
                        >
                            <div className="w-full aspect-[3/4] sm:aspect-[4/3] max-w-5xl mx-auto bg-[#f4e4d4] rounded-2xl overflow-hidden border border-white/5 shadow-[0_30px_100px_rgba(0,0,0,0.5)] relative">
                                <iframe
                                    src={`${menuData.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                                    className="w-full h-full border-none mix-blend-multiply"
                                    title="Menu PDF"
                                />
                                {/* Glassmorphism HUD for Actions */}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-black/40 backdrop-blur-xl border border-white/10 px-4 py-2.5 sm:px-6 sm:py-3 rounded-full shadow-2xl transition-all hover:scale-105 w-[90%] sm:w-auto justify-center">
                                    <span className="text-[9px] sm:text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold truncate">PDF Experience</span>
                                    <div className="w-px h-3 bg-white/10" />
                                    <a
                                        href={menuData.pdfUrl}
                                        target="_blank"
                                        className="text-[9px] sm:text-[10px] text-white hover:text-white/80 font-black uppercase tracking-widest transition-all"
                                    >
                                        Fullscreen
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <MenuBook categories={menuData.categories} />
                    )}
                </section>

                <section className="pt-12 text-center">
                    <p className="text-white/20 text-[10px] uppercase tracking-[0.5em] italic">
                        {menuData.footerNote}
                    </p>
                </section>
            </div>
        </main>
    );
}
