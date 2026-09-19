import { Search } from "kui-icons";
import { Input, ListPanel, Select, Table } from "react-kui";
import { useState } from "react";
const columns = [
  { title: "Name", key: "name" },
  { title: "Status", key: "status" },
];
const data = [
  { key: 1, name: "Alex", status: "Active" },
  { key: 2, name: "Mia", status: "Disabled" },
];
export default function App() {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<string | number>();
  const filtered = data.filter(
    (item) => (!keyword || item.name.includes(keyword)) && (!status || item.status === status),
  );
  return (
    <ListPanel
      summary={`${filtered.length} records`}
      filters={
        <>
          <Input
            value={keyword}
            onChange={(next) => setKeyword(String(next))}
            icon={Search}
            placeholder="Search users"
            style={{ width: 200 }}
          />
          <Select
            value={status}
            onChange={(next) =>
              setStatus(typeof next === "string" || typeof next === "number" ? next : undefined)
            }
            clearable
            placeholder="All statuses"
            options={[
              { label: "Active", value: "Active" },
              { label: "Disabled", value: "Disabled" },
            ]}
          />
        </>
      }
    >
      <Table data={filtered} columns={columns} />
    </ListPanel>
  );
}
