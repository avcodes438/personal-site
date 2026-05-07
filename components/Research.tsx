"use client";

import { useRef, useState, MouseEvent } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionHeader from "./SectionHeader";

const research = [
  {
    institution: "Stanford Medicine",
    lab: "Center for Interventional Radiology Innovation (IRIS)",
    role: "AI/ML Radiology Researcher",
    period: "Feb 2025 – Present",
    color: "#C9A84C",
    accentColor: "rgba(201,168,76,0.15)",
    borderColor: "rgba(201,168,76,0.3)",
    points: [
      "Collaborating with 31 global professors as the sole undergraduate on AI-driven diagnostics",
      "Developing anomaly detection algorithms for PET-CT, MRI, and X-ray analysis",
      "Implementing quantum computing innovations in radiology and medical imaging",
      "Pending publication in Nature Medicine",
    ],
    tag: "AI · Medical Imaging",
  },
  {
    institution: "Harvard Medical School",
    lab: "Boussiotis Hematology-Oncology Lab",
    role: "Blood Cancer Immunology Research Intern",
    period: "Dec 2024 – Aug 2025",
    color: "#64FFDA",
    accentColor: "rgba(100,255,218,0.1)",
    borderColor: "rgba(100,255,218,0.25)",
    points: [
      "Investigated PD-1/CD3-targeted assays to restore anti-leukemia immunity",
      "Isolated murine and human CD8+ T-cells for anti-tumor immunity research",
      "Proficient in 19 core bench techniques: genotyping, western blot, flow cytometry, bone marrow extraction, ELISA",
      "Advanced research on T-cell activation and immune tolerance mechanisms",
    ],
    tag: "Immunotherapy · T-Cell Biology",
  },
  {
    institution: "MITRE Corporation",
    lab: "National Security Research Division",
    role: "Chemistry Research Intern",
    period: "2025",
    color: "#A78BFA",
    accentColor: "rgba(167,139,250,0.1)",
    borderColor: "rgba(167,139,250,0.25)",
    points: [
      "Conducting classified research in support of national security objectives",
      "Work involves advanced chemistry and computational methodologies",
      "Project details are restricted under federal classification protocols",
    ],
    tag: "Classified · National Security",
    classified: true,
  },
];

function TiltCard({ item, index }: { item: typeof research[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg)");

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -12;
    const rotateY = ((x / rect.width) - 0.5) * 12;
    setTransform(
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`
    );
  };

  const handleMouseLeave = () => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)");
  };

  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform,
          transition: "transform 0.15s ease",
          borderColor: item.borderColor,
        }}
        className="relative rounded-2xl p-7 h-full cursor-default"
        css-bg={item.accentColor}
      >
        {/* Card background */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${item.accentColor}, rgba(10,22,40,0.9))`,
            border: `1px solid ${item.borderColor}`,
          }}
        />
        <div className="absolute inset-0 rounded-2xl backdrop-blur-sm" />

        {/* Classified overlay shimmer */}
        {item.classified && (
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-mono text-xs text-red-400 tracking-widest uppercase">Classified</span>
          </div>
        )}

        <div className="relative z-10">
          {/* Tag */}
          <span
            className="inline-block font-mono text-xs px-3 py-1 rounded-full mb-4"
            style={{
              color: item.color,
              background: item.accentColor,
              border: `1px solid ${item.borderColor}`,
            }}
          >
            {item.tag}
          </span>

          <h3
            className="font-serif text-2xl font-bold mb-1"
            style={{ color: item.color }}
          >
            {item.institution}
          </h3>
          <p className="text-slate-muted text-sm mb-1">{item.lab}</p>
          <p className="text-slate-light font-semibold mb-1">{item.role}</p>
          <p className="font-mono text-xs text-slate-muted mb-5">{item.period}</p>

          <ul className="space-y-2.5">
            {item.points.map((pt, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-muted leading-relaxed">
                <span style={{ color: item.color }} className="mt-1 shrink-0">▹</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

export default function Research() {
  return (
    <section id="research" className="section bg-navy-darkest relative">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold/3 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <SectionHeader
          number="01. Research"
          title="Where Science Meets Innovation"
          subtitle="Active research roles at world-leading institutions"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {research.map((item, i) => (
            <TiltCard key={item.institution} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
