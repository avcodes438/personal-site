"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionHeader from "./SectionHeader";

const achievements = [
  {
    title: "Karate & Taekwondo",
    subtitle: "2nd-Dan Karate · 1st-Dan TKD Black Belt",
    detail: "13 state championship titles across sparring, form & weapons. Assistant instructor to 50+ students. Taught 60+ virtual classes during COVID-19.",
    icon: "🥋",
    stat: "10+",
    statLabel: "Years of Training",
    color: "#C9A84C",
  },
  {
    title: "U16 Tri-State Karate Champion",
    subtitle: "DC · Maryland · Virginia — Advanced Belt Sparring",
    detail: "Won 1st place in the Tri-State Cup competing against seasoned opponents in full-contact sparring. Marked by technical precision, endurance, and strategic execution.",
    icon: "🏆",
    stat: "1st",
    statLabel: "Regional Champion",
    color: "#64FFDA",
  },
  {
    title: "Gujarat State Chess Co-Champion",
    subtitle: "Under-14 Category",
    detail: "Won 1st place at the Gujarat State Championship with a perfect 5–0 record. Recognized as the top player in the under-14 category.",
    icon: "♟️",
    stat: "5–0",
    statLabel: "Perfect Record",
    color: "#A78BFA",
  },
];

const interests = [
  { label: "Martial Arts", icon: "🥋" },
  { label: "Neapolitan Pizza Making", icon: "🍕" },
  { label: "Pickleball", icon: "🏓" },
  { label: "Chess", icon: "♟️" },
  { label: "Debate", icon: "🎙️" },
  { label: "Science", icon: "🔬" },
];

const languages = [
  { lang: "English", level: "Native" },
  { lang: "Hindi", level: "Fluent" },
  { lang: "Gujarati", level: "Fluent" },
  { lang: "Urdu", level: "Fluent" },
  { lang: "Marwari", level: "Fluent" },
  { lang: "Spanish", level: "Proficient" },
];

export default function Athletics() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="athletics" className="section bg-navy-dark relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <SectionHeader
          number="06. Beyond the Lab"
          title="Athletics & Interests"
        />

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {achievements.map((item, i) => {
            const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
            return (
              <motion.div
                key={item.title}
                ref={ref}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="glass rounded-2xl p-7 glass-hover text-center"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <p className="font-bold text-3xl mb-1" style={{ color: item.color }}>
                  {item.stat}
                </p>
                <p className="font-mono text-xs text-slate-muted mb-4">{item.statLabel}</p>
                <h3 className="font-serif text-lg font-bold text-slate-lightest mb-1">{item.title}</h3>
                <p className="text-sm font-medium mb-3" style={{ color: item.color }}>{item.subtitle}</p>
                <p className="text-sm text-slate-muted leading-relaxed">{item.detail}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Interests + Languages */}
        <div className="grid md:grid-cols-2 gap-8" ref={ref}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="glass rounded-2xl p-7"
          >
            <h3 className="font-serif text-xl font-bold text-slate-lightest mb-5">Interests</h3>
            <div className="flex flex-wrap gap-3">
              {interests.map((item) => (
                <span
                  key={item.label}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-darkest/50 border border-gold/15 text-slate-light text-sm hover:border-gold/40 transition-colors"
                >
                  <span>{item.icon}</span>
                  {item.label}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass rounded-2xl p-7"
          >
            <h3 className="font-serif text-xl font-bold text-slate-lightest mb-5">Languages</h3>
            <div className="space-y-3">
              {languages.map((l) => (
                <div key={l.lang} className="flex items-center justify-between">
                  <span className="text-slate-light text-sm font-medium">{l.lang}</span>
                  <span className="font-mono text-xs text-gold bg-gold/10 px-2.5 py-0.5 rounded-full">
                    {l.level}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
