// src/screens/HomeScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootState } from "../redux/store";
import { addWorkoutCategory } from "../redux/slices/workoutCategorySlice";
import { RootStackParamList } from "../navigation/MainNavigator";
import { globalStyles, homeStyles, colors } from "../styles/styles";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const categories = useSelector((state: RootState) => state.workoutCategories);
  const dispatch = useDispatch();
  const [newCategory, setNewCategory] = useState("");

  const addCategory = () => {
    if (newCategory.trim()) {
      dispatch(
        addWorkoutCategory({
          id: Date.now().toString(),
          name: newCategory.trim(),
        })
      );
      setNewCategory("");
    }
  };

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View style={globalStyles.contentContainer}>
        <Text style={globalStyles.title}>Workout Categories</Text>

        <View style={homeStyles.addCategoryContainer}>
          <TextInput
            value={newCategory}
            onChangeText={setNewCategory}
            placeholder="New category name"
            placeholderTextColor={colors.onSurface + "80"}
            keyboardAppearance="dark" // This works for iOS
            style={[globalStyles.input, { color: colors.onSurface }]}
          />
          <TouchableOpacity style={globalStyles.button} onPress={addCategory}>
            <Text style={globalStyles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={homeStyles.categoryButton}
              onPress={() =>
                navigation.navigate("CategoryWorkouts", { categoryId: item.id })
              }
            >
              <Text style={homeStyles.categoryButtonText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default HomeScreen;
