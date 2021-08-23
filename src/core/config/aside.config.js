// import store from "@/core/services/store";

const Menu = [
  {
    url: "/dashboard",
    title: "Dashboard",
    icon: "flaticon2-architecture-and-city",
    module: "dashboard",
  },
  {
    url: "/user-management",
    title: "Manajemen User",
    icon: "flaticon2-avatar",
    submenu: [
      {
        url: "/user",
        title: "User",
        module: "user",
      },
      {
        url: "/zone",
        title: "Wilayah",
        module: "zone",
      },
      {
        url: "/role",
        title: "Role",
        module: "role",
      },
      {
        url: "/module",
        title: "Modul",
        module: "module",
      },
      {
        url: "/action",
        title: "Tindakan",
        module: "action",
      },
    ],
  },
  {
    url: "/terminal",
    title: "Sistem Informasi",
    icon: "flaticon2-shelter",
    submenu: [
      {
        url: "/terminal",
        title: "Data Terminal",
        module: "terminal",
      },
      {
        url: "/sdm",
        title: "SDM",
        module: "sdm",
      },
      {
        url: "/pob",
        title: "Perusahaan Otobus",
        module: "pob",
      },
      {
        url: "/trayek",
        title: "Trayek",
        module: "trayek",
      },
      {
        url: "/angkutan",
        title: "Kendaraan",
        module: "angkutan",
      },
      // {
      //   url: "/fasilitas",
      //   title: "Fasilitas",
      //   module: "fasilitas",
      // },
      {
        url: "/aset",
        title: "Aset",
        module: "aset",
      },
    ],
  },
  // {
  //   url: "/angkutan",
  //   title: "Operasional Terminal",
  //   icon: "fas fa-bus",
  //   submenu: [
  //     {
  //       url: "/pob",
  //       title: "Perusahaan Otobus",
  //       module: "pob",
  //     },
  //     {
  //       url: "/trayek",
  //       title: "Trayek",
  //       module: "trayek",
  //     },
  //     {
  //       url: "/angkutan",
  //       title: "Kendaraan",
  //       module: "angkutan",
  //     },
  //   ],
  // },
  {
    url: "/files",
    title: "Image Processing Gate",
    icon: "flaticon-file-1",
    submenu: [
      {
        url: "/file",
        title: "Dokumen",
        module: "file",
      },
      {
        url: "/file-category",
        title: "Kategori",
        module: "file-category",
      },
    ],
  },
];

export default Menu;
