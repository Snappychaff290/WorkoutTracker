// src/redux/selectors.ts
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";

export const selectAllWorkoutCategories = (state: RootState) =>
  state.workoutCategories;
export const selectAllWorkouts = (state: RootState) => state.workouts;
export const selectAllExercises = (state: RootState) => state.exercises;
export const selectAllExerciseSets = (state: RootState) => state.exerciseSets;

export const selectWorkoutById = createSelector(
  [selectAllWorkouts, (state, workoutId: string) => workoutId],
  (workouts, workoutId) => workouts.find((w) => w.id === workoutId)
);

export const selectExercisesByWorkoutId = createSelector(
  [selectAllExercises, (state, workoutId: string) => workoutId],
  (exercises, workoutId) => exercises.filter((e) => e.workoutId === workoutId)
);

export const selectSetsByExerciseId = createSelector(
  [selectAllExerciseSets, (state, exerciseId: string) => exerciseId],
  (sets, exerciseId) => sets.filter((s) => s.exerciseId === exerciseId)
);

export const selectWorkoutsByCategory = createSelector(
  [selectAllWorkouts, (state, categoryId: string) => categoryId],
  (workouts, categoryId) => workouts.filter((w) => w.categoryId === categoryId)
);

export const selectPastExercises = createSelector(
  [selectAllExercises],
  (exercises) => [...new Set(exercises.map((e) => e.name))]
);
