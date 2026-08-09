import { Calendar, ChartBarBig, CircleCheck } from "kui-icons";
import { useState } from "react";
import {
  Avatar,
  AvatarGroup,
  Button,
  Content,
  Divider,
  Flex,
  Header,
  Layout,
  Menu,
  MenuItem,
  Sider,
} from "react-kui";

const styles = `
.workbench-layout { height: 100vh; border: 1px solid var(--kui-color-border); background: var(--kui-color-bg); }
.workbench-layout .app-rail { display: flex; flex-direction: column; align-items: center; padding-top: 20px; }
.workbench-layout .app-logo { margin-bottom: 24px; background: var(--kui-color-primary); }
.workbench-layout .workbench-header { background: var(--kui-color-bg-3); border-bottom: 1px solid var(--kui-color-border); display: flex; justify-content: space-between; align-items: center; padding: 10px 24px; }
.workbench-layout .proj-name { font-weight: bold; font-size: 16px; }
.workbench-layout .task-list { overflow: auto; }
.workbench-layout .workbench-main { padding: 20px; background: var(--kui-color-bg-layout); overflow-y: auto; }
.workbench-layout .task-item { background: var(--kui-color-bg-component); padding: 16px; margin-bottom: 12px; border-radius: 6px; cursor: pointer; border: 1px solid transparent; transition: all 0.3s; }
.workbench-layout .task-item:hover { border-color: var(--kui-color-primary); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); }
.workbench-layout .detail-panel { background: var(--kui-color-bg-component); border-left: 1px solid var(--kui-color-border); }
.workbench-layout .detail-header { padding: 16px 20px; border-bottom: 1px solid var(--kui-color-border); display: flex; justify-content: space-between; }
.workbench-layout .detail-body { padding: 20px; max-width: 300px; }
`;

export default function App() {
  const [selectedKeys, setSelectedKeys] = useState(["t1"]);
  const [showDetail, setShowDetail] = useState(true);
  return (
    <>
      <style>{styles}</style>
      <Layout className="workbench-layout">
        <Sider className="app-rail" style={{ width: 80 }}>
          <Avatar size={40} className="app-logo">
            P
          </Avatar>
          <Menu
            mode="vertical"
            inlineCollapsed
            style={{ border: "none" }}
            value={selectedKeys}
            onSelect={({ key }) => setSelectedKeys([key])}
          >
            <MenuItem menuKey="t1" icon={CircleCheck} />
            <MenuItem menuKey="t2" icon={Calendar} />
            <MenuItem menuKey="t3" icon={ChartBarBig} />
          </Menu>
        </Sider>

        <Layout>
          <Header className="workbench-header">
            <div className="header-breadcrumb">
              <span className="proj-name">Project A</span> / <span>Current iteration</span>
            </div>
            <Flex className="header-ops">
              <AvatarGroup maxCount={3}>
                <Avatar src="https://cdn.chuchur.com/img/chick.jpeg" size={25} />
                <Avatar src="https://cdn.chuchur.com/img/monkey.jpeg" size={25} />
              </AvatarGroup>
            </Flex>
          </Header>

          <Layout style={{ overflow: "hidden" }}>
            <Content className="workbench-main">
              <div className="task-list">
                {Array.from({ length: 10 }, (_, index) => (
                  <div className="task-item" onClick={() => setShowDetail(true)} key={index}>
                    Task #00{index + 1} - Optimization algorithm
                  </div>
                ))}
              </div>
            </Content>

            {showDetail && (
              <Sider className="detail-panel" collapsible style={{ width: 350 }}>
                <div className="detail-header">
                  <h4>Task Details</h4>
                  <Button type="text" onClick={() => setShowDetail(false)}>
                    Close
                  </Button>
                </div>
                <div className="detail-body">
                  <p>
                    <strong>Status:</strong> In progress
                  </p>
                  <p>
                    <strong>Executor:</strong> Qiu
                  </p>
                  <Divider />
                  <p>
                    Description: We need to ensure that the transform still takes effect in reverse
                    mode....
                  </p>
                </div>
              </Sider>
            )}
          </Layout>
        </Layout>
      </Layout>
    </>
  );
}
