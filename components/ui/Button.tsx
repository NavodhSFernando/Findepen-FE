import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface ButtonProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'danger';
  onPress: () => void;
}

const Button: React.FC<ButtonProps> = ({ title, variant = 'primary', onPress }) => {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.button, 
        styles[variant], 
        pressed && styles.pressed
      ]} 
      onPress={onPress}
    >
      <Text style={[styles.buttonText, styles[`${variant}Text`]]}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '50%',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'JakarthaSemiBold',
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  primaryText: {
    color: Colors.neutral,
  },
  secondary: {
    backgroundColor: Colors.neutral,
    borderColor: Colors.borderLight,
    borderWidth: 1,
  },
  secondaryText: {
    color: Colors.text,
  },
  danger: {
    backgroundColor: '#FF3B30',
  },
  dangerText: {
    color: Colors.neutral,
  },
  pressed: {
    opacity: 0.7, // Adds press effect
  },
});

export default Button;
