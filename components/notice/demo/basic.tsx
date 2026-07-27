import { Button, Space, notice } from "react-kui";
export default function Basic() {
  return (
    <Space vertical>
      <Button
        type="primary"
        onClick={() =>
          notice.open({ title: "Title", content: "The content of the notice.", duration: 5 })
        }
      >
        Notice
      </Button>
    </Space>
  );
}
