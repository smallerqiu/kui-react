import { Moon, Sun } from "kui-icons";
import { Button } from "../../button";
import Icon from "../../icon";
import { modal } from "../../modal";
import Space from "../../space";
import Tag from "../../tag";
import Table, { type Column } from "../index";
import { people, type Person } from "./data";
const columns: Column<Person>[] = [
  { title: "Name", key: "name" },
  { title: "Age", key: "age" },
  {
    title: "Gender",
    key: "gender",
    render: (value) => (
      <Icon type={value === 1 ? Sun : Moon} color={value === 1 ? "blue" : "#f50cff"} size={15} />
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
export default function BaseRender() {
  return <Table data={people} columns={columns} />;
}
