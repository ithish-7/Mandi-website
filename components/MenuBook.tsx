"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MenuItem {
    name: string;
    price: string;
    desc: string;
}

interface MenuCategory {
    name: string;
    items: MenuItem[];
}

interface MenuBookProps {
    categories: MenuCategory[];
}

export default function MenuBook({ categories }: MenuBookProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [direction, setDirection] = useState(0);
    const [companyName, setCompanyName] = useState("Mandi House");

    useEffect(() => {
        fetch("/api/content")
            .then(res => res.json())
            .then(data => setCompanyName(data.global.companyName));
    }, []);

    // Pages: [Cover, ...Categories, Thank You]
    const pages = [
        { type: 'cover', name: companyName },
        ...categories.map(cat => ({ ...cat, type: 'content' })),
        { type: 'outro', name: "Thank You" }
    ];

    const paginate = (newDirection: number) => {
        if (currentPage + newDirection >= 0 && currentPage + newDirection < pages.length) {
            setDirection(newDirection);
            setCurrentPage(currentPage + newDirection);
        }
    };

    return (
        <div className="relative w-full max-w-5xl mx-auto perspective-[2000px] py-12 px-2 md:px-20">
            {/* Navigation Arrows (Always visible) */}
            <div className="absolute left-0 sm:-left-6 top-1/2 -translate-y-1/2 z-50">
                <button
                    onClick={() => paginate(-1)}
                    disabled={currentPage === 0}
                    className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-black/50 sm:bg-white/5 backdrop-blur-md border border-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all disabled:opacity-0 disabled:pointer-events-none group"
                >
                    <span className="text-lg md:text-2xl group-active:scale-90 transition-transform">←</span>
                </button>
            </div>

            <div className="absolute right-0 sm:-right-6 top-1/2 -translate-y-1/2 z-50">
                <button
                    onClick={() => paginate(1)}
                    disabled={currentPage === pages.length - 1}
                    className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-black/50 sm:bg-white/5 backdrop-blur-md border border-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all disabled:opacity-0 disabled:pointer-events-none group"
                >
                    <span className="text-lg md:text-2xl group-active:scale-90 transition-transform">→</span>
                </button>
            </div>

            {/* Book Base / Shadows */}
            <div className="absolute inset-x-0 bottom-0 h-4 bg-black/60 blur-3xl rounded-full" />

            <div className="relative aspect-[3/4] sm:aspect-[4/3] w-full bg-gradient-to-br from-[#1a1a1a] via-[#111111] to-[#0a0a0a] rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden border border-white/5">
                {/* Single Content Page (Interactive) */}
                <div className="w-full h-full relative overflow-hidden group">
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={currentPage}
                            custom={direction}
                            variants={{
                                enter: (direction: number) => ({
                                    rotateY: direction > 0 ? 90 : -90,
                                    opacity: 0,
                                    x: direction > 0 ? 100 : -100
                                }),
                                center: {
                                    rotateY: 0,
                                    opacity: 1,
                                    x: 0,
                                    transition: {
                                        duration: 0.6,
                                        ease: [0.23, 1, 0.32, 1]
                                    }
                                },
                                exit: (direction: number) => ({
                                    rotateY: direction > 0 ? -90 : 90,
                                    opacity: 0,
                                    x: direction > 0 ? -100 : 100,
                                    transition: {
                                        duration: 0.4
                                    }
                                })
                            }}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="absolute inset-0 p-6 md:p-16 flex flex-col"
                            style={{ transformOrigin: "center center" }}
                        >
                            {/* Page Texture Overlay (Subtle noise/leather) */}
                            <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                                style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }} />

                            <div className="relative flex-1 flex flex-col items-center justify-center text-center">
                                {pages[currentPage].type === 'cover' ? (
                                    <div className="space-y-8">
                                        <div className="w-1 bg-white/10 h-20 mx-auto" />
                                        <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">{pages[currentPage].name}.</h2>
                                        <p className="text-xs uppercase tracking-[0.8em] text-white/40 font-bold">The Signature Menu</p>
                                        <div className="w-1 bg-white/10 h-20 mx-auto" />
                                    </div>
                                ) : pages[currentPage].type === 'outro' ? (
                                    <div className="space-y-8">
                                        <h2 className="text-5xl font-black text-white uppercase tracking-tighter italic">Thank You.</h2>
                                        <p className="text-xs uppercase tracking-[0.6em] text-white/30 font-bold leading-relaxed max-w-[300px] mx-auto">
                                            We look forward to hosting your next memorable gathering.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex flex-col text-left space-y-10">
                                        <header className="space-y-2 border-b border-white/5 pb-6 text-left w-full">
                                            <span className="text-[9px] uppercase tracking-[0.4em] text-white/20 font-bold block">Collection {currentPage}</span>
                                            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white uppercase">{(pages[currentPage] as any).name}</h2>
                                        </header>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 md:gap-y-10 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                            {(pages[currentPage] as any).items.map((item: any, i: number) => (
                                                <div key={i} className="group/item border-b border-white/5 pb-4 md:border-none md:pb-0">
                                                    <div className="flex justify-between items-baseline mb-1 md:mb-2 text-white">
                                                        <h4 className="text-sm md:text-base font-bold tracking-tight">{item.name}</h4>
                                                        <span className="text-[10px] md:text-xs font-bold text-white/40 italic">{item.price}</span>
                                                    </div>
                                                    <p className="text-[10px] md:text-xs text-white/60 leading-relaxed font-medium">{item.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <footer className="mt-auto pt-8 flex justify-between items-center text-[9px] uppercase tracking-widest font-black text-white/20">
                                <span className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-current" />
                                    {companyName}
                                </span>
                                <span>Page {currentPage + 1} / {pages.length}</span>
                            </footer>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Invisible Desktop Click areas */}
                <div
                    onClick={() => paginate(-1)}
                    className="absolute left-0 inset-y-0 w-32 cursor-pointer hidden md:block z-40"
                />
                <div
                    onClick={() => paginate(1)}
                    className="absolute right-0 inset-y-0 w-32 cursor-pointer hidden md:block z-40 shadow-inner"
                />
            </div>

            {/* Instruction */}
            <div className="text-center mt-8 space-y-2">
                <p className="text-white/20 text-[9px] uppercase tracking-[0.4em] font-bold">Turn pages via arrows or click the edge</p>
                <div className="flex justify-center gap-1">
                    {pages.map((_, i) => (
                        <div key={i} className={`w-1 h-1 rounded-full transition-all duration-500 ${i === currentPage ? "bg-white w-4" : "bg-white/10"}`} />
                    ))}
                </div>
            </div>
        </div>
    );
}
