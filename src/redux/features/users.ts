import { createAction, createReducer, PayloadAction } from "@reduxjs/toolkit";
import { User } from "app/interfaces/users";

// Define the type for the payload of the 'setUser' action
type SetUserPayload = User;

// Define the 'setUser' action creator with the appropriate payload type
export const setUser = createAction<SetUserPayload>("SET_USER");

const initialState: User = {
  id: 0,
  name: "",
  lastname: "",
  email: "",
  address: "",
  phone: "",
  isAdmin: false,
  status: "active"
};

const usersReducer = createReducer(initialState, (builder) => {
  builder.addCase(setUser, (state, action: PayloadAction<SetUserPayload>) => {
    return action.payload;
  });
});

export default usersReducer;
