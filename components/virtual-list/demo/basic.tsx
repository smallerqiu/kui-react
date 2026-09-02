import { VirtualList } from "react-kui";
const data = Array.from({ length: 1000 }, (_, index) => ({
  id: index,
  label: `Item ${index + 1}`,
}));
export default function App() {
  return (
    <VirtualList data={data} height={300} itemHeight={40} itemKey="id">
      {(item, index) => {
        return (
          <div style={{ padding: "0 16px", lineHeight: "40px" }}>
            {index + 1}. {item.label}
          </div>
        );
      }}
    </VirtualList>
  );
}
