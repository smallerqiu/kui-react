import { AutoComplete } from "react-kui";
import { useEffect, useRef, useState } from "react";
export default function App() {
  const [value, setValue] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const controller = useRef<AbortController>(undefined);
  useEffect(
    () => () => {
      clearTimeout(timer.current);
      controller.current?.abort();
    },
    []
  );
  const search = (keyword: string) => {
    clearTimeout(timer.current);
    controller.current?.abort();
    if (!keyword.trim()) {
      setLoading(false);
      setOptions([]);
      return;
    }
    setLoading(true);
    timer.current = setTimeout(async () => {
      const request = new AbortController();
      controller.current = request;
      try {
        const response = await fetch(
          `https://dummyjson.com/products/search?q=${encodeURIComponent(keyword)}&limit=8&select=title`,
          { signal: request.signal }
        );
        const data = (await response.json()) as { products: Array<{ title: string }> };
        setOptions(data.products.map((item) => item.title));
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) setOptions([]);
      } finally {
        if (!request.signal.aborted) setLoading(false);
      }
    }, 300);
  };
  return (
    <AutoComplete
      value={value}
      onChange={setValue}
      options={options}
      loading={loading}
      placeholder="输入商品名称"
      onSearch={search}
    />
  );
}
