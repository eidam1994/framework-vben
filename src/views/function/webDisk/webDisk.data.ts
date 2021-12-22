import { BasicColumn, FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '文件名',
    dataIndex: 'fileName',
  },
  {
    title: '文件大小',
    dataIndex: 'fileSize',
  },
  {
    title: '上传时间',
    dataIndex: 'createTime',
  },
  {
    title: '上传者',
    dataIndex: 'uploadBy',
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'searchContent',
    label: '文件名/备注',
    component: 'Input',
    colProps: { span: 6 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'remark',
    label: '备注',
    component: 'Input',
  },
  {
    field: 'userId',
    label: '是否公有',
    component: 'RadioButtonGroup',
    componentProps: {
      options: [
        { label: '私有', value: '1' },
        { label: '公有', value: '0' },
      ],
    },
  },
];
