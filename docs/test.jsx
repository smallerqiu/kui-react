import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom'
import { Switch, Tree } from 'react-kui';

const Demo = () => {

  const data = [
    {
      title: 'tree 1',
      key: '0-1',
      children: [
        {
          title: 'tree 1-1',
          key: '1-1',
          disabled: true,
          children: [
            { title: 'leaf 1-1-1', disabled: true },
            {
              title: 'leaf 1-1-2',
              key: '1-1-2',
              children: [
                { title: 'leaf 1-1-2-1' },
                { title: 'leaf 1-1-2-2' }
              ]
            }
          ]
        },
        {
          title: 'tree 1-2',
          key: '1-2',
          children: [
            { title: 'leaf 1-2-1' },
            { title: 'leaf 1-2-2' }
          ]
        },
        {
          title: 'tree 1-3',
          children: [
            { title: 'leaf 1-3-1' },
            { title: 'leaf 1-3-2' }
          ]
        }
      ]
    }
  ]
  return (
    <>
      <Tree data={data} expandedKeys={['0-1', '1-1', '1-1-2', '1-2', '0-1']} />
    </>
  )
}

ReactDOM.render(<Demo />, document.getElementById('app'))
