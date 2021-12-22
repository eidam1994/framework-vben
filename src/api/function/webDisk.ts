import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetWebDiskList = '/webDisk/list',
  DeleteWebDisk = '/webDisk/delete',
  UpdateWebDisk = '/webDisk/update',
  DownloadFile = '/webDisk/download',
  RegisterTask = '/task/register',
  SliceUpload = '/task/upload',
  MergeFiles = '/task/merge',
  CancelUpload = '/task/cancel',
}

/**
 * 读取网盘列表
 * @param params
 */
export const getWebDiskList = (params: any) => {
  return defHttp.post({ url: Api.GetWebDiskList, params });
};

/**
 * 删除网盘数据
 * @param id
 */
export const deleteWebDisk = (id) => {
  return defHttp.delete({ url: `${Api.DeleteWebDisk}/${id}` });
};

/**
 * 修改网盘文件信息
 * @param params
 */
export const updateWebDisk = (params: any) => {
  return defHttp.post({ url: Api.UpdateWebDisk, params });
};

/**
 * 下载文件
 * @param params
 */
export const downloadFile = (params: any) => {
  return defHttp.get({ url: Api.DownloadFile, params });
};

/**
 * 注册网盘上传任务
 * @param params
 */
export const registerTask = (params: any) => {
  return defHttp.get({ url: Api.RegisterTask, params });
};

/**
 * 分片上传文件
 * @param params
 */
export const sliceUpload = (params: any) => {
  return defHttp.post({ url: Api.SliceUpload, params });
};

/**
 * 合并已上传文件
 * @param params
 */
export const mergeFiles = (params: any) => {
  return defHttp.post({ url: Api.MergeFiles, params });
};

/**
 * 终止上传
 * @param params
 */
export const cancelUpload = (params: any) => {
  return defHttp.delete({ url: `${Api.CancelUpload}/${params.id}` });
};
