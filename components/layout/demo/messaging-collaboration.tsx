import { Send } from "kui-icons";
import { Button, Layout, Content, Footer, Header, Sider } from "react-kui";
import "./demo.css";
export default function App() {
  return (
    <Layout className="layout-demo">
      <Sider style={{ width: 240 }}>
        <input
          placeholder="Search conversation..."
          style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
        />
        <nav className="layout-nav" style={{ marginTop: 16 }}>
          <b># Core R&D Team</b>
          <span># Visual Design UI</span>
          <span># Customer Support</span>
        </nav>
      </Sider>
      <Layout>
        <Header>
          <b># Core R&D Team</b> <small>(128 members)</small>
        </Header>
        <Content>
          {Array.from({ length: 7 }, (_, i) => (
            <div className="layout-card" key={i}>
              <small>User_{i + 1} · 10:30 AM</small>
              <div>This is simulated historical message content.</div>
            </div>
          ))}
        </Content>
        <Footer>
          <textarea rows={3} placeholder="Press Cmd + Enter to send..." style={{ width: "100%" }} />
          <Button type="primary" size="small" icon={Send}>
            Send
          </Button>
        </Footer>
      </Layout>
    </Layout>
  );
}
