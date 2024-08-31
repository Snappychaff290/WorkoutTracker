// src/utils/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WorkoutCategory, Workout, Exercise, ExerciseSet } from "../types";

export const saveData = async (
  workoutCategories: WorkoutCategory[],
  workouts: Workout[],
  exercises: Exercise[],
  exerciseSets: ExerciseSet[]
) => {
  try {
    await AsyncStorage.setItem(
      "workoutCategories",
      JSON.stringify(workoutCategories)
    );
    await AsyncStorage.setItem("workouts", JSON.stringify(workouts));
    await AsyncStorage.setItem("exercises", JSON.stringify(exercises));
    await AsyncStorage.setItem("exerciseSets", JSON.stringify(exerciseSets));
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

export const loadData = async () => {
  try {
    const workoutCategories = await AsyncStorage.getItem("workoutCategories");
    const workouts = await AsyncStorage.getItem("workouts");
    const exercises = await AsyncStorage.getItem("exercises");
    const exerciseSets = await AsyncStorage.getItem("exerciseSets");

    return {
      workoutCategories: workoutCategories ? JSON.parse(workoutCategories) : [],
      workouts: workouts ? JSON.parse(workouts) : [],
      exercises: exercises ? JSON.parse(exercises) : [],
      exerciseSets: exerciseSets ? JSON.parse(exerciseSets) : [],
    };
  } catch (error) {
    console.error("Error loading data:", error);
    return {
      workoutCategories: [],
      workouts: [],
      exercises: [],
      exerciseSets: [],
    };
  }
};
