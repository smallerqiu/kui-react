import { LogoAlipay, LogoWechat } from "kui-icons";
import { Button, Space, notice } from "react-kui";
export default function App() {
  return (
    <Space vertical>
      <Button
        icon={LogoAlipay}
        onClick={() =>
          notice.open({
            icon: LogoAlipay,
            color: "#0082d9ff",
            title: "Dear user, hello",
            content:
              "We are pleased to inform you that you don't need to repay your Huabei balance next month!",
            duration: 10,
          })
        }
      />
      <Button
        icon={LogoWechat}
        onClick={() =>
          notice.open({
            icon: LogoWechat,
            color: "#00c87b",
            title: "Dear user, hello",
            content: (
              <div>
                <p style={{ margin: "10px 0" }}>
                  WeChat has added some new features, and we invite you to try them out!
                </p>
                <Button type="primary" size="small">
                  Go and see
                </Button>
              </div>
            ),
            duration: 10,
          })
        }
      />
    </Space>
  );
}
