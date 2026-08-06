import { Grid, GridItem } from "react-kui";
export default function App() {
  return (
    <Grid cols={12} rows={8} style={{ height: 400, background: "var(--kui-color-bg-5)" }}>
      <GridItem span={12} rowSpan={8} style={{ gridColumnStart: 1, gridRowStart: 1 }}>
        <img
          src="https://cdn.chuchur.com/upload/2017/kui-for-vue.jpg"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </GridItem>
      <GridItem
        span={{ xs: 10, md: 6 }}
        rowSpan={4}
        style={{
          gridColumnStart: "calc(50% - 3)",
          gridRowStart: 3,
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
