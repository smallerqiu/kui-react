import { Content, Footer, Header, Layout, Sider } from "react-kui";

export default function App() {
  return (
    <>
      <Layout className="nested-layout">
        <Header>Header</Header>
        <Layout>
          <Sider width={120}>Left Sider</Sider>
          <Layout>
            <Content>Content</Content>
            <Footer>Inner Footer</Footer>
          </Layout>
          <Sider width={120}>Right Sider</Sider>
        </Layout>
      </Layout>
      <style>{`
        .nested-layout { height: 320px; overflow: hidden; text-align: center; }
        .nested-layout .k-layout-header,
        .nested-layout .k-layout-footer { padding: 16px; background: var(--kui-color-bg-3); }
        .nested-layout .k-layout-sider { display: grid; place-items: center; background: var(--kui-color-bg-4); }
        .nested-layout .k-layout-content { display: grid; place-items: center; background: var(--kui-color-bg-2); }
      `}</style>
    </>
  );
}
