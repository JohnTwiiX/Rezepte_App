import * as React from 'react';
import { View, AppState, StyleSheet, Platform } from 'react-native';
import NavigationBar from './Screens/NavigationBar';
import { StatusBar } from 'react-native';
import { Provider as PaperProvider, ActivityIndicator, Snackbar } from 'react-native-paper';
import FullScreen from './utils/FullScreen'; // Import FullScreen module
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import UsernameInput from './Screens/UsernameInput'
import { getTextFromStorage, saveTextStorage } from './Screens/modals/StorageService';
import { ThemeAutumn } from './themes/ThemeAutumn';
import { ThemeWinter } from './themes/ThemeWinter';
import { ThemeSpring } from './themes/ThemeSpring';
import { ThemeSummer } from './themes/ThemeSummer';
import { ThemePurple } from './themes/ThemePurple';
import Login from './Screens/Authorization/Login';
import Registration from './Screens/Authorization/Registration';
import { firebase } from '@react-native-firebase/auth';

export default function App() {
  const [username, setUsername] = React.useState('');
  const [theme, setTheme] = React.useState('');
  const [update, setUpdate] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [visible, setVisible] = React.useState(false);
  const [loginScreen, setLoginScreen] = React.useState(true);
  const [userIsLogged, setUserIsLogged] = React.useState(false);

  React.useEffect(() => {
    FullScreen.enable(); // Enable fullscreen mode when App component mounts
    handleFetchdata();
    handleTheme().then((selectedTheme) => {
      // Setze das Theme im State, sobald es aus AsyncStorage geladen ist
      setTheme(selectedTheme);
    })
  }, []);

  React.useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      const userWithDB = await getTextFromStorage('@userWithDB');
      if (userWithDB) {
        if (nextAppState === 'active') {
          console.log(nextAppState);
          setVisible(true);
        } else {
          console.log(nextAppState);
          firebase.auth().signOut();
          await saveTextStorage('@userWithDB', null)
        }
      }
    };
    AppState.addEventListener('change', handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  React.useEffect(() => {
    if (update === true) {
      handleFetchdata();
      handleTheme().then((selectedTheme) => {
        // Setze das Theme im State, sobald es aus AsyncStorage geladen ist
        setTheme(selectedTheme);
      })
    }
  }, [update]);

  const handleFetchdata = async () => {
    const name = await getTextFromStorage('@name');
    if (name === null) {
      setUsername(null);
    } else {
      setUsername(name);
    }
    setUpdate(false);
    setLoading(false);
  }

  const handleTheme = async () => {
    const theme = await getTextFromStorage('@theme');
    switch (theme) {
      case 'ThemeAutumn':
        return ThemeAutumn;
      case 'ThemeWinter':
        return ThemeWinter;
      case 'ThemeSpring':
        return ThemeSpring;
      case 'ThemeSummer':
        return ThemeSummer;
      case 'ThemePurple':
        return ThemePurple;
      default:
        saveTextStorage('@theme', 'ThemeAutumn')
        return ThemeAutumn;
    }
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <StatusBar hidden={true} />
        {loading ? (
          // Show ActivityIndicator when loading
          <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <ActivityIndicator animating={true} size={240} />
          </View>
        ) :
          username ? (
            // Username is available, show 
            <View style={{ flex: 1 }}>
              <NavigationBar username={username} setUpdate={setUpdate} />
              <Snackbar
                visible={visible}
                onDismiss={() => setVisible(false)}
                duration={5000}>
                Du wurdest abgemeldet!
              </Snackbar>
            </View>
          ) : (
            <UsernameInput setUpdate={setUpdate} />
          )
        }
      </PaperProvider>
    </GestureHandlerRootView>
  );
}