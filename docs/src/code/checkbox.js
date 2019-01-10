let code = {}

code.base=`import { Checkbox } from 'react-kui';
constructor(props) {
  super(props)
  this.state = {
    checked: true,
  }
}
toggleCheck() {
  this.setState({ checked: !this.state.checked })
}
onChange(state) {
  this.setState({ checked: state  });
}
ReactDOM.render() {
  return (
    <div>
      <Checkbox checked={this.state.checked} onChange={this.onChange.bind(this)}>单选框 </Checkbox>
      <Button onClick={this.toggleCheck.bind(this)}>Click me</Button>
    </div>
  )
}`
code.disabled = ` `

code.group =`import { Checkbox } from 'react-kui';
constructor(props) {
  super(props)
  this.state = {
    checked: true,
    data: ["苹果🍎", "香蕉🍌", "葡萄🍇"],
  }
}
onChangeGroup(opt) {
  this.setState({ data: opt })
}
onClear() {
  this.setState({data: []})
}
onSelect() {
  this.setState({data: ['苹果🍎']})
}
ReactDOM.render() {
  return (
    <div>
        <Checkbox.Group value={this.state.data} onChange={this.onChangeGroup.bind(this)}>
          <Checkbox label="苹果🍎"></Checkbox>
          <Checkbox label="橘子🍊"></Checkbox>
          <Checkbox label="香蕉🍌"></Checkbox>
          <Checkbox label="栗子🌰"></Checkbox>
          <Checkbox label="葡萄🍇" disabled></Checkbox>
          <Checkbox label="梨子🍐" disabled></Checkbox>
        </Checkbox.Group>
        <Button onClick={this.onClear.bind(this)}>清除</Button>
        <Button onClick={this.onSelect.bind(this)}>选中苹果</Button>
    </div>
  )
}
`

code.checkAll =`import { Checkbox } from 'react-kui';
constructor(props) {
  super(props)
  this.state = {
    checkAll: false,
    indeterminate: false,
    check: []
  }
}
handelCheck(data) {
  let { checkAll, indeterminate, check } = this.state
  if (data.length === 4) {
    indeterminate = false;
    checkAll = true;
  } else if (data.length > 0) {
    indeterminate = true;
    checkAll = false;
  } else {
    indeterminate = false;
    checkAll = false;
  }
  this.setState({ checkAll, indeterminate })
}
handelCheckAll(v) {
  let { checkAll, indeterminate, check } = this.state
  if (indeterminate) {
    checkAll = false;
  } else {
    checkAll = !checkAll;
  }
  indeterminate = false;

  if (checkAll) {
    check = ["苹果🍎", "香蕉🍌", "葡萄🍇", "栗子🌰"];
  } else {
    check = [];
  }
  this.setState({ checkAll, indeterminate, check })
}
ReactDOM.render() {
  return (
    <div>
      <Checkbox checked={checkAll} indeterminate={indeterminate} onChange={this.handelCheckAll.bind(this)}>全选</Checkbox>

      <Checkbox.Group value={check} onChange={this.handelCheck.bind(this)}>
        <Checkbox label="苹果🍎"></Checkbox>
        <Checkbox label="葡萄🍇"></Checkbox>
        <Checkbox label="香蕉🍌"></Checkbox>
        <Checkbox label="栗子🌰"></Checkbox>
      </Checkbox.Group>
  <div>)
`
export default code