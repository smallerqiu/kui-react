import { Layout, Content, Header, Sider } from "react-kui";
import "./demo.css";
export default function Documentation() {
  return (
    <Layout className="layout-demo">
      <Header>
        <b>KUI Docs</b>
        <input placeholder="Search..." style={{ marginLeft: 40, padding: 8 }} />
      </Header>
      <Layout>
        <Sider style={{ width: 220 }}>
          <nav className="layout-nav">
            <b>Guide</b>
            <span>Started</span>
            <span>Custom Theme</span>
            <b>Universal</b>
            <span>Button</span>
            <span>Icon</span>
            <span>Layout</span>
          </nav>
        </Sider>
        <Content>
          <article>
            <h1>Layout</h1>
            <p>Assist in overall page layout planning.</p>
            {Array.from({ length: 5 }, (_, i) => (
              <section key={i}>
                <h2>Chapter {i + 1}</h2>
                <div className="layout-card">Sample code display area...</div>
              </section>
            ))}
          </article>
        </Content>
        <Sider style={{ width: 170 }}>
          <b>Contents</b>
          <nav className="layout-nav">
            <a href="#">Basic</a>
            <a href="#">Sidebar</a>
            <a href="#">Trigger</a>
          </nav>
        </Sider>
      </Layout>
    </Layout>
  );
}
