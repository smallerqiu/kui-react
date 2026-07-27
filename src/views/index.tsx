import { ArrowRight } from "kui-icons";
import { Link } from "react-router";
import { Button } from "../../components/button";
import Icon from "../../components/icon";
import Layout from "../../components/layout";
import "../assets/css/home.less";
import AppFooter from "../components/app-footer";
import AppHeader from "../components/app-header";
import { useDocs } from "../context";

export default function Home() {
  const { lang, t } = useDocs();
  const start = `/guide/quick-started${lang === "en" ? "-en" : ""}`;
  return (
    <Layout className="index">
      <AppHeader />
      <section className="index-content">
        <h1>Kui React</h1>
        <p className="desc">{t("index.desc")}</p>
        <div className="btn-content">
          <Link to={start}>
            <Button className="start" type="link" size="large">
              {t("index.btn_quick_start")}
              <Icon type={ArrowRight} />
            </Button>
          </Link>
          <Link to={start}>
            <Button size="large" className="btn-install" type="link">
              Install Kui React
            </Button>
          </Link>
        </div>
      </section>
      <AppFooter />
    </Layout>
  );
}
