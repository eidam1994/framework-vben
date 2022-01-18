import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetNotepadList = '/notepad/list',
  SaveNotepad = '/notepad/save',
  GetNotepadDetail = '/notepad/detail',
  GetTagOptions = '/notepad/options',
  DeleteNotepad = '/notepad/delete',
}

/**
 * 获取笔记列表
 * @param params
 */
export const getNotepadList = (params: any) => {
  return defHttp.post({ url: Api.GetNotepadList, params });
};

/**
 * 保存笔记
 * @param params
 */
export const saveNotepad = (params: any) => {
  return defHttp.post({ url: Api.SaveNotepad, params });
};

/**
 * 获取笔记详情
 * @param params
 */
export const getNotepadDetail = (params: any) => {
  return defHttp.post({ url: Api.GetNotepadDetail, params });
};

/**
 * 获取标签集合列表
 */
export const getTagOptions = () => {
  return defHttp.get({ url: Api.GetTagOptions });
};

/**
 * 删除笔记
 * @param id
 */
export const deleteNotepad = (id) => {
  return defHttp.delete({ url: `${Api.DeleteNotepad}/${id}` });
};
