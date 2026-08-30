import type { ClientConfig } from "@/lib/client-config";
import { renderLandingSlots } from "@/components/registry";
import { BooksyBookingStrip } from "@/components/booksy/BooksyBookingStrip";
import { LandingMotion } from "@/components/motion/LandingMotion";
import { Fragment } from "react";

export function LandingSections({ client }: { client: ClientConfig }) {
  const slots = renderLandingSlots(client);

  return (
    <>
      <LandingMotion />
      {slots.map(({ slot, Component }) => (
        <Fragment key={slot}>
          <Component client={client} />
          {slot === "hero" && client.booksy ? (
            <BooksyBookingStrip client={client} />
          ) : null}
        </Fragment>
      ))}
    </>
  );
}
