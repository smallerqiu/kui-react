import { KImage as Image, Space, Switch } from "react-kui";

export default function ComponentNamesDemo() {
  return (
    <Space>
      <Switch checked aria-label="Example switch" />
      <Image src="https://cdn.chuchur.com/img/chick.jpeg" width={50} />
    </Space>
  );
}
