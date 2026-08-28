import { useRef, useState } from "react";
import { Mentions } from "react-kui";

const members = ["Alice", "Alex", "Bob", "Bella", "Cindy"];

export default function App() {
  const [value, setValue] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const search = (query: string) => {
    if (timer.current) clearTimeout(timer.current);
    setLoading(true);
    timer.current = setTimeout(() => {
      setOptions(members.filter((member) => member.toLowerCase().includes(query.toLowerCase())));
      setLoading(false);
    }, 500);
  };
  return (
    <Mentions
      value={value}
      onChange={setValue}
      onSearch={search}
      loading={loading}
      loadingText="Searching"
      options={options}
      placeholder="输入 @ 后继续输入以远程搜索"
    />
  );
}
