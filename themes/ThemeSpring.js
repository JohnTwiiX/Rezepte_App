import { DefaultTheme } from "react-native-paper";

export const ThemeSpring = {
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
            bgColor: "#AAB0D1",
        },
        passive: "white"
    },
    color: "#AAB0D1",  //"#e1e1e1",
    tabColor: "#ced3f0",
    button: "#f3f3f3",  // "#9a998c",
    button2: "#AAB0D1",
    nav: "#9E949E",
    background: "#B2B1B6",
    input: "#ced3f0",
    backgroundImage: require('../assets/images/spring-bg.jpg')
}