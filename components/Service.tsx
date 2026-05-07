"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionHeader from "./SectionHeader";

const service = [
  {
    org: "Jaipur Foot USA",
    role: "International Coordinator & UN Representative",
    period: "Jan 2024 – Present",
    color: "#64FFDA",
    stats: [
      { value: "2.3M+", label: "Beneficiaries" },
      { value: "42", label: "Countries" },
      { value: "$75K", label: "Raised" },
      { value: "3M+", label: "Media Reach" },
    ],
    points: [
      "Lead youth engagement for world's largest prosthetic limb NGO",
      "Directing 3-year Trinidad & Tobago camp enabling 800+ amputees to walk",
      "Raised $75K from 1,000+ donors across global outreach campaigns",
      "UN speaker on disability rights at 18th Convention, represented to 98 nations",
      "3M+ reached via coordinated global media outreach",
    ],
  },
  {
    org: "Healthcare Volunteering",
    role: "TB Screening Coordinator & Patient Support",
    period: "Jul 2022 – Present",
    color: "#F472B6",
    stats: [
      { value: "350+", label: "Total Hours" },
      { value: "300+", label: "X-Rays Taken" },
      { value: "6", label: "Sonographies" },
      { value: "55+", label: "INOVA Hours" },
    ],
    points: [
      "Community Health Center India: Led tuberculosis screening initiative for low-income peri-urban families",
      "Performed 300+ X-rays and 6 free sonographies under Dr. Mahesh Patel",
      "Oversaw TB screening in resource-limited settings amidst staff shortages",
      "INOVA Fairfax Hospital: 55+ hours enhancing patient experience with direct care assistance",
    ],
  },
  {
    org: "National Spanish Honor Society",
    role: "President — Largest Club at BASIS McLean",
    period: "Feb 2025 – Present",
    color: "#FB923C",
    stats: [
      { value: "33", label: "Members" },
      { value: "1,000+", label: "Care Packages" },
      { value: "7", label: "Hospitals" },
      { value: "$6K", label: "Donations" },
    ],
    points: [
      "Led 33 members distributing 1,000+ care packages to 7 hospitals",
      "Raised $6K in backpacks and winter clothing for homeless shelters",
      "Organized cultural events, service initiatives, and language enrichment activities",
      "Promoted Spanish language and Hispanic culture across student body",
    ],
  },
];

function ServiceCard({ item, index }: { item: typeof service[0]; index: number }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="glass rounded-2xl p-8 glass-hover"
    >
      <div className="mb-6">
        <p className="font-mono text-xs text-slate-muted mb-1">{item.period}</p>
        <h3 className="font-serif text-2xl font-bold mb-1" style={{ color: item.color }}>
          {item.org}
        </h3>
        <p className="text-slate-light font-medium text-sm">{item.role}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 mb-6 p-4 rounded-xl" style={{ background: item.color + "08" }}>
        {item.stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="font-bold text-lg" style={{ color: item.color }}>{stat.value}</p>
            <p className="font-mono text-xs text-slate-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <ul className="space-y-2">
        {item.points.map((pt, i) => (
          <li key={i} className="flex gap-3 text-sm text-slate-muted leading-relaxed">
            <span style={{ color: item.color }} className="mt-1 shrink-0">▹</span>
            <span>{pt}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function Service() {
  return (
    <section id="service" className="section bg-navy-darkest relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <SectionHeader
          number="05. Service"
          title="Giving Back"
          subtitle="350+ volunteer hours across three continents"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {service.map((item, i) => (
            <ServiceCard key={item.org} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
