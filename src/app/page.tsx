import type { Metadata } from "next";
import { LandingSections } from "@/components/LandingSections";
import { PitchBadge } from "@/components/shared/PitchBadge";
import { StickyMobileCta } from "@/components/shared/StickyMobileCta";
import { loadClientConfig } from "@/lib/client-config";

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
          client.pitch.enabled ? "pb-44 md:pb-28" : "pb-24 md:pb-0"
        }
      >
        <LandingSections client={client} />
      </div>
      <StickyMobileCta client={client} />
      <PitchBadge client={client} />
    </>
  );
}
