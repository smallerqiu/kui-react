import { useState } from "react";
import { Button } from "../../button";
import type { DirectionType } from "../../const/types";
import Space from "../../space";
import Menu from "../index";
import { items } from "./data";
export default function Mode() {
  const [current, setCurrent] = useState(["1-1"]),
    [openKeys, setOpenKeys] = useState(["sub2"]),
    [mode, setMode] = useState<DirectionType>("inline"),
    [dark, setDark] = useState(false);
  return (
    <div>
      <Space>
        <Button onClick={() => setMode(mode === "inline" ? "vertical" : "inline")}>
          Change Mode
        </Button>
        <Button onClick={() => setDark(!dark)}>Change Theme</Button>
      </Space>
      <br />
      <br />
      <Menu
        value={current}
        onSelect={({ key }) => setCurrent([key])}
        openKeys={openKeys}
        onOpenChange={setOpenKeys}
        theme={dark ? "dark" : "light"}
        mode={mode}
        style={{ width: 256 }}
        items={items}
      />
    </div>
  );
}
