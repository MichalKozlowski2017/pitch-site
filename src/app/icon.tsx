import { ImageResponse } from "next/og";
import { FaviconMark } from "@/lib/favicon-mark";
import { loadClientConfig } from "@/lib/load-client-config";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  const client = loadClientConfig();

  return new ImageResponse(
    <FaviconMark client={client} fontSize={20} borderRadius={6} />,
    size,
  );
}
