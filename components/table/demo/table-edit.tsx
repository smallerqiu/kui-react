import { useRef, useState } from "react";
import { Button, Input, message, Popconfirm, Space, Table, type Column } from "react-kui";
interface Row {
  key: string;
  name: string;
  age: number | string;
  address: string;
  isEdit: boolean;
}
const initial: Row[] = [
  { key: "0", name: "Li Lei", age: 28, address: "Wu Han Guanggu No. 328", isEdit: false },
  { key: "1", name: "Liu Hao", age: 30, address: "Wu Han Hongshan No. 128", isEdit: false },
  { key: "2", name: "Hu Cong", age: 28, address: "Wu Han Nanhu No. 198", isEdit: false },
  { key: "3", name: "Qiu", age: 32, address: "Wu Han Nanhu No. 188", isEdit: false },
];
export default function App() {
  const [data, setData] = useState(initial),
    count = useRef(4);
  const patch = (key: string, values: Partial<Row>) =>
    setData((rows) => rows.map((row) => (row.key === key ? { ...row, ...values } : row)));
  const field = (key: keyof Row) => (value: unknown, record: Row) =>
    record.isEdit ? (
      <Input
        value={typeof value === "string" || typeof value === "number" ? value : ""}
        onChange={(next) => patch(record.key, { [key]: next })}
        size="small"
      />
    ) : (
      String(value)
    );
  const columns: Column<Row>[] = [
    { title: "Name", key: "name", render: field("name") },
    { title: "House price", key: "age", render: field("age") },
    { title: "Address", key: "address", render: field("address") },
    {
      title: "Operate",
      key: "action",
      render: (_, record) => (
        <Space>
          {!record.isEdit ? (
            <Button size="small" type="primary" onClick={() => patch(record.key, { isEdit: true })}>
              Edit
            </Button>
          ) : (
            <>
              <Button
                size="small"
                type="primary"
                onClick={() => {
                  patch(record.key, { isEdit: false });
                  message.success("Save successfully!");
                }}
              >
                Save
              </Button>
              <Button size="small" onClick={() => patch(record.key, { isEdit: false })}>
                Cancel
              </Button>
            </>
          )}{" "}
          {!record.isEdit && (
            <Popconfirm
              title="Are you sure delete this content?"
              onOk={() => setData((rows) => rows.filter((row) => row.key !== record.key))}
            >
              <Button size="small" type="danger">
                Delete
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];
  const add = () => {
    const key = String(count.current++);
    setData((rows) => [
      ...rows,
      { key, name: `Name ${key}`, age: 30, address: `China Wuhan no.${key}`, isEdit: false },
    ]);
  };
  return (
    <>
      <Button onClick={add}>Add</Button>
      <Table data={data} columns={columns} bordered />
    </>
  );
}
