import type { SectionProps } from "@/lib/client-config";
import { Container, SectionHeading } from "@/components/shared/ui";
import { ServiceBentoCard } from "@/components/services/ServiceBentoCard";

/** Bento cell spans for 4–6 service items (mobile stacks, lg = 4-col grid). */
function bentoCellClass(index: number, highlightIndex: number, total: number) {
  if (index === highlightIndex) {
    return "sm:col-span-2 sm:row-span-2 lg:min-h-[18rem]";
  }
  if (total === 6 && index === 5) {
    return "sm:col-span-2 lg:col-span-2";
  }
  if (total === 5 && index === 4) {
    return "sm:col-span-2 lg:col-span-2";
  }
  return "";
}

export function ServicesBento({ client }: SectionProps) {
  const { services } = client;
  const highlightIndex = services.items.findIndex((item) => item.highlight);
  const featuredIndex = highlightIndex >= 0 ? highlightIndex : 0;
  const total = services.items.length;

  return (
    <section
      id="uslugi"
      data-reveal-group
      data-services-section
      className="bg-[var(--color-background)] py-16 sm:py-24"
    >
      <Container>
        <SectionHeading title={services.title} subtitle={services.subtitle} />
        <div
          data-services-grid
          data-services-bento
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:auto-rows-[minmax(9.5rem,auto)] lg:grid-cols-4 lg:gap-4 lg:auto-rows-[minmax(10rem,auto)]"
          style={{ perspective: "1100px" }}
        >
          {services.items.map((service, index) => {
            const isFeatured = index === featuredIndex;

            return (
              <ServiceBentoCard
                key={service.title}
                service={service}
                index={index}
                isFeatured={isFeatured}
                className={`${bentoCellClass(index, featuredIndex, total)} ${
                  isFeatured
                    ? "min-h-[14rem] sm:min-h-0"
                    : "min-h-[10.5rem]"
                }`}
              />
            );
          })}
        </div>
      </Container>
    </section>
  );
}
