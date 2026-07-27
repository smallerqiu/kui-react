import { Grid, GridItem } from "../index";
import "./demo.css";
export default function Basic() {
  return (
    <Grid cols={{ xs: 1, md: 2, lg: 4 }} xGap={16} yGap={16}>
      <GridItem span={2}>
        <div className="grid-demo-box">Occupies 2 columns</div>
      </GridItem>
      <GridItem offset={1}>
        <div className="grid-demo-box">Offset by 1 column</div>
      </GridItem>
      <GridItem suffix>
        <div className="grid-demo-box">Always at the end</div>
      </GridItem>
    </Grid>
  );
}
