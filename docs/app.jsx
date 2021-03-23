import React from 'react'
import { BrowserRouter as Router, Route, Switch, HashRouter } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from "react-transition-group";


import Index from './index'
import Main from './layout'
import routers from './router'

export default () => {
    const routes = () => (
        Object.keys(routers).map(route => {
            return (<Route path={`/${route}`} component={routers[route]} key={route} />)
        })
    )
    return <HashRouter>
        <Switch>
            <Route path="/" exact component={Index} />
            <Route render={({ location }) => (
                <Main>
                    <TransitionGroup className="layout-transtion">
                        <CSSTransition timeout={500} classNames="fade" key={location.key}>
                            <div className="animate">
                                <Switch location={location}>
                                    {routes()}
                                    {/* <Route path="/log" component={log} />
                                        <Route path="/theme" component={theme} /> */}
                                </Switch>
                            </div>
                        </CSSTransition>
                    </TransitionGroup>
                </Main>
            )} />
        </Switch>
    </HashRouter>
}