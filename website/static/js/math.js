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
    }))
})