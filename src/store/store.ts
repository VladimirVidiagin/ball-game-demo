import { configureStore } from "@reduxjs/toolkit";
import { ballsReducer } from "../features/Board/model/ballsReducer";

export const store = configureStore({
  reducer: {
    // @ts-ignore
    balls: ballsReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
