import asyncComponent from './AsyncComponent'


// const about = asyncComponent(() => import(/*webpackChunkName:'about'*/'../components/about/demo'))
const affix = asyncComponent(() => import(/*webpackChunkName:'affix'*/'../components/affix/demo'))
const alert = asyncComponent(() => import(/*webpackChunkName:'alert'*/'../components/alert/demo'))
const button = asyncComponent(() => import(/*webpackChunkName:'button'*/'../components/button/demo'))
const badge = asyncComponent(() => import(/*webpackChunkName:'badge'*/'../components/badge/demo'))
const backtop = asyncComponent(() => import(/*webpackChunkName:'backtop'*/'../components/backtop/demo'))
const breadcrumb = asyncComponent(() => import(/*webpackChunkName:'breadcrumb'*/'../components/breadcrumb/demo'))
const card = asyncComponent(() => import(/*webpackChunkName:'card'*/'../components/card/demo'))
const carousel = asyncComponent(() => import(/*webpackChunkName:'carousel'*/'../components/carousel/demo'))
const checkbox = asyncComponent(() => import(/*webpackChunkName:'checkbox'*/'../components/checkbox/demo'))
const collapse = asyncComponent(() => import(/*webpackChunkName:'collapse'*/'../components/collapse/demo'))
// const colorpicker = asyncComponent(() => import(/*webpackChunkName:'colorpicker'*/'../components/colorpicker/demo'))
// const datepicker = asyncComponent(() => import(/*webpackChunkName:'datepicker'*/'../components/datepicker/demo'))
const divider = asyncComponent(() => import(/*webpackChunkName:'divider'*/'../components/divider/demo'))
// const form = asyncComponent(() => import(/*webpackChunkName:'form'*/'../components/form/demo'))
const grid = asyncComponent(() => import(/*webpackChunkName:'grid'*/'../components/grid/demo'))
// // const kuiangular = asyncComponent(() => import(/*webpackChunkName:'kuiangular'*/'../components/angular-kui/demo'))
const icon = asyncComponent(() => import(/*webpackChunkName:'icon'*/'../components/icon/demo'))
// const input = asyncComponent(() => import(/*webpackChunkName:'input'*/'../components/input/demo'))
const layout = asyncComponent(() => import(/*webpackChunkName:'layout'*/'../components/layout/demo'))
// const loading = asyncComponent(() => import(/*webpackChunkName:'loading'*/'../components/loading/demo'))
// const log = asyncComponent(() => import(/*webpackChunkName:'log'*/'../components/log/demo'))
// const message = asyncComponent(() => import(/*webpackChunkName:'message'*/'../components/message/demo'))
// const menu = asyncComponent(() => import(/*webpackChunkName:'menu'*/'../components/menu/demo'))
// const modal = asyncComponent(() => import(/*webpackChunkName:'modal'*/'../components/modal/demo'))
// const notice = asyncComponent(() => import(/*webpackChunkName:'notice'*/'../components/notice/demo'))
// const poptip = asyncComponent(() => import(/*webpackChunkName:'poptip'*/'../components/poptip/demo'))
// const page = asyncComponent(() => import(/*webpackChunkName:'page'*/'../components/page/demo'))
// const radio = asyncComponent(() => import(/*webpackChunkName:'radio'*/'../components/radio/demo'))
// const sponsor = asyncComponent(() => import(/*webpackChunkName:'sponsor'*/'../components/sponsor/demo'))
// const select = asyncComponent(() => import(/*webpackChunkName:'select'*/'../components/select/demo'))
// const start = asyncComponent(() => import(/*webpackChunkName:'start'*/'../components/start/demo'))
// const steps = asyncComponent(() => import(/*webpackChunkName:'steps'*/'../components/steps/demo'))
// const Switch = asyncComponent(() => import(/*webpackChunkName:'Switch'*/'../components/switch/demo'))
// const tag = asyncComponent(() => import(/*webpackChunkName:'tag '*/'../components/tag/demo'))
// const table = asyncComponent(() => import(/*webpackChunkName:'table'*/'../components/table/demo'))
// const tree = asyncComponent(() => import(/*webpackChunkName:'tree'*/'../components/tree/demo'))
// // const treeselect = asyncComponent(() => import(/*webpackChunkName:'treeselect'*/'../components/treeselect/demo'))
// const tooltip = asyncComponent(() => import(/*webpackChunkName:'tooltip'*/'../components/tooltip/demo'))
// const theme = asyncComponent(() => import(/*webpackChunkName:'theme'*/'../components/theme/demo'))
// const test = asyncComponent(() => import(/*webpackChunkName:'test'*/'../components/test/demo'))
// const tabs = asyncComponent(() => import(/*webpackChunkName:'tabs'*/'../components/tabs/demo'))
// const timeline = asyncComponent(() => import(/*webpackChunkName:'timeline  '*/'../components/timeline/demo'))
// const upload = asyncComponent(() => import(/*webpackChunkName:'upload'*/'../components/upload/demo'))

let R = {
  icon,
  // about, 
  alert,
  affix,
  badge,
  button,
  breadcrumb,
  backtop,
  card,
  carousel,
  checkbox,
  collapse, 
  // , colorpicker, ,
  // datepicker,
  divider,
  // form,
  grid,
  // input, icon,
  // log, 
  layout,
  //loading,
  // modal, message, menu,
  // notice,
  // poptip, page,
  // radio,
  // sponsor, select, Switch, start, tooltip, steps,
  // tag, test, timeline, tabs, table, theme, tree, 
  // upload,

}

export default R