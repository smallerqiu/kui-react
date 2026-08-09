import { LogoKui } from "kui-icons";
import {
  Anchor,
  AnchorLink,
  Content,
  Header,
  Icon,
  Input,
  Layout,
  Menu,
  MenuGroup,
  MenuItem,
  Sider,
  Space,
} from "react-kui";

const styles = `
.demo-docs-layout { height: 100vh; display: flex; flex-direction: column; }
.demo-docs-layout .docs-header { background: var(--kui-color-bg); border-bottom: 1px solid var(--kui-color-border); display: flex; align-items: center; padding: 10px 0; gap: 40px; }
.demo-docs-layout .docs-menu { border: none; }
.demo-docs-layout .docs-body { flex: 1; overflow: hidden; }
.demo-docs-layout .docs-sider-left { background: var(--kui-color-bg); border-right: 1px solid var(--kui-color-border); overflow-y: auto; }
.demo-docs-layout .docs-content { background: var(--kui-color-bg-layout); overflow-y: auto; padding: 40px 60px; scroll-behavior: smooth; }
.demo-docs-layout .docs-sider-right { background: var(--kui-color-bg-container); padding: 24px 16px; }
.demo-docs-layout .code-demo-box { border: 1px solid var(--kui-color-border); height: 150px; margin: 20px 0; border-radius: 8px; background: var(--kui-color-bg-component); display: flex; align-items: center; justify-content: center; color: #999; }
.demo-docs-layout .anchor-title { font-weight: bold; font-size: 12px; color: #999; margin-bottom: 12px; text-transform: uppercase; }
`;

export default function App() {
  return (
    <>
      <style>{styles}</style>
      <Layout className="demo-docs-layout">
        <Header className="docs-header">
          <Space className="logo">
            <Icon type={LogoKui} size={20} />
            KUI Docs
          </Space>
          <Input placeholder="Search..." style={{ width: 300 }} />
        </Header>

        <Layout className="docs-body">
          <Sider className="docs-sider-left" style={{ width: 280 }}>
            <div className="sider-menu-wrapper">
              <Menu mode="inline" openKeys={["g1"]} className="docs-menu">
                <MenuGroup title="Guide">
                  <MenuItem menuKey="intro">Started</MenuItem>
                  <MenuItem menuKey="custom">Custom Theme</MenuItem>
                </MenuGroup>
                <MenuGroup title="Universal">
                  <MenuItem menuKey="btn">Button</MenuItem>
                  <MenuItem menuKey="icon">Icon</MenuItem>
                  <MenuItem menuKey="layout">Layout</MenuItem>
                </MenuGroup>
              </Menu>
            </div>
          </Sider>

          <Content className="docs-content">
            <article className="markdown-body">
              <h1>Layout</h1>
              <p>Assist in overall page layout planning.</p>
              {Array.from({ length: 10 }, (_, index) => (
                <section key={index}>
                  <h2 id={`part-${index + 1}`}>Chapter {index + 1}</h2>
                  <div className="code-demo-box">Sample code display area...</div>
                </section>
              ))}
            </article>
          </Content>

          <Sider className="docs-sider-right" style={{ width: 200 }}>
            <div className="anchor-wrapper">
              <p className="anchor-title">Contents</p>
              <Anchor>
                <AnchorLink href="#part-1" title="Basic" />
                <AnchorLink href="#part-2" title="Sidebar collapse" />
                <AnchorLink href="#part-3" title="Custom trigger" />
              </Anchor>
            </div>
          </Sider>
        </Layout>
      </Layout>
    </>
  );
}
