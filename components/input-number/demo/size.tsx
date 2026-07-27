import { LogoKui } from "kui-icons";
import Space from "../../space";
import InputNumber from "../index";
export default function Size() {
  return (
    <Space vertical block>
      <InputNumber placeholder="Large Input" size="large" icon={LogoKui} />
      <InputNumber placeholder="Base Input" icon={LogoKui} />
      <InputNumber size="small" placeholder="Small Input" icon={LogoKui} />
    </Space>
  );
}
