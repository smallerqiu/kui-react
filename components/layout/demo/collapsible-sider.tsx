import { useState } from "react";
import { Button, Content, Footer, Header, Layout, Sider } from "react-kui";

export default function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <Layout className="layout-demo-frame">
        <Sider collapsed={collapsed} collapsible>
          <span className="sider-label">
            <span className={collapsed ? "hidden" : undefined}>Sider</span>
            <span className={!collapsed ? "hidden" : undefined}>S</span>
          </span>
        </Sider>
        <Layout>
          <Header>
            <Button size="small" onClick={() => setCollapsed((value) => !value)}>
              {collapsed ? "Expand" : "Collapse"}
            </Button>
          </Header>
          <Content>Content</Content>
          <Footer>Footer</Footer>
        </Layout>
      </Layout>
      <style>{`
        .layout-demo-frame { height: 320px; overflow: hidden; text-align: center; }
        .layout-demo-frame .k-layout-header,
        .layout-demo-frame .k-layout-footer { padding: 16px; background: var(--kui-color-bg-3); }
        .layout-demo-frame .k-layout-sider { display: grid; place-items: center; background: var(--kui-color-bg-4); }
        .layout-demo-frame .sider-label { display: grid; place-items: center; }
        .layout-demo-frame .sider-label > span { grid-area: 1 / 1; transition: opacity var(--kui-motion-duration) var(--kui-motion-easing); }
        .layout-demo-frame .sider-label > .hidden { opacity: 0; }
        .layout-demo-frame .k-layout-content { display: grid; place-items: center; background: var(--kui-color-bg-2); }
      `}</style>
    </>
  );
}
