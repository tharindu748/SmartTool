// src/redux/reducers/userReducer.js
const initialState = {
    currentUser: null,
    isAuthenticated: false,
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'LOGOUT':
        return {
          ...state,
          currentUser: null,
          isAuthenticated: false,
        };
      default:
        return state;
    }
  };
  
  export default userReducer;
  