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
      <template #role="{ model, field }">
        <a-select mode="multiple" v-model:value="model[field]">
          <a-select-option v-for="item of roleList" :key="item.roleName" :value="item.id">
            {{ item.roleName }}
          </a-select-option>
        </a-select>
      </template>
    </BasicForm>
  </BasicDrawer>
</template>

<script lang="ts">
  import { computed, defineComponent, ref, unref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from '/@/views/auth/user/user.data';
  import { message, Select } from 'ant-design-vue';
  import { getRoleSelect, saveUser } from '/@/api/sys/auth';

  export default defineComponent({
    name: 'UserDrawer',
    components: {
      BasicDrawer,
      BasicForm,
      [Select.name]: Select,
      ASelectOption: Select.Option,
    },
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');
      const roleList = ref<any>([]);

      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 90,
        schemas: formSchema,
        showActionButtonGroup: false,
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        setDrawerProps({ confirmLoading: false });
        if (unref(roleList.value).length === 0) {
          roleList.value = await getRoleSelect();
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
          await saveUser({
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

      const getTitle = computed(() => (!unref(isUpdate) ? '新增用户' : '编辑用户'));

      return {
        registerDrawer,
        registerForm,
        handleSubmit,
        getTitle,
        roleList,
      };
    },
  });
</script>

<style scoped></style>
