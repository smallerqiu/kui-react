import Color, { type ColorInstance } from "color";
import { Input } from "../input";
import InputNumber from "../input-number";
import { Select } from "../select";
import { isColor } from "../utils/color";
export type ColorMode = "hex" | "rgb" | "hsl";
export interface ModeProps { value: string | ColorInstance; mode?: ColorMode; disabledAlpha?: boolean; onUpdateMode?: (mode: ColorMode) => void; onUpdateColorValue?: (color: ColorInstance) => void }
export default function Mode({ value, mode = "hex", disabledAlpha, onUpdateMode, onUpdateColorValue }: ModeProps) {
  const color = Color(value), alpha = color.alpha();
  const change = (number: number | undefined, channel: "r"|"g"|"b"|"a"|"h"|"s"|"l") => {
    if (number == null) return; let next = Color(value);
    if (channel === "r") next = next.red(number); else if (channel === "g") next = next.green(number); else if (channel === "b") next = next.blue(number); else if (channel === "a") next = next.alpha(number / 100); else if (channel === "h") next = next.hue(number); else if (channel === "s") next = next.saturationl(number); else next = next.lightness(number);
    onUpdateColorValue?.(next);
  };
  const inputs = mode === "hex" ? <Input prefix="#" size="small" value={color.hex().slice(1)} onChange={(hex) => isColor(`#${hex}`) && onUpdateColorValue?.(Color(`#${hex}`).alpha(alpha))} />
    : mode === "rgb" ? color.rgb().array().slice(0,3).map((item,index) => <InputNumber key={index} size="small" min={0} max={255} value={Math.round(item)} onChange={(number) => change(number, (["r","g","b"] as const)[index])} />)
      : color.hsl().array().slice(0,3).map((item,index) => <InputNumber key={index} size="small" min={0} max={index ? 100 : 359} value={Math.round(item)} formatter={index ? (number) => `${number}%` : undefined} parser={index ? (text) => text.replace("%","") : undefined} onChange={(number) => change(number, (["h","s","l"] as const)[index])} />);
  return <div className={`k-color-picker-mode k-color-picker-${mode}`}>
    <Select clearable={false} bordered={false} size="small" value={mode} options={[{label:"HEX",value:"hex"},{label:"RGB",value:"rgb"},{label:"HSL",value:"hsl"}]} onChange={(next) => onUpdateMode?.(next as ColorMode)} />
    <div className="k-color-picker-val">{inputs}{!disabledAlpha && <InputNumber className="k-color-picker-alpha-input" value={Math.round(alpha*100)} size="small" min={0} max={100} formatter={(number)=>`${number}%`} parser={(text)=>text.replace("%","")} onChange={(number)=>change(number,"a")} />}</div>
  </div>;
}
