"use client";

import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";

const ParticleField = dynamic(() => import("./ParticleField"), { ssr: false });
const HeroGlobe = dynamic(() => import("./HeroGlobe"), { ssr: false });

const roles = [
  "Biomedical Researcher",
  "AI Engineer",
  "Entrepreneur",
  "Humanitarian",
  "Patent Inventor",
  "UN Representative",
];


export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const current = roles[roleIndex];
    if (typing) {
      if (displayed.length < current.length) {
        const t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 60);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), 2000);
        return () => clearTimeout(t);
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
        return () => clearTimeout(t);
      } else {
        setRoleIndex((i) => (i + 1) % roles.length);
        setTyping(true);
      }
    }
  }, [displayed, typing, roleIndex]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-navy-darkest">
      {/* Three.js particle background */}
      <ParticleField />

      {/* Ambient gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal/5 rounded-full blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: "2s" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: text */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-mono text-gold text-sm mb-4 tracking-widest uppercase"
            >
              Hello, I&apos;m
            </motion.p>

            {/* Name + inline globe on mobile */}
            <div className="flex items-center gap-3 sm:block mb-2 sm:mb-0">
              <div className="flex-1 min-w-0">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-lightest leading-[1.15] pb-1"
                >
                  Aaryasinh
                </motion.h1>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold gradient-text-gold leading-[1.15] pb-2 sm:mb-6"
                >
                  Vaghela
                </motion.h1>
              </div>
              {/* Globe only visible on mobile, locked beside the name */}
              <div className="sm:hidden w-28 h-28 shrink-0">
                <Suspense fallback={null}>
                  <HeroGlobe />
                </Suspense>
              </div>
            </div>

            {/* Stanford badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-4 mb-6 relative z-[101]"
            >
              <Image
                src="/stanford-logo.png"
                alt="Stanford University"
                width={72}
                height={72}
                className="rounded-xl shrink-0"
              />
              <div>
                <p className="text-slate-lightest font-semibold text-xl tracking-wide leading-tight">Stanford University</p>
                <p className="font-mono text-sm text-slate-muted tracking-wide mt-0.5">Class of 2030 &nbsp;·&nbsp; BS CS + Bioengineering</p>
              </div>
            </motion.div>

            {/* Typewriter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-2 mb-8 h-10"
            >
              <span className="font-mono text-teal text-xl md:text-2xl">
                {displayed}
              </span>
              <span className="w-0.5 h-7 bg-teal animate-pulse" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="https://scholar.google.com/citations?user=zZgfirMAAAAJ&hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3 bg-gold text-navy-darkest font-semibold rounded-lg hover:bg-gold-light transition-all duration-300 hover:shadow-lg hover:shadow-gold/30 hover:-translate-y-0.5"
              >
                View Research
              </a>
              <a
                href="#contact"
                className="px-7 py-3 border border-gold/50 text-gold font-semibold rounded-lg hover:bg-gold/10 hover:border-gold transition-all duration-300 hover:-translate-y-0.5"
              >
                Contact Me
              </a>
            </motion.div>
          </div>

          {/* Right: photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Rotating ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-gold/30 animate-spin-slow" style={{ margin: "-16px" }} />
              {/* Glow */}
              <div className="absolute inset-0 rounded-full bg-gold/10 blur-2xl scale-110" />
              {/* Photo */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-gold/40 shadow-2xl shadow-gold/20">
                <Image
                  src="/headshot.png"
                  alt="Aaryasinh Vaghela"
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-slate-muted text-xs">scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-12 bg-gradient-to-b from-gold to-transparent"
        />
      </motion.div>
    </section>
  );
}
