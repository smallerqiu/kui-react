import { useState } from "react";
import { Button, Popup, Select, Space } from "react-kui";
export default function App() {
  const [value, setValue] = useState<string | number>("all");
  return (
    <Popup
      arrow
      overlay={({ close }) => (
        <Space vertical>
          <strong>Filter results</strong>
          <Select
            style={{ width: 220 }}
            value={value}
            clearable={false}
            options={[
              { label: "All", value: "all" },
              { label: "Active", value: "active" },
            ]}
            onChange={(next) => {
              if (typeof next === "string" || typeof next === "number") setValue(next);
            }}
          />
          <Popup placement="right" overlay="This is a nested popup.">
            <Button>More details</Button>
          </Popup>
          <Button type="primary" onClick={close}>
            Apply
          </Button>
        </Space>
      )}
    >
      <Button>Open filters</Button>
    </Popup>
  );
}
