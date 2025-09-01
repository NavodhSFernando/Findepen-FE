import * as SecureStore from "expo-secure-store";

export async function getToken() {
    try {
      const token = await SecureStore.getItemAsync("authToken");
      console.log("Retrieved token:", token);
      return token;
    } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
}
