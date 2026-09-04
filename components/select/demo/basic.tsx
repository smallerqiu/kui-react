import { useEffect, useState } from "react";
import { Space, Option, Select } from "react-kui";
import { data as initial } from "./data";
export default function App() {
  const [value1, setValue1] = useState<string | number>(2),
    [value2, setValue2] = useState<string | number>(2),
    [data, setData] = useState(initial);
  useEffect(() => {
    const timer = setTimeout(
      () => setData(initial.map((item) => ({ ...item, label: `${item.label}1` }))),
      1000,
    );
    return () => clearTimeout(timer);
  }, []);
  return (
    <Space vertical>
      use options: {value1}
      <Select
        value={value1}
        options={data}
        onChange={(next) => !Array.isArray(next) && next !== undefined && setValue1(next)}
      />
      <br />
      use children: {value2}
      <Select
        value={value2}
        onChange={(next) => !Array.isArray(next) && next !== undefined && setValue2(next)}
      >
        {data.map((item) => (
          <Option key={item.value} value={item.value}>
            {item.label}
          </Option>
        ))}
      </Select>
    </Space>
  );
}
