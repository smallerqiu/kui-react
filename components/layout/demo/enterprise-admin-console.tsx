import { PanelLeftClose, PanelLeftOpen } from "kui-icons";
import { useState } from "react";
import { Button } from "../../button";
import Icon from "../../icon";
import Layout, { Content, Footer, Header, Sider } from "../index";
import "./demo.css";
export default function Admin() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout className="layout-demo">
      <Sider style={{ width: collapsed ? 72 : 210 }}>
        <h3>KUI {collapsed ? "" : "Console"}</h3>
        <nav className="layout-nav">
          {["Dashboard", "Users", "Settings", "API Keys"].map((x) => (
            <span key={x}>{collapsed ? x[0] : x}</span>
          ))}
        </nav>
        <Button block type="text" onClick={() => setCollapsed((v) => !v)}>
          <Icon type={collapsed ? PanelLeftOpen : PanelLeftClose} />
        </Button>
      </Sider>
      <Layout>
        <Header style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Home / User Management</span>
          <b>Admin</b>
        </Header>
        <Content>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h2>User List</h2>
            <Button type="primary">Add User</Button>
          </div>
          {Array.from({ length: 6 }, (_, i) => (
            <div className="layout-card" key={i}>
              User {i + 1}
            </div>
          ))}
        </Content>
        <Footer>KUI Design Platform ©2026</Footer>
      </Layout>
    </Layout>
  );
}
