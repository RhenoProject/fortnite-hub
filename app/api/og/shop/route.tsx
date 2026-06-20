import { ImageResponse } from "next/og";
import { fetchShop, rarityColors } from "@/lib/shopApi";

export async function GET() {
  try {
    const entries = await fetchShop();

    // Featured first (already sorted by rarity in fetchShop)
    const featured = entries.filter((e) => e.featured);
    const others = entries.filter((e) => !e.featured);
    const items = [...featured, ...others].slice(0, 6);

    const now = new Date(Date.now() + 9 * 60 * 60 * 1000);
    const dateStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")}`;
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dateLabel = `${dateStr} (${weekdays[now.getDay()]})`;

    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            background: "linear-gradient(160deg, #001428 0%, #003060 55%, #001428 100%)",
            display: "flex",
            flexDirection: "column",
            padding: "28px 32px 18px 32px",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "12px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <div
                style={{
                  color: "#00c8ff",
                  fontSize: "18px",
                  fontWeight: "bold",
                  letterSpacing: "0.08em",
                  display: "flex",
                }}
              >
                FORTNITE HUB
              </div>
              <div
                style={{
                  color: "white",
                  fontSize: "30px",
                  fontWeight: "bold",
                  display: "flex",
                }}
              >
                Today&apos;s Item Shop
              </div>
            </div>
            <div
              style={{
                color: "#7799bb",
                fontSize: "17px",
                display: "flex",
                paddingBottom: "4px",
              }}
            >
              {dateLabel}
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              height: "2px",
              background: "linear-gradient(90deg, #00c8ff88, #00c8ff22)",
              marginBottom: "14px",
              display: "flex",
            }}
          />

          {/* Items Row */}
          <div style={{ display: "flex", flex: "1", gap: "11px", alignItems: "stretch" }}>
            {items.map((item) => {
              const borderColor = rarityColors[item.rarity] ?? "#444466";
              return (
                <div
                  key={item.id}
                  style={{
                    flex: "1",
                    background: "rgba(0, 8, 24, 0.78)",
                    borderRadius: "14px",
                    border: `2px solid ${borderColor}`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "10px 6px 8px 6px",
                    boxShadow: `0 0 16px ${borderColor}33`,
                  }}
                >
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      width={154}
                      height={154}
                      style={{ objectFit: "contain", borderRadius: "8px" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 154,
                        height: 154,
                        background: "#112",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#445",
                        fontSize: "12px",
                      }}
                    >
                      No image
                    </div>
                  )}
                  <div
                    style={{
                      color: "#ddeeff",
                      fontSize: "12px",
                      marginTop: "8px",
                      display: "flex",
                      width: "100%",
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                  >
                    {item.name.length > 13 ? `${item.name.slice(0, 12)}…` : item.name}
                  </div>
                  <div
                    style={{
                      color: borderColor,
                      fontSize: "15px",
                      fontWeight: "bold",
                      marginTop: "4px",
                      display: "flex",
                    }}
                  >
                    {item.price > 0 ? `${item.price.toLocaleString()} V` : "FREE"}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "14px",
              color: "#334455",
              fontSize: "13px",
              gap: "18px",
            }}
          >
            <div style={{ display: "flex", color: "#00c8ff55" }}>
              Push Notifications Available
            </div>
            <div style={{ display: "flex", color: "#223" }}>|</div>
            <div style={{ display: "flex", color: "#556677" }}>
              fortnite-hub-delta.vercel.app
            </div>
            <div style={{ display: "flex", color: "#223" }}>|</div>
            <div style={{ display: "flex", color: "#00c8ff55" }}>
              Updated daily at 9:00 AM JST
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch (e) {
    return new Response(`OG image error: ${String(e)}`, { status: 500 });
  }
}
