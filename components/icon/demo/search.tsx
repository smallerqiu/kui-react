import * as icons from "kui-icons";
import { useMemo, useState } from "react";
import { Affix, Flex, Grid, GridItem, Icon, Input, Tag, type IconType } from "react-kui";
import { copyToClipboard } from "react-kui/utils/share";
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

export default function App() {
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
        <Grid className="icon-list" itemMinWidth={56} xGap={8} yGap={8}>
          {items.map((name) => (
            <GridItem key={name} className="icon-item" onClick={() => void copyToClipboard(name)}>
              <Icon type={iconMap[name]} strokeWidth={1} />
              <span className="item-tip">{name}</span>
            </GridItem>
          ))}
        </Grid>
      </>
    ) : null;
  return (
    <div>
      <h3>Icons Filter</h3>
      <Affix offsetTop={65}>
        <Flex size="large" style={{ backgroundColor: "var(--kui-color-bg)" }}>
          <Input
            value={query}
            onChange={(value) => setQuery(value)}
            placeholder="Enter keyword to search, then click an icon to copy its name."
            icon={icons.Search}
            suffix={<Tag>⌘K</Tag>}
          />
        </Flex>
      </Affix>
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
