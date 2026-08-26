import type { Metadata } from "next";
import { LandingSections } from "@/components/LandingSections";
import { PitchBadge } from "@/components/shared/PitchBadge";
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
      <div className={client.pitch.enabled ? "pb-28" : undefined}>
        <LandingSections client={client} />
      </div>
      <PitchBadge client={client} />
    </>
  );
}
