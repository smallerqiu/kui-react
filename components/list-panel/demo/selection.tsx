import { Search } from "kui-icons";
import { Button, Input, ListPanel, Table } from "react-kui";
import { useState } from "react";
const columns = [
  { title: "Name", key: "name" },
  { title: "Role", key: "role" },
];
const data = [
  { key: 1, name: "Alex", role: "Admin" },
  { key: 2, name: "Mia", role: "Editor" },
  { key: 3, name: "Leo", role: "Viewer" },
];
export default function App() {
  const [selected, setSelected] = useState<(string | number)[]>([]);
  return (
    <ListPanel
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
  );
}
