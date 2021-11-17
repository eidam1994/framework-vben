import { BasicColumn, FormSchema } from '/@/components/Table';
import { getMenuList } from '/@/api/sys/auth';

export const columns: BasicColumn[] = [
  {
    title: '菜单名称',
    dataIndex: 'menuName',
  },
  {
    title: '菜单类型',
    dataIndex: 'menuType',
  },
  {
    title: '权限标识',
    dataIndex: 'menuCode',
  },
  {
    title: '排序',
    dataIndex: 'sort',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '修改时间',
    dataIndex: 'updateTime',
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'menuType',
    label: '权限类型',
    component: 'RadioButtonGroup',
    defaultValue: 'menu',
    componentProps: {
      options: [
        { label: '管理菜单', value: 'admin' },
        { label: '菜单', value: 'menu' },
        { label: '按钮', value: 'button' },
      ],
    },
    required: true,
  },
  {
    field: 'menuName',
    label: '权限名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'menuCode',
    label: '权限标识',
    component: 'Input',
    required: true,
  },
  {
    field: 'parentId',
    label: '上级菜单权限',
    component: 'ApiTreeSelect',
    required: true,
    componentProps: {
      api: getMenuList,
      replaceFields: {
        title: 'menuName',
        ket: 'id',
        value: 'id',
      },
    },
  },
  {
    field: 'sort',
    label: '排序',
    component: 'InputNumber',
    required: true,
  },
];
