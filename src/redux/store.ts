// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import workoutCategoryReducer from "./slices/workoutCategorySlice";
import workoutReducer from "./slices/workoutSlice";
import exerciseReducer from "./slices/exerciseSlice";
import exerciseSetReducer from "./slices/exerciseSetSlice";

export const store = configureStore({
  reducer: {
    workoutCategories: workoutCategoryReducer,
    workouts: workoutReducer,
    exercises: exerciseReducer,
    exerciseSets: exerciseSetReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
