import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import InputField from '@/components/ui/Input'; 
import Button from '@/components/ui/Button'; 
import Title from '@/components/ui/Title'; 

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = () => {
    if (email && password) {
      // Perform the login logic (e.g., API call)
      console.log('Logged in with:', { email, password });
      setEmail('');
      setPassword('');
    } else {
      console.log('Please fill in all fields');
    }
  };

  return (
    <View style={styles.container}>
      <Title text="Welcome" />
      
      <View style={styles.inputWrapper}>
        <InputField
          label="Email"
          placeholder="Enter your email"
          type="text"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputWrapper}>
        <InputField
          label="Password"
          placeholder="Enter your password"
          type="password"
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <View style={styles.buttonWrapper}>
        <Button title="Login" variant='primary' onPress={handleLogin} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    backgroundColor: '#f5f5f5',
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputWrapper: {
    marginBottom: 20, // Adjust spacing between inputs
  },  
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 50,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
});

export default LoginPage;