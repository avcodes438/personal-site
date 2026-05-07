"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { label: "About", href: "#about" },
  { label: "Research", href: "#research" },
  { label: "Experience", href: "#experience" },
  { label: "Awards", href: "#awards" },
  { label: "Service", href: "#service" },
  { label: "Athletics", href: "#athletics" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-navy-darkest/90 backdrop-blur-md border-b border-gold/10 shadow-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.a
            href="#"
            className="font-serif text-xl font-bold gradient-text-gold"
            whileHover={{ scale: 1.05 }}
          >
            AV
          </motion.a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8">
            {links.map((link, i) => (
              <motion.li
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <a
                  href={link.href}
                  onClick={() => setActive(link.href)}
                  className={`text-sm font-medium transition-colors duration-200 relative group ${
                    active === link.href
                      ? "text-gold"
                      : "text-slate-muted hover:text-slate-lightest"
                  }`}
                >
                  <span className="font-mono text-gold text-xs mr-1">
                    {String(i + 1).padStart(2, "0")}.
                  </span>
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
                </a>
              </motion.li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`block w-6 h-px bg-gold transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-px bg-gold transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-px bg-gold transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-y-0 right-0 z-40 w-72 bg-navy-dark/95 backdrop-blur-xl border-l border-gold/20 flex flex-col justify-center px-10 gap-8"
          >
            {links.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                onClick={() => setMenuOpen(false)}
                className="text-slate-light hover:text-gold text-xl font-medium transition-colors"
              >
                <span className="font-mono text-gold text-sm mr-3">
                  {String(i + 1).padStart(2, "0")}.
                </span>
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
