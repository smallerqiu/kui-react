import { Moon, Sun } from "kui-icons";
import { useState } from "react";
import {
  Button,
  type SizeType,
  Icon,
  RadioGroup,
  Space,
  KSwitch as Switch,
  Tag,
  Table,
  type Column,
} from "react-kui";
import { people, type Person } from "./data";
export default function Control() {
  const [size, setSize] = useState<SizeType>("medium"),
    [bordered, setBordered] = useState(true),
    [loading, setLoading] = useState(false),
    [checkable, setCheckable] = useState(false),
    [empty, setEmpty] = useState(false),
    [striped, setStriped] = useState(false);
  const columns: Column<Person>[] = [
    { title: "Name", key: "name" },
    { title: "Age", key: "age", sorter: true },
    {
      title: "Gender",
      key: "gender",
      render: (value) => (
        <Icon type={value === 1 ? Moon : Sun} color={value === 1 ? "blue" : "#f50cff"} size={15} />
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
    { title: "Operate", key: "action", render: () => <Button size="small">test</Button> },
  ];
  return (
    <div>
      <Space wrap>
        Size:{" "}
        <RadioGroup
          value={size}
          onChange={setSize}
          size="small"
          type="button"
          options={["large", "medium", "small"].map((value) => ({ value, label: value }))}
        />
        Border: <Switch checked={bordered} onChange={(value) => setBordered(Boolean(value))} />
        Loading: <Switch checked={loading} onChange={(value) => setLoading(Boolean(value))} />
        Checkbox: <Switch checked={checkable} onChange={(value) => setCheckable(Boolean(value))} />
        Empty: <Switch checked={empty} onChange={(value) => setEmpty(Boolean(value))} />
        Striped: <Switch checked={striped} onChange={(value) => setStriped(Boolean(value))} />
      </Space>
      <Table
        data={empty ? [] : people}
        columns={columns}
        loading={loading}
        size={size}
        striped={striped}
        bordered={bordered}
        checkable={checkable}
        header={<div>header</div>}
        footer={<div>footer</div>}
      />
    </div>
  );
}
