import * as React from 'react';
import { View, SafeAreaView } from 'react-native';
import NavigationBar from './Screens/NavigationBar';
import { StatusBar } from 'react-native';
import { Provider as PaperProvider, ActivityIndicator } from 'react-native-paper';
import FullScreen from './utils/FullScreen'; // Import FullScreen module
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import UsernameInput from './Screens/UsernameInput'
import { getTextFromStorage, saveTextStorage } from './Screens/modals/StorageService';
import { ThemeAutumn } from './themes/ThemeAutumn';
import { ThemeWinter } from './themes/ThemeWinter';
import { ThemeSpring } from './themes/ThemeSpring';
import { ThemeSummer } from './themes/ThemeSummer';
import { ThemePurple } from './themes/ThemePurple';


export default function App() {
  const [username, setUsername] = React.useState('');
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
    <SafeAreaView style={{ flex: 1, }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider theme={theme}>
          <StatusBar hidden={true} />
          {loading ?
            <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <ActivityIndicator animating={true} size={240} />
            </View>
            :
            username ?
              <NavigationBar username={username} setUpdate={setUpdate} />
              :
              <UsernameInput setUpdate={setUpdate} />}
        </PaperProvider>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}