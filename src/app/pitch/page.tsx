import type { Metadata } from "next";
import { PitchOfferView } from "@/components/pitch/PitchOfferView";
import { loadClientConfig } from "@/lib/load-client-config";

export function generateMetadata(): Metadata {
  const client = loadClientConfig();
  return {
    title: `Oferta wdrożenia — ${client.business.name}`,
    description: client.pitch.offerBody ?? client.seo.description,
    robots: { index: false, follow: false },
  };
}

export default function PitchPage() {
  const client = loadClientConfig();
  return <PitchOfferView client={client} />;
}
