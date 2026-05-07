"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface Props {
  number: string;
  title: string;
  subtitle?: string;
}

export default function SectionHeader({ number, title, subtitle }: Props) {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="mb-16"
    >
      <p className="font-mono text-gold text-sm tracking-widest mb-2">{number}</p>
      <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-lightest mb-4">
        {title}
      </h2>
      <div className="flex items-center gap-4">
        <div className="h-px w-16 bg-gold" />
        {subtitle && (
          <p className="text-slate-muted text-sm">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}
