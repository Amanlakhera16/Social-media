import { GLOBALTYPES } from "../actions/globalTypes";

const initialState = localStorage.getItem("theme") === "true" ? true : false;

const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBALTYPES.THEME:
      return action.payload;

    default:
      return state;
  }
};

export default themeReducer;
