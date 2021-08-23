<template>
  <router-link :to="to" v-slot="{ href, navigate, isActive, isExactActive }">
    <li
      aria-haspopup="true"
      data-menu-toggle="hover"
      class="menu-item"
      :class="[
        isActive && 'menu-item-active',
        isExactActive && 'menu-item-active',
      ]"
    >
      <a :href="href" class="menu-link" @click="navigate">
        <i v-if="submenu" class="menu-bullet menu-bullet-dot">
          <span></span>
        </i>
        <i v-else-if="icon" :class="['menu-icon', icon]"></i>
        <span class="menu-text">{{ title }}</span>
      </a>
    </li>
  </router-link>
</template>

<script>
export default {
  name: "nav-menu-item",
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
      type: Boolean,
      default: false,
    },
  },
};
</script>
