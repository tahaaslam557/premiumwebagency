import { Navbar } from "@/components/navigation/Navbar";
import { Hero } from "@/components/hero/Hero";
import { Manifesto } from "@/components/ai/Manifesto";
import { CapabilityStack } from "@/components/capabilities/CapabilityStack";
import { IntelligenceCore } from "@/components/intelligence/IntelligenceCore";
import { Work } from "@/components/portfolio/Work";
import { Metrics } from "@/components/metrics/Metrics";
import { ClientNetwork } from "@/components/clients/ClientNetwork";
import { Methodology } from "@/components/methodology/Methodology";
import { Pricing } from "@/components/pricing/Pricing";
import { Conversion } from "@/components/contact/Conversion";
import { Contact } from "@/components/contact/Contact";
import { Footer } from "@/components/footer/Footer";

/**
 * Section order is the film's edit. It alternates deliberately between
 * typography, 3D, image, data and whitespace so nothing reads as a card list:
 * hero (3D) → statement (type) → stack (interaction) → engine (3D) →
 * work (image) → proof (data) → network (diagram) → method (scroll) →
 * pricing (data) → conversion (interaction) → contact (form).
 */
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <Manifesto />
        <CapabilityStack />
        <IntelligenceCore />
        <Work />
        <Metrics />
        <ClientNetwork />
        <Methodology />
        <Pricing />
        <Conversion />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
