let code = {}

code.base =`import { Button, Table ,Poptip } from 'react-kui';
constructor(props) {
  super(props)
  this.state = {
    border: false,
    mini: false,
    data: [
      { nick: "毛毛", gender: "右对其", birthday: "2018-1-1", action: "" },
      { nick: "高总", gender: "右对其", birthday: "2018-1-1", action: "" },
      { nick: "娟娟", gender: "右对其", birthday: "2018-1-1", action: "" },
      { nick: "鱼雷", gender: "右对其", birthday: "2018-1-1", action: "" }
    ],
    col: [
      { type: "selection" },
      { title: "姓名", key: "nick" },
      { title: "文字右对其", key: "gender", textAlign: "right" },
      { title: "姓名", key: "nick" },
      { title: "文字对其", key: "gender", textAlign: "center" },
      { title: "姓名", key: "nick" },
      { title: "文字对其", key: "gender", textAlign: "right" },
      {
        title: "出生年月",
        key: "birthday",
      },
      {
        title: "操作",
        key: "action",
        render: (item,index) => {
          return (<Poptip confirm title="是否删除数据？" placement="left-bottom" 
            onOk={()=>{
              let data =this.state.data.splice(index, 1);
              this.setState(data)
            }} >
           <Button mini type="danger">删除</Button>
          </Poptip>)
        }
      }
    ],
    row: []
  }
}
select(row) {
  this.row = row;
  console.log("当前选中：", row);
}
ReactDOM.render() {
  return (
    <div>
      <Button onClick={() => this.setState({ bordered: !bordered })} type="primary">表格边框</Button>
      <Button onClick={() => this.setState({ mini: !mini })} type="primary">mini</Button>
      <Table data={data} columns={col} mini={mini} onSelection={this.select.bind(this)} bordered={bordered}></Table>
    </div>
  )
}`

export default code