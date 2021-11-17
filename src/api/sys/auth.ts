import { defHttp } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/userModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  Login = '/auth/login',
  Logout = '/logout',
  GetUserInfo = '/auth/userInfo',
  GetPermCode = '/getPermCode',
  Register= '/user/register',
  UserList = '/user/list',
  SaveUser = '/user/save',
  DeleteUser = '/user/delete',
  RoleList = '/role/list',
  SaveRole = '/role/save',
  DeleteRole = '/role/delete',
  MenuList = '/menu/list',
  SaveMenu = '/menu/save',
  DeleteMenu = '/menu/delete',
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

export const register = (params: any) => {
  return defHttp.post({ url: Api.Register, params });
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

export const getRoleList = (params: any) => {
  return defHttp.post({ url: Api.RoleList, params });
};

export const saveRole = (params: any) => {
  return defHttp.post({ url: Api.SaveRole, params });
};

export const deleteRole = (id) => {
  return defHttp.delete({ url: `${Api.DeleteRole}/${id}` });
};

export const getMenuList = () => {
  return defHttp.get({ url: Api.MenuList });
};

export const saveMenu = (params: any) => {
  return defHttp.post({ url: Api.SaveMenu, params });
};
