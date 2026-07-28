import { Grid, GridItem } from "react-kui";
export default function App() {
  return (
    <Grid cols={12} rows={8} style={{ height: 400, background: "var(--kui-color-bg-5)" }}>
      <GridItem
        span={12}
        rowSpan={8}
        style={{
          gridColumnStart: 1,
          gridRowStart: 1,
          background: "linear-gradient(135deg,#1769aa,#8e54e9)",
        }}
      />
      <GridItem
        span={{ xs: 10, md: 6 }}
        rowSpan={4}
        style={{
          gridColumn: "2 / span 10",
          gridRowStart: 3,
          background: "color-mix(in srgb,var(--kui-color-bg-3) 88%,transparent)",
          zIndex: 1,
          padding: 20,
        }}
      >
        <h1>Commercial-grade advertising slogan</h1>
        <p>Grid layering without extensive absolute positioning.</p>
      </GridItem>
    </Grid>
  );
}
