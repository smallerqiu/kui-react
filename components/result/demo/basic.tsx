import { Button, Result, Space } from "react-kui";
export default function App() { return <Result status="success" title="版本发布完成" subTitle="新版本已经部署，所有服务运行正常。" extra={<Space><Button type="primary">查看版本</Button><Button>返回项目</Button></Space>} />; }
