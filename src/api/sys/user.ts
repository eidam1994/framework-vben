import { defHttp } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/userModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  Login = '/auth/login',
  Logout = '/logout',
  GetUserInfo = '/auth/userInfo',
  GetPermCode = '/getPermCode',
  UserList = '/user/list',
  SaveUser = '/user/save',
  DeleteUser = '/user/delete',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout });
}

export const getUserList = (params: any) => {
  return defHttp.post({ url: Api.UserList, params });
};

export const saveUser = (params: any) => {
  return defHttp.post({ url: Api.SaveUser, params });
};

export const deleteUser = (id) => {
  return defHttp.delete({ url: `${Api.DeleteUser}/${id}` });
};
