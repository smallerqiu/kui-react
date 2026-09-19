import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { Menu } from "../../components/menu";
import { Mail } from "kui-icons";
import "../../components/styles/index.less";
const items = [
  { key: "leaf", title: "Standalone item", icon: Mail },
  {
    key: "root",
    title: "Root",
    icon: Mail,
    children: [
      {
        key: "nested",
        title: "Nested",
        icon: Mail,
        children: [
          {
            key: "deep",
            title: "Deep",
            icon: Mail,
            children: [
              { key: "one", title: "First", icon: Mail },
              { key: "two", title: "Second", icon: Mail },
            ],
          },
        ],
      },
    ],
  },
];
export function Fixture() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div style={{ width: 256 }}>
      <button id="toggle" onClick={() => setCollapsed((value) => !value)}>
        Toggle
      </button>
      <Menu
        mode="inline"
        inlineCollapsed={collapsed}
        defaultOpenKeys={["root", "nested", "deep"]}
        items={items}
      />
    </div>
  );
}
createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <Fixture />
  </StrictMode>,
);
