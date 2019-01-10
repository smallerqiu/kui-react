let code = {}

code.base = `import { Collapse } from 'react-kui';
const Panel = Collapse.Panel
ReactDOM.render() {
  return (
    <div>
      <Collapse value={this.state.acitve}>
          <Panel title="我是标题" name="1">
              <p>我是内容，要写很多文字</p>
              <p>我是内容，要写很多文字</p>
              <p>我是内容，要写很多文字</p>
          </Panel>
          <Panel title="我是标题" name="2">
              <p>我是内容，要写很多文字</p>
              <p>我是内容，要写很多文字</p>
              <p>我是内容，要写很多文字</p>
          </Panel>
          <Panel title="我是标题" name="3">
              <p>我是内容，要写很多文字</p>
              <p>我是内容，要写很多文字</p>
              <p>我是内容，要写很多文字</p>
          </Panel>
      </Collapse>  
    </div>
  )
}`

code.accrodion = `import { Collapse } from 'react-kui';
const Panel = Collapse.Panel
ReactDOM.render() {
  return (
    <div>
    <Collapse value="1" accrodion>
        <Panel title="我是标题" name="1">
            <p>我是内容，要写很多文字</p>
            <p>我是内容，要写很多文字</p>
            <p>我是内容，要写很多文字</p>
        </Panel>
        <Panel title="我是标题" name="2">
            <p>我是内容，要写很多文字</p>
            <p>我是内容，要写很多文字</p>
            <p>我是内容，要写很多文字</p>
        </Panel>
        <Panel title="我是标题" name="3">
            <p>我是内容，要写很多文字</p>
            <p>我是内容，要写很多文字</p>
            <p>我是内容，要写很多文字</p>
        </Panel>
    </Collapse>    
    </div>
  )
}`

code.collapse=`import { Collapse } from 'react-kui';
const Panel = Collapse.Panel
ReactDOM.render() {
  return (
    <div>
     <Collapse value="1">
         <Panel title="我是标题" name="1">
             <p>我是内容，要写很多文字</p>
             <p>我是内容，要写很多文字</p>
             <p>我是内容，要写很多文字</p>
             <Collapse value="1">
                 <Panel title="我是标题" name="1">
                     <p>我是内容，要写很多文字</p>
                     <p>我是内容，要写很多文字</p>
                     <p>我是内容，要写很多文字</p>
                 </Panel>
                 <Panel title="我是标题" name="2">
                     <p>我是内容，要写很多文字</p>
                     <p>我是内容，要写很多文字</p>
                     <p>我是内容，要写很多文字</p>
                 </Panel>
             </Collapse>
         </Panel>
         <Panel title="我是标题" name="2">
             <p>我是内容，要写很多文字</p>
             <p>我是内容，要写很多文字</p>
             <p>我是内容，要写很多文字</p>
         </Panel>
         <Panel title="我是标题" name="3">
             <p>我是内容，要写很多文字</p>
             <p>我是内容，要写很多文字</p>
             <p>我是内容，要写很多文字</p>
         </Panel>
     </Collapse>   
    </div>
  )
}`

code.sample =`import { Collapse } from 'react-kui';
const Panel = Collapse.Panel
ReactDOM.render() {
  return (
    <div>
      <Collapse value={this.state.acitve1} sample>
          <Panel title="我是标题" name="1">
              <p>我是内容，要写很多文字</p>
              <p>我是内容，要写很多文字</p>
              <p>我是内容，要写很多文字</p>
          </Panel>
          <Panel title="我是标题" name="2">
              <p>我是内容，要写很多文字</p>
              <p>我是内容，要写很多文字</p>
              <p>我是内容，要写很多文字</p>
          </Panel>
          <Panel title="我是标题" name="3">
              <p>我是内容，要写很多文字</p>
              <p>我是内容，要写很多文字</p>
              <p>我是内容，要写很多文字</p>
          </Panel>
      </Collapse>   
    </div>
  )
}`

export default code