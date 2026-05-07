"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionHeader from "./SectionHeader";

const awards = [
  {
    title: "USPTO Provisional Patent Holder",
    subtitle: "VascuPINN: Physics-Informed Neural Network for 4D Blood Flow Modeling",
    detail: "Successfully used in a live vascular surgery in India",
    date: "Feb 2025",
    icon: "⚗️",
    highlight: true,
    color: "#C9A84C",
  },
  {
    title: "United Nations Speaker",
    subtitle: "18th Convention on Rights of Persons with Disabilities",
    detail: "Represented Jaipur Foot USA to 98 nations · $75K raised",
    date: "Jun 2025",
    icon: "🌍",
    highlight: true,
    color: "#64FFDA",
  },
  {
    title: "1st Place — Startups @ Spring",
    subtitle: "Business Pitch Competition",
    detail: "1st of 800+ internationally · $8,000 award",
    date: "Feb 2025",
    icon: "🏆",
    highlight: true,
    color: "#C9A84C",
  },
  {
    title: "Congressional Award & Record",
    subtitle: "Recognized by Congressman James Walkinshaw (VA-11)",
    detail: "For excellence in biomedical engineering",
    date: "Mar 2025",
    icon: "🇺🇸",
    color: "#F472B6",
  },
  {
    title: "Blue Ocean Global Finalist",
    subtitle: "World's Largest Student Entrepreneurship Competition",
    detail: "Top 300 of 14,000+ entries from 165 countries",
    date: "Mar 2025",
    icon: "🌊",
    color: "#60A5FA",
  },
  {
    title: "Virginia Invention Convention",
    subtitle: "State Finalist — Biomedical Engineering",
    detail: "Blood flow modeling software · Provisional patent recognized",
    date: "May 2025",
    icon: "🔬",
    color: "#34D399",
  },
  {
    title: "Conrad Challenge — Conrad Innovator",
    subtitle: "Houston Space Center",
    detail: "Premier global STEM innovation competition",
    date: "Mar 2025",
    icon: "🚀",
    color: "#A78BFA",
  },
  {
    title: "Dr. Edgar A. Love Award",
    subtitle: "Howard University · Omega Psi Phi Chapter",
    detail: "Excellence in Biomedical Engineering",
    date: "Apr 2025",
    icon: "🏅",
    color: "#FB923C",
  },
  {
    title: "Class Valedictorian",
    subtitle: "BASIS Independent McLean",
    detail: "Highest GPA among 39 graduates · 4.0 UW / 4.87 W",
    date: "2022–Present",
    icon: "🎓",
    color: "#C9A84C",
  },
  {
    title: "AP Scholar with Distinction",
    subtitle: "College Board",
    detail: "5s on 14 AP Exams across STEM and humanities",
    date: "2023, 2024",
    icon: "📚",
    color: "#64FFDA",
  },
];

function AwardCard({ award, index }: { award: typeof awards[0]; index: number }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
      className={`relative glass rounded-2xl p-6 glass-hover ${award.highlight ? "border-animate" : ""}`}
    >
      <div className="flex items-start gap-4">
        <div
          className="text-3xl w-12 h-12 flex items-center justify-center rounded-xl shrink-0"
          style={{ background: award.color + "15" }}
        >
          {award.icon}
        </div>
        <div>
          <p className="font-mono text-xs text-slate-muted mb-1">{award.date}</p>
          <h3 className="font-semibold text-slate-lightest mb-1 leading-tight">
            {award.title}
          </h3>
          <p className="text-sm font-medium mb-1" style={{ color: award.color }}>
            {award.subtitle}
          </p>
          <p className="text-xs text-slate-muted leading-relaxed">{award.detail}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Awards() {
  return (
    <section id="awards" className="section bg-navy-dark relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="absolute left-1/4 top-1/2 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <SectionHeader
          number="04. Awards"
          title="Recognition & Honors"
          subtitle="Nationally and internationally recognized achievements"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {awards.map((award, i) => (
            <AwardCard key={award.title} award={award} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
