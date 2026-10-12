import About from "@/components/home/About";
import Contact from "@/components/home/Contact";
import Hero from "@/components/home/Hero";
import Projects from "@/components/home/Projects";

export default function HomePage() {
  return (
    <main id="main">
      <Hero />
      <About />
      <Projects />
      <Contact />
    </main>
  );
}
