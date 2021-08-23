<template>
  <v-tooltip>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        class="ml-5 mr-2"
        :color="data.color"
        x-small
        dark
        fab
        elevation="0"
        v-on="on"
        v-bind="attrs"
      >
        <span :class="data.icon" style="font-size: 12px;"></span>
      </v-btn>
    </template>
    <span>{{ data.name }}</span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    data: Object,
  },
};
</script>
