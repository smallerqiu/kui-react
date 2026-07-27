import { Button, Content, Footer, Header, Layout, Sider, Grid, GridItem } from "react-kui";
import "./demo.css";
export default function Architecture() {
  return (
    <Layout style={{ minHeight: 500 }}>
      <Sider style={{ width: 160, padding: 20, background: "var(--kui-color-bg-layout)" }}>
        Sider Menu
      </Sider>
      <Content>
        <Layout>
          <Header style={{ padding: 16, display: "flex", justifyContent: "space-between" }}>
            <span>Console / Monitor</span>
            <Button>Refresh</Button>
          </Header>
          <Content style={{ padding: 20 }}>
            <h2>Core metrics</h2>
            <Grid
              cols={{ xs: 2, md: 4, xl: 6 }}
              xGap={16}
              yGap={16}
              autoRows="100px"
              style={{ gridAutoFlow: "dense" }}
            >
              <GridItem span={{ xs: 2, md: 4, xl: 4 }} rowSpan={2}>
                <div className="grid-demo-box" style={{ height: "100%" }}>
                  Realtime traffic trend
                </div>
              </GridItem>
              {Array.from({ length: 4 }, (_, i) => (
                <GridItem key={i} span={{ xs: 1, md: 2, xl: 2 }}>
                  <div className="grid-demo-box">
                    Metric {i + 1}: {1235 + i}
                  </div>
                </GridItem>
              ))}
            </Grid>
          </Content>
          <Footer style={{ padding: 20, textAlign: "center" }}>©2026 Grid Layout</Footer>
        </Layout>
      </Content>
    </Layout>
  );
}
