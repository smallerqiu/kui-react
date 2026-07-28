import { Grid, GridItem } from "react-kui";
export default function App() {
  return (
    <Grid cols={{ xs: 1, sm: 2, lg: 3, xxl: 4 }} xGap={32} yGap={16}>
      <GridItem>
        <b>Order Number: </b>20240501001
      </GridItem>
      <GridItem>
        <b>Status: </b>
        <span>Shipped</span>
      </GridItem>
      <GridItem span={{ xs: 1, lg: 2 }}>
        <b>Shipping Address: </b>Shanghai Pudong New Area, Building B
      </GridItem>
      <GridItem>
        <b>Updated: </b>2024-05-01 12:00
      </GridItem>
    </Grid>
  );
}
