import { CircleAlert } from "kui-icons";
import { Button, Flex, Icon, modal, Tooltip, Table, type Column } from "react-kui";
const data = [
  { key: "0", name: "Li Lei", age: 32, address: "Wu Han Guanggu No. 328" },
  { key: "1", name: "Liu Hao", age: 28, address: "Wu Han Hongshan No. 128" },
  { key: "2", name: "Hu Cong", age: 28, address: "Wu Han Nanhu No. 198" },
  { key: "3", name: "Qiu", age: 28, address: "Wu Han Nanhu No. 188" },
];
const header = (tip: string) => (column: Column) => (
  <Flex size="small">
    {column.title}
    <Tooltip title={tip}>
      <Icon type={CircleAlert} size={18} color="#777" />
    </Tooltip>
  </Flex>
);
const columns: Column<(typeof data)[number]>[] = [
  { title: "Name", key: "name" },
  { title: "Age", key: "age", renderHeader: header("How old are you?") },
  { title: "Address", key: "address", renderHeader: header("Where are you from?") },
  {
    title: "Operate",
    key: "action",
    width: 90,
    render: (_, record) => (
      <Button
        size="small"
        onClick={() => modal.info({ title: "More", content: `My name is ${record.name}` })}
      >
        more
      </Button>
    ),
  },
];
export default function App() {
  return <Table data={data} columns={columns} />;
}
