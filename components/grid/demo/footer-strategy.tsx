import { Grid, GridItem } from "react-kui";
export default function App() {
  return (
    <Grid cols={{ xs: 1, sm: 2, md: 5 }} yGap={30}>
      <GridItem span={{ xs: 1, md: 2 }}>
        <h3>公司品牌 Logo</h3>
        <p>致力于提供全球领先的 Grid 解决方案。</p>
      </GridItem>
      <GridItem>
        <h4>产品</h4>
        <ul>
          <li>功能 1</li>
          <li>功能 2</li>
        </ul>
      </GridItem>
      <GridItem>
        <h4>支持</h4>
        <ul>
          <li>文档</li>
          <li>社区</li>
        </ul>
      </GridItem>
      <GridItem>
        <h4>联系我们</h4>
        <div className="social-icons">...</div>
      </GridItem>
    </Grid>
  );
}
