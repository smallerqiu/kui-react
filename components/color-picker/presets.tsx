import Color, { type ColorInstance } from "color";
import { Check } from "kui-icons";
import Icon from "../icon";
const defaults = ["#f44336","#e91e63","#9c27b0","#673ab7","#3f51b5","#2196f3","#03a9f4","#00bcd4","#009688","#4caf50","#8bc34a","#cddc39","#ffeb3b","#ffc107","#ff9800","#ff5722","#795548","#9e9e9e","#607d8b","#000"];
export interface PresetsProps { color: string | ColorInstance; presets?: string[]; onUpdateColor?: (color: ColorInstance) => void }
export default function Presets({ color, presets = defaults, onUpdateColor }: PresetsProps) {
  if (!presets.length) return null; const active = Color(color).hex();
  return <div className="k-color-picker-presets">{presets.map((hex) => <span key={hex} style={{ backgroundColor: hex }} onClick={() => onUpdateColor?.(Color(hex))}>{active === Color(hex).hex() && <Icon type={Check} />}</span>)}</div>;
}
