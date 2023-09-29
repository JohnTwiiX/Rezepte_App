import * as React from 'react';
import { Button, Text, SafeAreaView } from 'react-native';
import NavigationBar from './Screens/NavigationBar';
import { StatusBar } from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import FullScreen from './utils/FullScreen'; // Import FullScreen module

const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#9a998c', // Change 'blue' to your desired primary color
    surface: '#e1e1e1', // Change the background color here
    backdrop: 'transparent',
    background: '#e1e1e1'
  }
};


export default function App() {
  React.useEffect(() => {
    FullScreen.enable(); // Enable fullscreen mode when App component mounts
  }, []);
  return (
    <SafeAreaView style={{ flex: 1, }}>
      <PaperProvider theme={customTheme}>
        <StatusBar hidden={true} />
        <NavigationBar />
      </PaperProvider>
    </SafeAreaView>
  );
}