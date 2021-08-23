<template>
  <div>
    <div class="card card-custom gutter-b">
      <div class="card-body">
        <datatable
          ref="datatable"
          module="trayek"
          :title="title"
          :url="url"
          :columns="columns"
          disable-action
          disable-create
        >
        </datatable>
      </div>
    </div>
  </div>
</template>

<script>
import Datatable from "@/view/component/Datatable.vue";

export default {
  props: {
    terminal: String,
  },
  data() {
    return {
      title: "Trayek",
      url: "trayek/data?terminal=" + this.terminal,
      columns: [
        {
          value: "id",
        },
        {
          text: "Kode",
          value: "kode",
          sortable: true,
          searchable: true,
        },
        {
          text: "Nama",
          value: "nama",
          sortable: true,
          searchable: true,
        },
        {
          text: "Deskripsi",
          value: "deskripsi",
          sortable: true,
          searchable: true,
        },
      ],
    };
  },
  components: {
    Datatable,
  },
};
</script>
