<template>
  <Card v-if="fileName">
    {{ fileName }}
    <div style="display: flex">
      <Progress
        :percent="progress"
        :status="completeFlag ? 'success' : cancelFlag ? 'exception' : 'active'"
      />
      <a-button
        @click="stopUpload"
        v-if="!completeFlag && !cancelFlag"
        style="margin-left: 25px"
        size="small"
        color="error"
        shape="circle"
        postIcon="bi:x"
        ghost
      />
    </div>
  </Card>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { Card, Progress } from 'ant-design-vue';
  import { sliceUpload, cancelUpload } from '/@/api/function/webDisk';

  export default defineComponent({
    name: 'UploadCard',
    components: { Card, Progress },
    emits: ['complete'],
    setup(_, { emit }) {
      let pauseIcon = ref('akar-icons:pause');
      let isOpen = ref(true);
      let progress = ref(0);
      let completeFlag = ref(false);
      let cancelFlag = ref(false);
      const fileName = ref('');
      const id = ref('');

      function stopUpload() {
        cancelUpload({ id: id.value }).then(() => {
          isOpen.value = false;
          cancelFlag.value = true;
        });
      }

      function newRequestArr(partList, hash, uploadId, mergeParam, length) {
        id.value = uploadId;
        fileName.value = mergeParam.fileName;
        if (length === 0) {
          completeFlag.value = true;
          progress.value = 100;
        } else {
          let i = 0;
          const fn = () => {
            const formData = new FormData(); // 通过form将file切片传给后台
            formData.append('file', partList[i].file);
            formData.append('md5Code', hash);
            formData.append('uploadId', uploadId);
            formData.append('partNumber', partList[i].id);
            sliceUpload(formData).then(() => {
              progress.value = ((parseFloat(partList[i].id) / parseFloat(length)) * 100).toFixed(1);
              if (isOpen.value) {
                // 如果上传开关在这里是false，则会停止递归调用上传函数，至于在哪里把他置为false，看你在哪里点击触发的暂停或者删除上传函数了，自己决定
                i += 1;
                if (i < partList.length) {
                  fn();
                } else {
                  emit('complete', mergeParam); // 如果是最后一个切片，则调用合并函数
                  completeFlag.value = true;
                }
              }
            });
          };
          fn();
        }
      }

      return {
        newRequestArr,
        fileName,
        progress,
        pauseIcon,
        completeFlag,
        cancelFlag,
        stopUpload,
      };
    },
  });
</script>

<style scoped></style>
