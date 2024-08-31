// src/screens/CategoryWorkoutsScreen.tsx
import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootState } from "../redux/store";
import { RootStackParamList } from "../navigation/MainNavigator";
import { globalStyles, colors } from "../styles/styles";

type CategoryWorkoutsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "CategoryWorkouts"
>;
type CategoryWorkoutsScreenRouteProp = RouteProp<
  RootStackParamList,
  "CategoryWorkouts"
>;

const CategoryWorkoutsScreen: React.FC = () => {
  const navigation = useNavigation<CategoryWorkoutsScreenNavigationProp>();
  const route = useRoute<CategoryWorkoutsScreenRouteProp>();
  const { categoryId } = route.params;

  const category = useSelector((state: RootState) =>
    state.workoutCategories.find((c) => c.id === categoryId)
  );
  const workouts = useSelector((state: RootState) =>
    state.workouts.filter((w) => w.categoryId === categoryId)
  );

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>{category?.name} Workouts</Text>

      <TouchableOpacity
        style={[globalStyles.button, styles.addButton]}
        onPress={() => navigation.navigate("AddWorkout", { categoryId })}
      >
        <Text style={globalStyles.buttonText}>Add New Workout</Text>
      </TouchableOpacity>

      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.workoutButton}
            onPress={() =>
              navigation.navigate("WorkoutDetails", { workoutId: item.id })
            }
          >
            <Text style={styles.workoutButtonText}>
              {new Date(item.date).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>No workouts added yet</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  addButton: {
    marginBottom: 20,
  },
  workoutButton: {
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  workoutButtonText: {
    color: colors.onSurface,
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyListText: {
    textAlign: "center",
    color: colors.onBackground,
    fontSize: 16,
    marginTop: 20,
  },
});

export default CategoryWorkoutsScreen;
