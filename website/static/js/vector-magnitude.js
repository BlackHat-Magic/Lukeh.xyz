document.addEventListener ('alpine:init', () => {
    Alpine.data ('main', () => ({
       values: [0, 0, 0],

       result () {
            result = 0;
            for (let i = 0; i < this.values.length; i++) {
                result += this.values[i] * this.values[i];
            }
            result = Math.round(Math.sqrt(result) * 100000) / 100000;
            return(result);
        },

        decrement () {
            if(this.values.length <= 1) {
                alert("Oh my god");
            } else {
                this.values.pop();
            }
        },

        increment () {
            this.values.push(0);
        }
    }))
})
