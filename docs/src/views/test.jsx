import React, { View } from 'react'
import { Checkbox, CheckboxGroup, Collapse, Transition } from '@/'
const Panel = Collapse.Panel

// import { TransitionGroup } from 'react-transition-group'
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
// console.log(Transition)
// import abc from './t1'
import { CSSTransition } from 'react-transition-group';

// import Collapse from '@/components/collapse/collapse'

export default class test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: ['hello', 'world', 'click', 'me'],
      a: false,
    };
    this.handleAdd = this.handleAdd.bind(this);
  }

  handleAdd() {
    this.setState({ a: !this.state.a })
    return;
    const newItems = this.state.items.concat([
      prompt('Enter some text')
    ]);
    this.setState({ items: newItems });
  }

  handleRemove(i) {
    let newItems = this.state.items.slice();
    newItems.splice(i, 1);
    this.setState({ items: newItems });
  }

  render() {
    const items = this.state.items.map((item, i) => (
      <div key={item} onClick={() => this.handleRemove(i)}>
        {item}
      </div>
    ));

    return (
      <div>
        <button onClick={this.handleAdd}>Add Item</button>
        <Transition name="dropdown" show={this.state.a}>
          <div>
            <p>fdfsafasfasfdas</p>
            <p>fdfsafasfasfdas</p>
            <p>fdfsafasfasfdas</p>
            <p>fdfsafasfasfdas</p>
            <p>fdfsafasfasfdas</p>
            <p>fdfsafasfasfdas</p>
            <p>fdfsafasfasfdas</p>
            <p>fdfsafasfasfdas</p>
            <p>fdfsafasfasfdas</p>
          </div>
        </Transition>
        {/* <Collapse show={this.state.a}>
          <div className="test111">
            <p>fdfsafasfasfdas</p>
            <p>fdfsafasfasfdas</p>
            <p>fdfsafasfasfdas</p>
            <p>fdfsafasfasfdas</p>
            <p>fdfsafasfasfdas</p>
            <p>fdfsafasfasfdas</p>
            <p>fdfsafasfasfdas</p>
            <p>fdfsafasfasfdas</p>
            <p>fdfsafasfasfdas</p>
          </div>
        </Collapse> */}
        {/* <Collapse show={this.state.a}>
           
          <Panel title="我是标题" name="3">
            <p>我是内容，要写很多文字</p>
            <p>我是内容，要写很多文字</p>
            <p>我是内容，要写很多文字</p>
          </Panel>
        </Collapse> */}
        {/* <CSSTransition in={this.state.a} timeout={300} unmountOnExit onEnter={() => { console.log('fdsfds') }} classNames="dropdown">
          <span>fdsf</span>

        </CSSTransition> */}
        {/* <span>{}</span> */}
        {/* <TransitionGroup timeout={500} component={aaaaaa} >
                <div> {items}</div>
            </TransitionGroup> */}
        {/* <Transition
            transitionName="example"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}
            >
              {items}
            </Transition> */}
      </div>
    );
  }
}