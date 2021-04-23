
import Loadable from 'react-loadable';

/* one
以下自定义懒加载 路由切换 出场动画不会执行，出场正常
*/
// export default (loader) => {
//   class Loadable extends Component {
//     state = {
//       component: null
//     }
//     async componentDidMount() {
//       const { default: component } = await loader();
//       this.setState({ component });
//     }
//     render() {
//       const C = this.state.component;
//       return C ? <C {...this.props} /> : null;
//     }
//   }
//   return Loadable;
// }




/* two
使用Loadable 之后，出场入场会正常执行，但是仅限 已经载入过的路由。初次载入，出场动画依旧不会执行
*/
export default (loader) => {
  return Loadable({
    loader,
    loading() {
      return null//<div>正在加载</div>
    },
  });
}

/**
 * three
 * 因为他存在一个 fallback ，所以 也会存在一个同样的问题， 更大的问题是，首次加载会覆盖动画
 * use Suspense , lazy,  fallback
 */
// import React, { Component, lazy , Suspense } from "react";

//<Suspense fallback={null}>
//  <Switch>
//    <Route path="/" exact component={lazy(() => import(/*webpackChunkName:'a'*/'./views/a'))} />
//    <Route path="/" exact component={lazy(() => import(/*webpackChunkName:'b'*/'./views/b'))} />
//  </Switch>
//</Suspense>