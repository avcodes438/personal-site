"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionHeader from "./SectionHeader";

const publications = [
  {
    journal: "Scientific Culture",
    date: "October 2025",
    title:
      "Functional and Ethical Modeling of Non-Newtonian Hemodynamics in Aneurysmal and Bifurcated Vessels Using Physics-Informed Neural Networks",
    index: "01",
  },
  {
    journal: "International Journal of Medical and Pharmaceutical Research",
    date: "December 2025",
    title:
      "Hybrid PINNs with Experimental Data for Real-Time Hemodynamic Prediction and Clinical Decision Support",
    index: "02",
  },
  {
    journal: "Journal of Pharmacy and Bioallied Sciences",
    date: "December 2025",
    title:
      "Physics-Informed Neural Network–Based Pulsatile Flow Modelling and Targeted Drug Delivery Optimization in Computational Hemodynamics",
    index: "03",
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
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="font-mono text-xs text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
              {pub.journal}
            </span>
            <span className="font-mono text-xs text-slate-muted">{pub.date}</span>
          </div>
          <h3 className="text-slate-light font-medium leading-relaxed italic">
            &ldquo;{pub.title}&rdquo;
          </h3>
          <p className="font-mono text-xs text-teal mt-3">Sole Author</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Publications() {
  return (
    <section className="section bg-navy-dark relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-72 h-72 bg-teal/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <SectionHeader
          number="02. Publications"
          title="Peer-Reviewed Research"
          subtitle="Sole author on all three publications"
        />

        <div className="space-y-5">
          {publications.map((pub, i) => (
            <PubCard key={pub.index} pub={pub} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
