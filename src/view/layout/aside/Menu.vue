<template>
  <ul class="menu-nav">
    <template v-for="(item, index) in listMenu">
      <template v-if="item.header">
        <li class="menu-section" :key="'item-' + index">
          <h4 class="menu-text">{{ item.header }}</h4>
          <i class="menu-icon flaticon-more-v2"></i>
        </li>
      </template>
      <template v-else-if="!item.submenu">
        <nav-menu-item
          :key="'item-' + index"
          :to="item.url"
          :title="item.title"
          :icon="item.icon"
        />
      </template>
      <template v-else>
        <nav-menu-group
          :key="'item-' + index"
          :to="item.url"
          :title="item.title"
          :icon="item.icon"
          :submenu="item.submenu"
        />
      </template>
    </template>
  </ul>
</template>

<script>
import configMenu from "@/core/config/aside.config";
import NavMenuItem from "./MenuItem";
import NavMenuGroup from "./MenuGroup";
import { mapGetters } from "vuex";
import _ from "lodash";

export default {
  data() {
    return {
      listMenu: [],
    };
  },
  // props: {
  //   listMenu: {
  //     type: Array,
  //   },
  // },
  components: {
    NavMenuItem,
    NavMenuGroup,
  },
  computed: {
    ...mapGetters(["listPermission"]),
  },
  methods: {
    validateModule(menuItem) {
      const arrMenu = [];
      menuItem.forEach((m) => {
        if (m.submenu && m.submenu.length > 0) {
          const validatedSubmenu = this.validateModule(m.submenu);
          if (validatedSubmenu.length > 0) {
            m.submenu = validatedSubmenu;
            arrMenu.push(m);
          }
        } else {
          // validate

          const hasAccess = this.$store.getters.hasPermission(m.module, "view");
          // console.log(m.module, hasAccess);
          if (hasAccess) {
            arrMenu.push(m);
          }
        }
      });

      return arrMenu;
    },
  },
  watch: {
    listPermission() {
      const menu = _.cloneDeep(configMenu);
      this.listMenu = [...this.validateModule(menu)];
    },
  },
};
</script>
