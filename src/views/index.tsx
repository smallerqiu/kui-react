import { ArrowRight, Code, Layers, LogoGithub, Palette, Zap } from "kui-icons";
import {
  Badge,
  Button,
  FeatureCard,
  Icon,
  Layout,
  Progress,
  Ripple,
  StatCard,
  Switch,
  Tag,
} from "react-kui";
import { Link } from "react-router";
import "../assets/css/home.less";
import AppFooter from "../components/app-footer";
import AppHeader from "../components/app-header";
import { useDocs } from "../context";

export default function Home() {
  const { lang, t } = useDocs();
  const withLang = (path: string) => `${path}${lang === "en" ? "-en" : ""}`;

  return (
    <Layout className="index">
      <AppHeader />
      <Ripple>
        <main className="index-main">
          <section className="index-hero">
            <div className="hero-copy">
              <Badge pill status="success" text={t("index.badge")} />
              <h1>
                Kui React
                <span>{t("index.title_suffix")}</span>
              </h1>
              <p className="desc">{t("index.desc")}</p>
              <div className="btn-content">
                <Button
                  className="start"
                  type="link"
                  size="large"
                  href={withLang("/guide/quick-started")}
                >
                  {t("index.btn_quick_start")}
                  <Icon type={ArrowRight} />
                </Button>
                <Button
                  size="large"
                  className="btn-github"
                  type="link"
                  href="https://github.com/smallerqiu/react-kui"
                  target="_blank"
                >
                  <Icon type={LogoGithub} />
                  GitHub
                </Button>
              </div>
              <div className="hero-meta">
                <span>React 19</span>
                <i />
                <span>TypeScript</span>
                <i />
                <span>60+ Components</span>
              </div>
            </div>

            <div className="hero-preview" aria-hidden="true">
              <div className="preview-window">
                <div className="preview-bar">
                  <div className="preview-dots">
                    <i />
                    <i />
                    <i />
                  </div>
                  <span>Dashboard</span>
                  <Tag color="green">Online</Tag>
                </div>
                <div className="preview-body">
                  <div className="preview-sidebar">
                    <strong>K</strong>
                    {[0, 1, 2, 3].map((item) => (
                      <i key={item} className={item === 0 ? "active" : undefined} />
                    ))}
                  </div>
                  <div className="preview-content">
                    <div className="preview-heading">
                      <div>
                        <strong>{t("index.preview_title")}</strong>
                        <span>{t("index.preview_desc")}</span>
                      </div>
                      <Button type="primary" size="small">
                        + New
                      </Button>
                    </div>
                    <div className="preview-stats">
                      <StatCard
                        bordered
                        reverse
                        items={[
                          {
                            value: 12840,
                            separator: ",",
                            desc: "Requests",
                            trend: "+18.2%",
                            trendStatus: "success",
                            autoAnimate: false,
                          },
                        ]}
                      />
                      <StatCard
                        bordered
                        reverse
                        items={[
                          {
                            value: 98.6,
                            precision: 1,
                            suffix: "%",
                            desc: "Success rate",
                            trend: "Stable",
                            trendStatus: "success",
                            autoAnimate: false,
                          },
                        ]}
                      />
                    </div>
                    <div className="preview-panel">
                      <div className="preview-panel-head">
                        <strong>Usage</strong>
                        <Switch size="small" checked />
                      </div>
                      <Progress percent={72} showInfo={false} />
                      <Progress percent={48} showInfo={false} />
                      <Progress percent={86} showInfo={false} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="index-features">
            {[
              [Zap, "feature_fast", "feature_fast_desc"],
              [Code, "feature_types", "feature_types_desc"],
              [Palette, "feature_theme", "feature_theme_desc"],
            ].map(([icon, title, desc]) => (
              <FeatureCard
                key={title as string}
                bordered
                icon={icon as typeof Zap}
                title={t(`index.${title}`)}
                desc={t(`index.${desc}`)}
              />
            ))}
          </section>

          <section className="index-explore">
            <div className="explore-title">
              <div>
                <span>{t("index.explore_eyebrow")}</span>
                <h2>{t("index.explore_title")}</h2>
              </div>
              <Link to={withLang("/guide/components")}>
                {t("index.explore_all")} <Icon type={ArrowRight} />
              </Link>
            </div>
            <div className="component-links">
              {["Button", "Form", "Table", "Select", "Modal", "DatePicker"].map((name) => (
                <Link
                  key={name}
                  to={withLang(
                    `/components/${name === "DatePicker" ? "date-picker" : name.toLowerCase()}`
                  )}
                >
                  <Icon type={Layers} />
                  <span>{name}</span>
                  <Icon type={ArrowRight} />
                </Link>
              ))}
            </div>
          </section>
        </main>
      </Ripple>
      <AppFooter />
    </Layout>
  );
}
