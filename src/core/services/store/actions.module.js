// action types
export const APPEND_ACTION = "appendAction";

// mutation types
export const SET_ACTION = "setAction";
export const ADD_ACTION = "addAction";
export const CLEAR_ACTION = "clearAction";

export default {
  state: {
    actions: [],
  },
  getters: {
    /**
     * Get list of actions for current page
     * @param state
     * @returns {*}
     */
    actions(state) {
      return state.actions;
    },
  },
  actions: {
    /**
     * Set the actions list
     * @param state
     * @param payload
     */
    [SET_ACTION](state, payload) {
      state.commit(SET_ACTION, payload);
    },

    /**
     * Add action
     * @param state
     * @param payload
     */
    [ADD_ACTION](state, payload) {
      if (typeof payload === "object") {
        payload.forEach((item) => state.commit(APPEND_ACTION, item));
      } else {
        state.commit(APPEND_ACTION, payload);
      }
    },

    [CLEAR_ACTION](state) {
      state.commit(CLEAR_ACTION);
    },
  },
  mutations: {
    [APPEND_ACTION](state, payload) {
      state.actions = [...state.actions, payload];
    },
    [SET_ACTION](state, payload) {
      state.actions = payload;
    },
    [CLEAR_ACTION](state) {
      state.actions = [];
    },
  },
};
