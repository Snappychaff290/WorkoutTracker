// src/redux/slices/exerciseSetSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExerciseSet } from "../../types";

const exerciseSetSlice = createSlice({
  name: "exerciseSets",
  initialState: [] as ExerciseSet[],
  reducers: {
    addExerciseSet: (state, action: PayloadAction<ExerciseSet>) => {
      state.push(action.payload);
    },
    updateExerciseSet: (state, action: PayloadAction<ExerciseSet>) => {
      const index = state.findIndex((set) => set.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteExerciseSet: (state, action: PayloadAction<string>) => {
      return state.filter((set) => set.id !== action.payload);
    },
    setExerciseSets: (state, action: PayloadAction<ExerciseSet[]>) => {
      return action.payload;
    },
  },
});

export const {
  addExerciseSet,
  updateExerciseSet,
  deleteExerciseSet,
  setExerciseSets,
} = exerciseSetSlice.actions;
export default exerciseSetSlice.reducer;
