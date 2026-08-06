import { Card, Grid, GridItem, Icon } from "react-kui";
import { Link } from "react-router";
import { Fragment } from "react/jsx-runtime";
import { useDocs } from "../../context";
import { navData } from "../../menu";

export default function ComponentsDemo() {
  const { lang, t } = useDocs();
  return (
    <div className="all-components">
      {navData
        .filter((group) => group.key !== "guide")
        .map((group) => (
          <Fragment key={group.key}>
            <h2>{t(group.title)}</h2>
            <Grid itemMinWidth={200} xGap={16} yGap={16}>
              {group.children.map((item) => (
                <GridItem key={item.name}>
                  <Link to={`/components/${item.name}${lang === "en" ? "-en" : ""}`}>
                    <Card bordered title={`${item.sub} ${lang !== "en" ? item.title : ""}`}>
                      <Icon type={item.icon} size={50} strokeWidth={1} className="icon-view" />
                    </Card>
                  </Link>
                </GridItem>
              ))}
            </Grid>
          </Fragment>
        ))}
    </div>
  );
}
