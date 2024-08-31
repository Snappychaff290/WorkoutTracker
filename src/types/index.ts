// src/types/index.ts

export interface WorkoutCategory {
  id: string;
  name: string;
}

export interface Workout {
  id: string;
  categoryId: string;
  date: Date;
}

export interface Exercise {
  id: string;
  workoutId: string;
  name: string;
}

export interface ExerciseSet {
  id: string;
  exerciseId: string;
  weight: number;
  reps: number;
}
