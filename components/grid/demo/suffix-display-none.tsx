import { Button, Grid, GridItem } from "react-kui";
import "./demo.css";
export default function SuffixDisplay() {
  return (
    <Grid cols={{ xs: 2, md: 6 }} xGap={8}>
      <GridItem span={2}>
        <input className="grid-demo-input" placeholder="Search keywords..." />
      </GridItem>
      <GridItem span={{ xs: 0, md: 2 }}>
        <select className="grid-demo-input">
          <option>Filter</option>
        </select>
      </GridItem>
      <GridItem suffix>
        <Button>Query</Button>
      </GridItem>
    </Grid>
  );
}
