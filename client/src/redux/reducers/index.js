// src/redux/reducers/index.js
import { combineReducers } from '@reduxjs/toolkit';  // Redux Toolkit's combineReducers
import userReducer from './userReducer';  // Import the user reducer

const rootReducer = combineReducers({
  user: userReducer,  // Combine your reducers here
});

export default rootReducer;
