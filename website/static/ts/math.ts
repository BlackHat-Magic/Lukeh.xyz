document.addEventListener("alpine:init", () => {
    const parseHash = (): { main: string; sub: string | null } => {
        const raw = decodeURIComponent((window.location.hash || "").replace(/^#/, ""));
        if (!raw) return { main: "Vector Calculus", sub: "Vector Addition" };
        const parts = raw.split("/");
        const main = parts[0] || "Vector Calculus";
        const sub = parts[1] || null;
        return { main, sub };
    };
    const setHash = (main: string, sub: string | null = null): void => {
        const target = sub
            ? `#${encodeURIComponent(main)}/${encodeURIComponent(sub)}`
            : `#${main}`;
        if (window.location.hash !== target) {
            history.replaceState(null, "", target);
        }
    };

    const validMain = new Set(["Vector Calculus", "Statistics"]);
    const validSub = new Set([
        "Vector Addition",
        "Scalar Multiplication",
        "Vector Magnitude",
        "Unit Vector",
        "Dot Product",
        "Cross Product",
        "TSP",
        "Vector Projection",
    ]);

    const mainComponent = {
        $refs: {} as Record<string, HTMLElement>,
        $nextTick: (() => {}) as (fn: () => void) => void,
        mainKey: "Vector Calculus",

        tabButtonClicked(tabButton: HTMLButtonElement): void {
            const key = tabButton.dataset.hash;
            if (!key || !validMain.has(key)) return;
            this.mainKey = key;
            this.tabRepositionMarker(tabButton);
            const { sub } = parseHash();
            if (key === "Vector Calculus") {
                setHash("Vector Calculus", (sub && validSub.has(sub)) ? sub : "Vector Addition");
            } else {
                setHash("Statistics");
            }
        },
        tabRepositionMarker(tabButton: HTMLButtonElement): void {
            this.$refs.tabMarker.style.width = tabButton.offsetWidth + "px";
            this.$refs.tabMarker.style.height = tabButton.offsetHeight + "px";
            this.$refs.tabMarker.style.left = tabButton.offsetLeft + "px";
        },
        tabContentActive(tabContent: HTMLElement): boolean {
            return tabContent.dataset.hash === this.mainKey;
        },

        init(): void {
            const { main } = parseHash();
            this.mainKey = validMain.has(main) ? main : "Vector Calculus";

            this.$nextTick(() => {
                const tabButtons = this.$refs.tabButtons;
                const button = Array.from(tabButtons.querySelectorAll<HTMLButtonElement>("button")).find(
                    (b) => b.dataset.hash === this.mainKey
                );
                if (button) this.tabRepositionMarker(button);
            });

            window.addEventListener("hashchange", () => {
                const { main } = parseHash();
                const newKey = validMain.has(main) ? main : "Vector Calculus";
                if (newKey !== this.mainKey) {
                    this.mainKey = newKey;
                    this.$nextTick(() => {
                        const tabButtons = this.$refs.tabButtons;
                        const button = Array.from(tabButtons.querySelectorAll<HTMLButtonElement>("button")).find(
                            (b) => b.dataset.hash === this.mainKey
                        );
                        if (button) this.tabRepositionMarker(button);
                    });
                }
            });
        },
    };

    Alpine.data("main", () => mainComponent);

    const vecCalc = {
        $refs: {} as Record<string, HTMLElement>,
        $nextTick: (() => {}) as (fn: () => void) => void,
        subKey: "Vector Addition",
        _onResize: null as ((this: Window, ev: UIEvent) => void) | null,

        tabButtonClicked(tabButton: HTMLButtonElement): void {
            const key = tabButton.dataset.hash;
            if (!key || !validSub.has(key)) return;
            requestAnimationFrame(() => {
                this.subKey = key;
                this.tabRepositionMarker(tabButton);
            });
            setHash("Vector Calculus", key);
        },

        tabRepositionMarker(tabButton: HTMLButtonElement): void {
            const marker = this.$refs.tabMarker;
            const container = this.$refs.tabButtons;
            if (!marker || !container || !tabButton) return;

            const btnRect = tabButton.getBoundingClientRect();
            const ctnRect = container.getBoundingClientRect();
            const width = Math.round(btnRect.width);
            const height = Math.round(btnRect.height);
            const dx = Math.round(btnRect.left - ctnRect.left);
            const dy = Math.round(btnRect.top - ctnRect.top);

            marker.style.width = width + "px";
            marker.style.height = height + "px";
            marker.style.left = "0px";
            marker.style.top = "0px";
            marker.style.transform = `translate(${dx}px, ${dy}px)`;
        },

        tabContentActive(tabContent: HTMLElement): boolean {
            return tabContent.dataset.hash === this.subKey;
        },

        tabButtonActive(tabButton: HTMLButtonElement): boolean {
            return tabButton.dataset.hash === this.subKey;
        },

        init(): void {
            const { main, sub } = parseHash();
            if (main === "Vector Calculus" && validSub.has(sub || "")) {
                this.subKey = sub!;
            } else {
                this.subKey = "Vector Addition";
            }

            this.$nextTick(() => {
                const tabButtons = this.$refs.tabButtons;
                const btn = Array.from(tabButtons.querySelectorAll<HTMLButtonElement>("button")).find(
                    (b) => b.dataset.hash === this.subKey
                );
                if (btn) this.tabRepositionMarker(btn);
                this._onResize = () => {
                    const activeBtn = Array.from(tabButtons.querySelectorAll<HTMLButtonElement>("button")).find(
                        (b) => b.dataset.hash === this.subKey
                    );
                    if (activeBtn) this.tabRepositionMarker(activeBtn);
                };
                window.addEventListener("resize", this._onResize);
            });

            window.addEventListener("hashchange", () => {
                const { main, sub } = parseHash();
                if (main !== "Vector Calculus") return;
                const next = validSub.has(sub || "") ? sub! : "Vector Addition";
                if (next !== this.subKey) {
                    this.subKey = next;
                    this.$nextTick(() => {
                        const tabButtons = this.$refs.tabButtons;
                        const btn = Array.from(tabButtons.querySelectorAll<HTMLButtonElement>("button")).find(
                            (b) => b.dataset.hash === this.subKey
                        );
                        if (btn) this.tabRepositionMarker(btn);
                    });
                }
            });
        },
        destroy(): void {
            if (this._onResize) window.removeEventListener("resize", this._onResize);
        },
    };

    Alpine.data("vecCalc", () => vecCalc);

    const vecAdd = {
        values: [
            [0, 0, 0],
            [0, 0, 0],
        ] as number[][],

        signs: [1, 1] as number[],

        dnvec(): void {
            if (this.values.length <= 1) {
                alert("Stop that.");
            } else {
                this.values.pop();
            }
        },
        upvec(): void {
            const newRow: number[] = [];
            for (let i = 0; i < this.values[0].length; i++) {
                newRow.push(0);
            }
            this.values.push(newRow);
            this.signs.push(1);
        },

        dndim(): void {
            if (this.values[0].length <= 1) {
                alert("Stop that.");
            } else {
                for (let i = 0; i < this.values.length; i++) {
                    this.values[i].pop();
                }
            }
        },
        updim(): void {
            for (let i = 0; i < this.values.length; i++) {
                this.values[i].push(0);
            }
        },

        result(): number[] {
            const output = new Array(this.values[0].length).fill(0);
            for (let i = 0; i < this.values.length; i++) {
                for (let j = 0; j < this.values[i].length; j++) {
                    output[j] += this.values[i][j];
                }
            }
            return output;
        },
    };

    Alpine.data("vecAdd", () => vecAdd);

    const scalarMult = {
        values: [0, 0, 0] as number[],
        scalar: 1.0,

        dndim(): void {
            if (this.values.length <= 1) {
                alert("Stop that.");
            } else {
                this.values.pop();
            }
        },
        updim(): void {
            this.values.push(0);
        },

        result(): number[] {
            return this.values.map((v) => v * this.scalar);
        },
    };

    Alpine.data("scalarMult", () => scalarMult);

    const vecMagnitude = {
        values: [0, 0, 0] as number[],

        dndim(): void {
            if (this.values.length <= 1) {
                alert("Stop that.");
            } else {
                this.values.pop();
            }
        },
        updim(): void {
            this.values.push(0);
        },

        result(): string {
            let sum = 0;
            for (let i = 0; i < this.values.length; i++) {
                sum += this.values[i] * this.values[i];
            }
            return Math.sqrt(sum).toFixed(5);
        },
    };

    Alpine.data("vecMagnitude", () => vecMagnitude);

    const unitVector = {
        values: [0, 0, 0] as number[],

        dndim(): void {
            if (this.values.length <= 1) {
                alert("Stop that.");
            } else {
                this.values.pop();
            }
        },
        updim(): void {
            this.values.push(0);
        },

        result(): string[] {
            let magnitude = 0;
            for (let i = 0; i < this.values.length; i++) {
                magnitude += this.values[i] * this.values[i];
            }
            magnitude = Math.sqrt(magnitude);

            const output: string[] = [];
            for (let i = 0; i < this.values.length; i++) {
                const val = magnitude === 0 ? 0 : this.values[i] / magnitude;
                output.push(val.toFixed(5));
            }
            return output;
        },
    };

    Alpine.data("unitVector", () => unitVector);

    const dotProduct = {
        vec1: [0, 0, 0] as number[],
        vec2: [0, 0, 0] as number[],

        dndim(): void {
            if (this.vec1.length <= 1) {
                alert("Stop that.");
            } else {
                this.vec1.pop();
                this.vec2.pop();
            }
        },
        updim(): void {
            this.vec1.push(0);
            this.vec2.push(0);
        },

        result(): number {
            let output = 0;
            for (let i = 0; i < this.vec1.length; i++) {
                output += this.vec1[i] * this.vec2[i];
            }
            return output;
        },
    };

    Alpine.data("dotProduct", () => dotProduct);

    const crossProduct = {
        a: [0, 0, 0] as number[],
        b: [0, 0, 0] as number[],
        noopDim(): void { alert("Cross product here is defined for 3D only."); },
        result(): number[] {
            const [ax, ay, az] = this.a.map(Number);
            const [bx, by, bz] = this.b.map(Number);
            return [
                ay * bz - az * by,
                az * bx - ax * bz,
                ax * by - ay * bx,
            ];
        },
    };

    Alpine.data("crossProduct", () => crossProduct);

    const tripleScalarProduct = {
        vectors: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ] as number[][],
        noopDim(): void { alert("Triple scalar product here is 3D only."); },
        result(): number {
            const [a, b, c] = this.vectors.map((v: number[]) => v.map(Number));
            const cross_bc = [
                b[1] * c[2] - b[2] * c[1],
                b[2] * c[0] - b[0] * c[2],
                b[0] * c[1] - b[1] * c[0],
            ];
            return a[0] * cross_bc[0] + a[1] * cross_bc[1] + a[2] * cross_bc[2];
        },
    };

    Alpine.data("tripleScalarProduct", () => tripleScalarProduct);

    const vectorProjection = {
        a: [0, 0, 0] as number[],
        b: [0, 0, 0] as number[],
        dndim(): void {
            if (this.a.length <= 1) {
                alert("Stop that.");
            } else {
                this.a.pop();
                this.b.pop();
            }
        },
        updim(): void {
            this.a.push(0);
            this.b.push(0);
        },
        dot(u: number[], v: number[]): number {
            let s = 0;
            for (let i = 0; i < u.length; i++) s += Number(u[i]) * Number(v[i]);
            return s;
        },
        normSq(v: number[]): number {
            let s = 0;
            for (let i = 0; i < v.length; i++) s += Number(v[i]) * Number(v[i]);
            return s;
        },
        scalarComponent(): string {
            const bb = this.normSq(this.b);
            if (bb === 0) return "0";
            const comp = this.dot(this.a, this.b) / Math.sqrt(bb);
            return Number.isFinite(comp) ? comp.toFixed(5) : "0";
        },
        result(): number[] {
            const bb = this.normSq(this.b);
            const out = new Array(this.a.length).fill(0);
            if (bb === 0) return out;
            const factor = this.dot(this.a, this.b) / bb;
            for (let i = 0; i < this.b.length; i++) {
                const val = factor * Number(this.b[i]);
                out[i] = Number.isFinite(val) ? Number(val.toFixed(5)) : 0;
            }
            return out;
        },
    };

    Alpine.data("vectorProjection", () => vectorProjection);
});
