document.addEventListener("alpine:init", () => {
    const prefersDark = (): boolean =>
        !!window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

    interface ThemePref {
        lightKey: string;
        darkKey: string;
    }

    interface ThemeEntry {
        key: string;
        name: string;
    }

    const themeStore = {
        mode: "light" as "light" | "dark",
        lightKey: "catppuccin-latte",
        darkKey: "catppuccin-mocha",

        lightThemes: [
            { key: "catppuccin-latte", name: "Catppuccin Latte" },
            { key: "nord-light", name: "Nord Light" },
            { key: "strawberry-light", name: "Strawberry Light" },
            { key: "gruvbox-light", name: "Gruvbox Light" },
        ] as ThemeEntry[],
        darkThemes: [
            { key: "catppuccin-mocha", name: "Catppuccin Mocha" },
            { key: "nord-dark", name: "Nord Dark" },
            { key: "strawberry-dark", name: "Strawberry Dark" },
            { key: "gruvbox-dark", name: "Gruvbox Dark" },
        ] as ThemeEntry[],

        _animT: undefined as ReturnType<typeof setTimeout> | undefined,

        init(): void {
            try {
                const savedPref = JSON.parse(
                    localStorage.getItem("theme.pref") || "null"
                ) as ThemePref | null;
                const savedMode = localStorage.getItem("theme.mode");

                if (savedPref?.lightKey) this.lightKey = savedPref.lightKey;
                if (savedPref?.darkKey) this.darkKey = savedPref.darkKey;

                this.mode = (savedMode as "light" | "dark") || (prefersDark() ? "dark" : "light");
            } catch {
                this.mode = prefersDark() ? "dark" : "light";
            }
            this.apply(true);
        },

        apply(animate = false): void {
            const html = document.documentElement;
            html.setAttribute("data-mode", this.mode);
            const themeKey = this.mode === "light" ? this.lightKey : this.darkKey;
            html.setAttribute("data-theme", themeKey);
            html.style.colorScheme = this.mode;

            if (animate) {
                html.classList.add("theme-anim");
                const dur = getComputedStyle(html).getPropertyValue("--theme-anim-duration").trim() || "320ms";
                const ms = dur.endsWith("ms")
                    ? parseFloat(dur)
                    : dur.endsWith("s")
                        ? parseFloat(dur) * 1000
                        : 320;
                clearTimeout(this._animT);
                this._animT = setTimeout(() => html.classList.remove("theme-anim"), ms + 50);
            }

            localStorage.setItem(
                "theme.pref",
                JSON.stringify({ lightKey: this.lightKey, darkKey: this.darkKey })
            );
            localStorage.setItem("theme.mode", this.mode);
        },

        toggleMode(): void {
            this.mode = this.mode === "light" ? "dark" : "light";
            this.apply(true);
        },

        setLight(key: string): void {
            this.lightKey = key;
            if (this.mode === "light") this.apply(true);
            else
                localStorage.setItem(
                    "theme.pref",
                    JSON.stringify({ lightKey: this.lightKey, darkKey: this.darkKey })
                );
        },

        setDark(key: string): void {
            this.darkKey = key;
            if (this.mode === "dark") this.apply(true);
            else
                localStorage.setItem(
                    "theme.pref",
                    JSON.stringify({ lightKey: this.lightKey, darkKey: this.darkKey })
                );
        },
    };

    Alpine.store("theme", themeStore);

    const themeUI = {
        menuOpen: false,
        activeTab: "light" as "light" | "dark",
        open(): void { this.menuOpen = true; },
        close(): void { this.menuOpen = false; },
        toggle(): void { themeStore.toggleMode(); },
        setTab(tab: string): void {
            if (tab !== "light" && tab !== "dark") return;
            this.activeTab = tab;
            if (themeStore.mode !== tab) {
                themeStore.mode = tab;
                themeStore.apply(true);
            }
        },
        init(): void {
            this.activeTab = themeStore.mode;
        },
    };

    Alpine.data("ThemeUI", () => themeUI);

    const navData = {
        $refs: {} as Record<string, HTMLElement>,
        navigationMenuOpen: false,
        navigationMenu: "",
        navigationMenuCloseDelay: 200,
        navigationMenuCloseTimeout: null as ReturnType<typeof setTimeout> | null,
        navigationMenuLeave(): void {
            this.navigationMenuCloseTimeout = setTimeout(() => {
                this.navigationMenuClose();
            }, this.navigationMenuCloseDelay);
        },
        navigationMenuReposition(navElement: HTMLElement): void {
            this.$refs.navigationDropdown.style.left = navElement.offsetLeft + "px";
            this.$refs.navigationDropdown.style.marginLeft = navElement.offsetWidth / 2 + "px";
        },
        navigationMenuClearCloseTimeout(): void {
            if (this.navigationMenuCloseTimeout !== null) clearTimeout(this.navigationMenuCloseTimeout);
        },
        navigationMenuClose(): void {
            this.navigationMenuOpen = false;
            this.navigationMenu = "";
        },
    };

    Alpine.data("NavData", () => navData);
});
