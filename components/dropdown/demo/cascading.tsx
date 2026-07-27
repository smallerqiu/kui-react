import { ChevronDown } from "kui-icons";
import { Button, Icon, Menu, type MenuSelectEvent, Dropdown } from "react-kui";
const items = [
  { key: "1-1", title: "1st menu item" },
  { key: "1-2", title: "2nd menu item" },
  {
    key: "2",
    title: "sub menu",
    children: [
      { key: "2-1", title: "3rd menu item" },
      { key: "2-2", title: "4th menu item" },
      {
        key: "2-3",
        title: "sub menu",
        children: [
          { key: "2-3-1", title: "3rd menu item" },
          { key: "2-3-2", title: "4th menu item" },
        ],
      },
    ],
  },
  {
    key: "3",
    title: "disabled sub menu",
    disabled: true,
    children: [
      { key: "3-1", title: "5th menu item" },
      { key: "3-2", title: "6th menu item" },
    ],
  },
];
export default function Cascading() {
  const overlay = <Menu items={items} onSelect={({ key }: MenuSelectEvent) => console.log(key)} />;
  return (
    <Dropdown overlay={overlay}>
      <Button>
        Multi-level Menu <Icon type={ChevronDown} />
      </Button>
    </Dropdown>
  );
}
