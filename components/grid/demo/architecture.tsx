import type { CSSProperties } from "react";
import {
  Button,
  Card,
  Col,
  Content,
  Footer,
  Grid,
  GridItem,
  Header,
  Layout,
  Row,
  Sider,
  StatCard,
} from "react-kui";

const chartStyle: CSSProperties = {
  background: "var(--kui-color-bg-component)",
  height: "100%",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
  boxSizing: "border-box",
};

const tableStyle: CSSProperties = {
  ...chartStyle,
  borderRadius: 8,
  padding: 20,
  minHeight: 300,
  border: "1px solid var(--kui-color-border)",
};

export default function App() {
  return (
    <Layout style={{ height: "100vh", background: "var(--kui-color-bg-container)" }}>
      <Sider style={{ width: 200, background: "var(--kui-color-bg-layout)", padding: 20 }}>
        Sider Menu
      </Sider>

      <Content style={{ overflowY: "auto" }}>
        <Layout>
          <Header
            style={{
              height: 64,
              background: "var(--kui-color-bg-1)",
              display: "flex",
              alignItems: "center",
              padding: "10px 24px",
              boxShadow: "0 1px 4px rgba(0, 0, 0, 0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <span>控制台 / 实时监控</span>
              <div style={{ display: "flex", gap: 12 }}>
                <Button>刷新数据</Button>
                <Button className="primary">导出报告</Button>
              </div>
            </div>
          </Header>

          <Content style={{ padding: 24, flex: 1 }}>
            <h2 style={{ fontSize: 18, marginBottom: 16, fontWeight: 600 }}>
              核心指标 (Grid 布局)
            </h2>
            <Grid
              cols={{ xs: 2, md: 4, xl: 6 }}
              xGap={16}
              yGap={16}
              autoRows="140px"
              style={{ gridAutoFlow: "dense", marginBottom: 32 }}
            >
              <GridItem span={{ xs: 2, md: 4, xl: 4 }} rowSpan={3}>
                <div
                  style={{
                    ...chartStyle,
                    borderRadius: 8,
                    padding: 20,
                    border: "1px dashed var(--kui-color-primary)",
                  }}
                >
                  实时流量趋势 (大块)
                </div>
              </GridItem>

              {Array.from({ length: 4 }, (_, index) => (
                <GridItem key={index} span={{ xs: 1, md: 2, xl: 2 }} rowSpan={1}>
                  <StatCard
                    title={`📈 指标 ${index + 1}`}
                    items={[{ value: 1235 + index }]}
                    style={{ height: "100%" }}
                  />
                </GridItem>
              ))}

              <GridItem span={{ xs: 2, md: 2, xl: 2 }} rowSpan={2}>
                <Card title="动态更新" style={{ height: "100%" }} />
                <div style={chartStyle}>动态更新</div>
              </GridItem>
            </Grid>

            <h2 style={{ fontSize: 18, marginBottom: 16, fontWeight: 600 }}>
              详细列表 (Row/Col 布局)
            </h2>
            <Row gutter={16}>
              <Col span={16}>
                <div style={tableStyle}>主要数据表格 (占 2/3)</div>
              </Col>
              <Col span={8}>
                <div style={tableStyle}>辅助操作面板 (占 1/3)</div>
              </Col>
            </Row>
          </Content>

          <Footer
            style={{ textAlign: "center", padding: 24, color: "var(--kui-color-text-description)" }}
          >
            ©2026 Grid Layout Pro
          </Footer>
        </Layout>
      </Content>
    </Layout>
  );
}
