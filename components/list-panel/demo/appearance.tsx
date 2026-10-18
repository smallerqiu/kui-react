import { Search } from "kui-icons";
import { useState } from "react";
import {
  Button,
  Input,
  ListPanel,
  RadioGroup,
  Space,
  Table,
  type SurfaceThemeType,
} from "react-kui";

const columns = [
  { title: "Name", key: "name" },
  { title: "Role", key: "role" },
];
const data = [
  { key: 1, name: "Alex", role: "Admin" },
  { key: 2, name: "Mia", role: "Editor" },
  { key: 3, name: "Leo", role: "Viewer" },
];

// The panel does not plate itself: the tier it is given is painted on the card it renders under the header,
// so the five options change the plate and frame of the whole panel rather than one part of it. `solid` is
// the tier that moves content — the result summary turns to light-on-primary text and the bulk-action strip
// swaps its grey plate for a pale one on the primary. Select a row to make that strip appear.
const tiers: SurfaceThemeType[] = ["outline", "fill", "plain", "solid", "dashed"];

export default function App() {
  const [tier, setTier] = useState<SurfaceThemeType>("outline");
  const [selected, setSelected] = useState<(string | number)[]>([1]);
  return (
    <Space vertical block>
      <RadioGroup
        type="button"
        options={tiers.map((value) => ({ label: value, value }))}
        value={tier}
        onChange={(value) => setTier(value as SurfaceThemeType)}
      />
      <ListPanel
        theme={tier}
        summary={`${data.length} users`}
        selectedCount={selected.length}
        selection={(count) => (
          <>
            <strong>{count} selected</strong>
            <Button size="small" theme="plain">
              Disable
            </Button>
            <Button size="small" theme="plain" onClick={() => setSelected([])}>
              Clear
            </Button>
          </>
        )}
        filters={<Input icon={Search} placeholder="Search users" style={{ width: 200 }} />}
      >
        <Table
          checkable
          selectedKeys={selected}
          onSelectedKeysChange={setSelected}
          data={data}
          columns={columns}
        />
      </ListPanel>
    </Space>
  );
}
