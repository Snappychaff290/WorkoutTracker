// src/redux/slices/workoutCategorySlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WorkoutCategory } from "../../types";

const workoutCategorySlice = createSlice({
  name: "workoutCategories",
  initialState: [] as WorkoutCategory[],
  reducers: {
    addWorkoutCategory: (state, action: PayloadAction<WorkoutCategory>) => {
      state.push(action.payload);
    },
    updateWorkoutCategory: (state, action: PayloadAction<WorkoutCategory>) => {
      const index = state.findIndex((wc) => wc.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteWorkoutCategory: (state, action: PayloadAction<string>) => {
      return state.filter((wc) => wc.id !== action.payload);
    },
  },
});

export const {
  addWorkoutCategory,
  updateWorkoutCategory,
  deleteWorkoutCategory,
} = workoutCategorySlice.actions;
export default workoutCategorySlice.reducer;
