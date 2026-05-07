"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionHeader from "./SectionHeader";

const experience = [
  {
    role: "Chemistry Research Intern",
    org: "MITRE Corporation",
    period: "2025",
    type: "Research",
    color: "#A78BFA",
    description:
      "Conducting classified research in support of national security objectives. Project details are restricted under federal classification protocols.",
    classified: true,
    tags: ["Classified", "National Security"],
  },
  {
    role: "AI/ML Radiology Researcher",
    org: "Stanford Medicine · IRIS Lab",
    period: "Feb 2025 – Present",
    type: "Research",
    color: "#C9A84C",
    description:
      "Collaborate with 31 global professors on AI models for PET-CT, MRI, and X-ray analysis. Developing anomaly detection algorithms to enhance diagnostics. Pending Nature Medicine publication.",
    tags: ["AI", "Medical Imaging", "Quantum Computing"],
  },
  {
    role: "Blood Cancer Immunology Research Intern",
    org: "Harvard Medical School · Boussiotis Lab",
    period: "Dec 2024 – Aug 2025",
    type: "Internship",
    color: "#64FFDA",
    description:
      "Investigated PD-1/CD3-targeted assays to restore anti-leukemia immunity. Isolated murine and human CD8+ T-cells. Proficient in 19 core lab techniques.",
    tags: ["Immunotherapy", "T-Cell Biology", "Oncology"],
  },
  {
    role: "Surgical & Medical Imaging Extern",
    org: "UVA Prince William Medical Center",
    period: "Jun – Aug 2025",
    type: "Externship",
    color: "#F472B6",
    description:
      "Assisted radiologic technician in 8 open vascular surgeries. Shadowed 6 vascular surgeries under Drs. Fatima & Bade. Learned surgical imaging protocols including carotid endarterectomy and femoral-femoral bypass.",
    tags: ["Vascular Surgery", "Surgical Imaging"],
  },
  {
    role: "Founder & CEO",
    org: "Alliance Tutors",
    period: "Jun 2020 – Present",
    type: "Entrepreneurship",
    color: "#FB923C",
    description:
      "Built international organization employing 12 tutors across 4 countries, serving 30+ low-income students. Saved families $200K+ via accessible STEM education. $15,000+ in revenue.",
    tags: ["STEM Education", "4 Countries", "$200K+ Impact"],
  },
  {
    role: "Founder & 2-Term Co-President",
    org: "Student Government · BASIS Independent McLean",
    period: "Mar 2024 – Present",
    type: "Leadership",
    color: "#34D399",
    description:
      "Re-elected with 85% then 100% support. Implemented 3 major reforms including Fourier Series course. Organized 22 school events. Mentored 3 successors.",
    tags: ["Student Government", "Reform", "Leadership"],
  },
  {
    role: "Founder & Executive Producer",
    org: "BIMTv News Channel",
    period: "Jun 2023 – Present",
    type: "Media",
    color: "#60A5FA",
    description:
      "Direct 11-member team producing bi-weekly 5-minute broadcasts for 600+ students. Amplify student voices, showcase achievements, and foster school community.",
    tags: ["Media Production", "600+ Viewers"],
  },
  {
    role: "Pathology Lab Intern",
    org: "Scientific Diagnostic Center",
    period: "Jun – Aug 2022",
    type: "Internship",
    color: "#C9A84C",
    description:
      "Completed 250+ hours of immersive training in clinical diagnostics. Analyzed samples from ~4,000 patients using EDTA Whole Blood protocols and ELISA assays.",
    tags: ["Clinical Diagnostics", "ELISA", "Blood Analysis"],
  },
];

function TimelineItem({ item, index }: { item: typeof experience[0]; index: number }) {
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true });
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 }}
      className={`relative flex ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} flex-col gap-8 items-start md:items-center mb-12`}
    >
      {/* Card */}
      <div className="w-full md:w-5/12 glass rounded-2xl p-6 glass-hover group">
        {item.classified && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-mono text-xs text-red-400 tracking-widest uppercase">Classified</span>
          </div>
        )}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span
            className="font-mono text-xs px-2.5 py-1 rounded-full"
            style={{
              color: item.color,
              background: item.color + "15",
              border: `1px solid ${item.color}30`,
            }}
          >
            {item.type}
          </span>
          <span className="font-mono text-xs text-slate-muted">{item.period}</span>
        </div>
        <h3 className="font-serif text-lg font-bold text-slate-lightest mb-1">
          {item.role}
        </h3>
        <p className="text-sm font-semibold mb-3" style={{ color: item.color }}>
          {item.org}
        </p>
        <p className="text-slate-muted text-sm leading-relaxed mb-4">
          {item.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded font-mono text-slate-muted bg-navy-darkest/50 border border-white/5"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Center dot */}
      <div className="hidden md:flex w-2/12 justify-center items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-4 h-4 rounded-full border-2 flex-shrink-0 z-10"
          style={{
            borderColor: item.color,
            background: item.color,
            boxShadow: `0 0 12px ${item.color}60`,
          }}
        />
      </div>

      {/* Spacer */}
      <div className="hidden md:block w-5/12" />
    </motion.div>
  );
}

export default function Experience() {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  return (
    <section id="experience" className="section bg-navy-darkest relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-gold/4 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <SectionHeader
          number="03. Experience"
          title="Work & Leadership"
          subtitle="Building at the intersection of science, business, and service"
        />

        <div className="relative">
          {/* Vertical line */}
          <motion.div
            ref={ref}
            className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 w-px bg-gradient-to-b from-gold/60 via-teal/40 to-transparent"
            initial={{ height: 0 }}
            animate={inView ? { height: "100%" } : {}}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {experience.map((item, i) => (
            <TimelineItem key={item.org + item.role} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
