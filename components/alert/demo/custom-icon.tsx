import { LogoAlipay, LogoApple, LogoGoogle, LogoWechat } from "kui-icons";
import { Space, Alert } from "react-kui";

export default function CustomIcon() {
  return (
    <Space vertical block>
      <Alert type="success" icon={LogoAlipay}>
        Success Text
      </Alert>
      <Alert type="info" icon={LogoWechat}>
        Info Text
      </Alert>
      <Alert type="warning" icon={LogoApple}>
        Warning Text
      </Alert>
      <Alert type="error" icon={LogoGoogle}>
        Error Text
      </Alert>
      <Alert
        type="success"
        icon={LogoAlipay}
        message="Success Tip"
        description="Congratulations, the operation is successful."
      />
      <Alert
        type="info"
        icon={LogoWechat}
        message="Informational Notes"
        description="Congratulations, the operation is successful."
      />
      <Alert
        type="warning"
        icon={LogoApple}
        message="Warning"
        description="Nuclear bomb launching base, please do not approach!"
      />
      <Alert
        type="error"
        icon={LogoGoogle}
        message="Error"
        description="Encountered an error, please press any key to continue."
      />
    </Space>
  );
}
