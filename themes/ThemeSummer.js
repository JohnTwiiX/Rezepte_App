import { DefaultTheme } from "react-native-paper";

export const ThemeSummer = {
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
            level2: "#f3f3f3",
            level3: "#e0e5df",
            level4: "black"
        },
    },
    chip: {
        active: {
            color: "white",
            bgColor: "#A19889",
        },
        passive: "white"
    },
    color: "#A19889",  //"#e1e1e1",
    tabColor: "#d4cbbe",
    button: "#f3f3f3",  // "#9a998c",
    button2: "#ADA2A1",
    nav: "#695C4B",
    background: "#B2B1B6",
    input: "#d4cbbe",
    backgroundImage: require('../assets/images/summer-bg.jpg')
}