<template>
  <!-- begin::Scrolltop -->
  <div id="kt_scrolltop" ref="kt_scrolltop" class="scrolltop">
    <span class="svg-icon">
      <inline-svg :src="asset('/media/svg/icons/Navigation/Up-2.svg')" />
    </span>
  </div>
  <!-- end::Scrolltop -->
</template>

<script>
import KTLayoutScrolltop from "@/assets/js/layout/extended/scrolltop.js";
import { asset } from "@/core/utils";

export default {
  name: "KTScrollTop",
  methods: { asset },
  mounted() {
    // Init Scrolltop
    KTLayoutScrolltop.init(this.$refs["kt_scrolltop"]);
  },
};
</script>
