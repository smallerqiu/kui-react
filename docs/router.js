import lazy from './Loadable'
// import React, {Component, lazy, Suspense} from 'react';

// import a from './views/start'
// import b from './views/use-in-vue'
// import c from './views/log'
// import d from './views/ssr'
// import e from './views/theme'
// import f from './views/kui-loader'
// let docs = [
//   { path: 'start', component: a },
//   { path: 'use-in-vue', component: b },
//   { path: 'log', component: c },
//   { path: 'ssr', component: d },
//   { path: 'theme', component: e },
//   { path: 'kui-loader', component: f },
// ]

let docs = [
  { path: 'start', component: lazy(() => import(/*webpackChunkName:'start'*/'./views/start')) },
  { path: 'use-in-vue', component: lazy(() => import(/*webpackChunkName:'use-in-vue'*/'./views/use-in-vue')) },
  { path: 'log', component: lazy(() => import(/*webpackChunkName:'log'*/'./views/log')) },
  { path: 'ssr', component: lazy(() => import(/*webpackChunkName:'ssr'*/'./views/ssr')) },
  { path: 'theme', component: lazy(() => import(/*webpackChunkName:'theme'*/'./views/theme')) },
  { path: 'kui-loader', component: lazy(() => import(/*webpackChunkName:'kui-loader'*/'./views/kui-loader')) },
]
let components = [
	{ path: 'all', component: () => import(/*webpackChunkName:'all'*/'./views/all.jsx') },
  { path: 'affix', component: lazy(() => import(/*webpackChunkName:'affix'*/'../components/affix/demo')) },
  { path: 'alert', component: lazy(() => import(/*webpackChunkName:'alert'*/'../components/alert/demo')) },
  { path: 'button', component: lazy(() => import(/*webpackChunkName:'button'*/'../components/button/demo')) },
  { path: 'badge', component: lazy(() => import(/*webpackChunkName:'badge'*/'../components/badge/demo')) },
  { path: 'backtop', component: lazy(() => import(/*webpackChunkName:'backtop'*/'../components/backtop/demo')) },
  { path: 'breadcrumb', component: lazy(() => import(/*webpackChunkName:'breadcrumb'*/'../components/breadcrumb/demo')) },
  { path: 'card', component: lazy(() => import(/*webpackChunkName:'card'*/'../components/card/demo')) },
  { path: 'carousel', component: lazy(() => import(/*webpackChunkName:'carousel'*/'../components/carousel/demo')) },
  { path: 'checkbox', component: lazy(() => import(/*webpackChunkName:'checkbox'*/'../components/checkbox/demo')) },
  { path: 'collapse', component: lazy(() => import(/*webpackChunkName:'collapse'*/'../components/collapse/demo')) },
  // { path:'colorpicker',component: lazy(() => import(/*webpackChunkName:'colorpicker'*/'../components/colorpicker/demo'))},
  // { path:'datepicker',component: lazy(() => import(/*webpackChunkName:'datepicker'*/'../components/datepicker/demo'))},
  { path: 'divider', component: lazy(() => import(/*webpackChunkName:'divider'*/'../components/divider/demo')) },
  { path: 'dropdown', component: lazy(() => import(/*webpackChunkName:'dropdown'*/'../components/dropdown/demo')) },
  // { path:'form',component: lazy(() => import(/*webpackChunkName:'form'*/'../components/form/demo'))},
  { path: 'grid', component: lazy(() => import(/*webpackChunkName:'grid'*/'../components/grid/demo')) },
  // // { path:'kuiangular',component: lazy(() => import(/*webpackChunkName:'kuiangular'*/'../components/angular-kui/demo'))},
  { path: 'icon', component: lazy(() => import(/*webpackChunkName:'icon'*/'../components/icon/demo')) },
  { path: 'input', component: lazy(() => import(/*webpackChunkName:'input'*/'../components/input/demo')) },
  { path: 'layout', component: lazy(() => import(/*webpackChunkName:'layout'*/'../components/layout/demo')) },
  // { path:'loading',component: lazy(() => import(/*webpackChunkName:'loading'*/'../components/loading/demo'))},
  // { path:'log',component: lazy(() => import(/*webpackChunkName:'log'*/'../components/log/demo'))},
  { path: 'message', component: lazy(() => import(/*webpackChunkName:'message'*/'../components/message/demo')) },
  { path:'menu',component: lazy(() => import(/*webpackChunkName:'menu'*/'../components/menu/demo'))},
  // { path:'modal',component: lazy(() => import(/*webpackChunkName:'modal'*/'../components/modal/demo'))},
  { path: 'notice', component: lazy(() => import(/*webpackChunkName:'notice'*/'../components/notice/demo')) },
  { path:'poptip',component: lazy(() => import(/*webpackChunkName:'poptip'*/'../components/poptip/demo'))},
  { path:'popconfirm',component: lazy(() => import(/*webpackChunkName:'popconfirm'*/'../components/popconfirm/demo'))},
  { path:'progress',component: lazy(() => import(/*webpackChunkName:'progress'*/'../components/progress/demo'))},
  { path: 'page', component: lazy(() => import(/*webpackChunkName:'page'*/'../components/page/demo')) },
  { path: 'radio', component: lazy(() => import(/*webpackChunkName:'radio'*/'../components/radio/demo')) },
  // { path:'sponsor',component: lazy(() => import(/*webpackChunkName:'sponsor'*/'../components/sponsor/demo'))},
  // { path:'select',component: lazy(() => import(/*webpackChunkName:'select'*/'../components/select/demo'))},
  { path:'spin',component: lazy(() => import(/*webpackChunkName:'spin'*/'../components/spin/demo'))},
  // { path:'start',component: lazy(() => import(/*webpackChunkName:'start'*/'../components/start/demo'))},
  // { path:'steps',component: lazy(() => import(/*webpackChunkName:'steps'*/'../components/steps/demo'))},
  { path: 'Switch', component: lazy(() => import(/*webpackChunkName:'switch'*/'../components/switch/demo')) },
  { path: 'tag', component: lazy(() => import(/*webpackChunkName:'tag '*/'../components/tag/demo')) },
  // { path:'table',component: lazy(() => import(/*webpackChunkName:'table'*/'../components/table/demo'))},
  // { path:'tree',component: lazy(() => import(/*webpackChunkName:'tree'*/'../components/tree/demo'))},
  // // { path:'treeselect',component: lazy(() => import(/*webpackChunkName:'treeselect'*/'../components/treeselect/demo'))},
  { path:'tooltip',component: lazy(() => import(/*webpackChunkName:'tooltip'*/'../components/tooltip/demo'))},
  // { path:'theme',component: lazy(() => import(/*webpackChunkName:'theme'*/'../components/theme/demo'))},
  // { path:'test',component: lazy(() => import(/*webpackChunkName:'test'*/'../components/test/demo'))},
  { path:'tabs',component: lazy(() => import(/*webpackChunkName:'tabs'*/'../components/tabs/demo'))},
  // { path:'timeline',component: lazy(() => import(/*webpackChunkName:'timeline  '*/'../components/timeline/demo'))},
  // { path:'upload',component: lazy(() => import(/*webpackChunkName:'upload'*/'../components/upload/demo'))},
]
export { docs, components }