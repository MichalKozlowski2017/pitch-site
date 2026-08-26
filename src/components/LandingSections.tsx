import type { ClientConfig } from "@/lib/client-config";
import { renderLandingSlots } from "@/components/registry";
import { LandingMotion } from "@/components/motion/LandingMotion";

export function LandingSections({ client }: { client: ClientConfig }) {
  const slots = renderLandingSlots(client);

  return (
    <>
      <LandingMotion />
      {slots.map(({ slot, Component }) => (
        <Component key={slot} client={client} />
      ))}
    </>
  );
}
