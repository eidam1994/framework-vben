import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetMenuList = '/menu/menuList',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = () => {
  return defHttp.get({ url: Api.GetMenuList });
};
