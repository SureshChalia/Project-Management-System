import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  connected: false,
  socketId: null,
};

const socketSlice = createSlice({
  name: "socket",

  initialState,

  reducers: {
    socketConnected: (state, action) => {
      state.connected = true;
      state.socketId = action.payload;
    },

    socketDisconnected: (state) => {
      state.connected = false;
      state.socketId = null;
    },
  },
});

export const {
  socketConnected,
  socketDisconnected,
} = socketSlice.actions;

export default socketSlice.reducer;