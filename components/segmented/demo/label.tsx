import { useState, type CSSProperties } from "react";
import { Segmented, type SegmentedOption } from "react-kui";

const options = [
  { label: "Edit", value: "edit", shortcut: "⌘1", color: "#7c5cff" },
  { label: "Preview", value: "preview", shortcut: "⌘2", color: "#18a058" },
  { label: "Compare", value: "compare", shortcut: "⌘3", color: "#f59e0b" },
];

const styles = {
  label: { display: "inline-flex", gap: 7, alignItems: "center" },
  dot: { width: 6, height: 6, borderRadius: "50%" },
  shortcut: {
    padding: "1px 4px",
    color: "var(--kui-color-text-description)",
    font: "inherit",
    fontSize: 11,
    lineHeight: "16px",
    background: "var(--kui-color-bg-2)",
    borderRadius: 3,
  },
} satisfies Record<string, CSSProperties>;

const renderLabel = (option: SegmentedOption, selected: boolean) => (
  <span style={styles.label}>
    <i style={{ ...styles.dot, background: String(option.color) }} />
    {option.label}
    <kbd
      style={{
        ...styles.shortcut,
        color: selected ? "var(--kui-color-primary)" : styles.shortcut.color,
      }}
    >
      {String(option.shortcut)}
    </kbd>
  </span>
);

export default function SegmentedLabelDemo() {
  const [value, setValue] = useState("preview");
  return (
    <Segmented
      value={value}
      options={options}
      renderLabel={renderLabel}
      onChange={(next) => setValue(String(next))}
    />
  );
}
