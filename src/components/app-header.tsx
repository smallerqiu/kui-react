import Color from "color";
import { ArrowUpRight, Languages, LogoGithub, LogoKui, Moon, Search, Sun } from "kui-icons";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Button,
  ColorPicker,
  Divider,
  Header,
  Icon,
  Menu,
  Select,
  Space,
  Tooltip,
  theme,
  type MenuOptionsProps,
  type MenuSelectEvent,
} from "react-kui";
import { useLocation, useNavigate } from "react-router";
import { version } from "../../package.json";
import { useDocs } from "../context";
import { routeData } from "../menu";

const DEFAULT_THEME_COLOR = "#3a95ff";

function updateThemeColorStyle(value: string) {
  const [red, green, blue] = Color(value).rgb().array();
  let style = document.querySelector<HTMLStyleElement>('style[name="kui"]');
  if (!style) {
    style = document.createElement("style");
    style.setAttribute("name", "kui");
    document.head.appendChild(style);
  }
  style.textContent = `
    body[theme-type='custom'] {
      --kui-color-primary: rgb(${red}, ${green}, ${blue});
      --kui-color-primary-hover: rgba(${red}, ${green}, ${blue}, .9);
      --kui-color-primary-active: rgba(${red}, ${green}, ${blue}, .75);
      --kui-color-primary-1: rgba(${red}, ${green}, ${blue}, .9);
      --kui-color-primary-3: rgba(${red}, ${green}, ${blue}, .7);
      --kui-color-primary-6: rgba(${red}, ${green}, ${blue}, .4);
      --kui-color-primary-8: rgba(${red}, ${green}, ${blue}, .2);
      --kui-color-primary-9: rgba(${red}, ${green}, ${blue}, .1);
      --kui-color-item-selected: rgba(${red}, ${green}, ${blue}, .2);
      --kui-color-outline: rgba(${red}, ${green}, ${blue}, .2);
    }
  `;
  document.body.setAttribute("theme-type", "custom");
}

export default function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, changeLang, t } = useDocs();
  const [query, setQuery] = useState<string | number>("");
  const [themeColor, setThemeColor] = useState(
    () => localStorage.getItem("themeColor") || DEFAULT_THEME_COLOR
  );
  const [themeMode, setThemeMode] = useState(
    () => document.documentElement.getAttribute("theme-mode") || "light"
  );

  const withLang = (path: string) => `${path}${lang === "en" ? "-en" : ""}`;
  const externalTitle = (title: ReactNode) => (
    <span>
      {title} <Icon type={ArrowUpRight} />
    </span>
  );
  const topMenuItems = useMemo<MenuOptionsProps[]>(
    () => [
      { key: "home", title: t("menu.home") },
      { key: "components", title: t("menu.components") },
      {
        key: "docs",
        title: t("menu.docs"),
        children: [
          { key: "/guide/quick-started", title: externalTitle(t("menu.quick_start")) },
          {
            key: "/guide/usage-with-next",
            title: externalTitle(t("menu.usage_with_next")),
          },
          { key: "/guide/language", title: externalTitle(t("menu.language")) },
          { key: "/guide/change-log", title: externalTitle(t("menu.change_log")) },
          { key: "/guide/dark-mode", title: externalTitle(t("menu.dark_mode")) },
          { key: "https://react-v2.k-ui.cn/", title: externalTitle(t("menu.docs_v2")) },
          {
            key: "https://react.k-ui.cn/",
            title: externalTitle(t("menu.docs_react")),
          },
          { key: "https://chuchur.com/", title: externalTitle("Blog") },
        ],
      },
    ],
    [t]
  );
  const activeTopMenu =
    location.pathname === "/"
      ? ["home"]
      : location.pathname.startsWith("/components/")
        ? ["components"]
        : ["docs"];

  const applyThemeColor = (value: string) => {
    updateThemeColorStyle(value);
    localStorage.setItem("themeColor", value);
    setThemeColor(value);
  };

  useEffect(() => {
    const savedColor = localStorage.getItem("themeColor");
    if (savedColor) updateThemeColorStyle(savedColor);
  }, []);

  const search = (name: string) => {
    const item = routeData.find((entry) => entry.name === name);
    if (!item) return;
    navigate(withLang(`/${item.key === "guide" ? "guide" : "components"}/${item.name}`));
    setQuery("");
  };
  const menuSelect = ({ key }: MenuSelectEvent) => {
    if (key === "home") navigate("/");
    else if (key === "components") navigate(withLang("/guide/components"));
    else if (/^https?:\/\//.test(key)) window.open(key, "_blank", "noopener,noreferrer");
    else navigate(withLang(key));
  };

  return (
    <Header className="header">
      <div className="header-inner">
        <div className="logo" onClick={() => navigate("/")}>
          <Icon type={LogoKui} />
          <span className="wrap-name">
            <span className="name">Kui React</span>
            <span className="ver">v {version}</span>
          </span>
        </div>
        <Divider type="vertical" />
        <div className="search-component">
          <Select
            value={query}
            placeholder="Search"
            icon={Search}
            showArrow={false}
            filterable
            options={routeData.map((item) => ({
              value: item.name,
              label: `${item.title} ${item.sub}`,
            }))}
            onChange={(value) => {
              const next = Array.isArray(value) ? value[0] : value;
              setQuery(next ?? "");
              if (next !== undefined) search(String(next));
            }}
          />
        </div>
        <Menu
          value={activeTopMenu}
          mode="horizontal"
          className="top-menu"
          items={topMenuItems}
          onSelect={menuSelect}
        />
        <Space>
          <ColorPicker
            value={themeColor}
            className="theme"
            mode="rgb"
            style={{ marginLeft: 8 }}
            disabledAlpha
            onChange={applyThemeColor}
          />
          <Tooltip title={t("menu.langTip")} placement="bottom">
            <Button icon={Languages} onClick={changeLang} />
          </Tooltip>
          <Tooltip
            title={`Switch ${themeMode === "dark" ? "light" : "dark"} theme`}
            placement="bottom"
          >
            <Button
              icon={themeMode === "dark" ? Sun : Moon}
              onClick={(event) =>
                theme.setThemeMode(event.nativeEvent, (isDark) =>
                  setThemeMode(isDark ? "dark" : "light")
                )
              }
            />
          </Tooltip>
          <a
            target="_blank"
            className="k-btn k-btn-fill k-btn-icon-only"
            href="https://github.com/smallerqiu/react-kui"
            rel="noreferrer"
          >
            <Icon type={LogoGithub} />
          </a>
        </Space>
      </div>
    </Header>
  );
}
