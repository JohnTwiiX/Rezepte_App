import * as React from 'react';
import { Button, Text, SafeAreaView } from 'react-native';
import NavigationBar from './Screens/NavigationBar';
import { StatusBar } from 'react-native';
import FullScreen from './utils/FullScreen'; // Import FullScreen module



export default function App() {
  React.useEffect(() => {
    FullScreen.enable(); // Enable fullscreen mode when App component mounts
  }, []);
  return (
    <SafeAreaView style={{ flex: 1, }}>
      <StatusBar hidden={true} />
      <NavigationBar />
    </SafeAreaView>
  );
}