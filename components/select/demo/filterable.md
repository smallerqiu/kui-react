<cn>
#### 过滤
通过设置 `filterable` 值来呈现过滤模式
</cn>

```tsx
import { Select , Button } from 'react-kui';
let {Option} = Select

const options = ['almond','apple','apple core','apple juice','apple skin','apricot','apricot flesh','apricot pit','areca nut','banana','banana skin','bargain price','beechnut','Beijing flowering crab','bitter','bitterness','bitter orange','blackberry','canned fruit','carambola','cherry','cherry pit','cherry pulp','chestnut','Chinese chestnut','Chinese date','Chinese gooseberry','Chinese walnut','coconut','coconut milk','coconut water','cold storage','cold store','crisp','cumquat','damson plum','Dangshan pear','date','date pit','decayed fruit','downy pitch','dry fruit','duke','early-maturing','fig','filbert','first class','flat peach','flavour','flesh','flesh fruit','fresh','fresh litchi','fruiterer','fruit in bags','fruit knife','fruits of the season','gingko','give full weigh','give short weight','grape','grape juice','grape skin','grapestone','greengage','Hami melon','Hard','haw','hawthorn','hazel','honey peach','in season','juicy','juicy peach','jujube','kernel','kumquat','late-maturing','lemon','litchi','litchi rind','longan','longan pulp','loquat','mandarine','mango','mature','morello','muskmelon','navel orange','nut','nut meat','nut shell','oleaster','olive','orange','orange peel','papaya','peach','pear','perishable','pineapple','plum','plumcot','pomegranate','pomelo','red bayberry','reduced price','ripe','rotten fruit','seasonable','seedless orange','special-grade','strawberry','sultana','superfine','tangerine','tart','tender','tinned fruit','unripe','walnut','walnut kernel','water chestnut','watermelon']

class Demo extends React.Component{
  state = { 
     value1:'',
     value2:[],
     value3:[],
  }
  
  render(){
    const {value1 ,value2 ,value3} = this.state            
    const optionNode = options.map(v=>{
              return <Option value={v} label={v} key={v}/>
            })
    return ( 
      <div className="demo-select">
        <p>Selected value:{value1}</p>
        <Select 
          size="large"
          width={512}
          value={value1} 
          onChange={
            (v) => this.setState({value1 : v})
          }
          placeholder="单选过滤" filterable>
          { optionNode }
        </Select>
        <p>Selected value:{value2.join()}</p>
        <Select 
          className="demo-select"
          multiple 
          width={512}
          value={value2} 
          onChange={
            (v) => this.setState({value2 : v})
          }
          placeholder="多选过滤" filterable >
          { optionNode } 
        </Select>
        <p>Selected value: {value3.join()}</p>
        <Select 
          className="demo-select"
          multiple 
          width={512}
          value={value3} 
          onChange={
            (v) => this.setState({value3 : v})
          }
          placeholder="远程搜索" filterable size="small">
          { optionNode }
        </Select>
      </div>
    )
  }
}

ReactDOM.render(<Demo />  ,  mountNode)
```