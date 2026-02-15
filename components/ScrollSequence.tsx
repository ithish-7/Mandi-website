"use client";

import React, { useRef, useEffect, useState } from "react";
import { useScroll, useSpring, useMotionValueEvent } from "framer-motion";

const FRAME_COUNT = 147;

export default function ScrollSequence() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadProgress, setLoadProgress] = useState(0);

    const { scrollYProgress } = useScroll();
    const smoothProgress = useSpring(scrollYProgress, { damping: 30, stiffness: 100 });

    useEffect(() => {
        let isMounted = true;
        const loadImages = async () => {
            const imagePromises: Promise<HTMLImageElement>[] = [];

            for (let i = 0; i < FRAME_COUNT; i++) {
                // Filenames are 1-based: 001 to 147
                const frameIndex = i + 1;
                const promise = new Promise<HTMLImageElement>((resolve) => {
                    const img = new Image();
                    const frameStr = frameIndex.toString().padStart(3, "0");
                    img.src = `/Sequence/ezgif-frame-${frameStr}.png`;
                    img.onload = () => resolve(img);
                    img.onerror = () => {
                        console.error(`Failed to load frame ${frameIndex}`);
                        resolve(img); // Resolve anyway to avoid blocking
                    };
                });

                imagePromises.push(promise);
            }

            let completed = 0;
            const allPromises = imagePromises.map(p => p.then(img => {
                if (isMounted) {
                    completed++;
                    setLoadProgress(Math.round((completed / FRAME_COUNT) * 100));
                }
                return img;
            }));

            const result = await Promise.all(allPromises);
            if (isMounted) {
                setImages(result);
                setLoading(false);
            }
        };

        loadImages();

        return () => {
            isMounted = false;
        };
    }, []);

    const renderFrame = (index: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const img = images[index];

        if (!ctx || !img) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw image - "cover" logic
        // We want to fill the entire canvas, cropping the edges of the image if necessary
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;

        // On very tall screens (portrait mobile), we might want to prioritize height
        // On very wide screens, we prioritize width
        // Math.max(hRatio, vRatio) implements "cover"
        const ratio = Math.max(hRatio, vRatio);

        const centerShift_x = (canvas.width - img.width * ratio) / 2;
        const centerShift_y = (canvas.height - img.height * ratio) / 2;

        ctx.drawImage(
            img,
            0,
            0,
            img.width,
            img.height,
            centerShift_x,
            centerShift_y,
            img.width * ratio,
            img.height * ratio
        );
    };

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                const dpr = window.devicePixelRatio || 1;
                canvasRef.current.width = window.innerWidth * dpr;
                canvasRef.current.height = window.innerHeight * dpr;

                const ctx = canvasRef.current.getContext("2d");
                if (ctx) ctx.scale(dpr, dpr);

                canvasRef.current.style.width = `${window.innerWidth}px`;
                canvasRef.current.style.height = `${window.innerHeight}px`;

                // Redraw current frame
                const currentProgress = smoothProgress.get();
                const frameIndex = Math.min(
                    FRAME_COUNT - 1,
                    Math.floor(currentProgress * (FRAME_COUNT - 1))
                );
                if (images.length > 0) {
                    renderFrame(frameIndex);
                }
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Init size

        return () => window.removeEventListener("resize", handleResize);
    }, [images]);

    // Handle Scroll Animation
    useMotionValueEvent(smoothProgress, "change", (latest) => {
        if (images.length === 0) return;
        const frameIndex = Math.min(
            FRAME_COUNT - 1,
            Math.floor(latest * (FRAME_COUNT - 1))
        );
        renderFrame(frameIndex);
    });

    // Initial render when images load
    useEffect(() => {
        if (!loading && images.length > 0) {
            // Render first frame immediately
            renderFrame(0);
        }
    }, [loading, images]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-full bg-[#894d39] text-white">
                <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden mb-4">
                    <div
                        className="h-full bg-white transition-all duration-300 ease-out"
                        style={{ width: `${loadProgress}%` }}
                    />
                </div>
                <p className="font-light tracking-widest text-xs uppercase opacity-70">Loading Experience {loadProgress}%</p>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <canvas
                ref={canvasRef}
                className="block w-full h-full"
            />
            {/* Optional gradient overlay for blend if edges are harsh */}
        </div>
    );
}
