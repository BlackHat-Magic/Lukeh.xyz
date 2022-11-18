document.addEventListener ('alpine:init', () => {
    Alpine.data ('main', () => ({
       values: [0, 0, 0],

       scalar: 1,

       result () {
            result = [];
            for (let i = 0; i < this.values.length; i++) {
                result.push(this.values[i] * this.scalar);
            }
            return(result);
        },

        decrement () {
            if(this.values.length <= 1) {
                alert("Stop.");
            } else {
                this.values.pop();
            }
        },

        increment () {
            this.values.push(0);
        }
    }))
})
