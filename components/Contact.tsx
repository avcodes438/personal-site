"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function Contact() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section id="contact" className="section bg-navy-darkest relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-navy-dark/40" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </div>

      <div ref={ref} className="max-w-3xl mx-auto px-6 text-center relative">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="font-mono text-gold text-sm tracking-widest mb-4"
        >
          07. Contact
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-serif text-4xl md:text-5xl font-bold text-slate-lightest mb-6"
        >
          Get In Touch
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-slate-muted text-lg leading-relaxed mb-10"
        >
          Whether you&apos;re interested in research collaboration, speaking opportunities,
          or just want to connect — my inbox is always open.
        </motion.p>

        <motion.a
          href="mailto:aaryasinh.vaghela@gmail.com"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(201,168,76,0.4)" }}
          whileTap={{ scale: 0.98 }}
          className="inline-block px-10 py-4 border-2 border-gold text-gold font-semibold text-lg rounded-xl hover:bg-gold/10 transition-colors duration-300"
        >
          Say Hello
        </motion.a>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="font-mono text-slate-muted text-sm mt-5"
        >
          aaryasinh.vaghela@gmail.com
        </motion.p>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.7 }}
        className="mt-24 text-center"
      >
        <p className="font-mono text-slate-muted text-xs">
          Designed & Built by Aaryasinh Vaghela
        </p>
      </motion.footer>
    </section>
  );
}
