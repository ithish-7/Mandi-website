"use client";

import { motion } from "framer-motion";

import { useState, useEffect } from "react";

export default function AboutPage() {
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

    const aboutData = content.pages.about;

    return (
        <main className="min-h-screen pt-40 md:pt-48 pb-24 px-6 md:px-12 bg-[#894d39]">
            <div className="max-w-5xl mx-auto space-y-20 md:space-y-32">
                {/* Hero Section */}
                <section className="space-y-6 md:space-y-8">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-white/30 text-[10px] md:text-xs tracking-[0.4em] md:tracking-[0.5em] uppercase block"
                    >
                        {aboutData.hero.tagline}
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-[10rem] font-bold text-white luxury-text tracking-tighter"
                    >
                        {aboutData.hero.title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/50 text-lg md:text-xl font-light leading-relaxed max-w-2xl"
                    >
                        {aboutData.hero.description}
                    </motion.p>
                </section>

                {/* Philosophy Section */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
                    <div className="aspect-[4/5] glass border border-white/5 rounded-[3rem] overflow-hidden flex items-center justify-center text-white/5 uppercase tracking-widest text-xs italic relative bg-white/[0.02]">
                        {aboutData.philosophy.image ? (
                            <img src={aboutData.philosophy.image} className="w-full h-full object-cover" alt="Philosophy" />
                        ) : (
                            "Visual Interpretation"
                        )}
                    </div>
                    <div className="space-y-8">
                        <h2 className="text-4xl md:text-6xl font-bold text-white luxury-text tracking-tighter">
                            {aboutData.philosophy.title}
                        </h2>
                        <p className="text-white/40 font-light leading-relaxed">
                            {aboutData.philosophy.description}
                        </p>
                        <div className="pt-8 border-t border-white/10 grid grid-cols-2 gap-8">
                            {aboutData.philosophy.stats.map((stat: any, i: number) => (
                                <div key={i}>
                                    <span className="block text-2xl font-bold text-white">{stat.value}</span>
                                    <span className="text-[10px] uppercase tracking-widest text-white/20">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Brand Mission */}
                <section className="text-center space-y-8 py-24 border-t border-white/5">
                    <p className="text-white/20 text-xs tracking-[0.8em] uppercase">{aboutData.mission.tagline}</p>
                    <h2 className="text-3xl md:text-5xl font-light text-white/60 max-w-3xl mx-auto leading-tight italic">
                        "{aboutData.mission.text}"
                    </h2>
                </section>
            </div>
        </main>
    );
}

// Clear Next.js bundler cache for About page
