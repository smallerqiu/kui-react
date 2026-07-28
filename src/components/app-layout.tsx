import clsx from "clsx";
import { ChevronLeft, ChevronRight, Menu as MenuIcon, X } from "kui-icons";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { Button, Content, Icon, Layout, Menu, MenuGroup, MenuItem, Sider } from "react-kui";
import { useDocs } from "../context";
import { navData, routeData, type RouteItem } from "../menu";
import AppHeader from "./app-header";

const OPEN_KEYS = navData.map((group) => group.key);

export default function AppLayout({ children }: { children: ReactNode }) {
  const { lang, t } = useDocs();
  const location = useLocation();
  const pageRef = useRef<HTMLDivElement>(null);
  const [showNav, setShowNav] = useState(false);
  const currentName = location.pathname.split("/").pop()?.replace(/-en$/, "") ?? "";
  const index = routeData.findIndex((item) => item.name === currentName);
  const current = routeData[index];
  const prev = routeData[index - 1];
  const next = routeData[index + 1];
  const pathFor = (item: RouteItem) =>
    `/${item.key === "guide" ? "guide" : "components"}/${item.name}${lang === "en" ? "-en" : ""}`;

  useEffect(() => {
    if (current) {
      document.title = `${lang === "en" ? current.sub : `${current.title} ${current.sub}`} - KUI`;
    }
    window.scrollTo(0, 0);
  }, [current, lang]);

  const groups = useMemo(() => navData, []);
  return (
    <Layout className="root">
      <AppHeader />
      <Layout className="main">
        <Sider className={clsx("docs-k-layout-sider", { "docs-k-layout-sider-show": showNav })}>
          <Button
            size="large"
            icon={showNav ? X : MenuIcon}
            className="min-menu-nav-btn"
            onClick={() => setShowNav((value) => !value)}
          />
          <Menu
            value={current ? [current.name] : []}
            className="left-menu"
            mode="inline"
            openKeys={OPEN_KEYS}
            onSelect={() => setShowNav(false)}
          >
            {groups.map((group) => (
              <MenuGroup key={group.key} title={t(group.title)}>
                {group.children.map((item) => (
                  <MenuItem key={item.name} icon={item.icon}>
                    <Link to={pathFor({ ...item, key: group.key })}>
                      <span>{item.sub}</span>
                      {lang !== "en" && <span className="sub">{item.title}</span>}
                    </Link>
                  </MenuItem>
                ))}
              </MenuGroup>
            ))}
          </Menu>
        </Sider>
        <Content>
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={location.pathname}
              nodeRef={pageRef}
              timeout={180}
              classNames={{
                enterActive: "docs-page-fade-enter-active",
                exitActive: "docs-page-fade-exit-active",
              }}
            >
              <main ref={pageRef} className="content-inner">
                {children}
              </main>
            </CSSTransition>
          </SwitchTransition>
          <div className="foot-nav">
            {prev && (
              <Link to={pathFor(prev)} className="nav-prev">
                <Icon type={ChevronLeft} strokeWidth={3} />
                <span className="nav-text">
                  {prev.sub} {lang !== "en" ? prev.title : ""}
                </span>
                <Icon type={prev.icon} />
              </Link>
            )}
            {next && (
              <Link to={pathFor(next)} className="nav-next">
                <Icon type={next.icon} />
                <span className="nav-text">
                  {next.sub} {lang !== "en" ? next.title : ""}
                </span>
                <Icon type={ChevronRight} strokeWidth={3} />
              </Link>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
