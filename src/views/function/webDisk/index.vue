<template>
  <div>
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <Upload :customRequest="customRequest" :showUploadList="false">
          <a-button preIcon="carbon:cloud-upload"> 上传文件 </a-button>
        </Upload>
        <a-button preIcon="carbon:data-view-alt" style="margin-left: 25px" @click="openUploadList">
          查看上传列表
        </a-button>
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
            {
              icon: 'ant-design:download-outlined',
              onClick: handleDownload.bind(null, record),
            },
          ]"
        />
      </template>
    </BasicTable>
    <Drawer
      title="上传列表"
      width="400px"
      placement="right"
      v-model:visible="visible"
      :mask="false"
    >
      <UploadCard v-for="(item, i) in uploadList" :key="i" ref="uploadCard" @complete="complete" />
    </Drawer>
    <WebDiskModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { columns, searchFormSchema } from '/@/views/function/webDisk/webDisk.data';
  import { deleteWebDisk, getWebDiskList, mergeFiles, registerTask } from '/@/api/function/webDisk';
  import { Drawer, message, Upload } from 'ant-design-vue';
  import SparkMD5 from 'spark-md5';
  import UploadCard from './UploadCard.vue';
  import WebDiskModal from './WebDiskModal.vue';
  import { useModal } from '/@/components/Modal';

  export default defineComponent({
    name: 'WebDisk',
    components: { BasicTable, Upload, Drawer, UploadCard, TableAction, WebDiskModal },
    setup() {
      let uploadList = ref<any>([]);
      const visible = ref<any>(false);
      let isOpen = ref<any>('');
      const uploadCard = ref(null);
      const [registerModal, { openModal }] = useModal();
      const [registerTable, { reload }] = useTable({
        api: getWebDiskList,
        columns,
        fetchSetting: {
          sizeField: 'pageSize',
          pageField: 'pageNum',
          listField: 'list',
        },
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        actionColumn: {
          width: 120,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
      });

      async function customRequest(data) {
        // 添加至上传列表
        uploadList.value = [...uploadList.value, data.file];
        visible.value = true;
        const { file } = data; // 拿到file
        const { size, name } = file; // 解构出可能用到的几个属性
        // 3.获取文件md5值（文件的md5值是根据文件内容生成的一个单独的标示，需要安装并引入一个插件：import SparkMD5 from 'spark-md5'）
        const result: any = await fileParse(file, 'buffer'); // fileParse转换函数我附在最下面👇，将file转成buffer格式数据，
        const spark = new SparkMD5.ArrayBuffer();
        spark.append(result);
        const hash = spark.end(); // 获取到的文件md5值
        // 5.文件切片上传
        const partSize = 5 * 1024 * 1024; // 考虑到前后端上传效率，我这里是切成5M/片,这个可根据项目实际需要自己决定
        const share = size <= partSize ? 1 : size / partSize; // 判断如果文件<=5M,不切片，超过按照5M每份切
        let cur = 0;
        const partList = ref<any>([]); // 存储文件切片的数组
        for (let i = 0; i < share; i++) {
          const obj = {
            file: file.slice(cur, cur + partSize), // 调用file.slice方法进行file的切片，第一个参数从哪里开始切，第二个参数切到哪里
            id: i + 1, // 每一个切片的单独标示，后期续传时用与去除已上传部分的切片
          };
          partList.value.push(obj); // 把切的每一片统一放到一个数组里
          cur += partSize;
        }
        isOpen.value = true; // isOpen代表上传开关，true标示打开上传开关，false标示关闭上传开关，你可以定义不同的名字，并且在哪里定义看你所用的框架
        // 6.调用断点续传
        register(partList.value, hash, name, size, partList.value.length); // 此函数往下看👇
      }

      function register(partList, hash, fileName, size, length) {
        registerTask({ md5: hash }).then((res) => {
          const { uploadId, status, partNumSet } = res; // uploadId是与这个文件对应的上传任务的id标示，status是此文件的状态，如已上传部分切片||从未进行上传，这是第一次||已经上传完了还未进行合并，partNumSet是一个数组，里面放着已经上传的切片的id，如果是从未进行上传，就是空数组
          const mergeParam = { hash, uploadId, fileName, size };
          if (status === '1') {
            // 1.已全部上传，未合并，直接调合并函数
            complete(mergeParam);
          } else if (status === '2') {
            // 2.已上传部分，根据后台返回的partNumSet字段(已上传切片id的数组)筛选，去除已上传部分，把剩下的切片组成一个新数组，如果筛选出来的新数组长度是0说明切片都已上传，直接合并，否则调用上传切片函数
            const newPartList = ref<any>([]);
            partList.forEach((item) => {
              if (partNumSet.indexOf(`${item.id}`) === -1) {
                newPartList.value.push(item);
              }
            });
            if (newPartList.value.length === 0) {
              complete(mergeParam);
            } else {
              uploadCard.value.newRequestArr(newPartList.value, hash, uploadId, mergeParam, length);
            }
          } else if (status === '3') {
            // 3.从未上传过此文件，调用上传切片函数
            uploadCard.value.newRequestArr(partList, hash, uploadId, mergeParam, length);
          } else if (status === '4') {
            // 4.已存在相同文件，调用秒传功能
            // 3.从未上传过此文件，调用上传切片函数
            uploadCard.value.newRequestArr(partList, hash, uploadId, mergeParam, 0);
            reload();
          }
        });
      }

      function complete(mergeParam) {
        mergeFiles(mergeParam).then(() => {
          reload();
          message.success('上传完成');
        });
      }
      // 转换函数
      const fileParse = (file, type = 'base64') => {
        return new Promise((res) => {
          const fileReader = new FileReader();
          /* fileReader.readAsArrayBuffer() // 转成buffer格式数据
              fileReader.readAsBinaryString() // 转成二进制格式数据
              fileReader.readAsDataURL() // 转成base64格式数据
              解析过程是异步，所以需要调用onload事件的e.target.result获取转换后的结果
            */
          switch (type) {
            case 'base64':
              fileReader.readAsDataURL(file);
              break;
            case 'buffer':
              fileReader.readAsArrayBuffer(file);
              break;
            case 'binary':
              fileReader.readAsBinaryString(file);
              break;
            default:
              break;
          }
          fileReader.onload = (e) => {
            res(e.target?.result);
          };
        });
      };

      function openUploadList() {
        visible.value = !visible.value;
      }

      function handleEdit(record: Recordable) {
        openModal(true, {
          record,
        });
      }

      function handleDownload(record: Recordable) {
        const a = document.createElement('a'); // 生成一个a元素
        const event = new MouseEvent('click'); // 创建一个单击事件
        a.href = '/basic-api/webDisk/download?id=' + record.id; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
      }

      function handleDelete(record: Recordable) {
        deleteWebDisk(record.id).then(() => {
          message.success('删除成功');
          reload();
        });
      }

      function handleSuccess() {
        reload();
      }

      return {
        registerTable,
        customRequest,
        openUploadList,
        visible,
        uploadList,
        uploadCard,
        complete,
        handleEdit,
        handleDelete,
        registerModal,
        handleSuccess,
        handleDownload,
      };
    },
  });
</script>

<style scoped></style>
