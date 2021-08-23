import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import JwtService from "@/core/services/jwt.service";

/**
 * Service to call HTTP request via Axios
 */

function errorResponseHandler(error) {
  // check for errorHandle config
  if (
    error.config.hasOwnProperty("errorHandle") &&
    error.config.errorHandle === false
  ) {
    return Promise.reject(error);
  }

  // if has response show the error
  if (error.response) {
    if (
      error.response.data &&
      error.response.data.errors == "Not Authenticated"
    ) {
      // Refresh if token expired to get new token
      window.location.reload();
    }
  }
  return Promise.reject(error);
}

const ApiService = {
  baseUrl: process.env.VUE_APP_SERVER_URL,
  init() {
    Vue.use(VueAxios, axios);
    Vue.axios.defaults.baseURL = this.baseUrl;

    // apply interceptor on response
    Vue.axios.interceptors.response.use(
      (response) => response,
      errorResponseHandler
    );
    if (JwtService.getToken()) {
      this.setHeader();
    }
  },

  /**
   * Set the default HTTP request headers
   */
  setHeader() {
    if (JwtService.getToken()) {
      Vue.axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${JwtService.getToken()}`;
    }
  },

  query(resource, params) {
    this.setHeader();
    return Vue.axios.get(resource, params).catch((error) => {
      // console.log(error);
      throw new Error(`[KT] ApiService ${error}`);
    });
  },

  /**
   * Send the GET HTTP request
   * @param resource
   * @param slug
   * @returns {*}
   */
  get(resource) {
    this.setHeader();
    return Vue.axios.get(resource).catch((error) => {
      throw new Error(`ApiService ${error}`);
    });
  },

  /**
   * Set the POST HTTP request
   * @param resource
   * @param params
   * @returns {*}
   */
  post(resource, params) {
    this.setHeader();
    params = this.sanitizeParams(params);
    return Vue.axios.post(`${resource}`, params);
  },

  /**
   * Send the UPDATE HTTP request
   * @param resource
   * @param slug
   * @param params
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   */
  update(resource, params) {
    this.setHeader();
    params = this.sanitizeParams(params);
    return Vue.axios.patch(resource, params);
  },

  /**
   * Send the PUT HTTP request
   * @param resource
   * @param params
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   */
  put(resource, params) {
    this.setHeader();
    params = this.sanitizeParams(params);
    return Vue.axios.put(`${resource}`, params);
  },

  /**
   * Send the DELETE HTTP request
   * @param resource
   * @returns {*}
   */
  delete(resource) {
    this.setHeader();
    return Vue.axios.delete(resource);
  },

  sanitizeParams(params) {
    for (var param in params) {
      if (params[param] === "") {
        params[param] = null;
      }
    }
    return params;
  },
};

export default ApiService;
