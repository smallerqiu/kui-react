import { Space, Badge } from "react-kui";
const values: Array<{ count: string | number; maxCount?: number }> = [
  { count: 99 },
  { count: 100 },
  { count: 20, maxCount: 10 },
  { count: 1000, maxCount: 999 },
  { count: "hot" },
  { count: "new" },
];
export default function Max() {
  return (
    <Space size="large" wrap>
      {values.map(({ count, maxCount }) => (
        <Badge key={String(count)} count={count} maxCount={maxCount}>
          <div className="badge-box" />
        </Badge>
      ))}
    </Space>
  );
}
