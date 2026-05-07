"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionHeader from "./SectionHeader";

const publications = [
  {
    index: "01",
    journal: "Scientific Culture",
    impactFactor: "1.3",
    date: "October 2025",
    title:
      "Functional and Ethical Modeling of Non-Newtonian Hemodynamics in Aneurysmal and Bifurcated Vessels Using Physics-Informed Neural Networks",
  },
  {
    index: "02",
    journal: "International Journal of Medical and Pharmaceutical Research",
    impactFactor: "5.9",
    date: "December 2025",
    title:
      "Hybrid PINNs with Experimental Data for Real-Time Hemodynamic Prediction and Clinical Decision Support",
  },
  {
    index: "03",
    journal: "Journal of Pharmacy and Bioallied Sciences",
    impactFactor: "1.0",
    date: "December 2025",
    title:
      "Physics-Informed Neural Network–Based Pulsatile Flow Modelling and Targeted Drug Delivery Optimization in Computational Hemodynamics",
  },
];

function PubCard({ pub, i }: { pub: typeof publications[0]; i: number }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: i * 0.12 }}
      className="group relative glass rounded-2xl p-7 glass-hover"
    >
      <div className="flex gap-6 items-start">
        <span className="font-mono text-5xl font-bold text-gold/15 group-hover:text-gold/30 transition-colors leading-none shrink-0 select-none">
          {pub.index}
        </span>
        <div className="flex-1 min-w-0">
          {/* Journal + IF row */}
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-slate-muted">Journal Name:</span>
              <span className="font-mono text-xs text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
                {pub.journal}
              </span>
            </div>
            <span className="font-mono text-xs text-teal bg-teal/10 px-2.5 py-1 rounded-full border border-teal/20">
              IF {pub.impactFactor}
            </span>
            <span className="font-mono text-xs text-slate-muted">{pub.date}</span>
          </div>

          {/* Title */}
          <h3 className="text-slate-light font-medium leading-relaxed italic mb-3">
            &ldquo;{pub.title}&rdquo;
          </h3>

          <p className="font-mono text-xs text-teal">Sole Author</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Publications() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="publications" className="section bg-navy-dark relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-72 h-72 bg-teal/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <SectionHeader
          number="02. Publications"
          title="Peer-Reviewed Research"
          subtitle="Sole author on all three publications"
        />

        {/* Scholar + ORCID badges */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap gap-4 mb-10"
        >
          <a
            href="https://scholar.google.com/citations?user=zZgfirMAAAAJ&hl=en"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="https://img.shields.io/badge/Google%20Scholar-4285F4?style=for-the-badge&logo=googlescholar&logoColor=white"
              alt="Google Scholar"
              width={180}
              height={28}
              unoptimized
            />
          </a>
          <a
            href="https://orcid.org/0009-0002-7942-8693"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="https://img.shields.io/badge/ORCID-A6CE39?style=for-the-badge&logo=orcid&logoColor=white"
              alt="ORCID"
              width={120}
              height={28}
              unoptimized
            />
          </a>
        </motion.div>

        <div className="space-y-5">
          {publications.map((pub, i) => (
            <PubCard key={pub.index} pub={pub} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
