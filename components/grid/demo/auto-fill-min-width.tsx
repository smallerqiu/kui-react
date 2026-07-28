import { Grid, GridItem } from "react-kui";
import "./demo.css";
export default function App() {
  return (
    <Grid itemMinWidth={256} xGap={16} yGap={16}>
      {Array.from({ length: 7 }, (_, i) => (
        <GridItem key={i} className="grid-demo-box">
          Card {i + 1} (Minimum 256px)
        </GridItem>
      ))}
    </Grid>
  );
}
