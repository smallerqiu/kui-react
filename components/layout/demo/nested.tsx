import type { CSSProperties } from "react";
import { Content, Footer, Header, Layout, Sider } from "react-kui";

const styles = {
  layout: { height: 320, overflow: "hidden", textAlign: "center" },
  headerFooter: { padding: 16, background: "var(--kui-color-bg-3)" },
  sider: { display: "grid", placeItems: "center", background: "var(--kui-color-bg-4)" },
  content: { display: "grid", placeItems: "center", background: "var(--kui-color-bg-2)" },
} satisfies Record<string, CSSProperties>;

export default function App() {
  return (
    <Layout style={styles.layout}>
      <Header style={styles.headerFooter}>Header</Header>
      <Layout>
        <Sider width={120} style={styles.sider}>
          Left Sider
        </Sider>
        <Layout>
          <Content style={styles.content}>Content</Content>
          <Footer style={styles.headerFooter}>Inner Footer</Footer>
        </Layout>
        <Sider width={120} style={styles.sider}>
          Right Sider
        </Sider>
      </Layout>
    </Layout>
  );
}
