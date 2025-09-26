document.addEventListener ("alpine:init", () => {
    const parseHash = () => {
        const raw = decodeURIComponent ((window.location.hash || "").replace(/^#/, ""));
        if (!raw) return { main: "Vector Calculus", sub: "Vector Addition" };
        const parts = raw.split ("/");
        const main = parts[0] || "Vector Calculus";
        const sub = parts[1] || null;
        return { main, sub };
    };
    const setHash = (main, sub = null) => {
        const target = sub ? `#${encodeURIComponent (main)}/${encodeURIComponent (sub)}` : `#${main}`;
        if (window.location.hash !== target) {
            history.replaceState (null, "", target);
        }
    };

    const validMain = new Set (["Vector Calculus", "Statistics"]);
    const validSub = new Set ([
        "Vector Addition",
        "Scalar Multiplication",
        "Vector Magnitude",
        "Unit Vector",
        "Dot Product",
        "Cross Product",
        "TSP",
        "Vector Projection"
    ]);

    Alpine.data ("main", () => ({
        mainKey: "Vector Calculus",

        tabButtonClicked(tabButton){
            const key = tabButton.dataset.hash;
            if (!validMain.has (key)) return;
            this.mainKey = key;
            this.tabRepositionMarker (tabButton);
            const { sub } = parseHash ();
            if (key === "Vector Calculus") {
                setHash ("Vector Calculus", validSub.has (sub) ? sub : "Vector Addition");
            } else {
                setHash ("Statistics");
            }
        },
        tabRepositionMarker(tabButton){
            this.$refs.tabMarker.style.width=tabButton.offsetWidth + 'px';
            this.$refs.tabMarker.style.height=tabButton.offsetHeight + 'px';
            this.$refs.tabMarker.style.left=tabButton.offsetLeft + 'px';
        },
        tabContentActive (tabContent) {
            return tabContent.dataset.hash === this.mainKey;
        },

        init () {
            const { main } = parseHash ();
            this.mainKey = validMain.has (main) ? main : "Vector Calculus";

            this.$nextTick (() => {
                const button = Array.from (this.$refs.tabButtons.querySelectorAll ("button")).find (
                    (b) => b.dataset.hash === this.mainKey
                );
                if (button) this.tabRepositionMarker (button);
            });

            window.addEventListener ("hashchange", () => {
                const { main } = parseHash ();
                const newKey = validMain.has (main) ? main : "Vector Calculus";
                if (newKey !== this.mainKey) {
                    this.mainKey = newKey;
                    this.$nextTick (() => {
                        const button = Array.from (
                            this.$refs.tabButtons.querySelectorAll ("button")
                        ).find ((b) => b.dataset.hash === this.mainKey);
                        if (button) this.tabRepositionMarker (button);
                    })
                }
            })
        }
    }));

    Alpine.data("vecCalc", () => ({
        // Subtabs only apply when main is 'vc'
        subKey: "Vector Addition",
    
        tabButtonClicked(tabButton) {
            const key = tabButton.dataset.hash;
            if (!validSub.has(key)) return;
            requestAnimationFrame (() => {
                this.subKey = key;
                this.tabRepositionMarker(tabButton);
            })
            setHash("Vector Calculus", key);
        },
    
        tabRepositionMarker(tabButton) {
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
    
        tabContentActive(tabContent) {
          // Each content div carries data-hash, e.g., "add"
            return tabContent.dataset.hash === this.subKey;
        },
    
        tabButtonActive(tabButton) {
            return tabButton.dataset.hash === this.subKey;
        },
    
        init() {
          // Initialize from hash if main is vc and sub is valid
            const { main, sub } = parseHash();
            if (main === "Vector Calculus" && validSub.has(sub || "")) {
                this.subKey = sub;
            } else {
                this.subKey = "Vector Addition";
            }

            this.$nextTick(() => {
                const btn = Array.from(this.$refs.tabButtons.querySelectorAll("button")).find(
                    (b) => b.dataset.hash === this.subKey
                );
                if (btn) this.tabRepositionMarker(btn);
                this._onResize = () => {
                    const activeBtn = Array.from(this.$refs.tabButtons.querySelectorAll("button")).find(
                      (b) => b.dataset.hash === this.subKey
                    );
                    if (activeBtn) this.tabRepositionMarker(activeBtn);
                };
                window.addEventListener("resize", this._onResize);
            });
    
            window.addEventListener("hashchange", () => {
                const { main, sub } = parseHash();
                if (main !== "Vector Calculus") return; // only react while in vc
                const next = validSub.has(sub || "") ? sub : "Vector Addition";
                if (next !== this.subKey) {
                    this.subKey = next;
                    this.$nextTick(() => {
                        const btn = Array.from(
                        this.$refs.tabButtons.querySelectorAll("button")
                        ).find((b) => b.dataset.hash === this.subKey);
                        if (btn) this.tabRepositionMarker(btn);
                    });
                }
            });
        },
        destroy() {
            if (this._onResize) window.removeEventListener("resize", this._onResize);
        },
    }));

    Alpine.data("vecAdd", () => ({
        values: [
            [0, 0, 0],
            [0, 0, 0]
        ],

        signs: [1, 1],

        dnvec () {
            if (Object.keys (this.values).length <= 1) {
                alert ("Stop that.");
            } else {
                this.values.pop ();
            }
        },
        upvec () {
            this.values.push ([]);
            for (let i = 0; i < this.values[0].length; i++) {
                this.values[this.values.length - 1].push(0);
            }
            this.signs.push(1);
        },

        dndim () {
            if (this.values[0].length <= 1) {
                alert("Stop that.");
            } else {
                for (let i = 0; i < this.values.length; i++) {
                    this.values[i].pop();
                }
            }
        },
        updim () {
            for (let i = 0; i < this.values.length; i++) {
                this.values[i].push(0);
            }
        },

        result () {
            output = [];
            for (let i = 0; i < this.values[0].length; i++) {
                output.push(0);
            }
            for (let i = 0; i < this.values.length; i++) {
                for (let j = 0; j < this.values[i].length; j++) {
                    output[j] += parseInt (this.values[i][j]);
                }
            }
            return output;
        }
    }));

    Alpine.data("scalarMult", () => ({
        values: [0, 0, 0],
        scalar: 1.0,

        dndim () {
            if (this.values.length <= 1) {
                alert("Stop that.");
            } else {
                this.values.pop ();
            }
        },
        updim () {
            this.values.push(0);
        },

        result () {
            output = [];
            for (let i = 0; i < this.values.length; i++) {
                output.push(this.values[i] * this.scalar);
            }
            return output;
        }
    }));

    Alpine.data("vecMagnitude", () => ({
        values: [0, 0, 0],

        dndim () {
            if (this.values.length <= 1) {
                alert("Stop that.");
            } else {
                this.values.pop ();
            }
        },
        updim () {
            this.values.push(0);
        },

        result () {
            output = 0;
            for (let i = 0; i < this.values.length; i++) {
                output += this.values[i] * this.values[i];
            }
            output = Math.sqrt (output).toFixed (5);
            return output;
        }
    }));

    Alpine.data("unitVector", () => ({
        values: [0, 0, 0],

        dndim () {
            if (this.values.length <= 1) {
                alert("Stop that.");
            } else {
                this.values.pop ();
            }
        },
        updim () {
            this.values.push(0);
        },

        result () {
            output = [];

            magnitude = 0;
            for (let i = 0; i < this.values.length; i++) {
                magnitude += this.values[i] * this.values[i];
            }
            magnitude = Math.sqrt (magnitude);

            for (let i = 0; i < this.values.length; i++) {
                output.push((this.values[i] / magnitude).toFixed (5));
                isNaN (output[i]) ? output[i] = 0.0 : null;
            }
            return output;
        }
    }));

    Alpine.data("dotProduct", () => ({
        vec1: [0, 0, 0],
        vec2: [0, 0, 0],

        dndim () {
            if (this.vec1.length <= 1) {
                alert("Stop that.");
            } else {
                this.vec1.pop ();
                this.vec2.pop ();
            }
        },
        updim () {
            this.vec1.push (0);
            this.vec2.push (0);
        },

        result () {
            output = 0
            for (let i = 0; i < this.vec1.length; i++) {
                output += this.vec1[i] * this.vec2[i];
            }
            return output;
        }
    }));

    Alpine.data("crossProduct", () => ({
        a: [0, 0, 0],
        b: [0, 0, 0],
        // Cross product is 3D; keep controls inert
        noopDim() { alert("Cross product here is defined for 3D only."); },
        result() {
            const [ax, ay, az] = this.a.map(Number);
            const [bx, by, bz] = this.b.map(Number);
            const cx = ay * bz - az * by;
            const cy = az * bx - ax * bz;
            const cz = ax * by - ay * bx;
            return [cx, cy, cz];
        }
    }));

    Alpine.data("tripleScalarProduct", () => ({
        vectors: [
            [0, 0, 0], // a
            [0, 0, 0], // b
            [0, 0, 0]  // c
        ],
        noopDim() { alert("Triple scalar product here is 3D only."); },
        result() {
            const [a, b, c] = this.vectors.map(v => v.map(Number));
            // Compute determinant |a; b; c| = a · (b × c)
            const bx = b[0], by = b[1], bz = b[2];
            const cx = c[0], cy = c[1], cz = c[2];
            const cross_bc = [
                by * cz - bz * cy,
                bz * cx - bx * cz,
                bx * cy - by * cx
            ];
            const val = a[0] * cross_bc[0] + a[1] * cross_bc[1] + a[2] * cross_bc[2];
            return val;
        }
    }));

    Alpine.data("vectorProjection", () => ({
        a: [0, 0, 0],
        b: [0, 0, 0],
        dndim() {
            if (this.a.length <= 1) {
                alert("Stop that.");
            } else {
                this.a.pop();
                this.b.pop();
            }
        },
        updim() {
            this.a.push(0);
            this.b.push(0);
        },
        dot(u, v) {
            let s = 0;
            for (let i = 0; i < u.length; i++) s += Number(u[i]) * Number(v[i]);
            return s;
        },
        normSq(v) {
            let s = 0;
            for (let i = 0; i < v.length; i++) s += Number(v[i]) * Number(v[i]);
            return s;
        },
        scalarComponent() {
            const bb = this.normSq(this.b);
            if (bb === 0) return 0;
            const comp = this.dot(this.a, this.b) / Math.sqrt(bb);
            return Number.isFinite(comp) ? comp.toFixed(5) : 0;
        },
        result() {
            const bb = this.normSq(this.b);
            const out = new Array(this.a.length).fill(0);
            if (bb === 0) return out;
            const factor = this.dot(this.a, this.b) / bb;
            for (let i = 0; i < this.b.length; i++) {
                const val = factor * Number(this.b[i]);
                out[i] = Number.isFinite(val) ? Number(val.toFixed(5)) : 0;
            }
            return out;
        }
    }));
})