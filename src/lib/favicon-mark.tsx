import type { ClientConfig } from "@/lib/client-config";

type FaviconMarkProps = {
  client: ClientConfig;
  fontSize: number;
  borderRadius: number | string;
};

export function FaviconMark({
  client,
  fontSize,
  borderRadius,
}: FaviconMarkProps) {
  const letter = client.business.name.trim().charAt(0).toUpperCase() || "?";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: client.theme.accent,
        borderRadius,
      }}
    >
      <div
        style={{
          fontSize,
          fontWeight: 600,
          color: client.theme.primary,
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        {letter}
      </div>
    </div>
  );
}
