import { useCallback, useEffect, useRef, useState } from "react";
import Table, { type Column, type SortState } from "../index";
interface Row {
  key: string;
  name: string;
  age: number;
  mail: string;
}
const source: Row[] = [
  { key: "0", name: "Qiu", age: 32, mail: "chuchur@qq.com" },
  { key: "3", name: "Wang Kang", age: 26, mail: "wangkang@gmail.com" },
  { key: "2", name: "Liu Hao", age: 27, mail: "liuhao@162.com" },
  { key: "1", name: "Li Lei", age: 33, mail: "hanlin@hotmail.com" },
  { key: "4", name: "Hu Cong", age: 25, mail: "hucong@163.com" },
];
export default function TableSorter() {
  const [data, setData] = useState<Row[]>([]),
    [loading, setLoading] = useState(false),
    timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchData = useCallback((key?: string, order?: SortState["order"]) => {
    console.log(key, order);
    setLoading(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setData([...source]);
      setLoading(false);
    }, 2000);
  }, []);
  useEffect(() => {
    fetchData();
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [fetchData]);
  const columns: Column<Row>[] = [
    { title: "Name", key: "name", sorter: true },
    { title: "Age", key: "age", sorter: true },
    { title: "Email", key: "mail", sorter: (state) => fetchData("mail", state.order) },
  ];
  return (
    <Table
      data={data}
      columns={columns}
      loading={loading}
      onSort={({ key, order }) => console.log(key, order)}
    />
  );
}
