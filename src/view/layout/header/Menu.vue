<template>
  <ul class="menu-nav" v-if="listZoneRole">
    <li
      aria-haspopup="true"
      data-menu-toggle="click"
      class="menu-item menu-item-submenu menu-item-open-dropdown"
    >
      <a href="#" class="menu-link menu-toggle" v-if="listZoneRole.length > 1">
        <span class="menu-text">{{ zoneName }}</span>
      </a>
      <span class="menu-text" v-else>{{ zoneName }}</span>

      <div class="menu-submenu" v-if="listZoneRole.length > 1">
        <ul class="menu-subnav">
          <li
            aria-haspopup="true"
            data-menu-toggle="hover"
            class="menu-item menu-item-submenu"
            v-for="zone in listZoneRole"
            :key="zone.zone_id"
            :class="{ ['menu-item-active']: zone.zone_id == activeZone.id }"
            @click="switchZone(zone)"
          >
            <a href="#" class="menu-link menu-toggle">
              <!-- <i class="menu-icon flaticon2-list-2"></i> -->
              <span class="menu-text"> {{ zone.zone_name }} </span>
            </a>
          </li>
        </ul>
      </div>
    </li>
    <li class="menu-item menu-item-submenu">
      <span class="fa fa-angle-right"></span>
    </li>
    <li
      aria-haspopup="true"
      data-menu-toggle="click"
      class="menu-item menu-item-submenu menu-item-open-dropdown"
    >
      <a href="#" class="menu-link menu-toggle" v-if="listRole.length > 1">
        <span class="menu-text">{{ roleName }}</span>
      </a>
      <span class="menu-text" v-else>{{ roleName }}</span>
      <div class="menu-submenu" v-if="listRole.length > 1">
        <ul class="menu-subnav">
          <li
            aria-haspopup="true"
            data-menu-toggle="hover"
            class="menu-item menu-item-submenu"
            v-for="role in listRole"
            :key="role.id"
            :class="{ ['menu-item-active']: role.id == activeRole }"
            @click="switchRole(role)"
          >
            <a href="#" class="menu-link menu-toggle">
              <!-- <i class="menu-icon flaticon2-list-2"></i> -->
              <span class="menu-text"> {{ role.name }} </span>
            </a>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script>
import ApiService from "@/core/services/api.service";
import { find } from "lodash";
import { GET_PERMISSION } from "@/core/services/store/auth.module";
import { VERIFY_AUTH } from "@/core/services/store/auth.module";

export default {
  name: "KTMenu",
  data() {
    return {
      listZoneRole: [],
      listRole: [],
      activeZone: null,
      activeRole: null,
      zoneName: null,
      roleName: null,
    };
  },
  async mounted() {
    this.initMenu();
  },
  methods: {
    async initMenu() {
      
      const currUser = this.$store.getters.currentUser;
      this.activeZone = currUser.activeZone;
      this.activeRole = currUser.activeRole;
      const { data } = await ApiService.get("/user/list-role");
      this.listZoneRole = data;

      const objZone = find(this.listZoneRole, { zone_id: this.activeZone.id });
      this.zoneName = this.activeZone.name;

      this.listRole = objZone.roles;
      // const objRole = find(objZone.roles, { id: this.activeRole });
      this.roleName = this.activeRole.name;
    },
    redirect(to) {
      this.$store.dispatch(GET_PERMISSION).then(() => {
        this.$store.dispatch(VERIFY_AUTH).then(() => {
          if (this.$route.path != to) {
            this.$router.push({ path: to });
          }else{
            window.location.reload();
          }

          this.initMenu();
        });
      });
    },
    switchZone(zone) {
      if (zone.zone_id != this.activeZone.id) {
        ApiService.post("/user/switch-zone", {
          zone_id: zone.zone_id,
        }).then(({ data }) => {
          if (data.to) {
            this.activeZone = zone;
            this.zoneName = zone.name;
            this.redirect(data.to);
          }
        });
      }
    },
    switchRole(role) {
      if (role.id != this.activeRole.id) {
        ApiService.post("/user/switch-role", {
          role_id: role.id,
        }).then(({ data }) => {
          if (data.to) {
            this.activeRole = role;
            this.roleName = role.name;
            this.redirect(data.to);
          }
        });
      }
    },
  },
};
</script>
