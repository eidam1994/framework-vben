import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const dashboard: AppRouteModule = {
  path: '/system',
  name: 'System',
  component: LAYOUT,
  redirect: '/system/user',
  meta: {
    orderNo: 1,
    icon: 'grommet-icons:system',
    title: '系统管理',
  },
  children: [
    {
      path: 'user',
      name: 'User',
      component: () => import('/@/views/auth/user/index.vue'),
      meta: {
        icon: 'bx:bxs-user-detail',
        title: '用户管理',
      },
    },
    {
      path: 'role',
      name: 'Role',
      component: () => import('/@/views/auth/role/index.vue'),
      meta: {
        icon: 'mdi:account-lock-outline',
        title: '角色管理',
      },
    },
  ],
};

export default dashboard;
