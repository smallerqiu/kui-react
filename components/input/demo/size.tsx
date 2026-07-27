import { LogoKui } from "kui-icons";
import message from "../../message";
import Space from "../../space";
import { Input } from "../index";
export default function Size() {
  return (
    <Space vertical block>
      <Input placeholder="Large Input" size="large" icon={LogoKui} clearable />
      <Input placeholder="Base Input" icon={LogoKui} clearable />
      <Input
        size="small"
        placeholder="Small Input"
        icon={LogoKui}
        onIconClick={() => message.info("You click the icon")}
        clearable
      />
    </Space>
  );
}
