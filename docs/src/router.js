import asyncComponent from './views/AsyncComponent'

const about = asyncComponent(() => import(/*webpackChunkName:'about'*/'./views/about'))
const affix = asyncComponent(() => import(/*webpackChunkName:'affix'*/'./views/affix'))
const alert = asyncComponent(() => import(/*webpackChunkName:'alert'*/'./views/alert'))
const button = asyncComponent(() => import(/*webpackChunkName:'button'*/'./views/button'))
const badge = asyncComponent(() => import(/*webpackChunkName:'badge'*/'./views/badge'))
const backtop = asyncComponent(() => import(/*webpackChunkName:'backtop'*/'./views/backtop'))
const breadcrumb = asyncComponent(() => import(/*webpackChunkName:'breadcrumb'*/'./views/breadcrumb'))
const collapse = asyncComponent(() => import(/*webpackChunkName:'collapse'*/'./views/collapse'))
const colorpicker = asyncComponent(() => import(/*webpackChunkName:'colorpicker'*/'./views/colorpicker'))
const checkbox = asyncComponent(() => import(/*webpackChunkName:'checkbox'*/'./views/checkbox'))
const card = asyncComponent(() => import(/*webpackChunkName:'card'*/'./views/card'))
const carousel = asyncComponent(() => import(/*webpackChunkName:'carousel'*/'./views/carousel'))
const datepicker = asyncComponent(() => import(/*webpackChunkName:'datepicker'*/'./views/datepicker'))
const form = asyncComponent(() => import(/*webpackChunkName:'form'*/'./views/form'))
const grid = asyncComponent(() => import(/*webpackChunkName:'grid'*/'./views/grid'))
// const kuiangular = asyncComponent(() => import(/*webpackChunkName:'kuiangular'*/'./views/angular-kui'))
const icon = asyncComponent(() => import(/*webpackChunkName:'icon'*/'./views/icon'))
const input = asyncComponent(() => import(/*webpackChunkName:'input'*/'./views/input'))
const layout = asyncComponent(() => import(/*webpackChunkName:'layout'*/'./views/layout'))
const loading = asyncComponent(() => import(/*webpackChunkName:'loading'*/'./views/loading'))
const log = asyncComponent(() => import(/*webpackChunkName:'log'*/'./views/log'))
const message = asyncComponent(() => import(/*webpackChunkName:'message'*/'./views/message'))
const menu = asyncComponent(() => import(/*webpackChunkName:'menu'*/'./views/menu'))
const modal = asyncComponent(() => import(/*webpackChunkName:'modal'*/'./views/modal'))
const notice = asyncComponent(() => import(/*webpackChunkName:'notice'*/'./views/notice'))
const poptip = asyncComponent(() => import(/*webpackChunkName:'poptip'*/'./views/poptip'))
const page = asyncComponent(() => import(/*webpackChunkName:'page'*/'./views/page'))
const radio = asyncComponent(() => import(/*webpackChunkName:'radio'*/'./views/radio'))
const sponsor = asyncComponent(() => import(/*webpackChunkName:'sponsor'*/'./views/sponsor'))
const select = asyncComponent(() => import(/*webpackChunkName:'select'*/'./views/select'))
const start = asyncComponent(() => import(/*webpackChunkName:'start'*/'./views/start'))
const steps = asyncComponent(() => import(/*webpackChunkName:'steps'*/'./views/steps'))
const Switch = asyncComponent(() => import(/*webpackChunkName:'Switch'*/'./views/switch'))
const tag = asyncComponent(() => import(/*webpackChunkName:'tag '*/'./views/tag'))
const table = asyncComponent(() => import(/*webpackChunkName:'table'*/'./views/table'))
const tree = asyncComponent(() => import(/*webpackChunkName:'tree'*/'./views/tree'))
const treeselect = asyncComponent(() => import(/*webpackChunkName:'treeselect'*/'./views/treeselect'))
const tooltip = asyncComponent(() => import(/*webpackChunkName:'tooltip'*/'./views/tooltip'))
const theme = asyncComponent(() => import(/*webpackChunkName:'theme'*/'./views/theme'))
const test = asyncComponent(() => import(/*webpackChunkName:'test'*/'./views/test'))
const tabs = asyncComponent(() => import(/*webpackChunkName:'tabs'*/'./views/tabs'))
const timeline = asyncComponent(() => import(/*webpackChunkName:'timeline  '*/'./views/timeline'))
const upload = asyncComponent(() => import(/*webpackChunkName:'upload'*/'./views/upload'))

let R = {
  about, alert, affix,
  badge, button, breadcrumb, backtop,
  collapse, card, checkbox, colorpicker, carousel,
  datepicker,
  form,
  grid,
  input, icon,
  log, layout, loading,
  modal, message, menu,
  notice,
  poptip, page,
  radio,
  sponsor, select, Switch, start, tooltip, steps,
  tag, test, timeline, tabs, table, theme, tree, treeselect,
  upload,

}

export default R