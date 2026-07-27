import { Link } from "react-router";
import Card from "../../../components/card";
import Icon from "../../../components/icon";
import { useDocs } from "../../context";
import { navData } from "../../menu";

export default function ComponentsDemo() {
  const { lang, t } = useDocs();
  return <div className="all-components">{navData.filter((group) => group.key !== "guide").map((group) => <section key={group.key}><h2>{t(group.title)}</h2><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16 }}>{group.children.map((item) => <Link key={item.name} to={`/components/${item.name}${lang === "en" ? "-en" : ""}`}><Card bordered title={`${item.sub} ${lang !== "en" ? item.title : ""}`}><Icon type={item.icon} size={50} strokeWidth={1} className="icon-view" /></Card></Link>)}</div></section>)}</div>;
}
