import { Space, Alert } from "react-kui";

export default function Basic() {
  return (
    <Space vertical block>
      <Alert showIcon={false} type="success">
        Success Text
      </Alert>
      <Alert showIcon={false} type="info">
        Info Text
      </Alert>
      <Alert showIcon={false} type="warning">
        Warning Text
      </Alert>
      <Alert showIcon={false} type="error">
        Error Text
      </Alert>
    </Space>
  );
}
