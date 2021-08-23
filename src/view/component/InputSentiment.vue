<template>
  <div class="mb-5">
    <div class="text-subtitle-1 mb-2">Sentimen</div>
    <v-btn
      small
      v-for="(st, key) in list"
      :key="key"
      :text="st.slug != value"
      :depressed="st.slug == value"
      :color="st.color"
      @click="setValue(st.slug)"
      class="mr-2"
      ><span :class="st.icon" class="mr-2"></span> {{ st.name }}</v-btn
    >
  </div>
</template>

<script>
import { listSentiment } from "@/core/utils";

export default {
  props: {
    value: String,
  },
  data() {
    return {
      list: listSentiment,
    };
  },
  methods: {
    setValue(value) {
      this.value = value;
      this.$emit("input", value);
    },
  },
};
</script>

<style></style>
