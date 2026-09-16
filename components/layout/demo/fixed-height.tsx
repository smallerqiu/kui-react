import { Content, Footer, Header, Layout, Sider } from "react-kui";

export default function App() {
  return (
    <>
      <Layout className="fixed-layout">
        <Header>Fixed-height Layout</Header>
        <Layout className="fixed-layout-body">
          <Sider width={140}>Sider</Sider>
          <Content>
            {Array.from({ length: 20 }, (_, index) => (
              <p key={index}>Scrollable content {index + 1}</p>
            ))}
          </Content>
        </Layout>
        <Footer>Footer</Footer>
      </Layout>
      <style>{`
        .fixed-layout { height: 360px; overflow: hidden; }
        .fixed-layout > .k-layout-header,
        .fixed-layout > .k-layout-footer { flex: none; padding: 16px 24px; background: var(--kui-color-bg-3); }
        .fixed-layout .k-layout-sider { display: grid; place-items: center; background: var(--kui-color-bg-4); }
        .fixed-layout .fixed-layout-body { min-height: 0; }
        .fixed-layout .k-layout-content { min-height: 0; overflow: auto; padding: 8px 24px; background: var(--kui-color-bg-2); }
      `}</style>
    </>
  );
}
