import { useState } from "react";
import Space from "../../space";
import Tag from "../../tag";
import Table, { type Column } from "../index";
import { basicColumns, people, type Person } from "./data";
const columns: Column<Person>[] = [
  ...basicColumns.map((column) =>
    column.key === "tags"
      ? {
          ...column,
          render: (tags: string[]) => (
            <Space>
              {tags.map((tag) => (
                <Tag key={tag} color={tag === "Python" ? "green" : "blue"}>
                  {tag}
                </Tag>
              ))}
            </Space>
          ),
        }
      : column
  ),
  {
    title: "Operate",
    key: "action",
    render: () => (
      <Space>
        <a href="#">Edit</a>
        <a href="#">Delete</a>
      </Space>
    ),
  },
];
export default function TableCheck() {
  const [selectedKeys, setSelectedKeys] = useState<Array<string | number>>([]);
  return (
    <>
      <code>selectedKeys: {selectedKeys.join(", ")}</code>
      <Table
        data={people}
        columns={columns}
        checkable
        selectedKeys={selectedKeys}
        onSelectedKeysChange={setSelectedKeys}
      />
    </>
  );
}
