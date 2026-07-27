import { Anchor, AnchorLink } from "react-kui";
export default function WithinContainer() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 10 }}>
      <div
        className="anchor-demo-scroll"
        style={{ height: 300, overflowY: "auto", border: "1px solid var(--kui-color-border)" }}
      >
        <div id="item-1" style={{ height: 400, background: "#e6f7ff3c" }}>
          content 1
        </div>
        <div id="item-2" style={{ height: 400, background: "#fff7e640" }}>
          content 2
        </div>
      </div>
      <Anchor container=".anchor-demo-scroll">
        <AnchorLink href="#item-1" title="part 1" />
        <AnchorLink href="#item-2" title="part 2" />
      </Anchor>
    </div>
  );
}
