<template>
  <div>
    <BasicTable @fetch-success="handleSuccessFetch" @register="registerTable">
      <template #tableTitle>
        <a-button type="primary" @click="handleCreate"> 新增菜单</a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
            },
          ]"
        />
      </template>
    </BasicTable>
    <MenuDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { columns } from './permission.data';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { deleteRole, getMenuList } from '/@/api/sys/auth';
  import { useDrawer } from '/@/components/Drawer';
  import MenuDrawer from './PermissionDrawer.vue';

  export default defineComponent({
    name: 'Role',
    components: { MenuDrawer, BasicTable, TableAction },
    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerTable, { reload }] = useTable({
        api: getMenuList,
        columns,
        fetchSetting: {
          listField: 'records',
        },
        isTreeTable: true,
        showTableSetting: true,
        bordered: true,
        pagination: false,
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: undefined,
        },
        afterFetch: test,
      });

      function test(data) {
        console.log(data);
        return data?.filter((i: any) => i.id !== '0');
      }

      function handleCreate() {
        openDrawer(true, {
          isUpdate: false,
        });
      }

      function handleSuccess() {
        reload();
      }

      function handleEdit(record: Recordable) {
        openDrawer(true, {
          record,
          isUpdate: true,
        });
      }

      function handleDelete(record: Recordable) {
        deleteRole(record.id).then(() => {
          reload();
        });
      }

      const handleSuccessFetch = (data) => {
        console.log(data);
      };
      return {
        registerTable,
        registerDrawer,
        handleCreate,
        handleSuccess,
        handleEdit,
        handleDelete,
        handleSuccessFetch,
      };
    },
  });
</script>

<style scoped></style>
