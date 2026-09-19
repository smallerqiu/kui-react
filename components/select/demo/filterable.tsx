import { useState } from "react";
import { Space, Select } from "react-kui";
import { fruits } from "./data";
const options = fruits.map((value) => ({ label: value, value }));
export default function App() {
  const [v1, setV1] = useState<string | number>(""),
    [v2, setV2] = useState<(string | number)[]>([]),
    [v3, setV3] = useState<string | number>(""),
    [v4, setV4] = useState<(string | number)[]>([]),
    [remote, setRemote] = useState<typeof options>([]),
    [loading, setLoading] = useState(false);
  const search = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.trim().toLowerCase();
    setLoading(true);
    setTimeout(() => {
      setRemote(options.filter((item) => item.value.includes(query)));
      setLoading(false);
    }, 1000);
  };
  return (
    <Space vertical block>
      <span>Filtering:</span>
      <Select
        value={v1}
        onChange={(next) => !Array.isArray(next) && next !== undefined && setV1(next)}
        block
        placeholder="Filtering"
        filterable
        options={options}
      />
      <br />
      <span>Multiple Filtering:</span>
      <Select
        value={v2}
        onChange={(next) => Array.isArray(next) && setV2(next)}
        multiple
        maxTagCount={3}
        block
        placeholder="Multiple Filtering"
        filterable
        options={options}
      />
      <br />
      <span>Search:</span>
      <Select
        value={v3}
        onChange={(next) => !Array.isArray(next) && next !== undefined && setV3(next)}
        onSearch={search}
        block
        loading={loading}
        placeholder="Search"
        options={remote}
      />
      <br />
      <span>Multiple Search:</span>
      <Select
        value={v4}
        onChange={(next) => Array.isArray(next) && setV4(next)}
        multiple
        block
        maxTagCount={3}
        loading={loading}
        onSearch={search}
        placeholder="Multiple Search"
        options={remote}
      />
    </Space>
  );
}
