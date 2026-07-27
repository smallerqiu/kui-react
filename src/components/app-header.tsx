import { Languages, LogoGithub, LogoKui, Moon, Search, Sun } from "kui-icons";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../../components/button";
import Icon from "../../components/icon";
import { version } from "../../package.json";
import { useDocs } from "../context";
import { routeData } from "../menu";

export default function AppHeader() {
  const navigate = useNavigate();
  const { lang, changeLang, t } = useDocs();
  const [query, setQuery] = useState("");
  const [dark, setDark] = useState(() => localStorage.getItem("theme-mode") === "dark");
  useEffect(() => {
    document.documentElement.setAttribute("theme-mode", dark ? "dark" : "light");
    localStorage.setItem("theme-mode", dark ? "dark" : "light");
  }, [dark]);
  const search = (name: string) => {
    setQuery("");
    const item = routeData.find((entry) => entry.name === name);
    if (item)
      navigate(
        `/${item.key === "guide" ? "guide" : "components"}/${name}${lang === "en" ? "-en" : ""}`
      );
  };
  return (
    <header className="header">
      <div className="header-inner">
        <Link className="logo" to="/">
          <Icon type={LogoKui} />
          <span className="wrap-name">
            <span className="name">Kui React</span>
            <span className="ver">v {version}</span>
          </span>
        </Link>
        <div className="search-component">
          <Icon type={Search} />
          <input
            list="component-search"
            value={query}
            placeholder="Search"
            onChange={(event) => {
              setQuery(event.target.value);
              if (routeData.some((item) => item.name === event.target.value))
                search(event.target.value);
            }}
          />
          <datalist id="component-search">
            {routeData.map((item) => (
              <option value={item.name} key={item.name}>
                {item.title} {item.sub}
              </option>
            ))}
          </datalist>
        </div>
        <nav className="top-menu">
          <Link to="/">{t("menu.home")}</Link>
          <Link to={`/guide/quick-started${lang === "en" ? "-en" : ""}`}>{t("menu.docs")}</Link>
          <Link to={`/guide/components${lang === "en" ? "-en" : ""}`}>{t("menu.components")}</Link>
        </nav>
        <div className="header-actions">
          <Button icon={Languages} onClick={changeLang} title={t("menu.langTip")} />
          <Button
            icon={dark ? Sun : Moon}
            onClick={() => setDark((value) => !value)}
            title="Switch theme"
          />
          <a
            target="_blank"
            className="k-btn k-btn-fill k-btn-icon-only"
            href="https://github.com/smallerqiu/kui-react"
            rel="noreferrer"
          >
            <Icon type={LogoGithub} />
          </a>
        </div>
      </div>
    </header>
  );
}
