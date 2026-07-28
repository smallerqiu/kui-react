import { useEffect, useState } from "react";
import { Space, Option, Select } from "react-kui";
import { data as initial } from "./data";
export default function App() {
  const [value1, setValue1] = useState<any>(2),
    [value2, setValue2] = useState<any>(2),
    [data, setData] = useState(initial);
  useEffect(() => {
    const timer = setTimeout(
      () => setData(initial.map((item) => ({ ...item, label: `${item.label}1` }))),
      1000
    );
    return () => clearTimeout(timer);
  }, []);
  return (
    <Space vertical>
      use options: {value1}
      <Select value={value1} options={data} onChange={setValue1} />
      <br />
      use children: {value2}
      <Select value={value2} onChange={setValue2}>
        {data.map((item) => (
          <Option key={item.value} value={item.value}>
            {item.label}
          </Option>
        ))}
      </Select>
    </Space>
  );
}
