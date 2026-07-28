import { Copy } from "kui-icons";
import { Button, Input, Space } from "react-kui";
export default function App() {
  return (
    <Space vertical size="medium" block style={{ maxWidth: 520 }}>
      <Space compact style={{ width: "50%" }}>
        <Input style={{ width: "50%" }} value="027" readOnly />
        <Input style={{ width: "50%" }} value="28398987" readOnly />
      </Space>
      <Space compact block>
        <Input style={{ width: "calc(100% - 100px)" }} value="https://react.k-ui.cn" readOnly />
        <Button type="primary">Submit</Button>
      </Space>
      <Space compact block>
        <Input
          style={{ width: "calc(100% - 50px)" }}
          value="git@github.com:smallerqiu/kui-react.git"
          readOnly
        />
        <Button icon={Copy} />
      </Space>
      <Space compact block>
        <Input style={{ width: "30%" }} value="0755" readOnly />
        <Input style={{ width: "50%" }} value="28398987" readOnly />
        <Input style={{ width: "20%" }} value="+1" readOnly />
      </Space>
    </Space>
  );
}
