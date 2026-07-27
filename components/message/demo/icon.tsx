import { LogoAlipay, LogoWechat } from "kui-icons";
import { Button } from "../../button";
import Space from "../../space";
import message from "../index";
export default function CustomIcon() {
  return (
    <Space vertical>
      <Button
        icon={LogoAlipay}
        onClick={() =>
          message.show({
            color: "#0f87ffff",
            icon: LogoAlipay,
            content: "You have received 1,000,000 yuan via Alipay.",
          })
        }
      />
      <Button
        icon={LogoWechat}
        onClick={() =>
          message.show({
            color: "#00d76fff",
            icon: LogoWechat,
            content: "WeChat payment received: 1 million yuan",
          })
        }
      />
    </Space>
  );
}
