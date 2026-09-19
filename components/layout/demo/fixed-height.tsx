import type { CSSProperties } from "react";
import { Content, Footer, Header, Layout, Sider } from "react-kui";

const styles = {
  layout: { height: 360, overflow: "hidden" },
  headerFooter: { flex: "none", padding: "16px 24px", background: "var(--kui-color-bg-3)" },
  sider: { display: "grid", placeItems: "center", background: "var(--kui-color-bg-4)" },
  body: { minHeight: 0 },
  content: {
    minHeight: 0,
    overflow: "auto",
    padding: "8px 24px",
    background: "var(--kui-color-bg-2)",
  },
} satisfies Record<string, CSSProperties>;

export default function App() {
  return (
    <Layout style={styles.layout}>
      <Header style={styles.headerFooter}>Fixed-height Layout</Header>
      <Layout style={styles.body}>
        <Sider width={140} style={styles.sider}>
          Sider
        </Sider>
        <Content style={styles.content}>
          {Array.from({ length: 20 }, (_, index) => (
            <p key={index}>Scrollable content {index + 1}</p>
          ))}
        </Content>
      </Layout>
      <Footer style={styles.headerFooter}>Footer</Footer>
    </Layout>
  );
}
