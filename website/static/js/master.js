document.addEventListener ("alpine:init", () => {
    const prefersDark = () =>
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
  
    Alpine.store("theme", {
        mode: "light",
        lightKey: "catppuccin-latte",
        darkKey: "catppuccin-mocha",

        lightThemes: [
            { key: "catppuccin-latte", name: "Catppuccin Latte" },
            { key: "nord-light", name: "Nord Light" },
            { key: "solarized-light", name: "Solarized Light" },
            { key: "gruvbox-light", name: "Gruvbox Light" },
            { key: "rose-pine-dawn", name: "Rosé Pine Dawn" },
        ],
        darkThemes: [
            { key: "catppuccin-mocha", name: "Catppuccin Mocha" },
            { key: "catppuccin-macchiato", name: "Catppuccin Macchiato" },
            { key: "nord-dark", name: "Nord Dark" },
            { key: "dracula", name: "Dracula" },
            { key: "gruvbox-dark", name: "Gruvbox Dark" },
            // Optional:
            // { key: "catppuccin-frappe", name: "Catppuccin Frappé" },
            // { key: "solarized-dark", name: "Solarized Dark" },
            // { key: "rose-pine", name: "Rosé Pine" },
        ],
  
        init() {
            try {
                const savedPref = JSON.parse(
                    localStorage.getItem("theme.pref") || "null"
                );
                const savedMode = localStorage.getItem("theme.mode");

                if (savedPref?.lightKey) this.lightKey = savedPref.lightKey;
                if (savedPref?.darkKey) this.darkKey = savedPref.darkKey;

                this.mode = savedMode || (prefersDark() ? "dark" : "light");
            } catch (_) {
                this.mode = prefersDark() ? "dark" : "light";
            }
            this.apply();
        },
  
        apply() {
            const html = document.documentElement;
            html.setAttribute("data-mode", this.mode);
            const themeKey = this.mode === "light" ? this.lightKey : this.darkKey;
            html.setAttribute("data-theme", themeKey);
            html.style.colorScheme = this.mode;

            localStorage.setItem(
                "theme.pref",
                JSON.stringify({ lightKey: this.lightKey, darkKey: this.darkKey })
            );
            localStorage.setItem("theme.mode", this.mode);
        },
  
        toggleMode() {
            this.mode = this.mode === "light" ? "dark" : "light";
            this.apply();
        },
  
        setLight(key) {
            this.lightKey = key;
            if (this.mode === "light") this.apply();
            else
            localStorage.setItem(
                "theme.pref",
                JSON.stringify({ lightKey: this.lightKey, darkKey: this.darkKey })
            );
        },
  
        setDark(key) {
            this.darkKey = key;
            if (this.mode === "dark") this.apply();
            else
            localStorage.setItem(
                "theme.pref",
                JSON.stringify({ lightKey: this.lightKey, darkKey: this.darkKey })
            );
        },
    });
  
    Alpine.data("ThemeUI", () => ({
        menuOpen: false,
        activeTab: "light", // "light" | "dark"
        open() { this.menuOpen = true; },
        close() { this.menuOpen = false; },
        toggle() { Alpine.store("theme").toggleMode(); },
        setTab(tab) {
            // Switch mode when switching tabs
            if (tab !== "light" && tab !== "dark") return;
            this.activeTab = tab;
            const theme = Alpine.store("theme");
            if (theme.mode !== tab) {
                theme.mode = tab;
                theme.apply();
            }
        },
        init() {
            // Keep tabs synced with store mode
            this.activeTab = Alpine.store("theme").mode;
            this.$watch("$store.theme.mode", (v) => { this.activeTab = v; });
        },
      }));

    Alpine.data ("NavData", () => ({
        navigationMenuOpen: false,
        navigationMenu: '',
        navigationMenuCloseDelay: 200,
        navigationMenuCloseTimeout: null,
        navigationMenuLeave() {
            let that = this;
            this.navigationMenuCloseTimeout = setTimeout(() => {
                that.navigationMenuClose();
            }, this.navigationMenuCloseDelay);
        },
        navigationMenuReposition(navElement) {
            this.navigationMenuClearCloseTimeout();
            this.$refs.navigationDropdown.style.left = navElement.offsetLeft + 'px';
            this.$refs.navigationDropdown.style.marginLeft = (navElement.offsetWidth/2) + 'px';
        },
        navigationMenuClearCloseTimeout(){
            clearTimeout(this.navigationMenuCloseTimeout);
        },
        navigationMenuClose(){
            this.navigationMenuOpen = false;
            this.navigationMenu = '';
        }
    }))
})