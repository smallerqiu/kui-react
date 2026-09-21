import { useState } from "react";
import { Button, Checkbox, Popup, Space } from "react-kui";
export default function App() {
  const [arrow, setArrow] = useState(true);
  const placements = [
    "top-left",
    "top",
    "top-right",
    "bottom-left",
    "bottom",
    "bottom-right",
    "left-top",
    "left",
    "left-bottom",
    "right-top",
    "right",
    "right-bottom",
  ] as const;
  return (
    <Space vertical>
      <Checkbox checked={arrow} onChange={(event) => setArrow(event.checked)}>
        Show arrow
      </Checkbox>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 8,
          maxWidth: 420,
        }}
      >
        {placements.map((placement) => (
          <Popup
            key={placement}
            placement={placement}
            arrow={arrow}
            offset={10}
            overlay={<span>{placement}</span>}
          >
            <Button>{placement}</Button>
          </Popup>
        ))}
      </div>
    </Space>
  );
}
