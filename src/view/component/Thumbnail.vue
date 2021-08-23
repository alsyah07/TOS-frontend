<template>
  <div v-if="loaded">
    <CoolLightBox :items="items" :index="index" @close="index = null">
    </CoolLightBox>
    <div class="images-wrapper">
      <div class="images-wrapper">
        <div
          class="image"
          v-for="(image, imageIndex) in items"
          :key="imageIndex"
          :style="{
            width: multiple ? width + 'px' : '100%',
            height: multiple ? height + 'px' : height * 2 + 'px',
            backgroundImage: 'url(\'' + image.src + '\')',
          }"
          @click="index = imageIndex"
        ></div>
      </div>
      <!--
        :style="'background-image: url(' + image.src + ')'"
         <v-img
        v-for="(image, imageIndex) in items"
        :key="imageIndex"
        @click="index = imageIndex"
        :lazy-src="image.src"
        :src="image.src"
        :max-height="'100'"
        :max-width="multiple ? '100' : '500'"
        contain
      ></v-img> -->
    </div>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import CoolLightBox from "vue-cool-lightbox";
import "vue-cool-lightbox/dist/vue-cool-lightbox.min.css";
import { forEach, isArray, map } from "lodash";

export default {
  async mounted() {
    
    let items = [];
    if(this.value && this.value.length > 0){
      // console.log(typeof this.value[0]);
      if(typeof this.value[0] == 'object'){
        items = map(this.value, (vv) => {
          return {
            title: vv.name,
            description: "",
            src: vv.url
          }
        });
      }
    }else{
      const { data } = await ApiService.post("file/load", {
        fileId: isArray(this.value) ? this.value : [this.value],
      });
      
      if (data.length > 0) {
        forEach(data, (val) => {
          items.push({
            title: val.name,
            description: "",
            src: val.url,
          });
        });
      }
    }

    this.items = items;
    
    if (this.items.length > 1) {
      this.multiple = true;
    }
    this.$nextTick().then(() => {
      this.loaded = true;
    });
  },
  data() {
    return {
      src: null,
      items: [],
      loaded: false,
      index: null,
      multiple: false,
    };
  },
  props: {
    value: String,
    height: {
      type: Number,
      default: 120,
    },
    width: {
      type: Number,
      default: 120,
    },
  },
  components: {
    CoolLightBox,
  },
};
</script>

<style type="text/css">
.image {
  display: inline-block;
  background-size: cover;
  background-position: center;
  border: 1px solid #eee;
  border-radius: 5px;
  margin: 3px 6px;
}
@media (min-width: 767px) {
  .images-wrapper {
    margin-right: -20px;
  }
}
.images-wrapper {
  display: block;
  margin-right: -10px;
  max-width: 100%;
}
</style>
