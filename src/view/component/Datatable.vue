<template>
  <div>
    <v-row>
      <v-col cols="12" md="3" v-if="!disableSearch">
        <v-text-field
          label="Search"
          dense
          prepend-inner-icon="mdi-magnify"
          :hide-details="true"
          :clearable="true"
          v-model="search"
          background-color="rgba(0, 0, 0, 0.1))"
          :solo="true"
          :flat="true"
          :style="{
            border: '1px solid #d5d5d5',
          }"
        ></v-text-field>
      </v-col>
      <slot name="action" />
    </v-row>
    <v-data-table
      :headers="headers"
      :items="items"
      :server-items-length="totalItems"
      :footer-props="footerProps"
      :loading="loading"
      :options.sync="options"
    >
      <template v-for="slot in slots" v-slot:[slot.name]="{ item }">
        <slot :name="slot.name" v-bind:item="item">{{ item[slot.value] }}</slot>
      </template>

      <template v-if="!disableAction" v-slot:item.actions="{ item }">
        <slot name="item.action" v-bind:item="item"></slot>
        <v-tooltip left v-if="canUpdate || canView">
          <template v-slot:activator="{ on, attrs }">
            <a
              href="#"
              class="btn btn-icon btn-light btn-xs mx-1"
              @click="onClickUpdate(item)"
              v-on="on"
              v-bind="attrs"
            >
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <!--begin::Svg Icon-->
                <inline-svg
                  v-if="canUpdate"
                  :src="asset('/media/svg/icons/Communication/Write.svg')"
                ></inline-svg>
                <inline-svg
                  v-else-if="canView"
                  :src="asset('/media/svg/icons/Files/File.svg')"
                ></inline-svg>
                <!--end::Svg Icon-->
              </span>
            </a>
          </template>
          <span>{{ canUpdate ? "Edit" : "Lihat Detil" }}</span>
        </v-tooltip>

        <v-tooltip left v-if="canDelete">
          <template v-slot:activator="{ on, attrs }">
            <a
              href="#"
              class="btn btn-icon btn-light btn-xs mx-1"
              @click="onClickDelete(item)"
              v-if="canDelete"
              v-on="on"
              v-bind="attrs"
            >
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <!--begin::Svg Icon-->
                <inline-svg
                  :src="asset('/media/svg/icons/General/Trash.svg')"
                ></inline-svg>
                <!--end::Svg Icon-->
              </span>
            </a>
          </template>
          <span>Hapus</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { SET_ACTION } from "@/core/services/store/actions.module";
import ApiService from "@/core/services/api.service";
import { asset } from "@/core/utils/";
import { forEach, isPlainObject, isArray } from "lodash";

let timeoutSearch;

export default {
  mounted() {
    if (!this.disableCreate) {
      if (this.canCreate) {
        this.$store.dispatch(SET_ACTION, [
          {
            text: "Tambah " + this.title,
            onClick: this.onClickCreate,
            color: "blue",
            icon: "mdi-plus",
          },
        ]);
      }
    }

    this.dataColumn = this.columns.map((column) => {
      const params = {};
      if (column.value) {
        params.data = column.value;
        params.sortable = column.sortable ? true : false;
        params.searchable = column.searchable ? true : false;
      }

      return params;
    });

    this.headers = [];
    this.columns.map((column) => {
      if (!column.text) {
        return;
      }
      this.slots.push({
        name: "item." + column.value,
        value: column.value,
      });

      let headerColumn = { ...column };
      delete headerColumn.searchable;
      this.headers.push(headerColumn);
    });
    if (!this.disableAction) {
      this.headers.push({
        text: "Tindakan",
        value: "actions",
        align: "center",
        sortable: false,
        width: this.actionWidth,
      });
    }
  },
  data() {
    return {
      baseUrl: window.location.origin,
      slots: [],
      search: "",
      loading: true,
      totalItems: 0,
      currentPage: 1,
      perPage: 10,
      footerProps: {
        "items-per-page-options": [10, 20, 50, 100],
        "show-current-page": true,
      },
      options: {},
      items: [],
      order: null,
      headers: [],
      dataColumn: [],
    };
  },
  props: {
    module: {
      type: String,
      default: null,
    },
    url: {
      type: String,
    },
    title: {
      type: String,
    },
    columns: {
      type: Array,
    },
    filter: {
      type: [Array, Object],
      default: null,
    },
    actionWidth: {
      type: Number,
      default: 150,
    },
    requireFilter: Boolean,
    onClickDelete: {
      type: Function,
      default: function() {},
    },
    onClickCreate: {
      type: Function,
      default: function() {},
    },
    onClickUpdate: {
      type: Function,
      default: function() {},
    },
    disableCreate: Boolean,
    disableSearch: Boolean,
    disableAction: Boolean,
  },
  methods: {
    refresh() {
      this.getData();
    },
    async getData() {
      if (!this.url) {
        return;
      }
      if (this.requireFilter && !this.filter) {
        return;
      }
      this.loading = true;
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;

      const params = {
        columns: this.dataColumn,
        page: page,
        perPage: itemsPerPage,
      };

      if (sortBy.length === 1 && sortDesc.length === 1) {
        params.order = {
          column: sortBy[0],
          dir: sortDesc[0] ? "asc" : "desc",
        };
      }

      if (this.search != "") {
        params.search = {
          value: this.search,
        };
      }

      if (this.filter) {
        params.filter = [];

        if (isPlainObject(this.filter)) {
          params.filter.push({
            column: this.filter.column,
            value: this.filter.value,
            operator: this.filter.operator || "eq",
          });
        } else if (isArray(this.filter)) {
          forEach(this.filter, (vfilter) => {
            params.filter.push({
              column: vfilter.column,
              value: vfilter.value,
              operator: vfilter.operator || "eq",
            });
          });
        }
      }

      const dataModule = await ApiService.post(this.url, params);
      this.loading = false;
      this.items = dataModule.data.data;
      this.totalItems = dataModule.data.recordsTotal;
    },
    asset,
  },
  watch: {
    options: {
      handler() {
        this.getData();
      },
      deep: true,
    },
    filter() {
      this.refresh();
    },
    search() {
      if (this.disableSearch) return;
      clearTimeout(timeoutSearch);
        timeoutSearch = setTimeout(() => {
          this.getData();
        }, 500);
    },
  },
  computed: {
    canView() {
      if (this.module == null) {
        return true;
      } else if (this.$store.getters.hasPermission(this.module, "view")) {
        return true;
      }

      return false;
    },
    canCreate() {
      if (this.module == null) {
        return true;
      } else if (this.$store.getters.hasPermission(this.module, "create")) {
        return true;
      }

      return false;
    },
    canUpdate() {
      if (this.module == null) {
        return true;
      } else if (this.$store.getters.hasPermission(this.module, "update")) {
        return true;
      }

      return false;
    },
    canDelete() {
      if (this.module == null) {
        return true;
      } else if (this.$store.getters.hasPermission(this.module, "delete")) {
        return true;
      }

      return false;
    },
  },
};
</script>

<style lang="scss">
.theme--light.v-data-table
  > .v-data-table__wrapper
  > table
  > tbody
  > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
  background: #fcfcfc !important;
  .btn-icon {
    background: #fff;
  }
}
</style>
