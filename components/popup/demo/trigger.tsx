import { Button, Popup, Space } from "react-kui";
export default function App() {
  return (
    <Space wrap>
      {(["click", "hover", "focus", "contextmenu"] as const).map((trigger) => (
        <Popup
          key={trigger}
          trigger={trigger}
          arrow
          openDelay={150}
          closeDelay={300}
          overlay={<span>Opened by {trigger}</span>}
        >
          <Button>{trigger}</Button>
        </Popup>
      ))}
      <Popup disabled overlay="Unavailable">
        <Button disabled>Disabled</Button>
      </Popup>
    </Space>
  );
}
