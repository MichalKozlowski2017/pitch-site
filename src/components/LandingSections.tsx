import type { ClientConfig } from "@/lib/client-config";
import { renderLandingSlots } from "@/components/registry";

export function LandingSections({ client }: { client: ClientConfig }) {
  const slots = renderLandingSlots(client);

  return (
    <>
      {slots.map(({ slot, Component }) => (
        <Component key={slot} client={client} />
      ))}
    </>
  );
}
