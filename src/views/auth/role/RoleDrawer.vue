<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="500px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #menu="{ model, field }">
        <BasicTree
          v-model:value="model[field]"
          :treeData="treeData"
          :replaceFields="{ title: 'menuName', key: 'id' }"
          checkable
          toolbar
          title="菜单分配"
        />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>

<script lang="ts">
  import { computed, defineComponent, ref, unref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from '/@/views/auth/role/role.data';
  import { message } from 'ant-design-vue';
  import { getMenuList, saveRole } from '/@/api/sys/auth';
  import { BasicTree, TreeItem } from '/@/components/Tree';

  export default defineComponent({
    name: 'RoleDrawer',
    components: {
      BasicDrawer,
      BasicForm,
      BasicTree,
    },
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');
      const treeData = ref<TreeItem[]>([]);

      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 90,
        schemas: formSchema,
        showActionButtonGroup: false,
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        setDrawerProps({ confirmLoading: false });
        if (unref(treeData).length === 0) {
          const res = await getMenuList();
          treeData.value = res;
        }
        isUpdate.value = !!data?.isUpdate;
        rowId.value = data.record?.id;
        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record,
          });
        }
      });
      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          await saveRole({
            ...values,
            id: rowId.value || null,
          });
          message.success(!unref(isUpdate) ? '新增成功' : '编辑成功');
          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      const getTitle = computed(() => (!unref(isUpdate) ? '新增角色' : '编辑角色'));

      return {
        registerDrawer,
        registerForm,
        handleSubmit,
        getTitle,
        treeData,
      };
    },
  });
</script>

<style scoped></style>
