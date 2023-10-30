import { DefaultTheme } from "react-native-paper";

export const ThemeAutumn = {
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