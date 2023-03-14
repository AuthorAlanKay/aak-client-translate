import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import globalSlice from "./reuse-features/globalSlice";

export const reducer = combineReducers({
  global: globalSlice,
});

export const rootPersistConfig = {
  key: "root",
  storage,
  // blacklist: [""],
};
