import { LogoKui } from "kui-icons";
import { Space, InputNumber } from "react-kui";
export default function App() {
  return (
    <Space vertical block>
      <InputNumber placeholder="Large Input" size="large" icon={LogoKui} />
      <InputNumber placeholder="Base Input" icon={LogoKui} />
      <InputNumber size="small" placeholder="Small Input" icon={LogoKui} />
    </Space>
  );
}
