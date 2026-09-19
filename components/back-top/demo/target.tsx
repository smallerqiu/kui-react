import { useRef } from "react";
import { BackTop } from "react-kui";

export default function App() {
  const container = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={container}
      style={{ height: 180, overflow: "auto", border: "1px solid var(--kui-control-border)" }}
    >
      <div style={{ height: 600, padding: 16 }}>Scroll this container</div>
      <BackTop target={() => container.current} height={80} right={100} />
    </div>
  );
}
