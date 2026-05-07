"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function Tagline() {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <section ref={ref} className="relative bg-navy-darkest overflow-hidden py-24 md:py-32">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-6 text-center relative">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-lightest leading-[1.2]"
        >
          I build healthcare technologies to close the gap between{" "}
          <span className="gradient-text-gold">lab breakthroughs</span>{" "}
          and patients who actually need them.
        </motion.p>
      </div>
    </section>
  );
}
