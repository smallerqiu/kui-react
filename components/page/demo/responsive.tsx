import { Page } from "react-kui";

export default function App() {
  return (
    <div
      style={{
        width: 720,
        maxWidth: "100%",
        minWidth: 180,
        resize: "horizontal",
        overflow: "auto",
        padding: 16,
        boxSizing: "border-box",
        border: "1px solid var(--kui-color-border)",
      }}
    >
      <Page total={10000} page={50} showSizer showElevator />
    </div>
  );
}
