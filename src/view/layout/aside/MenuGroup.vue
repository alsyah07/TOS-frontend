<template>
  <li
    aria-haspopup="true"
    data-menu-toggle="hover"
    class="menu-item menu-item-submenu"
    v-bind:class="{ 'menu-item-open': hasActiveChildren(to) }"
  >
    <a href="#" class="menu-link menu-toggle">
      <i v-if="icon" :class="['menu-icon', icon]"></i>
      <span class="menu-text">{{ title }}</span>
      <i class="menu-arrow"></i>
    </a>

    <div class="menu-submenu">
      <span class="menu-arrow"></span>
      <ul class="menu-subnav">
        <li aria-haspopup="true" class="menu-item menu-item-parent">
          <span class="menu-link">
            <span class="menu-text">{{ title }}</span>
          </span>
        </li>
        <template v-for="(groupItem, index) in submenu">
          <nav-menu-group
            :key="'submenu' + index"
            v-if="groupItem.submenu"
            :to="groupItem.url"
            :title="groupItem.title"
            :icon="groupItem.icon"
            :submenu="groupItem.submenu"
          ></nav-menu-group>
          <nav-menu-item
            v-else
            :key="'submenu' + index"
            :to="to + groupItem.url"
            :title="groupItem.title"
            :icon="groupItem.title"
            :submenu="true"
          />
        </template>
      </ul>
    </div>
  </li>
</template>
<script>
import NavMenuItem from "./MenuItem";

export default {
  name: "nav-menu-group",
  props: {
    to: {
      type: String,
    },
    title: {
      type: String,
    },
    icon: {
      type: String,
      default: null,
    },
    submenu: {
      type: Array,
      default: null,
    },
  },
  components: {
    NavMenuItem,
  },
  methods: {
    hasActiveChildren(match) {
      return this.$route["path"].indexOf(match) !== -1;
    },
  },
};
</script>
