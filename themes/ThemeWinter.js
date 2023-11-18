import { DefaultTheme } from "react-native-paper";

export const ThemeWinter = {
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
            bgColor: "#ADA2A1",
        },
        passive: "white"
    },
    color: "#ADA2A1",  //"#e1e1e1",
    tabColor: "#d1c9c9",
    button: "#f3f3f3",  // "#9a998c",
    button2: "#ADA2A1",
    nav: "#6A4E46",
    background: "#B2B1B6",
    input: "#d1c9c9",
    backgroundImage: require('../assets/images/winter-bg.jpg')
}