import { Download, Ellipsis, Gamepad2, Heart, Mail, Shirt } from "kui-icons";
import { Button, Dropdown, Menu, MenuItem, Space } from "react-kui";
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
  const icons = [Download, Gamepad2, Heart, Mail, Shirt];
  return (
    <Space size="medium">
      <Space compact vertical>
        {icons.map((icon, index) => (
          <Button icon={icon} key={index} />
        ))}
        <Dropdown placement="bottom-left" overlay={overlay}>
          <Button icon={Ellipsis} />
        </Dropdown>
      </Space>
      <Space compact vertical>
        {Array.from({ length: 4 }, (_, index) => (
          <Button theme="dashed" key={index}>
            Button{index + 1}
          </Button>
        ))}
      </Space>
      <Space compact vertical>
        {Array.from({ length: 4 }, (_, index) => (
          <Button key={index}>Button{index + 1}</Button>
        ))}
      </Space>
    </Space>
  );
}
