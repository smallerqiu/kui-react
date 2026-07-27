import { Check, LogoApple, LogoMicrosoft, Plane, Wifi, X } from "kui-icons";
import { Icon, Space, KSwitch as Switch } from "react-kui";
export default function WithText() {
  return (
    <Space vertical align="start">
      <Switch trueText="Yes" falseText="No" />
      <Switch trueText="｜" falseText="〇" />
      <Switch trueText="｜" falseText="〇" checked />
      <Switch trueText="On" falseText="Off" />
      <Switch checkedChildren={<Icon type={Check} />} unCheckedChildren={<Icon type={X} />} />
      <Switch
        checkedChildren={<Icon type={LogoApple} />}
        unCheckedChildren={<Icon type={LogoMicrosoft} />}
      />
      <Switch checkedChildren={<Icon type={Wifi} />} unCheckedChildren={<Icon type={Plane} />} />
    </Space>
  );
}
