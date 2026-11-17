const positions = ["tl", "tr", "bl", "br"];
const labels = ["Top left", "Top right", "Bottom left", "Bottom right"];

export interface CornersProps {
  disabled?: boolean;
  colors: string[];
  selected?: number;
  gradient?: string;
  onActivate?: (index: number, element: HTMLElement) => void;
}

export default function Corners({
  disabled = false,
  colors,
  selected = 0,
  gradient = "",
  onActivate,
}: CornersProps) {
  return (
    <div className="k-gradient-picker-corners">
      <div className="k-gradient-picker-corners-fill">
        <div className="k-gradient-picker-corners-color" style={{ backgroundImage: gradient }} />
      </div>
      {colors.map((color, index) => (
        <button
          key={positions[index]}
          type="button"
          className={[
            "k-gradient-picker-corner",
            `k-gradient-picker-corner-${positions[index]}`,
            index === selected && "k-gradient-picker-corner-active",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-label={labels[index]}
          aria-pressed={index === selected}
          aria-haspopup="dialog"
          aria-disabled={disabled || undefined}
          disabled={disabled}
          onClick={(event) => {
            if (disabled) return;
            onActivate?.(index, event.currentTarget);
          }}
        >
          <span className="k-gradient-picker-corner-color" style={{ backgroundColor: color }} />
        </button>
      ))}
    </div>
  );
}
