import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "@/constants/Colors";

interface InputProps extends TextInputProps {
  label: string;
  placeholder?: string;
  type?: "text" | "number" | "date" | "password" | "email";
  format?: string;
  iconName?: string;
  disabled?: boolean;
}

const InputField: React.FC<InputProps> = ({
  label = "Label",
  placeholder = "Type here",
  type = "text",
  format = "YYYY-MM-DD",
  iconName = "",
  disabled = false,
  ...props
}) => {
  const [inputText, setInputText] = useState<string | number | Date>("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleTextChange = (text: string) => {
    if (type === "number") {
      const parsedValue = isNaN(Number(text)) ? "" : Number(text);
      setInputText(parsedValue);
    } else {
      setInputText(text);
    }
  };

  useEffect(() => {
    if (props.value) {
      const parsedDate = new Date(props.value);
      if (parsedDate instanceof Date && !isNaN(parsedDate.getTime())) {
        setInputText(parsedDate);
      }
    }
  }, [props.value]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
      setInputText(selectedDate);
      if (props.onChangeText) {
        // Pass the date as a formatted string to the parent
        props.onChangeText(selectedDate.toISOString().split("T")[0]);
      }
    }
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        {type === "date" ? (
          <>
            <TouchableOpacity
              onPress={openDatePicker}
              style={[styles.dateButton, disabled && styles.disabled]}
              disabled={disabled}
            >
              <Text style={styles.dateText}>
                {inputText instanceof Date
                  ? inputText.toDateString()
                  : placeholder}
              </Text>
              <Icon
                name="calendar"
                size={20}
                color="#555"
                style={styles.dateIcon}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={inputText instanceof Date ? inputText : new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </>
        ) : (
          <>
            <TextInput
              style={[styles.input, disabled && styles.disabled]}
              value={inputText ? String(inputText) : ""}
              onChangeText={handleTextChange}
              placeholder={placeholder}
              keyboardType={
                type === "number"
                  ? "numeric"
                  : type === "email"
                    ? "email-address"
                    : "default"
              }
              secureTextEntry={type === "password" && !isPasswordVisible}
              editable={!disabled}
              {...props}
            />
            {type === "password" && (
              <TouchableOpacity
                onPress={togglePasswordVisibility}
                style={styles.iconButton}
              >
                <Icon
                  name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#555"
                />
              </TouchableOpacity>
            )}
            {type !== "password" && iconName && (
              <TouchableOpacity style={styles.iconButton}>
                <Icon name={iconName} size={20} color="#555" />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    fontSize: 12,
    marginBottom: 5,
    fontFamily: "JakarthaRegular",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 40,
    backgroundColor: "#fff",
    borderColor: Colors.borderLight,
    borderWidth: 1,
    borderRadius: 5,
  },
  input: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 35,
    fontFamily: "JakarthaRegular",
    fontSize: 12,
  },
  iconButton: {
    position: "absolute",
    right: 10,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.5,
  },
  dateText: {
    fontSize: 12,
    color: "#555",
    fontFamily: "JakarthaRegular",
    paddingLeft: 10,
    // Ensure text is vertically centered
    paddingVertical: 12,
  },
  dateButton: {
    flex: 1,
    height: 40,
    justifyContent: "center",
  },
  dateIcon: {
    position: "absolute",
    right: 10,
    // Center the icon vertically
    alignSelf: "center",
    opacity: 0.5,
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: "#f5f5f5",
  },
});

export default InputField;
