<template>
  <div>
    <div class="card card-custom gutter-b">
      <div class="card-body">
        <datatable
          ref="datatable"
          :title="title"
          :url="url"
          :columns="columns"
          :on-click-update="onClickUpdate"
          :on-click-delete="onClickDelete"
          disable-create
          disable-search
          disable-action
        >
            <template v-slot:item.lat="{ item }">
                {{ item.lat && item.lng ? item.lat+", "+item.lng : "-" }}
            </template>
            <template v-slot:item.created_at="{ item }">
            {{ item.created_at | moment("dddd, DD MMM YYYY - HH:mm") }}
          </template>
        </datatable>
      </div>
    </div>
    
  </div>
</template>

<script>
import Datatable from "@/view/component/Datatable.vue";


export default {
  data() {
    return {
      title: "User",
      url: "user-log/data?id=" + this.id,
      columns: [
        {
          value: "id",
        },
        {
          value: "lng",
        },
        {
          text: "Date",
          value: "created_at",
          sortable: true,
          searchable: true,
          
        },
        {
          text: "Browser",
          value: "browser",
          sortable: true,
          searchable: true,
        },
        {
          text: "Version",
          value: "version",
          sortable: true,
          searchable: true,
        },
        {
          text: "OS",
          value: "os",
          sortable: true,
          searchable: true,
        },
        {
          text: "Platform",
          value: "platform",
          sortable: true,
          searchable: true,
        },
        {
          text: "Location",
          value: "lat",
          sortable: true,
          searchable: true,
        }
      ],
    };
  },
  props: {
    id: String,
  },
  methods: {
    
  },
  components: {
    Datatable,
  },
};
</script>
