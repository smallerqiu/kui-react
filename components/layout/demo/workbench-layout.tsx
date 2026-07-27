import { useState } from "react";
import { Button } from "../../button";
import Layout, { Content, Header, Sider } from "../index";
import "./demo.css";
export default function Workbench() {
  const [detail, setDetail] = useState(true);
  return (
    <Layout className="layout-demo">
      <Sider style={{ width: 72, textAlign: "center" }}>
        <h2>P</h2>
        <nav className="layout-nav">
          <span>✓</span>
          <span>▣</span>
          <span>▥</span>
        </nav>
      </Sider>
      <Layout>
        <Header>
          <b>Project A</b> / Current iteration
        </Header>
        <Layout>
          <Content>
            {Array.from({ length: 8 }, (_, i) => (
              <div className="layout-card" onClick={() => setDetail(true)} key={i}>
                Task #00{i + 1} – Optimization algorithm
              </div>
            ))}
          </Content>
          {detail && (
            <Sider style={{ width: 300 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h4>Task Details</h4>
                <Button type="text" onClick={() => setDetail(false)}>
                  Close
                </Button>
              </div>
              <p>
                <b>Status:</b> In progress
              </p>
              <p>
                <b>Executor:</b> Qiu
              </p>
              <p>Description: ensure transforms work in reverse mode.</p>
            </Sider>
          )}
        </Layout>
      </Layout>
    </Layout>
  );
}
