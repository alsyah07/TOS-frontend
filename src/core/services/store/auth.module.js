import ApiService from "@/core/services/api.service";
import JwtService from "@/core/services/jwt.service";

// action types
export const VERIFY_AUTH = "verifyAuth";
export const LOGIN = "login";
export const LOGOUT = "logout";
export const REGISTER = "register";
export const UPDATE_USER = "updateUser";
export const GET_PERMISSION = "getPermission";

// mutation types
export const PURGE_AUTH = "logOut";
export const SET_AUTH = "setUser";
export const SET_ERROR = "setError";
export const SET_PERMISSION = "setPermission";

const state = {
  errors: null,
  user: {},
  isAuthenticated: !!JwtService.getToken(),
  permission: window.localStorage.getItem("permission")
    ? JSON.parse(window.localStorage.getItem("permission"))
    : null,
};

const getters = {
  currentUser(state) {
    return state.user;
  },
  isAuthenticated(state) {
    return state.isAuthenticated;
  },
  listPermission(state) {
    return state.permission;
  },
  hasPermission: (state) => (module, action) => {
    // console.log(state.permission, module, action);
    if (state.permission && state.permission[module]) {
      if (state.permission[module].includes(action)) {
        return true;
      }
    }

    return false;
  },
};

const actions = {
  [LOGIN](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.post("auth/login-with-password", credentials)
        .then(({ data }) => {
          context.commit(SET_AUTH, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, [response.data.error]);
          reject(response);
        });
    });
  },
  [LOGOUT](context) {
    context.commit(PURGE_AUTH);
  },
  [REGISTER](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.post("auth/register", credentials)
        .then(({ data }) => {
          context.commit(SET_AUTH, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, [response.data.error]);
          reject(response);
        });
    });
  },
  [VERIFY_AUTH](context) {
    return new Promise((resolve) => {
      if (JwtService.getToken()) {
        ApiService.post("auth/refresh", {
          token: JwtService.getToken("refreshToken"),
        })
          .then(({ data }) => {
            context.commit(SET_AUTH, data);
            resolve(true);
          })
          .catch(({ response }) => {
            context.commit(SET_ERROR, response.data.errors);
            context.commit(PURGE_AUTH);
            resolve(false);
          });
      } else {
        context.commit(PURGE_AUTH);
        resolve(false);
        // .then(() => this.$router.push({ name: "login" }));
      }
    });
  },
  // [UPDATE_USER](context, payload) {
  //   const { email, username, password, image, bio } = payload;
  //   const user = { email, username, bio, image };
  //   if (password) {
  //     user.password = password;
  //   }

  //   return ApiService.put("user", user).then(({ data }) => {
  //     context.commit(SET_AUTH, data);
  //     return data;
  //   });
  // },
  [GET_PERMISSION](context) {
    return ApiService.get("user/permission").then(({ data }) => {
      context.commit(SET_PERMISSION, data);
      return data;
    });
  },
};

const mutations = {
  [SET_ERROR](state, error) {
    state.errors = error;
  },
  [SET_AUTH](state, data) {
    state.isAuthenticated = true;
    state.user = data.user;
    state.errors = {};
    JwtService.saveToken(data.access_token);
    JwtService.saveToken(data.refresh_token, "refreshToken");
  },
  [PURGE_AUTH](state) {
    state.isAuthenticated = false;
    state.user = {};
    state.errors = {};
    state.permission = null;
    JwtService.destroyToken();
  },
  [SET_PERMISSION](state, data) {
    state.permission = data;
    window.localStorage.setItem("permission", JSON.stringify(data));
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
