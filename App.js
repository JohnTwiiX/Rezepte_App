import * as React from 'react';
import { Button, Text, SafeAreaView } from 'react-native';
import NavigationBar from './Screens/NavigationBar';
import { StatusBar } from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import FullScreen from './utils/FullScreen'; // Import FullScreen module

// const customTheme = {
//   ...DefaultTheme,
//   colors: {
//     ...DefaultTheme.colors,
//     primary: '#9a998c', // Change 'blue' to your desired primary color #e1e1e1
//     surface: '#c2cac2', // Change the background color here
//     backdrop: 'transparent',
//     backgroundColor: '#c2cac2',
//     surfaceVariant: '#c2cac2',

//   }
// };

const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    surface: "#c2cac2",
    primary: "#c2cac2",
    backdrop: 'transparent',
    elevation: {
      ...DefaultTheme.colors.elevation,
      level1: "white",
      level3: "#e0e5df"
    },
    chip: {
      active: {
        color: "white",
        bgColor: "#9a998c",
      },
      passive: "white"
    },
    color: "#e1e1e1",
    tabColor: "#9a998c"

  }
}

// const theme = {
//   ...DefaultTheme,
//   colors: {
//     ...DefaultTheme.colors,
//     primary: '#c2cac2',
//     primaryContainer: '#c2cac2',
//     secondary: '#c2cac2',
//     secondaryContainer: '#c2cac2',
//     tertiary: '#c2cac2',
//     tertiaryContainer: '#c2cac2',
//     surface: '#c2cac2',
//     surfaceVariant: '#c2cac2',
//     surfaceDisabled: '#c2cac2',
//     background: '#c2cac2',
//     error: '#c2cac2',
//     errorContainer: '#c2cac2',
//     onPrimary: '#c2cac2',
//     onPrimaryContainer: '#c2cac2',
//     onSecondary: '#c2cac2',
//     onSecondaryContainer: '#c2cac2',
//     onTertiary: '#c2cac2',
//     onTertiaryContainer: '#c2cac2',
//     onSurface: '#c2cac2',
//     onSurfaceVariant: '#c2cac2',
//     onSurfaceDisabled: '#c2cac2',
//     onError: '#c2cac2',
//     onErrorContainer: '#c2cac2',
//     onBackground: '#c2cac2',
//     outline: '#c2cac2',
//     outlineVariant: '#c2cac2',
//     inverseSurface: '#c2cac2',
//     inverseOnSurface: '#c2cac2',
//     inversePrimary: '#c2cac2',
//     shadow: '#c2cac2',
//     scrim: '#c2cac2',
//     backdrop: '#c2cac2',
//   },
// };


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