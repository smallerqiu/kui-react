import { Grid, GridItem } from "react-kui";
import "./demo.css";
export default function App() {
  return (
    <Grid cols={{ xs: 1, md: 4, xl: 6 }} xGap={20} yGap={20}>
      <GridItem span={{ xs: 1, md: 2, xl: 1 }}>
        <input className="grid-demo-input" placeholder="Project name" />
      </GridItem>
      <GridItem span={{ xs: 1, md: 2 }}>
        <input className="grid-demo-input" placeholder="Person in charge" />
      </GridItem>
      <GridItem span={{ md: 2 }} offset={{ md: 1 }}>
        <input className="grid-demo-input" placeholder="Remark" />
      </GridItem>
    </Grid>
  );
}
