import { Hero } from "@/components/landing/hero";
import { AboutSofia } from "@/components/landing/about-sofia";
import { Services } from "@/components/landing/services";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <AboutSofia />
      <Services />
      <Footer />
    </main>
  );
}
