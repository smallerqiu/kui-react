import { useRef } from "react";
import { Button, Popup } from "react-kui";
export default function App() {
  const container = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={container}
      style={{
        position: "relative",
        minHeight: 200,
        padding: 24,
        border: "1px dashed var(--kui-color-border)",
      }}
    >
      <Popup
        getPopupContainer={() => container.current}
        matchTriggerWidth
        overlay={<span>Mounted inside this container.</span>}
      >
        <Button style={{ width: 240, maxWidth: "100%" }}>Custom container</Button>
      </Popup>
    </div>
  );
}
