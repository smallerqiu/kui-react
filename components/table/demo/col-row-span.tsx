import { Table, type Column } from "react-kui";
const data = [
  { key: "1", name: "Jim", age: 25, city: "Beijing" },
  { key: "2", name: "Allen", age: 30, city: "Wuhan" },
  { key: "3", name: "Qiu", age: 35, city: "Wuhan" },
  { key: "4", name: "Jake", age: 40, city: "Shanghai" },
  { key: "5", name: "Mask", age: 38, city: "Wuhan" },
];
const columns: Column<(typeof data)[number]>[] = [
  { title: "Name", key: "name", width: 100, rowSpan: (_, index) => (index === 2 ? 2 : 1) },
  { title: "Age", key: "age", width: 100, colSpan: (_, index) => (index === 1 ? 2 : 1) },
  { title: "City", key: "city", width: 100 },
];
export default function ColRowSpan() {
  return <Table data={data} columns={columns} bordered />;
}
