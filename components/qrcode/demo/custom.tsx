import { useState } from "react";
import ColorPicker from "../../color-picker";
import { Radio, RadioGroup } from "../../radio";
import Slider from "../../slider";
import Space from "../../space";
import Switch from "../../switch";
import QRCode, { type QRCodeErrorLevel } from "../index";
export default function Custom() {
  const [color, setColor] = useState("#4CAF50"),
    [size, setSize] = useState(100),
    [margin, setMargin] = useState(0),
    [level, setLevel] = useState<QRCodeErrorLevel>("L"),
    [bordered, setBordered] = useState(true);
  return (
    <Space vertical block>
      <QRCode
        value="https://k-ui.cn"
        size={size}
        colorDark={color}
        errorLevel={level}
        bordered={bordered}
        margin={margin}
      />
      <Space>
        Color: <ColorPicker value={color} onChange={setColor} />
      </Space>
      <Space>
        Size:{" "}
        <Slider
          value={size}
          min={100}
          max={150}
          style={{ width: 200 }}
          onChange={(v) => setSize(v as number)}
        />
      </Space>
      <Space>
        Margin:{" "}
        <Slider
          value={margin}
          max={10}
          style={{ width: 200 }}
          onChange={(v) => setMargin(v as number)}
        />
      </Space>
      <Space>
        ErrorLevel:
        <RadioGroup
          value={level}
          theme="card"
          type="button"
          onChange={(v) => setLevel(v as QRCodeErrorLevel)}
        >
          {(["L", "M", "Q", "H"] as QRCodeErrorLevel[]).map((v) => (
            <Radio key={v} value={v}>
              {v}
            </Radio>
          ))}
        </RadioGroup>
      </Space>
      <Space>
        Border: <Switch checked={bordered} onChange={(v) => setBordered(Boolean(v))} />
      </Space>
    </Space>
  );
}
