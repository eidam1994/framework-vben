<template>
  <template v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <Form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef">
      <FormItem name="loginName" class="enter-x">
        <Input
          class="fix-auto-fill"
          size="large"
          v-model:value="formData.loginName"
          :placeholder="t('sys.login.userName')"
          autocomplete="off"
        />
      </FormItem>
      <FormItem name="phoneNumber" class="enter-x">
        <Input
          size="large"
          v-model:value="formData.phoneNumber"
          :placeholder="t('sys.login.mobile')"
          class="fix-auto-fill"
          autocomplete="off"
        />
      </FormItem>
      <!--      <FormItem name="sms" class="enter-x">-->
      <!--        <CountdownInput-->
      <!--          size="large"-->
      <!--          class="fix-auto-fill"-->
      <!--          v-model:value="formData.sms"-->
      <!--          :placeholder="t('sys.login.smsCode')"-->
      <!--        />-->
      <!--      </FormItem>-->
      <FormItem name="password" class="enter-x">
        <StrengthMeter
          size="large"
          v-model:value="formData.password"
          :placeholder="t('sys.login.password')"
          autocomplete="new-password"
        />
      </FormItem>
      <FormItem name="confirmPassword" class="enter-x">
        <InputPassword
          size="large"
          visibilityToggle
          v-model:value="formData.confirmPassword"
          :placeholder="t('sys.login.confirmPassword')"
        />
      </FormItem>

      <!--      <FormItem class="enter-x" name="policy">-->
      <!--        &lt;!&ndash; No logic, you need to deal with it yourself &ndash;&gt;-->
      <!--        <Checkbox v-model:checked="formData.policy" size="small">-->
      <!--          {{ t('sys.login.policy') }}-->
      <!--        </Checkbox>-->
      <!--      </FormItem>-->

      <Button
        type="primary"
        class="enter-x"
        size="large"
        block
        @click="handleRegister"
        :loading="loading"
      >
        {{ t('sys.login.registerButton') }}
      </Button>
      <Button size="large" block class="mt-4 enter-x" @click="handleBackLogin">
        {{ t('sys.login.backSignIn') }}
      </Button>
    </Form>
  </template>
</template>
<script lang="ts" setup>
  import { reactive, ref, unref, computed } from 'vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { Form, Input, Button, Checkbox, message } from "ant-design-vue";
  import { StrengthMeter } from '/@/components/StrengthMeter';
  import { CountdownInput } from '/@/components/CountDown';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useLoginState, useFormRules, useFormValid, LoginStateEnum } from './useLogin';
  import { register } from '/@/api/sys/auth';

  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { handleBackLogin, getLoginState } = useLoginState();

  const formRef = ref();
  const loading = ref(false);

  const formData = reactive({
    loginName: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });

  const { getFormRules } = useFormRules(formData);
  const { validForm } = useFormValid(formRef);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.REGISTER);

  async function handleRegister() {
    const data = await validForm();
    if (!data) return;
    register(data).then(() => {
      message.success('注册成功');
      handleBackLogin();
    });
  }
</script>
