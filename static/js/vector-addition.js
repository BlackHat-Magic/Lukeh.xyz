document.addEventListener ('alpine:init', () => {
    Alpine.data('main', () => ({

        values: [
         [0, 0, 0],
         [0, 0, 0]
        ],

        vecsub () {
            if ( Object.keys(this.values).length <= 1 ) {
                alert("Stop that.");
            } else {
                this.values.pop();
            }
        },
        vecadd () {
            this.values.push([]);
            for (let i = 0; i < this.values[0].length; i++) {
                this.values[this.values.length - 1].push(0);
            }
        },

        dimsub () {
            if ( this.values[0].length <= 1 ) {
                alert("You think you're funny?");
            } else {
                for (let i = 0; i < this.values.length; i++) {
                    this.values[i].pop();
                }
            }
        },
        dimadd () {
            for (let i = 0; i < this.values.length; i++) {
                this.values[i].push(0);
            }
        },

        result () {
            result = [];
            for(let i = 0; i < this.values[0].length; i++) {
                for (let j = 0; j < this.values.length; j++) {
                    x = 0;
                    x += this.values[j][i];
                    result.push(x);
                    console.log(result);
                }
            }
            return result;
        }

    }))
})


