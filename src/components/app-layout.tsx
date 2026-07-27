import { ChevronLeft, ChevronRight, Menu as MenuIcon, X } from "kui-icons";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router";
import { Button, Content, Icon, Layout, Sider } from "react-kui";
import { useDocs } from "../context";
import { navData, routeData, type RouteItem } from "../menu";
import AppHeader from "./app-header";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { lang, t } = useDocs();
  const location = useLocation();
  const [showNav, setShowNav] = useState(false);
  const currentName = location.pathname.split("/").pop()?.replace(/-en$/, "") ?? "";
  const index = routeData.findIndex((item) => item.name === currentName);
  const prev = routeData[index - 1];
  const next = routeData[index + 1];
  const pathFor = (item: RouteItem) =>
    `/${item.key === "guide" ? "guide" : "components"}/${item.name}${lang === "en" ? "-en" : ""}`;
  useEffect(() => {
    const current = routeData[index];
    if (current)
      document.title = `${lang === "en" ? current.sub : `${current.title} ${current.sub}`} - KUI`;
    window.scrollTo(0, 0);
  }, [index, lang]);
  const groups = useMemo(() => navData, []);
  return (
    <Layout className="root">
      <AppHeader />
      <Layout className="main">
        <Sider
          className={["docs-k-layout-sider", showNav && "docs-k-layout-sider-show"]
            .filter(Boolean)
            .join(" ")}
        >
          <Button
            size="large"
            icon={showNav ? X : MenuIcon}
            className="min-menu-nav-btn"
            onClick={() => setShowNav((value) => !value)}
          />
          <div className="left-menu">
            {groups.map((group) => (
              <section key={group.key}>
                <h4>{t(group.title)}</h4>
                {group.children.map((item) => (
                  <Link
                    className={item.name === currentName ? "active" : ""}
                    onClick={() => setShowNav(false)}
                    to={pathFor({ ...item, key: group.key })}
                    key={item.name}
                  >
                    <Icon type={item.icon} />
                    <span>{item.sub}</span>
                    {lang !== "en" && <span className="sub">{item.title}</span>}
                  </Link>
                ))}
              </section>
            ))}
          </div>
        </Sider>
        <Content>
          <main className="content-inner">{children}</main>
          <div className="foot-nav">
            {prev && (
              <Link to={pathFor(prev)} className="nav-prev">
                <Icon type={ChevronLeft} strokeWidth={3} />
                <span className="nav-text">{prev.sub}</span>
              </Link>
            )}
            {next && (
              <Link to={pathFor(next)} className="nav-next">
                <span className="nav-text">{next.sub}</span>
                <Icon type={ChevronRight} strokeWidth={3} />
              </Link>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
