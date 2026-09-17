import { useState, type CSSProperties } from "react";
import { Button, Content, Footer, Header, Layout, Sider } from "react-kui";

const styles = {
  layout: { height: 320, overflow: "hidden", textAlign: "center" },
  headerFooter: { padding: 16, background: "var(--kui-color-bg-3)" },
  sider: { display: "grid", placeItems: "center", background: "var(--kui-color-bg-4)" },
  label: { display: "grid", placeItems: "center" },
  labelText: {
    gridArea: "1 / 1",
    transition: "opacity var(--kui-motion-duration) var(--kui-motion-easing)",
  },
  content: { display: "grid", placeItems: "center", background: "var(--kui-color-bg-2)" },
} satisfies Record<string, CSSProperties>;

export default function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={styles.layout}>
      <Sider collapsed={collapsed} collapsible style={styles.sider}>
        <span style={styles.label}>
          <span style={{ ...styles.labelText, opacity: collapsed ? 0 : 1 }}>Sider</span>
          <span style={{ ...styles.labelText, opacity: collapsed ? 1 : 0 }}>S</span>
        </span>
      </Sider>
      <Layout>
        <Header style={styles.headerFooter}>
          <Button size="small" onClick={() => setCollapsed((value) => !value)}>
            {collapsed ? "Expand" : "Collapse"}
          </Button>
        </Header>
        <Content style={styles.content}>Content</Content>
        <Footer style={styles.headerFooter}>Footer</Footer>
      </Layout>
    </Layout>
  );
}
