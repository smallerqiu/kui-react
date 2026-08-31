import { useState } from 'react';
import type { Column } from '../index';
import Table, { TableColumnSetting } from '../index';

const columns: Column[] = [
  { title: '姓名', key: 'name' },
  { title: '部门', key: 'department' },
  { title: '状态', key: 'status' },
];

const data = [
  { key: 1, name: '林晓', department: '产品中心', status: '正常' },
  { key: 2, name: '张三', department: '技术中心', status: '正常' },
  { key: 3, name: '李四', department: '市场中心', status: '暂停' },
];

export default function ColumnSettingDemo() {
  const [hiddenKeys, setHiddenKeys] = useState<(string | number)[]>([]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TableColumnSetting
        columns={columns}
        hiddenColumnKeys={hiddenKeys}
        onHiddenColumnKeysChange={setHiddenKeys}
        disabledKeys={['name']}
        title="显示列"
        resetText="重置"
      />
      <Table data={data} columns={columns} hiddenColumnKeys={hiddenKeys} />
    </div>
  );
}
