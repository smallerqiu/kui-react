import { useState } from "react";
import { Segmented, type SegmentedOption } from "react-kui";

const options = [
  { label: "Edit", value: "edit", shortcut: "⌘1", color: "#7c5cff" },
  { label: "Preview", value: "preview", shortcut: "⌘2", color: "#18a058" },
  { label: "Compare", value: "compare", shortcut: "⌘3", color: "#f59e0b" },
];

const renderLabel = (option: SegmentedOption, selected: boolean) => (
  <span className={`segmented-mode-label${selected ? " selected" : ""}`}>
    <i style={{ background: String(option.color) }} />
    {option.label}
    <kbd>{String(option.shortcut)}</kbd>
  </span>
);

export default function SegmentedLabelDemo() {
  const [value, setValue] = useState("preview");
  return (
    <>
      <style>{`
        .segmented-mode-label { display: inline-flex; gap: 7px; align-items: center; }
        .segmented-mode-label i { width: 6px; height: 6px; border-radius: 50%; }
        .segmented-mode-label kbd { padding: 1px 4px; color: var(--kui-color-text-description); font: inherit; font-size: 11px; line-height: 16px; background: var(--kui-color-bg-2); border-radius: 3px; }
        .segmented-mode-label.selected kbd { color: var(--kui-color-primary); }
      `}</style>
      <Segmented
        value={value}
        options={options}
        renderLabel={renderLabel}
        onChange={(next) => setValue(String(next))}
      />
    </>
  );
}
