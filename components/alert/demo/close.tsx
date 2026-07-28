import { Space, Alert } from "react-kui";

export default function App() {
  return (
    <Space vertical block>
      <Alert type="success" closable>
        Success Text
      </Alert>
      <Alert type="info" closable>
        Info Text
      </Alert>
      <Alert type="warning" closable>
        Warning Text
      </Alert>
      <Alert type="error" closable>
        Error Text
      </Alert>
      <Alert
        type="success"
        closable
        message="Success Tip"
        description="Congratulations, the operation is successful."
      />
    </Space>
  );
}
