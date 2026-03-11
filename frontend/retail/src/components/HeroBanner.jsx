import React, { useState, useEffect, useRef } from "react";

const IMAGES = [
    "/images/food1.png",
    "/images/food2.png",
    "/images/food3.png",
    "/images/food4.png",
];

const TRANSITION_DURATION = 5000;

export default function HeroBanner() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [nextIndex, setNextIndex] = useState(1);
    const [transitioning, setTransitioning] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setTransitioning(true);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
                setNextIndex((prev) => (prev + 1) % IMAGES.length);
                setTransitioning(false);
            }, 1200);
        }, TRANSITION_DURATION);
        return () => clearInterval(timerRef.current);
    }, []);

    function scrollToProducts() {
        const el = document.getElementById("products-section");
        if (el) el.scrollIntoView({ behavior: "smooth" });
    }

    return (
        <section className="hero-banner" id="hero-banner">
            {/* Background images with crossfade */}
            <div className="hero-bg">
                <div
                    className="hero-bg-img"
                    style={{
                        backgroundImage: `url(${IMAGES[currentIndex]})`,
                        opacity: transitioning ? 0 : 1,
                    }}
                />
                <div
                    className="hero-bg-img"
                    style={{
                        backgroundImage: `url(${IMAGES[nextIndex]})`,
                        opacity: transitioning ? 1 : 0,
                    }}
                />
                <div className="hero-overlay" />
            </div>

            {/* Content */}
            <div className="hero-content">
                <h1 className="hero-brand">Rasoi</h1>
                <p className="hero-tagline">
                    <span className="hero-highlight">food delivery app</span>
                </p>
                <p className="hero-subtitle">
                    Experience fast &amp; easy online ordering
                </p>
            </div>

            {/* Scroll indicator */}
            <button className="hero-scroll-btn" onClick={scrollToProducts}>
                <span>Scroll down</span>
                <svg
                    className="hero-scroll-chevron"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M5 7.5L10 12.5L15 7.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
        </section>
    );
}
