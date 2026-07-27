import { Select } from "../../select";
import Space from "../../space";
import Table, { type Column } from "../../table";
const columns: Column[] = [
  { title: "Name", key: "name" },
  { title: "Age", key: "age" },
];
export default function Used() {
  return (
    <Space vertical block>
      Select:
      <Select width={220} />
      Table:
      <Table data={[]} columns={columns} />
    </Space>
  );
}
