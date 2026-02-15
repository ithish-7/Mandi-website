"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type PageKey = "home" | "about" | "menu" | "contact";
type View = "pages" | "global" | "section-editor";

export default function ShopifyStyleCMS() {
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const [view, setView] = useState<View>("pages");
    const [selectedPage, setSelectedPage] = useState<PageKey>("home");
    const [selectedSection, setSelectedSection] = useState<string | null>(null);

    const previewRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        fetch("/api/content")
            .then((res) => res.json())
            .then((data) => {
                setContent(data);
                setLoading(false);
            });
    }, []);

    // Sync preview when content changes
    useEffect(() => {
        if (content && previewRef.current) {
            // In a real app, we'd use postMessage for instant updates.
            // For now, we'll suggest a refresh or assume the user sees the logic.
            // But let's try to notify the preview if it's on the same origin.
            try {
                previewRef.current.contentWindow?.postMessage({ type: "CMS_UPDATE", content }, window.location.origin);
            } catch (e) { }
        }
    }, [content]);

    const handleSave = async () => {
        setSaving(true);
        const formData = new FormData();
        formData.append("action", "saveContent");
        formData.append("content", JSON.stringify(content, null, 2));

        try {
            const res = await fetch("/api/content", {
                method: "POST",
                body: formData,
            });
            if (res.ok) {
                setMessage("Published Successfully!");
                setTimeout(() => setMessage(""), 3000);
                previewRef.current?.contentWindow?.location.reload();
            }
        } catch (error) {
            alert("Save failed.");
        } finally {
            setSaving(false);
        }
    };

    const updateNestedContent = (path: string[], value: any) => {
        const newContent = { ...content };
        let current = newContent;
        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]];
        }
        current[path[path.length - 1]] = value;
        setContent(newContent);
    };

    const handleImageUpload = async (path: string[], file: File) => {
        const formData = new FormData();
        formData.append("action", "uploadImage");
        formData.append("file", file);

        try {
            const res = await fetch("/api/content", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                updateNestedContent(path, data.url);
                setMessage("Media Synchronized");
                setTimeout(() => setMessage(""), 2000);
            }
        } catch (error) {
            alert("Upload failed.");
        }
    };

    if (loading) return (
        <div className="h-screen bg-[#1a1a1a] flex items-center justify-center text-white/20 tracking-[1em] text-[10px] uppercase font-bold">
            Loading Shopify-Style Editor...
        </div>
    );

    const getSections = (page: PageKey) => {
        return Object.keys(content.pages[page]);
    };

    return (
        <div className="h-screen flex bg-black text-white font-sans selection:bg-white/10 overflow-hidden">
            {/* Left Sidebar: The "Shopify" Sidebar */}
            <aside className="w-80 border-r border-white/5 flex flex-col bg-[#111] z-20">
                <header className="p-6 border-b border-white/5 flex items-center justify-between bg-[#1a1a1a]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                            <div className="w-4 h-4 bg-black rounded-sm" />
                        </div>
                        <h1 className="text-sm font-bold tracking-tight uppercase">Mandi Editor</h1>
                    </div>
                    <button
                        onClick={async () => {
                            await fetch('/api/auth/logout', { method: 'POST' });
                            window.location.reload();
                        }}
                        className="text-[9px] uppercase tracking-widest text-white/20 hover:text-white transition-colors font-bold"
                    >
                        Sign Out
                    </button>
                </header>
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    <AnimatePresence mode="wait">
                        {view === "pages" && (
                            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="p-4 space-y-8">
                                <SidebarGroup label="Page Management">
                                    {(["home", "menu", "contact", "about"] as PageKey[]).map((p) => (
                                        <SidebarItem
                                            key={p}
                                            label={`${p.charAt(0).toUpperCase() + p.slice(1)}`}
                                            icon={p === "home" ? "🏠" : p === "menu" ? "🍽️" : p === "contact" ? "📍" : "📖"}
                                            active={selectedPage === p}
                                            onClick={() => {
                                                setSelectedPage(p);
                                                setSelectedSection(null);
                                                setView("section-editor");
                                            }}
                                        />
                                    ))}
                                </SidebarGroup>

                                <SidebarGroup label="Site Components">
                                    <SidebarItem
                                        label="Footer"
                                        icon="📋"
                                        active={selectedSection === "footer"}
                                        onClick={() => {
                                            setSelectedSection("footer");
                                            setView("section-editor");
                                        }}
                                    />
                                    <SidebarItem
                                        label="Buttons"
                                        icon="🔘"
                                        active={selectedSection === "buttons"}
                                        onClick={() => {
                                            setSelectedSection("buttons");
                                            setView("section-editor");
                                        }}
                                    />
                                </SidebarGroup>

                                <SidebarGroup label="Site Identity">
                                    <SidebarItem
                                        label="General Settings"
                                        icon="⚙️"
                                        onClick={() => setView("global")}
                                    />
                                </SidebarGroup>
                            </motion.div>
                        )}

                        {view === "global" && (
                            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} className="p-4 space-y-6">
                                <BackButton onClick={() => setView("pages")} label="General Identity" />
                                <div className="space-y-4">
                                    <SidebarInput label="Store Name" value={content.global.companyName} onChange={(v) => updateNestedContent(["global", "companyName"], v)} />
                                    <SidebarInput label="Contact Email" value={content.global.contactEmail} onChange={(v) => updateNestedContent(["global", "contactEmail"], v)} />
                                    <div className="pt-6 border-t border-white/5 space-y-4">
                                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Social Connections</h3>
                                        <RecursiveEditor
                                            data={content.global.social || []}
                                            path={["global", "social"]}
                                            update={updateNestedContent}
                                            upload={handleImageUpload}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {view === "section-editor" && (
                            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} className="p-4 space-y-6">
                                <BackButton onClick={() => setView("pages")} label={selectedSection === "buttons" ? "Button Labels" : selectedSection === "footer" ? "Footer Design" : `${selectedPage.toUpperCase()} SECTIONS`} />

                                {selectedSection === "buttons" ? (
                                    <div className="space-y-6 p-4 bg-white/[0.02] rounded-xl border border-white/5">
                                        <RecursiveEditor
                                            data={content.global.buttons}
                                            path={["global", "buttons"]}
                                            update={updateNestedContent}
                                            upload={handleImageUpload}
                                        />
                                    </div>
                                ) : selectedSection === "footer" ? (
                                    <div className="space-y-6 p-4 bg-white/[0.02] rounded-xl border border-white/5">
                                        <RecursiveEditor
                                            data={content.global.footer}
                                            path={["global", "footer"]}
                                            update={updateNestedContent}
                                            upload={handleImageUpload}
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {selectedPage === "menu" && (
                                            <div className="mb-6 p-4 bg-white/[0.05] rounded-xl border border-white/10 space-y-4">
                                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Menu Source</h3>
                                                <SidebarPDF
                                                    label="Upload Menu PDF"
                                                    current={content.pages.menu.pdfUrl || ""}
                                                    onUpload={(f: File) => handleImageUpload(["pages", "menu", "pdfUrl"], f)}
                                                />
                                                <p className="text-[9px] text-white/20 italic">If a PDF is uploaded, it will be prioritized on the live site.</p>
                                            </div>
                                        )}
                                        {getSections(selectedPage).map((s) => (
                                            <SectionAccordion
                                                key={s}
                                                title={s.replace(/([A-Z])/g, ' $1').trim()}
                                                isOpen={selectedSection === s}
                                                onClick={() => setSelectedSection(selectedSection === s ? null : s)}
                                            >
                                                <div className="space-y-6 p-4 bg-white/[0.02] rounded-xl border border-white/5 mt-2">
                                                    <RecursiveEditor
                                                        data={content.pages[selectedPage][s]}
                                                        path={["pages", selectedPage, s]}
                                                        update={updateNestedContent}
                                                        upload={handleImageUpload}
                                                    />
                                                </div>
                                            </SectionAccordion>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <footer className="p-4 border-t border-white/5 bg-[#1a1a1a]">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-white/90 active:scale-95 transition-all shadow-xl"
                    >
                        {saving ? "Publishing..." : "Publish Site"}
                    </button>
                </footer>
            </aside>

            {/* Right Side: The Preview */}
            <main className="flex-1 bg-[#222] relative flex flex-col">
                <div className="h-12 bg-[#1a1a1a] border-b border-white/5 flex items-center px-4 justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40" />
                        </div>
                        <div className="bg-black/40 px-4 py-1 rounded-full text-[10px] text-white/40 font-medium tracking-tight">
                            localhost:3000/{selectedPage === "home" ? "" : selectedPage}
                        </div>
                    </div>
                    <div className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Shopify-Style Visual Preview</div>
                </div>
                <div className="flex-1 p-8 md:p-12 overflow-hidden flex items-center justify-center">
                    <div className="w-full h-full bg-white rounded-xl shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden relative">
                        <iframe
                            ref={previewRef}
                            src={`/${selectedPage === "home" ? "" : selectedPage}`}
                            key={selectedPage}
                            className="w-full h-full border-none"
                        />
                        {/* Overlay to catch clicks and prevent navigation during edit? Optional */}
                    </div>
                </div>

                {/* Notifications */}
                <AnimatePresence>
                    {message && (
                        <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 50, opacity: 0 }} className="fixed bottom-10 right-10 bg-white text-black px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest shadow-2xl z-50">
                            {message}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

// Recursive Editor Component
function RecursiveEditor({ data, path, update, upload }: any) {
    const formatLabel = (key: string) => {
        return key.replace(/([A-Z])/g, ' $1')
            .replace(/_/g, ' ')
            .replace(/^\w/, (c) => c.toUpperCase())
            .replace('Hero', 'Hero Section')
            .replace('Chapter', 'Chapter')
            .trim();
    };

    return (
        <div className="space-y-6">
            {Object.entries(data).map(([key, value]: [string, any]) => {
                const currentPath = [...path, key];
                const label = formatLabel(key);

                if (Array.isArray(value)) {
                    return (
                        <div key={key} className="space-y-4 pt-4 border-t border-white/5">
                            <label className="text-[9px] uppercase tracking-widest text-white/30 font-black">{label}</label>
                            {value.map((item, index) => (
                                <div key={index} className="p-4 bg-black/20 rounded-2xl border border-white/5 space-y-4 shadow-sm">
                                    <div className="flex justify-between items-center text-[8px] uppercase tracking-[0.2em] text-white/10 font-bold">
                                        <span>Item #{index + 1}</span>
                                    </div>
                                    <RecursiveEditor
                                        data={item}
                                        path={[...currentPath, index.toString()]}
                                        update={update}
                                        upload={upload}
                                    />
                                </div>
                            ))}
                        </div>
                    );
                }

                if (typeof value === 'object' && value !== null) {
                    return (
                        <div key={key} className="space-y-4 pt-4 border-t border-white/5">
                            <label className="text-[9px] uppercase tracking-widest text-white/30 font-black">{label}</label>
                            <RecursiveEditor
                                data={value}
                                path={currentPath}
                                update={update}
                                upload={upload}
                            />
                        </div>
                    );
                }

                if (typeof value === 'string' && (key.toLowerCase().includes('image') || key.toLowerCase().includes('background'))) {
                    return (
                        <SidebarImage
                            key={key}
                            label={label}
                            current={value}
                            onUpload={(f: File) => upload(currentPath, f)}
                        />
                    );
                }

                if (typeof value === 'string' && value.length > 50) {
                    return (
                        <SidebarTextarea
                            key={key}
                            label={label}
                            value={value}
                            onChange={(v: string) => update(currentPath, v)}
                        />
                    );
                }

                return (
                    <SidebarInput
                        key={key}
                        label={label}
                        value={String(value)}
                        onChange={(v: string) => update(currentPath, v)}
                    />
                );
            })}
        </div>
    );
}

// Components
function SidebarGroup({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <h3 className="text-[9px] font-bold text-white/20 uppercase tracking-widest pl-2">{label}</h3>
            <div className="space-y-1">{children}</div>
        </div>
    );
}

function SidebarItem({ label, icon, active, onClick }: { label: string; icon?: string; active?: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between p-3 rounded-lg text-xs font-medium transition-all ${active ? "bg-white/10 text-white" : "text-white/40 hover:bg-white/5 hover:text-white/60"
                }`}
        >
            <div className="flex items-center gap-3">
                {icon && <span>{icon}</span>}
                <span>{label}</span>
            </div>
            <span className="text-[10px] opacity-20">→</span>
        </button>
    );
}

function BackButton({ onClick, label }: { onClick: () => void; label: string }) {
    return (
        <button onClick={onClick} className="flex items-center gap-2 text-white/30 hover:text-white transition-colors mb-4">
            <span className="text-sm">←</span>
            <span className="text-[10px] uppercase tracking-widest font-bold">{label}</span>
        </button>
    );
}

function SidebarInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
    return (
        <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-widest text-white/30 font-bold ml-1">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-xs focus:outline-none focus:border-white/20 transition-all"
            />
        </div>
    );
}

function SidebarTextarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
    return (
        <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-widest text-white/30 font-bold ml-1">{label}</label>
            <textarea
                value={value}
                rows={4}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-xs focus:outline-none focus:border-white/20 transition-all resize-none"
            />
        </div>
    );
}

function SidebarImage({ label, current, onUpload }: { label: string; current: string; onUpload: (file: File) => void }) {
    return (
        <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-widest text-white/30 font-bold ml-1">{label}</label>
            <div className="relative group aspect-video rounded-lg bg-black/60 border border-white/10 overflow-hidden flex items-center justify-center">
                {current ? (
                    <img src={current} className="w-full h-full object-cover opacity-40 group-hover:opacity-20 transition-opacity" />
                ) : (
                    <span className="text-[8px] text-white/10 italic">Empty Source</span>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="text-[8px] font-black uppercase tracking-widest bg-white text-black px-4 py-2 rounded-full">Replace Media</span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                </div>
            </div>
        </div>
    );
}

function SidebarPDF({ label, current, onUpload }: { label: string; current: string; onUpload: (file: File) => void }) {
    return (
        <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-widest text-white/30 font-bold ml-1">{label}</label>
            <div className="relative group aspect-[4/1] rounded-lg bg-black/60 border border-white/10 overflow-hidden flex items-center justify-center">
                <div className="flex items-center gap-3 px-4 w-full">
                    <div className="w-8 h-8 rounded bg-red-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-red-500/60 uppercase">PDF</span>
                    </div>
                    <div className="flex-1 truncate">
                        {current ? (
                            <span className="text-[10px] text-white/40">{current.split('/').pop()}</span>
                        ) : (
                            <span className="text-[10px] text-white/10 italic">No PDF Uploaded</span>
                        )}
                    </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="text-[8px] font-black uppercase tracking-widest bg-white text-black px-4 py-2 rounded-full">Upload New PDF</span>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                </div>
            </div>
        </div>
    );
}

function SectionAccordion({ title, isOpen, onClick, children }: { title: string; isOpen: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <div className="border-b border-white/5 py-1">
            <button
                onClick={onClick}
                className="w-full flex items-center justify-between py-3 px-2 hover:bg-white/5 rounded-lg transition-all"
            >
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">{title}</span>
                <span className={`text-[10px] transition-transform ${isOpen ? "rotate-180" : ""}`}>↓</span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
