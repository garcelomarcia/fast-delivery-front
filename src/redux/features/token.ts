import { createAction, createReducer, PayloadAction } from "@reduxjs/toolkit";

export const setToken = createAction<any>("SET_TOKEN");

const initialState: any = {
  token: ""
};

const usersReducer = createReducer(initialState, (builder) => {
  builder.addCase(setToken, (state, action: PayloadAction<any>) => {
    return action.payload;
  });
});

export default usersReducer;
