/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  primary: '#133E87',
  secondary: '#ACD8FF',
  background: '#EEEEDD',
  text: '#000000',
  neutral: '#ffffff',
  borderLight: '#C5C5C5',
  fadedPrimary: "#4c648c",
  fadedText: '#7a7979',
  error: '#E74C3C',
  success: '#4CD964',
  white: '#ffffff',
  errorLight: '#f8f9fa',
  // Additional colors for recurring transactions
  income: '#4CD964', // Map to success
  expense: '#E74C3C', // Map to error
  warning: '#FF9500', // Orange color for warnings
  card: '#ffffff', // Map to neutral
  shadow: '#000', // Shadow color
  border: '#C5C5C5', // Map to borderLight
  light: {
    text: '#11181C',
    background: '#fff',
    tint: '#0a7ea4',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#0a7ea4',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: '#fff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
  },
};
