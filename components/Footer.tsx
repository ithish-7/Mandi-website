"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { usePathname } from "next/navigation";

export default function Footer() {
    const pathname = usePathname();
    const [globalData, setGlobalData] = useState<any>(null);

    useEffect(() => {
        fetch("/api/content")
            .then((res) => res.json())
            .then((data) => setGlobalData(data.global));
    }, []);

    // Hide footer on admin page or if data missing
    if (pathname === "/admin" || !globalData) return null;

    return (
        <footer className="relative bg-[#3e241c] border-t border-white/5 py-20 md:py-32 px-6 md:px-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
                <div className="col-span-1 md:col-span-2 space-y-6 text-center sm:text-left">
                    <h3 className="text-xl md:text-2xl font-bold tracking-[0.2em] uppercase">{globalData.companyName}.</h3>
                    <p className="max-w-sm mx-auto sm:mx-0 text-white/40 font-light leading-relaxed text-sm md:text-base">
                        {globalData.footer.tagline}
                    </p>
                </div>

                <div className="space-y-4 text-center sm:text-left">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30">Social Connections</h4>
                    <ul className="space-y-4 text-sm font-light">
                        {globalData.social?.map((link: any, i: number) => (
                            <li key={i} className="group">
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center sm:justify-start gap-3 text-white/60 hover:text-white transition-colors"
                                >
                                    {link.name.toLowerCase() === 'instagram' && (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                    )}
                                    {link.name.toLowerCase() === 'whatsapp' && (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3z"></path></svg>
                                    )}
                                    <span>{link.name}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-4 text-center sm:text-left">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30">Location</h4>
                    <div className="text-sm font-light text-white/60 leading-relaxed whitespace-pre-line">
                        {globalData.footer.address}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-20 md:mt-32 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] uppercase tracking-[0.2em] text-center">
                <span className="text-white/80 font-medium tracking-[0.1em]">{globalData.footer.copyright}</span>
                <span className="text-white/80 font-bold tracking-[0.4em]">PROJECT BY ITHISHJONNES.COM</span>
            </div>
        </footer>
    );
}
