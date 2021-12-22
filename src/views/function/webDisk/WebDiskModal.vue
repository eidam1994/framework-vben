<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="修改备注"
    width="500px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './webDisk.data';
  import { message } from 'ant-design-vue';
  import BasicModal from '/@/components/Modal/src/BasicModal.vue';
  import { useModalInner } from '/@/components/Modal';
  import { updateWebDisk } from '/@/api/function/webDisk';

  export default defineComponent({
    name: 'WebDiskModal',
    components: {
      BasicModal,
      BasicForm,
    },
    emits: ['success'],
    setup(_, { emit }) {
      const rowId = ref('');
      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 90,
        schemas: formSchema,
        showActionButtonGroup: false,
      });

      const [registerModal, { closeModal }] = useModalInner(async (data) => {
        resetFields();
        rowId.value = data.record?.id;
        setFieldsValue({
          ...data.record,
        });
      });
      async function handleSubmit() {
        const values = await validate();
        await updateWebDisk({
          ...values,
          id: rowId.value || null,
        });
        message.success('修改成功');
        closeModal();
        emit('success');
      }

      return {
        registerModal,
        registerForm,
        handleSubmit,
      };
    },
  });
</script>

<style scoped></style>
