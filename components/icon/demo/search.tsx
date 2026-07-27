import * as icons from "kui-icons";
import { useMemo, useState } from "react";
import { copyToClipboard } from "../../utils/share";
import Icon, { type IconType } from "../index";
import "./search.less";
import { tags } from "./tags";

const iconMap = icons as unknown as Record<string, IconType[]>;
const names = Object.keys(iconMap);
const toPascalCase = (value: string) =>
  value
    .split("-")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join("");

export default function IconSearchDemo() {
  const [query, setQuery] = useState("");
  const matches = useMemo(() => {
    const term = query.toLowerCase().trim();
    if (!term) return names;
    const tagged = new Set(
      tags
        .filter((icon) => icon.name.includes(term) || icon.tags.some((tag) => tag.includes(term)))
        .map((icon) => toPascalCase(icon.name))
    );
    return names.filter((name) => name.toLowerCase().includes(term) || tagged.has(name));
  }, [query]);
  const apps = matches.filter((name) => !name.startsWith("Logo"));
  const logos = matches.filter((name) => name.startsWith("Logo"));
  const section = (title: string, items: string[]) =>
    items.length ? (
      <>
        <h3>{title}</h3>
        <div
          className="icon-list"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(72px,1fr))",
            gap: 8,
          }}
        >
          {items.map((name) => (
            <button
              type="button"
              key={name}
              className="icon-item"
              onClick={() => void copyToClipboard(name)}
            >
              <Icon type={iconMap[name]} strokeWidth={1} />
              <span className="item-tip">{name}</span>
            </button>
          ))}
        </div>
      </>
    ) : null;
  return (
    <div>
      <h3>Icons Filter</h3>
      <div className="icon-search">
        <Icon type={icons.Search} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Enter keyword to search, then click an icon to copy its name."
        />
      </div>
      <div className="show-icons">
        {section("App icons", apps)}
        {section("Logos", logos)}
        {!matches.length && (
          <h3 style={{ textAlign: "center", paddingBottom: 50, color: "#888" }}>
            No results for “{query}”
          </h3>
        )}
      </div>
    </div>
  );
}
