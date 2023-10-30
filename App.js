import * as React from 'react';
import { View, Button, Text, SafeAreaView } from 'react-native';
import NavigationBar from './Screens/NavigationBar';
import { StatusBar } from 'react-native';
import { DefaultTheme, Provider as PaperProvider, ActivityIndicator } from 'react-native-paper';
import FullScreen from './utils/FullScreen'; // Import FullScreen module
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import UsernameInput from './Screens/UsernameInput'
import { getTextFromStorage } from './Screens/modals/StorageService';


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
    // primary: "#c2cac2",
    primaryContainer: "#c2cac2",
    onPrimaryContainer: "black",
    primary: "black",
    backdrop: 'transparent',
    elevation: {
      ...DefaultTheme.colors.elevation,
      level1: "white",
      level3: "#e0e5df",
      level4: "black"
    },
    chip: {
      active: {
        color: "white",
        bgColor: "#9a998c",
      },
      passive: "white"
    },
    // color: "#e1e1e1",
    color: "#B2B1B6",
    tabColor: "#9a998c",
    button: "#f3f3f3",
    // button: "#9a998c",
    nav: '#905E55'

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
async function existUsername() {
  try {
    return await getTextFromStorage('@name');
  } catch (e) {
    console.error(e)
  }
}


export default function App() {
  const [username, setUsername] = React.useState('');
  const [update, setUpdate] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    FullScreen.enable(); // Enable fullscreen mode when App component mounts
    handleFetchdata();
  }, []);
  React.useEffect(() => {
    if (update === true) {
      handleFetchdata();
    }
  }, [update]);

  const handleFetchdata = async () => {
    const name = await existUsername(setUsername);
    if (name === null) {
      setUsername(null);
    } else {
      setUsername(name);
    }
    setUpdate(false);
    setLoading(false);
  }
  return (
    <SafeAreaView style={{ flex: 1, }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider theme={customTheme}>
          <StatusBar hidden={true} />
          {loading ?
            <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <ActivityIndicator animating={true} size={240} />
            </View>
            :
            username ?
              <NavigationBar username={username} />
              :
              <UsernameInput setUpdate={setUpdate} />}
        </PaperProvider>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}