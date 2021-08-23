<template>
  <div>
    <v-btn
      depressed
      v-for="action in actions"
      :key="action.text"
      :color="action.color"
      @click="action.onClick"
      dark
      :style="{ 'text-transform': 'none', 'margin-right': '10px' }"
    >
      <v-icon v-if="action.icon" small>{{ action.icon }}</v-icon>
      {{ action.text }}</v-btn
    >
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["actions"]),
  },
};
</script>

<style></style>
