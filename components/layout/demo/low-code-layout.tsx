import { Files, GitBranch, Search } from "kui-icons";
import Icon from "../../icon";
import Layout, { Content, Footer, Header, Sider } from "../index";
import "./demo.css";
export default function LowCode() {
  return (
    <Layout className="layout-demo" style={{ background: "#1e1e1e", color: "#ccc" }}>
      <Layout>
        <Sider style={{ width: 48, background: "#333" }}>
          <nav className="layout-nav">
            <Icon type={Files} />
            <Icon type={Search} />
            <Icon type={GitBranch} />
          </nav>
        </Sider>
        <Sider style={{ width: 180, background: "#252526" }}>
          <small>EXPLORER</small>
          <nav className="layout-nav">
            <b>index.tsx</b>
            <span>slider.tsx</span>
            <span>styles.less</span>
          </nav>
        </Sider>
        <Layout>
          <Header style={{ background: "#2d2d2d" }}>index.tsx　 slider.tsx</Header>
          <Content style={{ background: "#1e1e1e" }}>
            <pre>
              <code>{`export default function App() {\n  return <Layout />;\n}`}</code>
            </pre>
          </Content>
        </Layout>
        <Sider style={{ width: 220, background: "#252526" }}>
          <small>ATTRIBUTE SETTINGS</small>
          <p>Display mode: block</p>
          <p>Main color: #3a95ff</p>
        </Sider>
      </Layout>
      <Footer
        style={{
          background: "#007acc",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>Ready</span>
        <span>UTF-8 | React 19 | Ln 10</span>
      </Footer>
    </Layout>
  );
}
