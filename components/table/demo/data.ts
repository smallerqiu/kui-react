import { type Column } from "react-kui";
export interface Person {
  key: string;
  name: string;
  gender: number;
  age: number;
  address: string;
  tags: string[];
}
export const people: Person[] = [
  {
    key: "0",
    name: "Li Lei",
    gender: 0,
    age: 32,
    address: "Wu Han Guanggu No. 328",
    tags: ["Python", "Java"],
  },
  {
    key: "1",
    name: "Liu Hao",
    gender: 1,
    age: 28,
    address: "Wu Han Hongshan No. 128",
    tags: ["Python", "Java"],
  },
  {
    key: "2",
    name: "Hu Cong",
    gender: 0,
    age: 28,
    address: "Wu Han Nanhu No. 198",
    tags: ["JS", "CSS"],
  },
  {
    key: "3",
    name: "Qiu",
    gender: 1,
    age: 28,
    address: "Wu Han Nanhu No. 188",
    tags: ["Go", "Python"],
  },
];
export const basicColumns: Column<Person>[] = [
  { title: "Name", key: "name" },
  { title: "Age", key: "age" },
  { title: "Gender", key: "gender" },
  { title: "Address", key: "address" },
  { title: "Tags", key: "tags" },
];
