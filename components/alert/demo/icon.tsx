import { useState } from "react";
import { Checkbox, Space, Alert } from "react-kui";

export default function App() {
  const [bordered, setBordered] = useState(true);
  return (
    <Space vertical block>
      <Checkbox checked={bordered} onChange={({ checked }) => setBordered(checked)}>
        Show border
      </Checkbox>
      <Alert type="success" bordered={bordered}>
        Success Text
      </Alert>
      <Alert type="info" bordered={bordered}>
        Info Text
      </Alert>
      <Alert type="warning" bordered={bordered}>
        Warning Text
      </Alert>
      <Alert type="error" bordered={bordered}>
        Error Text
      </Alert>
      <Alert
        bordered={bordered}
        type="success"
        message="Success Tip"
        description="Congratulations, the operation is successful."
      />
      <Alert
        bordered={bordered}
        type="info"
        message="Informational Notes"
        description="Congratulations, the operation is successful."
      />
      <Alert
        bordered={bordered}
        type="warning"
        message="Warning"
        description="Nuclear bomb launching base, please do not approach!"
      />
      <Alert
        bordered={bordered}
        type="error"
        message="Error"
        description="Encountered an error, please press any key to continue."
      />
    </Space>
  );
}
