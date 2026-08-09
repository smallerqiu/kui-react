import { Files, GitBranch, Search } from "kui-icons";
import { Content, Footer, Header, Icon, Input, KSwitch, Layout, Sider } from "react-kui";

const styles = `
.ide-layout { height: 100vh; background: #1e1e1e; color: #ccc; overflow: hidden; }
.ide-layout .ide-rail { background: #333; display: flex; flex-direction: column; align-items: center; padding-top: 10px; }
.ide-layout .rail-icon { height: 48px; width: 48px; display: flex; align-items: center; justify-content: center; font-size: 20px; cursor: pointer; }
.ide-layout .rail-icon.active { color: var(--kui-color-primary); border-left: 2px solid; }
.ide-layout .ide-explorer, .ide-layout .ide-inspector { background: #252526; border-right: 1px solid #111; font-size: 12px; }
.ide-layout .panel-title { padding: 10px 16px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888; }
.ide-layout .file-item { padding: 4px 20px; font-size: 13px; cursor: pointer; }
.ide-layout .file-item.active { background: #37373d; color: #fff; }
.ide-layout .editor-tabs { background: #2d2d2d; height: 35px; line-height: 35px; display: flex; }
.ide-layout .tab { padding: 0 20px; border-right: 1px solid #1e1e1e; font-size: 12px; cursor: pointer; }
.ide-layout .tab.active { background: #1e1e1e; color: #fff; }
.ide-layout .editor-main { background: #1e1e1e; padding: 20px; }
.ide-layout .ide-status-bar { height: 22px; padding: 0 12px; background: #007acc; color: #fff; display: flex; justify-content: space-between; align-items: center; font-size: 12px; }
.ide-layout .setting-row { padding: 8px 16px; display: flex; justify-content: space-between; align-items: center; }
`;

export default function App() {
  return (
    <>
      <style>{styles}</style>
      <Layout className="ide-layout">
        <Layout>
          <Sider className="ide-rail" style={{ width: 48 }}>
            <div className="rail-icon active">
              <Icon type={Files} />
            </div>
            <div className="rail-icon">
              <Icon type={Search} />
            </div>
            <div className="rail-icon">
              <Icon type={GitBranch} />
            </div>
          </Sider>

          <Sider className="ide-explorer" style={{ width: 200 }}>
            <div className="panel-title">Explorer</div>
            <div className="file-tree">
              <div className="file-item active">index.tsx</div>
              <div className="file-item">slider.tsx</div>
              <div className="file-item">styles.less</div>
            </div>
          </Sider>

          <Layout>
            <Header className="editor-tabs">
              <div className="tab active">index.tsx</div>
              <div className="tab">slider.tsx</div>
            </Header>
            <Content className="editor-main">
              <pre className="code-preview">
                <code>{"export default { ... }"}</code>
              </pre>
            </Content>
          </Layout>

          <Sider className="ide-inspector" style={{ width: 240 }}>
            <div className="panel-title">Attribute Settings</div>
            <div className="inspector-content">
              <div className="setting-row">
                <span>Display mode:</span> <KSwitch />
              </div>
              <div className="setting-row">
                <span>Main color:</span> <Input size="small" />
              </div>
            </div>
          </Sider>
        </Layout>

        <Footer className="ide-status-bar">
          <div className="status-left">Ready</div>
          <div className="status-right">UTF-8 | React 19 | Line 10, Col 5</div>
        </Footer>
      </Layout>
    </>
  );
}
