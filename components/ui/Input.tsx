import { View, TextInput, Text, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';

interface InputProps extends TextInputProps {
  label: string;
  placeholder?: string;
  type?: 'text' | 'number' | 'date' | 'password';
  format?: string; 
  iconName?: string; 
}

const InputField: React.FC<InputProps> = ({
  label = 'Label',
  placeholder = 'Type here',
  type = 'text',
  format = 'YYYY-MM-DD',
  iconName = '',
  ...props
}) => {
  const [inputText, setInputText] = useState<string | number | Date>('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleTextChange = (text: string) => {
    if (type === 'number') {
      const parsedValue = isNaN(Number(text)) ? '' : Number(text);
      setInputText(parsedValue);
    } else {
      setInputText(text);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setInputText(selectedDate);
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
        {type === 'date' ? (
          <>
            <TouchableOpacity onPress={openDatePicker} style={styles.dateButton}>
              <Text style={styles.dateText}>
                {inputText instanceof Date ? inputText.toDateString() : placeholder}
              </Text>
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
              style={styles.input}
              value={inputText ? String(inputText) : ''}
              onChangeText={handleTextChange}
              placeholder={placeholder}
              keyboardType={type === 'number' ? 'numeric' : 'default'}
              secureTextEntry={type === 'password' && !isPasswordVisible}
              {...props}
            />
            {type === 'password' && (
              <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconButton}>
                <Icon name={isPasswordVisible ? 'eye' : 'eye-slash'} size={20} color="#555" />
              </TouchableOpacity>
            )}
            {type !== 'password' && iconName && (
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
    width: '100%',
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    marginBottom: 5,
    fontFamily: 'JakarthaRegular',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 40,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  input: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 35,
    fontFamily: 'JakarthaRegular',
    fontSize: 12,
  },
  iconButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -10 }],
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
  },
  dateText: {
    fontSize: 12,
    color: '#555',
    fontFamily: 'JakarthaRegular',
    textAlignVertical: 'center',
    paddingLeft: 10,
  },
  dateButton: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default InputField;
