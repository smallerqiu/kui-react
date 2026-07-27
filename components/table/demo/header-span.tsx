import { Table, type Column } from "react-kui";
const data = Array.from({ length: 10 }, (_, i) => ({
  key: i,
  name: "John Brown",
  age: i + 1,
  street: "Lake Park",
  building: "C",
  number: 2035,
  companyAddress: "Lake Street 42",
  companyName: "SoftLake Co",
  gender: "M",
}));
const columns: Column[] = [
  { title: "Name", key: "name", width: 120, fixed: "left" },
  {
    title: "Other",
    key: "other",
    children: [
      { title: "Age", key: "age", sorter: true },
      {
        title: "Address",
        key: "address",
        children: [
          { title: "Street", key: "street" },
          {
            title: "Block",
            key: "block",
            children: [
              { title: "Building", key: "building" },
              { title: "Door No.", key: "number" },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Company",
    key: "company",
    children: [
      { title: "Company Address", key: "companyAddress", width: 200 },
      { title: "Company Name", key: "companyName", width: 200 },
    ],
  },
  { title: "Gender", key: "gender", width: 100, fixed: "right" },
];
export default function HeaderSpan() {
  return <Table data={data} columns={columns} bordered scroll={{ y: 300 }} />;
}
