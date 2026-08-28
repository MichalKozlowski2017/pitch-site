import { ImageResponse } from "next/og";
import { FaviconMark } from "@/lib/favicon-mark";
import { loadClientConfig } from "@/lib/load-client-config";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const client = loadClientConfig();

  return new ImageResponse(
    <FaviconMark client={client} fontSize={96} borderRadius={40} />,
    size,
  );
}
