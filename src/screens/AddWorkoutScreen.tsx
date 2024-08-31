// src/screens/AddWorkoutScreen.tsx
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Vibration,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RootState } from "../redux/store";
import { addWorkout } from "../redux/slices/workoutSlice";
import { addExercise } from "../redux/slices/exerciseSlice";
import { addExerciseSet } from "../redux/slices/exerciseSetSlice";
import { saveData } from "../utils/storage";
import { globalStyles, colors } from "../styles/styles";
import {
  selectAllExercises,
  selectAllExerciseSets,
  selectPastExercises,
  selectAllWorkouts,
} from "../redux/selectors";

const AddWorkoutScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { categoryId } = route.params;
  const dispatch = useDispatch();

  const allExercises = useSelector(selectAllExercises);
  const allSets = useSelector(selectAllExerciseSets);
  const allPastExercises = useSelector(selectPastExercises);
  const allWorkouts = useSelector(selectAllWorkouts);
  const store = useSelector((state: RootState) => state);

  const [exercises, setExercises] = useState([]);
  const [newExerciseName, setNewExerciseName] = useState("");
  const [showPastExercises, setShowPastExercises] = useState(false);
  const [notes, setNotes] = useState("");

  // Filter past exercises by the current category
  const pastExercises = useMemo(() => {
    const categoryWorkouts = allWorkouts.filter(
      (w) => w.categoryId === categoryId
    );
    const categoryExerciseIds = categoryWorkouts.flatMap((w) =>
      allExercises.filter((e) => e.workoutId === w.id).map((e) => e.id)
    );
    const categoryExercises = allExercises.filter((e) =>
      categoryExerciseIds.includes(e.id)
    );
    return [...new Set(categoryExercises.map((e) => e.name))];
  }, [allWorkouts, allExercises, categoryId]);

  const triggerVibration = () => {
    Vibration.vibrate(100); // Vibrate for 100ms
  };

  const addNewExercise = () => {
    if (newExerciseName.trim()) {
      setExercises([
        ...exercises,
        { name: newExerciseName.trim(), sets: [{ weight: "", reps: "" }] },
      ]);
      setNewExerciseName("");
      triggerVibration();
    }
  };

  const addExistingExercise = (exerciseName) => {
    const lastPerformance = getLastPerformance(exerciseName);
    setExercises([
      ...exercises,
      {
        name: exerciseName,
        sets: lastPerformance.map((set) => ({
          weight: set.weight.toString(),
          reps: set.reps.toString(),
          previousWeight: set.weight,
          previousReps: set.reps,
        })),
      },
    ]);
    setShowPastExercises(false);
    triggerVibration();
  };

  const getLastPerformance = (exerciseName) => {
    const categoryWorkouts = allWorkouts.filter(
      (w) => w.categoryId === categoryId
    );
    const exerciseInstances = allExercises.filter(
      (e) =>
        e.name === exerciseName &&
        categoryWorkouts.some((w) => w.id === e.workoutId)
    );
    if (exerciseInstances.length === 0) return [];

    const lastExerciseId = exerciseInstances[exerciseInstances.length - 1].id;
    return allSets.filter((set) => set.exerciseId === lastExerciseId);
  };

  const addSet = (exerciseIndex) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets.push({ weight: "", reps: "" });
    setExercises(updatedExercises);
    triggerVibration();
  };

  const updateSet = (exerciseIndex, setIndex, field, value) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets[setIndex][field] = value;
    setExercises(updatedExercises);
  };

  const deleteExercise = (index) => {
    const updatedExercises = exercises.filter((_, i) => i !== index);
    setExercises(updatedExercises);
    triggerVibration();
  };

  const deleteSet = (exerciseIndex, setIndex) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets = updatedExercises[
      exerciseIndex
    ].sets.filter((_, i) => i !== setIndex);
    setExercises(updatedExercises);
    triggerVibration();
  };

  const saveWorkout = () => {
    if (exercises.length === 0) {
      Alert.alert("Error", "Please add at least one exercise before saving.");
      return;
      triggerVibration();
    }

    const workoutId = Date.now().toString();
    const newWorkout = {
      id: workoutId,
      categoryId,
      date: new Date(),
      notes: notes,
    };
    dispatch(addWorkout(newWorkout));

    const newExercises = [];
    const newSets = [];

    exercises.forEach((exercise) => {
      const exerciseId = Date.now().toString();
      const newExercise = {
        id: exerciseId,
        workoutId,
        name: exercise.name,
      };
      dispatch(addExercise(newExercise));
      newExercises.push(newExercise);

      exercise.sets.forEach((set) => {
        const newSet = {
          id: Date.now().toString(),
          exerciseId,
          weight: parseFloat(set.weight) || 0,
          reps: parseInt(set.reps) || 0,
        };
        dispatch(addExerciseSet(newSet));
        newSets.push(newSet);
      });
    });

    // Save data to AsyncStorage
    saveData(
      store.workoutCategories,
      [...store.workouts, newWorkout],
      [...store.exercises, ...newExercises],
      [...store.exerciseSets, ...newSets]
    );

    navigation.goBack();
  };

  const isImprovedPerformance = (
    currentWeight,
    currentReps,
    previousWeight,
    previousReps
  ) => {
    return (
      parseFloat(currentWeight) > previousWeight ||
      parseInt(currentReps) > previousReps
    );
  };

  return (
    <KeyboardAwareScrollView
      style={globalStyles.container}
      contentContainerStyle={globalStyles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={globalStyles.title}>Add New Workout</Text>

      <TouchableOpacity style={globalStyles.button} onPress={saveWorkout}>
        <Text style={globalStyles.buttonText}>Save Workout</Text>
      </TouchableOpacity>

      <View style={styles.notesContainer}>
        <Text style={styles.label}>Workout Notes:</Text>
        <TextInput
          style={[globalStyles.input, styles.notesInput]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Add any notes about this workout..."
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
        style={[globalStyles.button, { marginBottom: 10 }]}
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

      {exercises.map((exercise, exerciseIndex) => (
        <View key={exerciseIndex} style={styles.exerciseContainer}>
          <View style={styles.exerciseHeader}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <TouchableOpacity onPress={() => deleteExercise(exerciseIndex)}>
              <Text style={globalStyles.deleteIcon}>✕</Text>
            </TouchableOpacity>
          </View>
          {exercise.sets.map((set, setIndex) => (
            <View key={setIndex}>
              <View style={styles.setContainer}>
                <TextInput
                  style={[globalStyles.input, styles.setInput]}
                  value={set.weight}
                  onChangeText={(text) =>
                    updateSet(exerciseIndex, setIndex, "weight", text)
                  }
                  placeholder="Weight"
                  placeholderTextColor={colors.onSurface + "80"}
                  keyboardType="numeric"
                  keyboardAppearance="dark"
                />
                <TextInput
                  style={[globalStyles.input, styles.setInput]}
                  value={set.reps}
                  onChangeText={(text) =>
                    updateSet(exerciseIndex, setIndex, "reps", text)
                  }
                  placeholder="Reps"
                  placeholderTextColor={colors.onSurface + "80"}
                  keyboardType="numeric"
                  keyboardAppearance="dark"
                />
                <TouchableOpacity
                  onPress={() => deleteSet(exerciseIndex, setIndex)}
                >
                  <Text style={globalStyles.deleteIcon}>✕</Text>
                </TouchableOpacity>
              </View>
              {set.previousWeight && set.previousReps && (
                <Text
                  style={[
                    styles.previousPerformance,
                    isImprovedPerformance(
                      set.weight,
                      set.reps,
                      set.previousWeight,
                      set.previousReps
                    )
                      ? styles.improvedPerformance
                      : null,
                  ]}
                >
                  Previous: {set.previousWeight} lbs x {set.previousReps} reps
                </Text>
              )}
            </View>
          ))}
          <TouchableOpacity
            style={[globalStyles.button, { marginTop: 10 }]}
            onPress={() => addSet(exerciseIndex)}
          >
            <Text style={globalStyles.buttonText}>Add Set</Text>
          </TouchableOpacity>
        </View>
      ))}
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
  previousPerformance: {
    fontSize: 14,
    color: colors.onSurface + "80", // Grey color for previous performance
    marginBottom: 5,
  },
  improvedPerformance: {
    color: colors.secondary, // Green color for improved performance
  },
});

export default AddWorkoutScreen;
