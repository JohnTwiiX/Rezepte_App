import { DefaultTheme } from "react-native-paper";

export const ThemeAutumn = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        surface: "#c2cac2",
        // primary: "#c2cac2",
        primaryContainer: "#c2cac2",
        onPrimaryContainer: "black",
        primary: "#9a998c",
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
            bgColor: "#9a998c",
        },
        passive: "white"
    },
    color: "#B2B1B6",  //"#e1e1e1",
    tabColor: "#9a998c",
    button: "#f3f3f3",  // "#9a998c",
    button2: "#ADA2A1",
    nav: "#905E55",
    background: "#B2B1B6",
    input: "#f3f3f3",
    backgroundImage: require('../assets/images/authumn-bg.jpg')
}