import { Heart, Mail, Settings } from "kui-icons";
import { useState } from "react";
import { Menu, type MenuOptionsProps } from "react-kui";
const items: MenuOptionsProps[] = [
  { title: "Navigation One", key: "1", icon: Mail },
  { title: "Navigation Two", key: "2", icon: Heart, disabled: true },
  {
    title: "Navigation - Submenu",
    key: "3",
    icon: Settings,
    children: [
      { title: "Option 1", key: "3-1" },
      { title: "Option 2", key: "3-2" },
      { title: "Option 3", key: "3-3" },
      { title: "Option 4", key: "3-4" },
      {
        title: "Submenu",
        key: "3-5",
        children: [1, 2, 3, 4].map((n) => ({ title: `Option ${n}`, key: `3-5-${n}` })),
      },
    ],
  },
  {
    title: (
      <a href="https://react.k-ui.cn" target="_blank" rel="noreferrer">
        Navigation - Link
      </a>
    ),
    key: "4",
  },
];
export default function Basic() {
  const [current, setCurrent] = useState(["1"]);
  return (
    <Menu
      mode="horizontal"
      value={current}
      onSelect={({ key }) => setCurrent([key])}
      items={items}
    />
  );
}
