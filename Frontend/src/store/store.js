import { configureStore } from "@reduxjs/toolkit";
import { meetingSlice } from "./common";
import { createWrapper } from "next-redux-wrapper";

const makeStore = () =>
  configureStore({
    reducer: {
      [meetingSlice.name]: meetingSlice.reducer,
    },
    devTools: true,
  });

export const wrapper = createWrapper(makeStore);
