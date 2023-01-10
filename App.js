import * as React from 'react';
import { Button, Text, SafeAreaView } from 'react-native';
import NavigationBar from './Screens/NavigationBar';





export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, }}>
      <NavigationBar />
    </SafeAreaView>
  );
}