import { BasicColumn, FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '登录名',
    dataIndex: 'loginName',
  },
  {
    title: '用户名称',
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
    field: 'loginName',
    label: '登录名',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'username',
    label: '用户名称',
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

export const formSchema: FormSchema[] = [
  {
    field: 'loginName',
    label: '登录名',
    required: true,
    component: 'Input',
  },
  {
    field: 'password',
    label: '密码',
    required: true,
    component: 'InputPassword',
    componentProps: {
      autocomplete: 'new-password',
    },
  },
  {
    field: 'username',
    label: '用户名称',
    required: true,
    component: 'Input',
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'Input',
  },
  {
    field: 'phoneNumber',
    label: '电话号码',
    component: 'Input',
    rules: [
      { pattern: /^1[3456789]\d{9}$/, trigger: 'blur', message: '手机号格式错误' },
      { required: true },
    ],
  },
];
