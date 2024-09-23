const constantRoutes = [
  {
    path: "/",
    redirect: "/site/newdecoration",
  },
  {
    path: "/site",
    redirect: "/site/newdecoration",
    component: () => import("@/views/Home.vue"),
    children: [
      {
        path: "/site/newdecoration",
        name: "Decoration",
        component: () => import("@/views/Decoration.vue")
      },
      {
        path: "/site/setting",
        name: "Setting",
        component: () => import("@/views/siteSetting/index.vue")
      }
    ]
  },
];

export default constantRoutes;
