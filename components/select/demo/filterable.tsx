import { useState } from "react";
import Space from "../../space";
import { Select } from "../index";
import { fruits } from "./data";
const options = fruits.map((value) => ({ label: value, value }));
export default function Filterable() {
  const [v1, setV1] = useState<any>(""),
    [v2, setV2] = useState<any[]>([]),
    [v3, setV3] = useState<any>(""),
    [v4, setV4] = useState<any[]>([]),
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
        onChange={setV1}
        block
        placeholder="Filtering"
        filterable
        options={options}
      />
      <br />
      <span>Multiple Filtering:</span>
      <Select
        value={v2}
        onChange={(v) => setV2(v as any[])}
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
        onChange={setV3}
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
        onChange={(v) => setV4(v as any[])}
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
