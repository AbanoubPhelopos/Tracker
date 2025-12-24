/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#58a6ff';

export const Colors = {
    light: {
        text: '#11181C',
        background: '#fff',
        tint: tintColorLight,
        icon: '#687076',
        tabIconDefault: '#687076',
        tabIconSelected: tintColorLight,
        inputBackground: '#f6f8fa',
        borderColor: '#d0d7de',
    },
    dark: {
        text: '#c9d1d9',
        background: '#0d1117',
        tint: tintColorDark,
        icon: '#8b949e',
        tabIconDefault: '#8b949e',
        tabIconSelected: tintColorDark,
        inputBackground: '#21262d',
        borderColor: '#30363d',
        card: '#161b22',
        success: '#238636',
        danger: '#da3633',
        warning: '#9e6a03',
    },
};
