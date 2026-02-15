"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
    { name: "Menu", href: "/menu" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
];

import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [globalData, setGlobalData] = useState<any>(null);

    useEffect(() => {
        fetch("/api/content")
            .then((res) => res.json())
            .then((data) => setGlobalData(data.global));
    }, []);

    // Hide navbar on admin page or if data missing
    if (pathname === "/admin" || !globalData) return null;

    return (
        <nav className="fixed top-0 left-0 w-full z-[100] px-4 py-6 md:px-12 pointer-events-none">
            <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto relative">
                <div className="flex-1 flex justify-start">
                    <Link href="/" className="group glass px-4 py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 rounded-full transition-transform active:scale-95" onClick={() => setIsOpen(false)}>
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-sm md:text-base lg:text-lg font-bold tracking-[0.4em] uppercase opacity-90 group-hover:opacity-100 transition-opacity"
                        >
                            {globalData.companyName}<span className="text-white/40">.</span>
                        </motion.span>
                    </Link>
                </div>

                {/* Centered Mobile Menu Toggle */}
                <div className="md:hidden flex-1 flex justify-center">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="glass px-6 py-2.5 rounded-full flex items-center justify-center active:scale-90 transition-transform"
                    >
                        <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold">
                            {isOpen ? "Close" : "Menu"}
                        </span>
                    </button>
                </div>

                <div className="flex-1 flex items-center justify-end space-x-3 md:space-x-4">
                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center glass px-8 py-3 rounded-full space-x-8">
                        {navLinks.map((link, i) => (
                            <Link key={link.href} href={link.href}>
                                <motion.span
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/70 hover:text-white transition-colors"
                                >
                                    {link.name}
                                </motion.span>
                            </Link>
                        ))}
                    </div>

                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="btn-luxury !px-6 !py-2.5 md:!px-8 md:!py-3 text-[9px] md:text-[10px]"
                    >
                        {globalData.buttons.navbarReserve}
                    </motion.button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-24 left-4 right-4 glass rounded-3xl p-8 pointer-events-auto md:hidden overflow-hidden"
                    >
                        <div className="flex flex-col space-y-6 text-center">
                            {navLinks.map((link, i) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <motion.span
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="text-xl sm:text-2xl font-bold text-white luxury-text tracking-tighter block"
                                    >
                                        {link.name.toUpperCase()}
                                    </motion.span>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
