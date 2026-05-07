import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Tagline from "@/components/Tagline";
import Experience from "@/components/Experience";
import Publications from "@/components/Publications";
import Awards from "@/components/Awards";
import Service from "@/components/Service";
import Athletics from "@/components/Athletics";
import Contact from "@/components/Contact";
import dynamic from "next/dynamic";

const KoenigseggIntro = dynamic(() => import("@/components/KoenigseggIntro"), {
  ssr: false,
});

export default function Home() {
  return (
    <main>
      <KoenigseggIntro />
      <Nav />
      <Hero />
      <Tagline />
      <Experience />
      <Publications />
      <Awards />
      <Service />
      <Athletics />
      <Contact />
    </main>
  );
}
