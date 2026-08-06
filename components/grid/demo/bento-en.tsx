import type { CSSProperties } from "react";
import { Grid, GridItem } from "react-kui";

interface Feature {
  id: number;
  title: string;
  desc: string;
  span: { xs: number; md: number; xl: number };
  rowSpan: number;
  color: string;
  textColor?: string;
  border?: string;
}

const features: Feature[] = [
  {
    id: 1,
    title: "Self-developed M3 Max Chip",
    desc: "Unparalleled computing power to effortlessly handle professional workflows.",
    span: { xs: 2, md: 3, xl: 4 },
    rowSpan: 3,
    color: "var(--kui-color-bg-4)",
    textColor: "#fff",
  },
  {
    id: 2,
    title: "Extended Battery Life",
    desc: "Up to 22 hours of video playback.",
    span: { xs: 1, md: 3, xl: 2 },
    rowSpan: 2,
    color: "#f5f5f7",
  },
  {
    id: 3,
    title: "5G Ultra High Speed",
    desc: "Enjoy lightning-fast speeds anytime, anywhere.",
    span: { xs: 1, md: 3, xl: 2 },
    rowSpan: 1,
    color: "#e8e8ed",
  },
  {
    id: 4,
    title: "Retina Display",
    desc: "Vibrant colors, every detail revealed.",
    span: { xs: 2, md: 3, xl: 4 },
    rowSpan: 2,
    color: "#fff",
    border: "1px solid var(--kui-color-border)",
  },
  {
    id: 5,
    title: "Privacy Protection",
    desc: "Your data, under your control.",
    span: { xs: 1, md: 3, xl: 2 },
    rowSpan: 2,
    color: "#f2f2f2",
  },
  {
    id: 6,
    title: "Multi-Device Collaboration",
    desc: "Seamless connection, double the efficiency.",
    span: { xs: 1, md: 3, xl: 2 },
    rowSpan: 1,
    color: "#fafafa",
  },
];

const cardStyle: CSSProperties = {
  height: "100%",
  borderRadius: 24,
  padding: 32,
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  transition: "transform 0.2s ease-in-out",
  cursor: "pointer",
};

export default function App() {
  return (
    <div style={{ padding: "40px 20px", maxWidth: "100%", margin: "0 auto" }}>
      <h1
        style={{
          marginBottom: 32,
          fontWeight: 600,
          fontSize: "2rem",
          color: "var(--kui-color-text)",
        }}
      >
        Technical Specifications Matrix
      </h1>

      <Grid
        cols={{ xs: 2, md: 6, xl: 8 }}
        xGap={20}
        yGap={20}
        autoRows="120px"
        style={{ gridAutoFlow: "dense" }}
      >
        {features.map((item) => (
          <GridItem key={item.id} span={item.span} rowSpan={item.rowSpan}>
            <div
              style={{
                ...cardStyle,
                backgroundColor: item.color,
                color: item.textColor || "#333",
                border: item.border || "none",
              }}
              onMouseEnter={(event) => (event.currentTarget.style.transform = "scale(0.99)")}
              onMouseLeave={(event) => (event.currentTarget.style.transform = "")}
            >
              <div>
                <h3 style={{ fontSize: "1.5rem", margin: "0 0 8px 0", fontWeight: 600 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "1rem", opacity: 0.7, margin: 0, lineHeight: 1.4 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          </GridItem>
        ))}

        <GridItem suffix span={{ xs: 2, md: 3, xl: 2 }}>
          <div
            style={{
              background: "var(--kui-color-primary)",
              color: "#fff",
              borderRadius: 24,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.1rem",
              fontWeight: 500,
              padding: 32,
              boxSizing: "border-box",
              cursor: "pointer",
            }}
          >
            <span>Learn more parameters →</span>
          </div>
        </GridItem>
      </Grid>
    </div>
  );
}
