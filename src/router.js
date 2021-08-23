import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: "/admin",
  routes: [
    {
      path: "/",
      redirect: "/dashboard",
      component: () => import("@/view/layout/Layout"),
      children: [
        {
          path: "/dashboard",
          name: "dashboard",
          component: () => import("@/view/pages/Blank.vue"),
        },
        {
          path: "/terminal",
          name: "terminal",
          component: () => import("@/view/pages/terminal/Terminal.vue"),
          children: [
            {
              path: "terminal",
              name: "Terminal",
              component: () =>
                import("@/view/pages/terminal/terminal/ListTerminal.vue"),
            },
            {
              path: "sdm",
              name: "SDM",
              component: () => import("@/view/pages/terminal/sdm/ListSdm.vue"),
            },
            {
              path: "fasilitas",
              name: "Fasilitas",
              component: () =>
                import("@/view/pages/terminal/fasilitas/ListFasilitas.vue"),
            },
            {
              path: "pob",
              name: "Perusahaan Otobus",
              component: () => import("@/view/pages/angkutan/pob/ListPob.vue"),
            },
            {
              path: "trayek",
              name: "Trayek",
              component: () =>
                import("@/view/pages/angkutan/trayek/ListTrayek.vue"),
            },
            {
              path: "angkutan",
              name: "Angkutan",
              component: () =>
                import("@/view/pages/angkutan/angkutan/ListAngkutan.vue"),
            },
          ],
        },
        // {
        //   path: "/angkutan",
        //   name: "angkutan",
        //   component: () => import("@/view/pages/angkutan/Angkutan.vue"),
        //   children: [
        //     {
        //       path: "pob",
        //       name: "Perusahaan Otobus",
        //       component: () => import("@/view/pages/angkutan/pob/ListPob.vue"),
        //     },
        //     {
        //       path: "trayek",
        //       name: "Trayek",
        //       component: () =>
        //         import("@/view/pages/angkutan/trayek/ListTrayek.vue"),
        //     },
        //     {
        //       path: "angkutan",
        //       name: "Angkutan",
        //       component: () =>
        //         import("@/view/pages/angkutan/angkutan/ListAngkutan.vue"),
        //     },
        //   ],
        // },
        {
          path: "/user-management",
          name: "user-management",
          component: () =>
            import("@/view/pages/user-management/UserManagement.vue"),
          children: [
            {
              path: "user",
              name: "user",
              component: () =>
                import("@/view/pages/user-management/user/ListUser.vue"),
            },
            {
              path: "zone",
              name: "zone",
              component: () =>
                import("@/view/pages/user-management/zone/ListZone.vue"),
            },
            {
              path: "role",
              name: "role",
              component: () =>
                import("@/view/pages/user-management/role/ListRole.vue"),
            },
            {
              path: "module",
              name: "module",
              component: () =>
                import("@/view/pages/user-management/module/ListModule.vue"),
            },
            {
              path: "action",
              name: "action",
              component: () =>
                import("@/view/pages/user-management/action/ListAction.vue"),
            },
          ],
        },
        {
          path: "/files",
          name: "Files",
          component: () => import("@/view/pages/files/Files.vue"),
          children: [
            {
              path: "file",
              name: "file",
              component: () => import("@/view/pages/files/file/ListFile.vue"),
            },
            {
              path: "file-category",
              name: "file-category",
              component: () =>
                import("@/view/pages/files/file-category/ListFileCategory.vue"),
            },
          ],
        },
      ],
    },
    {
      path: "/error",
      name: "error",
      component: () => import("@/view/pages/error/Error.vue"),
      children: [
        {
          path: "error-1",
          name: "error-1",
          component: () => import("@/view/pages/error/Error-1.vue"),
        },
        {
          path: "error-2",
          name: "error-2",
          component: () => import("@/view/pages/error/Error-2.vue"),
        },
        {
          path: "error-3",
          name: "error-3",
          component: () => import("@/view/pages/error/Error-3.vue"),
        },
        {
          path: "error-4",
          name: "error-4",
          component: () => import("@/view/pages/error/Error-4.vue"),
        },
        {
          path: "error-5",
          name: "error-5",
          component: () => import("@/view/pages/error/Error-5.vue"),
        },
        {
          path: "error-6",
          name: "error-6",
          component: () => import("@/view/pages/error/Error-6.vue"),
        },
      ],
    },
    {
      path: "/",
      component: () => import("@/view/pages/auth/Auth"),
      children: [
        {
          name: "login",
          path: "/login",
          component: () => import("@/view/pages/auth/Login"),
        },
        {
          name: "register",
          path: "/register",
          component: () => import("@/view/pages/auth/Register"),
        },
      ],
    },
    {
      path: "*",
      redirect: "/404",
    },
    {
      // the 404 route, when none of the above matches
      path: "/404",
      name: "404",
      component: () => import("@/view/pages/error/Error-1.vue"),
    },
  ],
});
