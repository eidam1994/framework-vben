import { BasicColumn, FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '用户名',
    dataIndex: 'username',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
  },
  {
    title: '电话号码',
    dataIndex: 'phoneNumber',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'username',
    label: '用户名',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'phoneNumber',
    label: '电话号码',
    component: 'Input',
    colProps: { span: 6 },
  },
];
