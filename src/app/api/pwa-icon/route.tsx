import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const size = parseInt(req.nextUrl.searchParams.get("size") ?? "192");
  const radius = Math.round(size * 0.2);
  const fontSize = Math.round(size * 0.55);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #7B6EF6 0%, #2DD4BF 100%)",
          borderRadius: `${radius}px`,
          fontSize,
          fontWeight: 700,
          color: "white",
          letterSpacing: "-4px",
        }}
      >
        FF
      </div>
    ),
    { width: size, height: size }
  );
}
