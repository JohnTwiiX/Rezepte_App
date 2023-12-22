import * as React from 'react';
import { View, SafeAreaView, AppRegistry } from 'react-native';
import NavigationBar from './Screens/NavigationBar';
import { StatusBar } from 'react-native';
import { Provider as PaperProvider, ActivityIndicator } from 'react-native-paper';
import FullScreen from './utils/FullScreen'; // Import FullScreen module
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import UsernameInput from './Screens/UsernameInput'
import { getArrayFromStorage, getTextFromStorage, saveTextStorage } from './Screens/modals/StorageService';
import { ThemeAutumn } from './themes/ThemeAutumn';
import { ThemeWinter } from './themes/ThemeWinter';
import { ThemeSpring } from './themes/ThemeSpring';
import { ThemeSummer } from './themes/ThemeSummer';
import { ThemePurple } from './themes/ThemePurple';
import Login from './Screens/Auth';
import { name as appName } from './app.json';
import { initializeApp } from '@react-native-firebase/app';
import Auth from './Screens/Auth';

// const firebaseConfig = {
//   apiKey: "AIzaSyB7WPBj78NaaRzCpPuNBtfAVqJMWhDWEE4",
//   authDomain: "rezepte-app-4a230.firebaseapp.com",
//   projectId: "rezepte-app-4a230",
//   storageBucket: "rezepte-app-4a230.appspot.com",
//   messagingSenderId: "1:382231183022:android:97b395494966343a29b73f",
//   appId: "1:382231183022:android:97b395494966343a29b73f",
// };
// const app = initializeApp(firebaseConfig);

// AppRegistry.registerComponent(appName, () => App);



export default function App() {
  const [user, setUser] = React.useState('');
  const [theme, setTheme] = React.useState('');
  const [update, setUpdate] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    FullScreen.enable(); // Enable fullscreen mode when App component mounts
    handleFetchdata();
    handleTheme().then((selectedTheme) => {
      // Setze das Theme im State, sobald es aus AsyncStorage geladen ist
      setTheme(selectedTheme);
    })
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
    const name = await getArrayFromStorage('@user');
    if (name === null) {
      setUser(null);
    } else {
      setUser(name);
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
    <SafeAreaView style={{ flex: 1, }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider theme={theme}>
          <StatusBar hidden={true} />
          {loading ?
            <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <ActivityIndicator animating={true} size={240} />
            </View>
            :
            user ?
              <NavigationBar user={user} setUpdate={setUpdate} />
              :
              <Auth setUpdate={setUpdate} />
          }
        </PaperProvider>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}