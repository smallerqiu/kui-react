import { Table, type Column } from "react-kui";
const data = [
  { key: "0", fullname: "Li Lei", price: 18990, address: "Wu Han Guanggu No. 328" },
  { key: "1", fullname: "Liu Hao", price: 23900, address: "Wu Han Hongshan No. 128" },
  { key: "2", fullname: "Hu Cong", price: 12000, address: "Wu Han Nanhu No. 198" },
  { key: "3", fullname: "Qiu", price: 28000, address: "Wu Han Nanhu No. 188" },
];
const columns: Column<(typeof data)[number]>[] = [
  { title: "Name", key: "fullname", render: (value) => <a>{value}</a> },
  {
    title: "Housing price",
    key: "price",
    render: (value) => (
      <span style={{ color: value > 20000 ? "red" : undefined }}>￥{value}/㎡</span>
    ),
  },
  { title: "Address", key: "address" },
];
export default function Bordered() {
  return <Table data={data} columns={columns} bordered header="Header" footer="Footer" />;
}
