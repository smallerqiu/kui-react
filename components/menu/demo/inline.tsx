import { Heart, Mail, Settings } from "kui-icons";
import { useState } from "react";
import { Menu, type MenuOptionsProps } from "react-kui";
const items: MenuOptionsProps[] = [
  {
    key: "sub1",
    icon: Mail,
    title: "Navigation One",
    children: [
      { key: "1-1", icon: Heart, title: "Option 1" },
      { key: "1-2", icon: Heart, title: "Option 2" },
      { key: "1-3", icon: Heart, title: "Option 3" },
      { key: "1-4", icon: Heart, title: "Option 4" },
    ],
  },
  {
    key: "sub2",
    icon: Heart,
    title: "Navigation Two",
    children: [
      { key: "2-1", title: "Option 5" },
      { key: "2-2", title: "Option 6" },
      {
        key: "sub2-1",
        title: "SubMenu",
        children: [
          { key: "2-3", title: "Option 7" },
          { key: "2-4", title: "Option 8" },
        ],
      },
    ],
  },
  {
    key: "sub3",
    icon: Settings,
    title: "Navigation Three",
    children: [
      { key: "3-1", title: "Option 9" },
      { key: "3-2", title: "Option 10" },
      { key: "3-3", title: "Option 11" },
      { key: "3-4", title: "Option 12" },
    ],
  },
];
export default function App() {
  const [current, setCurrent] = useState(["1-1"]),
    [openKeys, setOpenKeys] = useState(["sub1"]);
  return (
    <div style={{ width: 256 }}>
      <Menu
        value={current}
        onSelect={({ key }) => setCurrent([key])}
        openKeys={openKeys}
        mode="inline"
        onOpenChange={(keys) => {
          setOpenKeys(keys);
          console.log(keys);
        }}
        items={items}
      />
    </div>
  );
}
