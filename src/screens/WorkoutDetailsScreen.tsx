// src/screens/WorkoutDetailsScreen.tsx
import React, { useState, useMemo } from "react"; // Add useMemo here
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSelector, useDispatch } from "react-redux";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootState } from "../redux/store";
import { updateWorkout } from "../redux/slices/workoutSlice";
import {
  addExercise,
  updateExercise,
  deleteExercise,
} from "../redux/slices/exerciseSlice";
import {
  addExerciseSet,
  updateExerciseSet,
  deleteExerciseSet,
} from "../redux/slices/exerciseSetSlice";
import { RootStackParamList } from "../navigation/MainNavigator";
import { globalStyles, colors } from "../styles/styles";
import {
  selectWorkoutById,
  selectExercisesByWorkoutId,
  selectAllExerciseSets,
  selectPastExercises,
} from "../redux/selectors";

type WorkoutDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  "WorkoutDetails"
>;

const WorkoutDetailsScreen = () => {
  const route = useRoute<WorkoutDetailsScreenRouteProp>();
  const { workoutId } = route.params;
  const dispatch = useDispatch();

  const workout = useSelector((state: RootState) =>
    selectWorkoutById(state, workoutId)
  );
  const exercises = useSelector((state: RootState) =>
    selectExercisesByWorkoutId(state, workoutId)
  );
  const exerciseSets = useSelector(selectAllExerciseSets);
  const allExercises = useSelector(selectPastExercises); // Make sure allExercises is available

  const [notes, setNotes] = useState(workout?.notes || "");
  const [newExerciseName, setNewExerciseName] = useState("");
  const [showPastExercises, setShowPastExercises] = useState(false);

  const triggerHaptic = () => {
    // Assuming ReactNativeHapticFeedback is correctly imported
    ReactNativeHapticFeedback.trigger("impactLight", hapticOptions);
  };

  // Use useMemo to compute past exercises
  const pastExercises = useMemo(() => {
    const workoutExerciseNames = new Set(exercises.map((e) => e.name));
    return [...new Set(allExercises.map((e) => e.name))].filter(
      (name) => !workoutExerciseNames.has(name)
    );
  }, [allExercises, exercises]);

  const updateNotes = () => {
    if (workout) {
      dispatch(updateWorkout({ ...workout, notes }));
      triggerHaptic();
    }
  };

  const addNewExercise = () => {
    if (newExerciseName.trim() && workout) {
      const newExercise = {
        id: Date.now().toString(),
        workoutId: workout.id,
        name: newExerciseName.trim(),
      };
      dispatch(addExercise(newExercise));
      setNewExerciseName("");
      triggerHaptic();
    }
  };

  const addExistingExercise = (exerciseName: string) => {
    if (workout) {
      const newExercise = {
        id: Date.now().toString(),
        workoutId: workout.id,
        name: exerciseName,
      };
      dispatch(addExercise(newExercise));
      setShowPastExercises(false);
      triggerHaptic();
    }
  };

  const addSet = (exerciseId: string) => {
    const newSet = {
      id: Date.now().toString(),
      exerciseId,
      weight: 0,
      reps: 0,
    };
    dispatch(addExerciseSet(newSet));
    triggerHaptic();
  };

  const updateSet = (
    setId: string,
    field: "weight" | "reps",
    value: string
  ) => {
    const set = exerciseSets.find((s) => s.id === setId);
    if (set) {
      dispatch(updateExerciseSet({ ...set, [field]: parseFloat(value) || 0 }));
    }
  };

  const deleteSet = (setId: string) => {
    dispatch(deleteExerciseSet(setId));
    triggerHaptic();
  };

  const deleteExerciseHandler = (exerciseId: string) => {
    dispatch(deleteExercise(exerciseId));
    exerciseSets
      .filter((set) => set.exerciseId === exerciseId)
      .forEach((set) => {
        dispatch(deleteExerciseSet(set.id));
      });
    triggerHaptic();
  };

  if (!workout) {
    return (
      <Text style={[globalStyles.text, styles.errorText]}>
        Workout not found
      </Text>
    );
  }

  return (
    <KeyboardAwareScrollView
      style={globalStyles.container}
      contentContainerStyle={globalStyles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={globalStyles.title}>
        Workout on {new Date(workout.date).toLocaleDateString()}
      </Text>

      <View style={styles.notesContainer}>
        <Text style={styles.label}>Notes:</Text>
        <TextInput
          style={[globalStyles.input, styles.notesInput]}
          value={notes}
          onChangeText={setNotes}
          onBlur={updateNotes}
          placeholder="Add workout notes..."
          placeholderTextColor={colors.onSurface + "80"}
          multiline
          keyboardAppearance="dark"
        />
      </View>

      <View style={styles.addExerciseContainer}>
        <TextInput
          style={[globalStyles.input, { flex: 1 }]}
          value={newExerciseName}
          onChangeText={setNewExerciseName}
          placeholder="New exercise name"
          placeholderTextColor={colors.onSurface + "80"}
          keyboardAppearance="dark"
        />
        <TouchableOpacity style={globalStyles.button} onPress={addNewExercise}>
          <Text style={globalStyles.buttonText}>Add New</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[globalStyles.button, styles.showPastExercisesButton]}
        onPress={() => setShowPastExercises(!showPastExercises)}
      >
        <Text style={globalStyles.buttonText}>
          {showPastExercises ? "Hide Past Exercises" : "Show Past Exercises"}
        </Text>
      </TouchableOpacity>

      {showPastExercises && (
        <FlatList
          data={pastExercises}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.pastExerciseButton}
              onPress={() => addExistingExercise(item)}
            >
              <Text style={styles.pastExerciseText}>{item}</Text>
            </TouchableOpacity>
          )}
          style={styles.pastExercisesList}
        />
      )}

      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item: exercise }) => (
          <View style={styles.exerciseContainer}>
            <View style={styles.exerciseHeader}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <TouchableOpacity
                onPress={() => deleteExerciseHandler(exercise.id)}
              >
                <Text style={globalStyles.deleteIcon}>✕</Text>
              </TouchableOpacity>
            </View>
            {exerciseSets
              .filter((set) => set.exerciseId === exercise.id)
              .map((set) => (
                <View key={set.id} style={styles.setContainer}>
                  <TextInput
                    style={[globalStyles.input, styles.setInput]}
                    value={set.weight.toString()}
                    onChangeText={(text) => updateSet(set.id, "weight", text)}
                    keyboardType="numeric"
                    keyboardAppearance="dark"
                    placeholder="Weight"
                    placeholderTextColor={colors.onSurface + "80"}
                  />
                  <TextInput
                    style={[globalStyles.input, styles.setInput]}
                    value={set.reps.toString()}
                    onChangeText={(text) => updateSet(set.id, "reps", text)}
                    keyboardType="numeric"
                    keyboardAppearance="dark"
                    placeholder="Reps"
                    placeholderTextColor={colors.onSurface + "80"}
                  />
                  <TouchableOpacity onPress={() => deleteSet(set.id)}>
                    <Text style={globalStyles.deleteIcon}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            <TouchableOpacity
              style={[globalStyles.button, styles.addSetButton]}
              onPress={() => addSet(exercise.id)}
            >
              <Text style={globalStyles.buttonText}>Add Set</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  notesContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.onBackground,
    marginBottom: 5,
  },
  notesInput: {
    height: 100,
    textAlignVertical: "top",
  },
  addExerciseContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  exerciseContainer: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.onSurface,
  },
  setContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  setInput: {
    flex: 1,
    marginRight: 10,
  },
  addSetButton: {
    marginTop: 10,
  },
  errorText: {
    textAlign: "center",
    marginTop: 20,
  },
  showPastExercisesButton: {
    marginBottom: 10,
  },
  pastExercisesList: {
    maxHeight: 200,
    marginBottom: 20,
  },
  pastExerciseButton: {
    backgroundColor: colors.surface,
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  pastExerciseText: {
    color: colors.onSurface,
    fontSize: 16,
  },
});

export default WorkoutDetailsScreen;
