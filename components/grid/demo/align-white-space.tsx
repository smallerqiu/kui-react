import { Grid, GridItem } from "react-kui";
export default function App() {
  return (
    <Grid cols={{ xs: 1, sm: 2, lg: 3, xxl: 4 }} xGap={32} yGap={16}>
      <GridItem>
        <label>Order Numbers：</label>
        <span>20240501001</span>
      </GridItem>
      <GridItem>
        <label>状态：</label>
        <span className="status-tag">已发货</span>
      </GridItem>
      <GridItem span={{ xs: 1, lg: 2 }}>
        <label>Shipping Address：</label>
        <span>上海市浦东新区某某路 999 号某某大厦 B 座 12 楼</span>
      </GridItem>
      <GridItem>
        <label>更新时间：</label>
        <span>2024-05-01 12:00</span>
      </GridItem>
    </Grid>
  );
}
