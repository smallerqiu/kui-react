import type { CSSProperties } from "react";
import { Grid, GridItem } from "react-kui";

const itemStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 8,
};

export default function App() {
  return (
    <Grid
      cols={4}
      rows="auto 1fr auto"
      style={{
        height: 500,
        border: "1px solid var(--kui-color-border)",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <GridItem span={4} style={{ ...itemStyle, height: 50, background: "var(--kui-color-bg-3)" }}>
        Header (100% Width)
      </GridItem>
      <GridItem span={1} rowSpan={1} style={{ ...itemStyle, background: "var(--kui-color-bg-4)" }}>
        Menu
      </GridItem>
      <GridItem span={3} style={{ ...itemStyle, background: "var(--kui-color-bg-2)" }}>
        Main Content (Auto Height)
      </GridItem>
      <GridItem span={4} style={{ ...itemStyle, height: 50, background: "var(--kui-color-bg-3)" }}>
        Footer
      </GridItem>
    </Grid>
  );
}
