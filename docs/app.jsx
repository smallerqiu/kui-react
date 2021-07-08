import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Route, Switch, HashRouter } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from "react-transition-group";

import Main from './layout'
import { docs, components } from './router'
import Loadable from './Loadable'

const Index = Loadable(() => import(/*webpackChunkName:'index'*/'./index'))
const Test = Loadable(() => import(/*webpackChunkName:'test'*/'./test'))

export default () => {

  const getRoute = (data, pre) => {
    return data.map(({ path, component }) => {
      return (<Route path={`/${pre}/${path}`} component={component} key={path} />)
    })
  }


  return (
    // <HashRouter>
    <BrowserRouter>
      {/* <Suspense fallback={null}> */}
      <Switch>
        <Route path="/" exact render={({ history }) => <Index history={history} />} />
        <Route path="/test" exact component={Test} />
        <Route render={({ location, history }) => (
          <Main history={history}>
            <TransitionGroup className="route-main">
              <CSSTransition timeout={500} classNames="fade" key={location.pathname}>
                <Switch location={location}>
                  {getRoute(docs, 'docs')}
                  {getRoute(components, 'components')}
                </Switch>
              </CSSTransition>
            </TransitionGroup>
          </Main>
        )} />
      </Switch>
      {/* </Suspense> */}
    </BrowserRouter>
    // </Router>
  )
}