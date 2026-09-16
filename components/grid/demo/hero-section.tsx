import { Grid, GridItem } from "react-kui";
export default function App() {
  return (
    <Grid cols={12} rows={8} style={{ height: 400, background: "var(--kui-color-bg-5)" }}>
      <GridItem span={12} rowSpan={8} columnStart={1} rowStart={1}>
        <div
          style={{
            width: "100%",
            height: "100%",
            background:
              "radial-gradient(circle at 75% 25%, var(--kui-color-primary), transparent 35%), linear-gradient(135deg, var(--kui-color-bg-3), var(--kui-color-bg-5))",
          }}
        />
      </GridItem>
      <GridItem
        span={{ xs: 10, md: 6 }}
        rowSpan={4}
        columnStart={{ xs: 2, md: 4 }}
        rowStart={3}
        style={{
          background: "var(--kui-color-bg-3)",
          zIndex: 1,
          padding: 20,
        }}
      >
        <h1>Commercial-grade advertising slogan</h1>
        <p>Grid 布局让叠加效果变得简单，无需大量 absolute 定位。</p>
      </GridItem>
    </Grid>
  );
}
