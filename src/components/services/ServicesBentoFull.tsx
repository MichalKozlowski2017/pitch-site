import type { SectionProps } from "@/lib/client-config";
import { Container, SectionHeading } from "@/components/shared/ui";
import { ServiceBentoCard } from "@/components/services/ServiceBentoCard";
import { ServicesBento } from "@/components/services/ServicesBento";

/** Featured left, 2×2 right, last item full-width footer bar (6 items). */
function partitionSixItems(items: SectionProps["client"]["services"]["items"]) {
  const highlightIndex = items.findIndex((item) => item.highlight);
  const featuredIndex = highlightIndex >= 0 ? highlightIndex : 0;
  const bottomIndex = items.length - 1;

  const featured = { item: items[featuredIndex], index: featuredIndex };
  const bottom = { item: items[bottomIndex], index: bottomIndex };
  const grid = items
    .map((item, index) => ({ item, index }))
    .filter(
      ({ index }) => index !== featuredIndex && index !== bottomIndex,
    );

  return { featured, bottom, grid };
}

export function ServicesBentoFull({ client }: SectionProps) {
  const { services } = client;
  const total = services.items.length;

  if (total < 6) {
    return <ServicesBento client={client} />;
  }

  const { featured, bottom, grid } = partitionSixItems(services.items);

  return (
    <section
      id="uslugi"
      data-reveal-group
      data-services-section
      className="bg-[var(--color-background)] py-16 sm:py-24"
    >
      <Container>
        <SectionHeading title={services.title} subtitle={services.subtitle} />

        {/* Mobile / tablet: natural stack */}
        <div
          className="flex flex-col gap-3 sm:gap-4 lg:hidden"
          data-services-grid
          data-services-bento-full
          style={{ perspective: "1100px" }}
        >
          <ServiceBentoCard
            service={featured.item}
            index={featured.index}
            isFeatured
            className="min-h-[14rem]"
          />
          {grid.map(({ item, index }) => (
            <ServiceBentoCard
              key={item.title}
              service={item}
              index={index}
              className="min-h-[10.5rem]"
            />
          ))}
          <ServiceBentoCard
            service={bottom.item}
            index={bottom.index}
            className="min-h-[10.5rem]"
          />
        </div>

        {/* Desktop: featured | 2×2, then full-width footer (01→05, then 06) */}
        <div
          data-services-grid
          data-services-bento-full
          className="hidden lg:flex lg:flex-col lg:gap-4"
          style={{ perspective: "1100px" }}
        >
          <div className="grid h-[34rem] grid-cols-2 gap-4">
            <ServiceBentoCard
              service={featured.item}
              index={featured.index}
              isFeatured
              className="h-full min-h-0"
            />
            <div className="grid h-full grid-cols-2 grid-rows-2 gap-4">
              {grid.map(({ item, index }) => (
                <ServiceBentoCard
                  key={item.title}
                  service={item}
                  index={index}
                  className="h-full min-h-0"
                />
              ))}
            </div>
          </div>
          <ServiceBentoCard
            service={bottom.item}
            index={bottom.index}
            layout="wide"
          />
        </div>
      </Container>
    </section>
  );
}
