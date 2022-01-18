<template>
  <div>
    <PageWrapper v-loading="loadingFlag">
      <template #default>
        <div style="display: flex">
          <div style="width: 260px; height: calc(100vh - 120px)">
            <Select
              class="!mb-2"
              v-model:value="searchTags"
              mode="tags"
              style="width: 100%"
              placeholder="请输入标签"
              :options="tagOptions"
              :token-separators="[',']"
              @change="handleChange"
            />
            <ScrollContainer>
              <Card
                v-for="(item, i) in notepadList"
                :key="i"
                class="!mb-2 !max-w-full !min-w-260px"
                :hoverable="true"
                size="small"
                :title="item.title"
                headStyle="cursor: default"
              >
                <template #extra>
                  <Popconfirm
                    title="是否要删除该笔记?"
                    ok-text="是"
                    cancel-text="否"
                    @confirm="handleRemove(item.id)"
                  >
                    <Icon style="cursor: pointer" icon="fluent:delete-24-regular" color="red" />
                  </Popconfirm>
                </template>
                <MarkdownViewer :value="item.content" @click="getDetail(item.id)" />
                <div class="text-xs text-gray-400 text-right">{{ item.updateTime }}</div>
              </Card>
            </ScrollContainer>
          </div>
          <div style="width: 100%; margin-left: 20px">
            <InputGroup compact>
              <Popconfirm
                title="是否要新建笔记?"
                ok-text="是"
                cancel-text="否"
                @confirm="newDocument"
              >
                <a-button postIcon="carbon:document-add" class="!mr-2.4 !w-3/50" />
              </Popconfirm>
              <Select
                class="!w-16/50 !mr-2.4"
                v-model:value="notepad.data.tags"
                mode="tags"
                style="width: 100%"
                placeholder="请输入标签"
                :options="tagOptions"
                :token-separators="[',']"
              />
              <InputSearch
                class="!mb-2 !w-30/50"
                v-model:value="notepad.data.title"
                placeholder="请输入标题"
                enter-button="保存"
                @search="onSave"
              />
            </InputGroup>
            <Tinymce
              v-model="notepad.data.content"
              width="100%"
              height="calc(100vh - 120px)"
              :showImageUpload="false"
              :options="{
                statusbar: false,
                menubar: 'customMenu',
                menu: {
                  customMenu: { title: '菜单', items: 'wordcount' },
                },
              }"
            />
          </div>
        </div>
      </template>
    </PageWrapper>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { ScrollContainer } from '/@/components/Container';
  import { Tinymce } from '/@/components/Tinymce';
  import { Card, Select, message, Popconfirm } from 'ant-design-vue';
  import {
    getNotepadList,
    saveNotepad,
    getNotepadDetail,
    getTagOptions,
    deleteNotepad,
  } from '/@/api/function/notepad';
  import { MarkdownViewer } from '/@/components/Markdown';
  import AButton from '/@/components/Button/src/BasicButton.vue';
  import Icon from '/@/components/Icon/src/Icon.vue';
  import { InputGroup, InputSearch } from "ant-design-vue/es";

  export default defineComponent({
    name: 'Notepad',
    components: {
      Icon,
      AButton,
      PageWrapper,
      ScrollContainer,
      Tinymce,
      Card,
      Select,
      InputSearch,
      InputGroup,
      MarkdownViewer,
      Popconfirm,
    },
    setup() {
      const notepad = reactive({ data: { id: '', title: '', content: '', tags: [] } });
      const searchTags = ref([]);
      const tagOptions = ref([]);
      const notepadList = ref([]);
      const loadingFlag = ref(false);

      const onSave = () => {
        if (!notepad.data.content) {
          message.error('内容不能未空');
          return;
        }
        if (!notepad.data.title) {
          message.error('标题不能未空');
          return;
        }
        saveNotepad(notepad.data).then((res) => {
          message.success('保存成功');
          notepad.data.id = res.id;
          queryList();
        });
      };

      const handleChange = () => {
        loadingFlag.value = true;
        getNotepadList({ tags: searchTags.value })
          .then((res) => {
            notepadList.value = res;
          })
          .finally(() => {
            loadingFlag.value = false;
          });
      };

      const handleRemove = (id) => {
        deleteNotepad(id).then(() => {
          queryList();
          newDocument();
        });
      };

      const queryList = () => {
        loadingFlag.value = true;
        getNotepadList({})
          .then((res) => {
            notepadList.value = res;
          })
          .finally(() => {
            loadingFlag.value = false;
          });
        getTagOptions().then((res) => {
          tagOptions.value = res.map((item) => ({ value: item }));
        });
      };

      const newDocument = () => {
        notepad.data.id = '';
        notepad.data.title = '';
        notepad.data.content = '';
        notepad.data.tags = [];
      };

      const getDetail = (id) => {
        loadingFlag.value = true;
        getNotepadDetail({ id: id })
          .then((res) => {
            notepad.data = res;
          })
          .finally(() => {
            loadingFlag.value = false;
          });
      };

      onMounted(() => {
        queryList();
      });

      return {
        loadingFlag,
        notepadList,
        notepad,
        searchTags,
        tagOptions,
        onSave,
        getDetail,
        handleChange,
        newDocument,
        handleRemove,
      };
    },
  });
</script>

<style scoped></style>
