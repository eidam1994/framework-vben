<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click=""> 新增用户</a-button>
      </template>
    </BasicTable>
    <UserDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { columns, searchFormSchema } from './user.data';
  import { BasicTable, useTable } from '/@/components/Table';
  import { getUserList } from '/@/api/sys/user';
  import { useDrawer } from '/@/components/Drawer';
  import UserDrawer from './UserDrawer.vue';

  export default defineComponent({
    name: 'User',
    components: { UserDrawer, BasicTable },
    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerTable, { reload }] = useTable({
        api: getUserList,
        columns,
        afterFetch: (res) => {
          console.log(res, 'res');
        },
        fetchSetting: {
          pageField: 'pageNum',
          listField: 'records',
        },
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
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

      return {
        registerTable,
        registerDrawer,
        handleCreate,
        handleSuccess,
      };
    },
  });
</script>

<style scoped></style>
