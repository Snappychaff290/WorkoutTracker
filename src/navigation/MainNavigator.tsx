// src/navigation/MainNavigator.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import CategoryWorkoutsScreen from "../screens/CategoryWorkoutsScreen";
import WorkoutDetailsScreen from "../screens/WorkoutDetailsScreen";
import AddWorkoutScreen from "../screens/AddWorkoutScreen";
import { colors } from "../styles/styles";

export type RootStackParamList = {
  Home: undefined;
  CategoryWorkouts: { categoryId: string };
  WorkoutDetails: { workoutId: string };
  AddWorkout: { categoryId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.onSurface,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Workout Categories" }}
      />
      <Stack.Screen
        name="CategoryWorkouts"
        component={CategoryWorkoutsScreen}
        options={({ route }) => ({
          title: route.params.categoryId, // You might want to pass the category name instead of ID for the title
        })}
      />
      <Stack.Screen
        name="WorkoutDetails"
        component={WorkoutDetailsScreen}
        options={{ title: "Workout Details" }}
      />
      <Stack.Screen
        name="AddWorkout"
        component={AddWorkoutScreen}
        options={{ title: "Add New Workout" }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
