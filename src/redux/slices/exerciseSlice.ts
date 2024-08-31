// src/redux/slices/exerciseSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Exercise } from "../../types";

const exerciseSlice = createSlice({
  name: "exercises",
  initialState: [] as Exercise[],
  reducers: {
    addExercise: (state, action: PayloadAction<Exercise>) => {
      state.push(action.payload);
    },
    updateExercise: (state, action: PayloadAction<Exercise>) => {
      const index = state.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteExercise: (state, action: PayloadAction<string>) => {
      return state.filter((e) => e.id !== action.payload);
    },
    setExercises: (state, action: PayloadAction<Exercise[]>) => {
      return action.payload;
    },
  },
});

export const { addExercise, updateExercise, deleteExercise, setExercises } =
  exerciseSlice.actions;
export default exerciseSlice.reducer;
