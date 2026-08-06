import { Grid, GridItem } from "react-kui";
const boxStyle = {
  padding: 8,
  fontSize: 12,
  background: "var(--kui-color-bg-3)",
};
export default function App() {
  return (
    <Grid cols={{ xs: 1, md: 2, lg: 4 }} xGap={16} yGap={16}>
      <GridItem span={2}>
        <div style={boxStyle}>Occupies 2 columns</div>
      </GridItem>
      <GridItem offset={1}>
        <div style={boxStyle}>Offset by 1 column</div>
      </GridItem>
      <GridItem suffix>
        <div style={boxStyle}>Always at the end</div>
      </GridItem>
    </Grid>
  );
}
