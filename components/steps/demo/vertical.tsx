import { Steps } from "react-kui";
export default function App() {
  return (
    <Steps
      direction="vertical"
      current={1}
      items={[
        { title: "创建项目", description: "填写项目信息" },
        { title: "配置", description: "完成相关配置" },
        { title: "发布" },
      ]}
    />
  );
}
