import type { Metadata } from "next";
import { LandingSections } from "@/components/LandingSections";
import { BooksyRoot } from "@/components/booksy/BooksyRoot";
import { MobileBottomDock } from "@/components/shared/MobileBottomDock";
import { PitchBadge } from "@/components/shared/PitchBadge";
import { loadClientConfig } from "@/lib/load-client-config";

export function generateMetadata(): Metadata {
  const client = loadClientConfig();
  return {
    title: client.seo.title,
    description: client.seo.description,
  };
}

export default function HomePage() {
  const client = loadClientConfig();

  return (
    <>
      <div
        className={
          client.pitch.enabled ? "pb-[4.5rem] md:pb-28" : "pb-[3.25rem] md:pb-0"
        }
      >
        <LandingSections client={client} />
      </div>
      <MobileBottomDock client={client} />
      <PitchBadge client={client} />
      <BooksyRoot booksy={client.booksy} />
    </>
  );
}
