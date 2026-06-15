import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Switch } from "react-router";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import Main from "./layout";
import { components, docs } from "./router";
// import lazy from './Loadable'

const Index = lazy(() => import("./index"));
const Test = lazy(() => import("./test"));
export default () => {
  const getRoute = (data, pre) => {
    return data.map(({ path, component }) => {
      return (
        <Route path={`/${pre}/${path}`} component={component} key={path} />
      );
    });
  };

  return (
    // <HashRouter>
    <BrowserRouter>
      <Suspense fallback={<div></div>}>
        <Switch>
          <Route
            path="/"
            exact
            render={({ history }) => <Index history={history} />}
          />
          <Route path="/test" exact render={() => <Test />} />
          <Route
            render={({ location, history }) => (
              <Main history={history}>
                <TransitionGroup className="route-main">
                  <CSSTransition
                    timeout={500}
                    classNames="fade"
                    key={location.pathname}
                  >
                    <Switch location={location}>
                      {getRoute(docs, "docs")}
                      {getRoute(components, "components")}
                    </Switch>
                  </CSSTransition>
                </TransitionGroup>
              </Main>
            )}
          />
        </Switch>
      </Suspense>
    </BrowserRouter>
    // </Router>
  );
};
