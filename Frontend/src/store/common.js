import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

// Initial state
const initialState = {
  lists: [],
  loading: false,
};

// Actual Slice
export const meetingSlice = createSlice({
  name: "meetings",
  initialState,
  reducers: {
    setMeetings(state, action) {
      state.lists = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },

  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.auth,
      };
    },
  },
});

export const { setMeetings, setLoading } = meetingSlice.actions;

export const meetingLists = (state) => state.meetings.lists;
export const loading = (state) => state.meetings.loading;

export default meetingSlice.reducer;
