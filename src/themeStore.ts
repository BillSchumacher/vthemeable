import {Store} from "./store";

interface Theme extends Object {
    darkMode: Boolean,
    primary: String,
    primaryDarken1: String,
    primaryDarken2: String,
    primaryDarken3: String,
    primaryLighten1: String,
    primaryLighten2: String,
    primaryLighten3: String,
    primaryDarkAnalog: String,
    primaryLightAnalog: String,
    error: String,
    warning: String,
    success: String,
    accentPrimary: String,
    accentSecondary: String,
    accentAction: String,
    darkBackground: String,
    darkColor: String,
    darkInputColor: String,
    lightBackground: String
    lightColor: String
    lightInputColor: String
}

class ThemeStore extends Store<Theme> {
    protected data(): Theme {
        return {
            darkMode: false,
            lightBackground: "#ffffff",
            lightColor: "darkgrey",
            lightInputColor: "#000",
            darkBackground: "#000000",
            darkColor: "lightgrey",
            darkInputColor: "#fff",
            primary: "#0099ff",
            primaryDarken1: "#008ae6",
            primaryDarken2: "#007acc",
            primaryDarken3: "#006bb3",
            primaryLighten1: "#1aa3ff",
            primaryLighten2: "#33adff",
            primaryLighten3: "#4db8ff",
            primaryDarkAnalog: "#0019ff",
            primaryLightAnalog: "#00ffe6",
            error: "#ff001a",
            warning: "#ffe600",
            success: "#12b400",
            accentPrimary: "#00ff66",
            accentSecondary: "#ff0099",
            accentAction: "#ff6600"
        };
    }
    setValue(color, value) {
        this.state[color] = value;
    }
    getDarkBackground() {
        return this.getState().darkBackground;
    }
    getLightBackground() {
        return this.getState().lightBackground;
    }
    getDarkMode() {
        return this.getState().darkMode;
    }
    getDarkColor() {
        return this.getState().darkColor;
    }
    getLightColor() {
        return this.getState().lightColor;
    }
    getDarkInputColor() {
        return this.getState().darkInputColor;
    }
    getLightInputColor() {
        return this.getState().lightInputColor;
    }
    getBackgroundColor() {
        return this.getDarkMode() ? this.getDarkBackground() : this.getLightBackground();
    }
    getColor() {
        return this.getDarkMode() ? this.getDarkColor() : this.getLightColor();
    }
    getInputColor() {
        return this.getDarkMode() ? this.getDarkInputColor() : this.getLightInputColor();
    }

}

export const themeStore: ThemeStore = new ThemeStore()