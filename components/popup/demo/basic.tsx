import { Button, Input, Popup, Space } from "react-kui";
export default function App() {
  return (
    <Popup
      arrow
      overlay={({ close }) => (
        <Space vertical>
          <strong>Quick note</strong>
          <Input aria-label="Note" placeholder="Write a note…" />
          <Button type="primary" onClick={close}>
            Done
          </Button>
        </Space>
      )}
    >
      <Button>Open popup</Button>
    </Popup>
  );
}
