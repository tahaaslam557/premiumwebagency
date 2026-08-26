import { SectionHeader } from "@/components/ui/SectionHeader";
import { PricingTables } from "./PricingTables";
import { offer } from "@/data/site";

/**
 * The homepage's pricing section: numbered header, then the shared explorer.
 *
 * The tables themselves live in <PricingTables> so the /pricing route can
 * render the same thing under its own opener. Nothing about what is drawn
 * here changed when they moved.
 */
export function Pricing() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="relative border-t border-line bg-void py-28 lg:py-36"
    >
      <div className="page">
        <SectionHeader
          titleId="pricing-heading"
          index="09"
          eyebrow="Packages"
          title={"Priced in\nthe open."}
          description={
            <>
              Every package Premium Web Agency publishes, with its current pricing.{" "}
              {offer.active ? (
                <span className="text-bone-dim">
                  Promotional pricing ({offer.headline}) is already applied below.
                </span>
              ) : null}
            </>
          }
        />

        <PricingTables className="mt-14" />
      </div>
    </section>
  );
}
