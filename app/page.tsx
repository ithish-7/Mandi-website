"use client";

import ScrollSequence from "@/components/ScrollSequence";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

function TextBeat({
    children,
    start,
    end,
    align = "center",
    stabilize = false,
}: {
    children: React.ReactNode;
    start: number;
    end: number;
    align?: "left" | "center" | "right";
    stabilize?: boolean;
}) {
    const { scrollYProgress } = useScroll();

    const opacity = useTransform(
        scrollYProgress,
        [start, start + 0.05, end - 0.05, end],
        [0, 1, 1, 0]
    );

    const y = useTransform(
        scrollYProgress,
        [start, end],
        stabilize ? [0, 0] : [40, -40]
    );

    const alignClass =
        align === "left"
            ? "items-start text-left px-6 md:pl-24 lg:pl-32"
            : align === "right"
                ? "items-end text-right px-6 md:pr-24 lg:pr-32"
                : "items-center text-center px-6";

    return (
        <motion.div
            style={{ opacity, y }}
            className={`fixed inset-0 flex flex-col justify-center pointer-events-none z-10 ${alignClass}`}
        >
            <div className="max-w-5xl w-full p-6">{children}</div>
        </motion.div>
    );
}

import { useState, useEffect } from "react";

function ScrollIndicator() {
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
    const y = useTransform(scrollYProgress, [0, 0.05], [0, 20]);

    return (
        <motion.div
            style={{ opacity, y }}
            className="fixed bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-20 pointer-events-none"
        >
            <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-black text-black/60 drop-shadow-sm">Scroll Me</span>
            <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-black/40"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                </svg>
            </motion.div>
        </motion.div>
    );
}

export default function Home() {
    const [content, setContent] = useState<any>(null);

    useEffect(() => {
        fetch("/api/content")
            .then((res) => res.json())
            .then((data) => setContent(data));
    }, []);

    if (!content) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white/20 tracking-[0.5em] text-[10px] uppercase font-bold">
            Initialising Experience...
        </div>
    );

    const homeData = content.pages.home;
    const globalData = content.global;

    return (
        <main className="relative bg-[#050505]">
            {/* Scroll Experience Layer */}
            <section className="relative h-[500vh] z-0">
                <div className="sticky top-0 h-screen w-full overflow-hidden">
                    <ScrollSequence />

                    {/* Optional Hero Background Image from CMS */}
                    {homeData.hero.backgroundImage && (
                        <div className="absolute inset-0 z-[-1]">
                            <img
                                src={homeData.hero.backgroundImage}
                                className="w-full h-full object-cover opacity-30"
                                alt="Background"
                            />
                        </div>
                    )}
                </div>

                {/* Hero Beat */}
                <TextBeat start={0} end={0.15}>
                    <div className="relative flex flex-col items-center">
                        <div className="absolute inset-0 bg-black/60 blur-[80px] md:blur-[120px] scale-[2] rounded-full opacity-70 pointer-events-none" />

                        <motion.h1
                            className="relative text-5xl md:text-8xl lg:text-9xl font-bold text-white leading-[0.85] luxury-text tracking-[-0.08em] drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                        >
                            {homeData.hero.title}
                        </motion.h1>
                        <p className="relative mt-8 md:mt-12 text-[9px] md:text-xs lg:text-sm text-white tracking-[0.6em] md:tracking-[0.8em] uppercase font-bold drop-shadow-xl text-center">
                            {homeData.hero.subtitle}
                        </p>
                    </div>
                </TextBeat>

                {/* Scroll Indicator - Fades out quickly */}
                <ScrollIndicator />

                {/* Beat B: The Rice */}
                <TextBeat start={0.25} end={0.4} align="left">
                    <span className="text-white/60 text-[8px] md:text-[10px] tracking-[0.4em] uppercase block mb-4 md:mb-6 font-bold drop-shadow-md">
                        {homeData.chapterOne.tagline}
                    </span>
                    <h2 className="text-4xl md:text-7xl lg:text-8xl font-bold text-white mb-6 md:mb-8 luxury-text tracking-tighter drop-shadow-2xl">
                        {homeData.chapterOne.title}
                    </h2>
                    <p className="text-base md:text-lg lg:text-xl text-white/70 font-medium leading-relaxed max-w-xs md:max-w-md drop-shadow-lg">
                        {homeData.chapterOne.description}
                    </p>
                </TextBeat>

                {/* Beat C: The Meat */}
                <TextBeat start={0.5} end={0.65} align="right">
                    <span className="text-white/60 text-[8px] md:text-[10px] tracking-[0.4em] uppercase block mb-4 md:mb-6 font-bold drop-shadow-md">
                        {homeData.chapterTwo.tagline}
                    </span>
                    <h2 className="text-4xl md:text-7xl lg:text-8xl font-bold text-white mb-6 md:mb-8 luxury-text tracking-tighter drop-shadow-2xl">
                        {homeData.chapterTwo.title}
                    </h2>
                    <p className="text-base md:text-lg lg:text-xl text-white/70 font-medium leading-relaxed max-w-xs md:max-w-md ml-auto drop-shadow-lg">
                        {homeData.chapterTwo.description}
                    </p>
                </TextBeat>

                {/* Beat D: Conclusion */}
                <TextBeat start={0.8} end={0.9} stabilize>
                    <h2 className="text-4xl md:text-7xl lg:text-8xl font-bold text-white mb-12 md:mb-20 luxury-text tracking-tighter leading-[0.9]">
                        {homeData.finalAssembly.title}
                    </h2>
                    <div className="flex flex-col items-center pointer-events-auto">
                        <button className="btn-luxury btn-primary !px-8 !py-3 md:!px-12 md:!py-5">
                            {globalData.buttons.homeMenu}
                        </button>
                    </div>
                </TextBeat>
            </section>

            {/* Signature Section - Now fully CMS powered */}
            <section className="relative z-20 py-24 md:py-40 lg:py-56 bg-black/90 backdrop-blur-3xl px-6 md:px-12 border-t border-white/10 shadow-[0_-50px_150px_rgba(0,0,0,1)]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16 lg:gap-24">
                    <div className="w-full md:w-1/2 space-y-8 md:space-y-12 text-center md:text-left">
                        <span className="text-white/20 text-[8px] md:text-[10px] uppercase tracking-[0.5em] font-bold block">
                            {homeData.signature.tagline}
                        </span>
                        <h3 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white luxury-text tracking-tighter leading-[0.9]">
                            {homeData.signature.title}
                        </h3>
                        <p className="text-white/40 text-base md:text-lg font-light leading-relaxed max-w-md mx-auto md:mx-0">
                            {homeData.signature.description}
                        </p>
                        <div className="flex justify-center md:justify-start">
                            <button className="text-[10px] uppercase tracking-[0.4em] font-bold border-b border-white/20 pb-4 hover:border-white hover:text-white transition-all">
                                {globalData.buttons.homeSecret}
                            </button>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 aspect-square md:aspect-[4/5] relative group">
                        <div className="w-full h-full glass rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 relative bg-white/[0.02]">
                            {homeData.signature.image ? (
                                <img
                                    src={homeData.signature.image}
                                    className="w-full h-full object-cover saturate-50 group-hover:saturate-100 transition-all duration-1000"
                                    alt="Signature dish"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-white/5 text-[9px] uppercase tracking-[0.5em] italic text-center px-4">
                                    [ No Site Media Selected ]
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

// Force re-index for Next.js bundler stability
