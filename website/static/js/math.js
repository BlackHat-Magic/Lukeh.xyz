document.addEventListener ("alpine:init", () => {
    Alpine.data ("main", () => ({
        tabSelected: 1,
        // tabId: $id('tabs'),
        tabButtonClicked(tabButton){
            this.tabSelected = tabButton.id.split('-').pop();
            this.tabRepositionMarker(tabButton);
        },
        tabRepositionMarker(tabButton){
            this.$refs.tabMarker.style.width=tabButton.offsetWidth + 'px';
            this.$refs.tabMarker.style.height=tabButton.offsetHeight + 'px';
            this.$refs.tabMarker.style.left=tabButton.offsetLeft + 'px';
        },
        tabContentActive(tabContent){
            return this.tabSelected == tabContent.id.split('-').pop();
        }
    }));

    Alpine.data("vecCalc", () => ({
        tabSelected: 1,
        // tabId: $id('tabs'),
        tabButtonClicked(tabButton){
            this.tabSelected = tabButton.id.split('-').pop();
            this.tabRepositionMarker(tabButton);
        },
        tabRepositionMarker(tabButton){
            this.$refs.tabMarker.style.width=tabButton.offsetWidth + 'px';
            this.$refs.tabMarker.style.height=tabButton.offsetHeight + 'px';
            this.$refs.tabMarker.style.top=tabButton.offsetTop + 'px';
            this.$refs.tabMarker.style.left='0px';
        },
        tabContentActive(tabContent){
            return this.tabSelected == tabContent.id.split('-').pop();
        },
        tabButtonActive(tabContent){
            const tabId = tabContent.id.split('-').slice(-1);
            return this.tabSelected == tabId;
        }
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