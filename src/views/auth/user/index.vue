<template>
  <div>
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <a-button type="primary" @click="handleCreate"> 新增用户</a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <UserDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { columns, searchFormSchema } from './user.data';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { deleteUser, getUserList } from '/@/api/sys/user';
  import { useDrawer } from '/@/components/Drawer';
  import UserDrawer from './UserDrawer.vue';

  export default defineComponent({
    name: 'User',
    components: { UserDrawer, BasicTable, TableAction },
    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerTable, { reload }] = useTable({
        api: getUserList,
        columns,
        fetchSetting: {
          sizeField: 'size',
          pageField: 'current',
          listField: 'records',
        },
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: undefined,
        },
      });

      function handleCreate() {
        openDrawer(true, {
          isUpdate: false,
        });
      }

      function handleSuccess(record) {
        console.log(record);
        reload();
      }

      function handleEdit(record: Recordable) {
        openDrawer(true, {
          record,
          isUpdate: true,
        });
      }

      function handleDelete(record: Recordable) {
        deleteUser(record.id).then(() => {
          reload();
        });
      }

      return {
        registerTable,
        registerDrawer,
        handleCreate,
        handleSuccess,
        handleEdit,
        handleDelete,
      };
    },
  });
</script>

<style scoped></style>
