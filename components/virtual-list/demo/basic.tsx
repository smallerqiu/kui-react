import { VirtualList } from "react-kui";
const items = Array.from({ length: 10000 }, (_, index) => ({
  id: index + 1,
  label: `Virtual item ${index + 1}`,
}));
export default function App() {
  return (
    <VirtualList data={items} height={280} itemHeight={40} itemKey="id">
      {(item, index) => (
        <div
          style={{
            display: "flex",
            height: "100%",
            alignItems: "center",
            padding: "0 16px",
            borderBottom: "1px solid var(--kui-color-border)",
            gap: 16,
          }}
        >
          <span>#{index + 1}</span>
          <span>{item.label}</span>
        </div>
      )}
    </VirtualList>
  );
}
