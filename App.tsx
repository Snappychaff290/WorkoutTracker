// App.tsx
import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import { Provider } from "react-redux";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { store } from "./src/redux/store";
import MainNavigator from "./src/navigation/MainNavigator";
import { loadData } from "./src/utils/storage";
import { setWorkoutCategories } from "./src/redux/slices/workoutCategorySlice";
import { setWorkouts } from "./src/redux/slices/workoutSlice";
import { setExercises } from "./src/redux/slices/exerciseSlice";
import { setExerciseSets } from "./src/redux/slices/exerciseSetSlice";
import { colors } from "./src/styles/styles";

// Customize the DarkTheme
const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.onSurface,
    primary: colors.primary,
  },
};

export default function App() {
  useEffect(() => {
    const loadInitialData = async () => {
      const data = await loadData();
      store.dispatch(setWorkoutCategories(data.workoutCategories));
      store.dispatch(setWorkouts(data.workouts));
      store.dispatch(setExercises(data.exercises));
      store.dispatch(setExerciseSets(data.exerciseSets));
    };

    loadInitialData();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer theme={CustomDarkTheme}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.background}
        />
        <MainNavigator />
      </NavigationContainer>
    </Provider>
  );
}
