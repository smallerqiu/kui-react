import { ArrowDown, ArrowUp, Moon, Sun, Trash2 } from "kui-icons";
import { useState } from "react";
import { Button, Icon, message, modal, Space, Tag, Table, type Column } from "react-kui";
import { people, type Person } from "./data";
export default function App() {
  const [data, setData] = useState([...people]);
  const move = (index: number, offset: number) => {
    const target = index + offset;
    if (target < 0 || target >= data.length) return;
    const next = [...data];
    [next[index], next[target]] = [next[target], next[index]];
    setData(next);
  };
  const columns: Column<Person>[] = [
    { title: "Name", key: "name" },
    { title: "Age", key: "age" },
    {
      title: "Gender",
      key: "gender",
      render: (v) => (
        <Icon type={v === 1 ? Sun : Moon} color={v === 1 ? "blue" : "#f50cff"} size={15} />
      ),
    },
    { title: "Address", key: "address" },
    {
      title: "Tags",
      key: "tags",
      render: (tags: string[]) => (
        <Space>
          {tags.map((tag) => (
            <Tag key={tag} color={tag === "Python" ? "green" : "blue"}>
              {tag}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Operate",
      key: "action",
      render: (_, record, index) => (
        <Space>
          <Button
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              move(index, -1);
            }}
            icon={ArrowUp}
          />
          <Button
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              move(index, 1);
            }}
            icon={ArrowDown}
          />
          <Button
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setData(data.filter((_, i) => i !== index));
            }}
            icon={Trash2}
          />
          <Button
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              modal.info({ title: "Hi", content: `My name is ${record.name}` });
            }}
          >
            more
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <Table
      data={data}
      columns={columns}
      onRowClick={(record) => message.info("Test row click: " + record.name)}
    />
  );
}
