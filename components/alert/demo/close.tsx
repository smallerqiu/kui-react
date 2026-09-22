import { Space, Alert, Button } from "react-kui";
import { useState } from "react";

export default function App() {
  const [visible, setVisible] = useState(true);
  return (
    <Space vertical block>
      {visible ? (
        <Alert type="success" closable onAfterClose={() => setVisible(false)}>
          Success Text
        </Alert>
      ) : (
        <Button onClick={() => setVisible(true)}>Show Alert</Button>
      )}
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
