import Image from "next/image";
import type { SectionProps } from "@/lib/client-config";
import { Container, SectionHeading } from "@/components/shared/ui";

export function GalleryGrid({ client }: SectionProps) {
  const { gallery } = client;
  if (gallery.items.length === 0) return null;

  return (
    <section id="realizacje" className="bg-[var(--color-surface)] py-16 sm:py-24">
      <Container>
        <SectionHeading title={gallery.title} subtitle={gallery.subtitle} />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {gallery.items.map((image) => (
            <div
              key={image.src}
              className="relative aspect-[4/3] overflow-hidden bg-[var(--color-muted)]"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition duration-500 hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
