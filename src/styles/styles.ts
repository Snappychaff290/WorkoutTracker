// src/styles/styles.ts
import { StyleSheet } from "react-native";

export const colors = {
  background: "#121212",
  surface: "#1E1E1E",
  primary: "#BB86FC",
  primaryVariant: "#3700B3",
  secondary: "#03DAC6",
  onBackground: "#FFFFFF",
  onSurface: "#FFFFFF",
  error: "#CF6679",
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.onBackground,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: colors.surface,
    color: colors.onSurface,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: colors.background,
    fontWeight: "bold",
    fontSize: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.onSurface,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    color: colors.onSurface,
  },
  deleteIcon: {
    color: colors.error,
    fontSize: 24,
    fontWeight: "bold",
  },
});

export const homeStyles = StyleSheet.create({
  addCategoryContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  categoryButton: {
    ...globalStyles.card,
    backgroundColor: colors.primaryVariant,
  },
  categoryButtonText: {
    ...globalStyles.cardTitle,
    textAlign: "center",
  },
});

export const addWorkoutStyles = StyleSheet.create({
  notesContainer: {
    marginBottom: 20,
  },
  notesLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.onBackground,
    marginBottom: 8,
  },
  notesInput: {
    ...globalStyles.input,
    minHeight: 100,
    textAlignVertical: "top",
  },
  addExerciseContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  exerciseContainer: {
    ...globalStyles.card,
    marginBottom: 20,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  exerciseName: {
    ...globalStyles.cardTitle,
  },
  setContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  previousPerformance: {
    fontSize: 14,
    color: colors.secondary,
    marginBottom: 8,
  },
  improvedPerformance: {
    color: colors.secondary,
    fontWeight: "bold",
  },
});

export { colors };
