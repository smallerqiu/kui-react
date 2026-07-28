import { Button, Layout, Content, Footer, Header } from "react-kui";
import "./demo.css";
export default function App() {
  return (
    <Layout className="layout-demo">
      <Header style={{ display: "flex", justifyContent: "space-between" }}>
        <b>KUI PRO</b>
        <nav style={{ display: "flex", gap: 20 }}>
          <span>Home</span>
          <span>Components</span>
          <span>Resources</span>
        </nav>
        <Button type="primary" size="small">
          Get started
        </Button>
      </Header>
      <Content>
        <section
          style={{
            padding: "70px 20px",
            textAlign: "center",
            background: "linear-gradient(135deg,#188fff55,#8e54e955)",
          }}
        >
          <h1>Connecting beauty with technology</h1>
          <p>A minimalist enterprise-grade React UI library</p>
        </section>
        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 32 }}
        >
          {Array.from({ length: 3 }, (_, i) => (
            <div className="layout-card" key={i}>
              <h3>Feature Showcase</h3>
              <p>CSS Variables and instant theme switching.</p>
            </div>
          ))}
        </div>
      </Content>
      <Footer>Copyright © 2026 KUI Team</Footer>
    </Layout>
  );
}
