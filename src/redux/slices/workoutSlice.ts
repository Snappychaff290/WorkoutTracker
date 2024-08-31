// src/redux/slices/workoutSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Workout } from "../../types";

const workoutSlice = createSlice({
  name: "workouts",
  initialState: [] as Workout[],
  reducers: {
    addWorkout: (state, action: PayloadAction<Workout>) => {
      state.push(action.payload);
    },
    updateWorkout: (state, action: PayloadAction<Workout>) => {
      const index = state.findIndex((w) => w.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteWorkout: (state, action: PayloadAction<string>) => {
      return state.filter((w) => w.id !== action.payload);
    },
  },
});

export const { addWorkout, updateWorkout, deleteWorkout } =
  workoutSlice.actions;
export default workoutSlice.reducer;
