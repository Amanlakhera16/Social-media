import { MESSAGE_TYPES } from "../actions/messageAction";

const initialState = {
    users: [],
    resultUsers: 0,
    data: [],
    resultData: 0,
    firstLoad: false 
};

const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case MESSAGE_TYPES.ADD_USER:
      if(state.users.every(item => item._id !== action.payload._id)){
        return {
          ...state,
          users: [action.payload, ...state.users],
        };
      }
      return state;

    case MESSAGE_TYPES.ADD_MESSAGE:
      return {
        ...state,
        data: [...state.data, action.payload],
        users: state.users.map((user) =>
          user._id === action.payload.recipient ||
          user._id === action.payload.sender
            ? {
                ...user,
                text: action.payload.text,
                media: action.payload.media,
              }
            : user
        ),
      };

    case MESSAGE_TYPES.GET_CONVERSATIONS:
      return {
        ...state,
        users: action.payload.newArr,
        resultUsers: action.payload.result,
        firstLoad: true
      };

    case MESSAGE_TYPES.GET_MESSAGES:
      return {
        ...state,
        data: action.payload.messages,
        resultData: action.payload.result,
      };

    case MESSAGE_TYPES.DELETE_MESSAGES:
        return {
            ...state,
            data: action.payload.newData
        };

    case MESSAGE_TYPES.DELETE_CONVERSATION:
        return {
            ...state,
            users: state.users.filter(item => item._id !== action.payload),
            data: []
        };

    default:
      return state;
  }
};

export default messageReducer;
