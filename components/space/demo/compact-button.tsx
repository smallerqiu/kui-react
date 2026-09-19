import { Download, Ellipsis, Gamepad2, Heart, Mail, Shirt } from "kui-icons";
import { Button, Dropdown, Menu, MenuItem, Space, Tooltip } from "react-kui";
const iconButtons = [Download, Gamepad2, Heart, Mail, Shirt];
const overlay = (
  <Menu>
    <MenuItem>
      <a href="javascript:;">1st menu item</a>
    </MenuItem>
    <MenuItem>
      <a href="javascript:;">2nd menu item</a>
    </MenuItem>
    <MenuItem>
      <a href="javascript:;">3rd menu item</a>
    </MenuItem>
  </Menu>
);
export default function App() {
  return (
    <Space vertical size="medium">
      <Space compact>
        {iconButtons.map((icon, index) =>
          index === 0 ? (
            <Tooltip placement="top" title="Copy" key={index}>
              <Button icon={icon} />
            </Tooltip>
          ) : (
            <Button icon={icon} key={index} />
          )
        )}
        <Dropdown placement="bottom-right" overlay={overlay}>
          <Button icon={Ellipsis} />
        </Dropdown>
      </Space>
      <Space compact>
        {Array.from({ length: 4 }, (_, index) => (
          <Button type="primary" key={index}>
            Button{index + 1}
          </Button>
        ))}
      </Space>
      <Space compact>
        <Button>Button1</Button>
        <Button>Button2</Button>
        <Button>Button3</Button>
        <Button icon={Shirt} disabled />
        <Button icon={Shirt} />
        <Button>Button4</Button>
      </Space>
    </Space>
  );
}
